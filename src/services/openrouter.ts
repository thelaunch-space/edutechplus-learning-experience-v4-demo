import { MATH_MATE_SYSTEM_PROMPT, GREETING_SYSTEM_PROMPT, getAdventureHookPrompt, getBridgeTransitionPrompt, getContextPrompt, getEvaluationPrompt, getCheckpointPrompt, FALLBACK_RESPONSES } from '../config/prompts';
import type { Message, EvaluationResult, Scaffolding } from '../types';

// Anthropic API — direct browser access with CORS header
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const TIMEOUT_MS = 8000;

// Strip emojis from LLM output before sending to TTS
function stripEmojis(text: string): string {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '').replace(/\s{2,}/g, ' ').trim();
}

// Helper: call Anthropic Messages API
async function callAnthropic(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  maxTokens: number = 150,
  temperature: number = 0.7,
): Promise<string | null> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY;
  if (!apiKey) return null;

  // Anthropic requires alternating user/assistant. Merge consecutive same-role messages.
  const cleaned: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const msg of messages) {
    const role = msg.role === 'user' ? 'user' : 'assistant';
    if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === role) {
      cleaned[cleaned.length - 1].content += '\n' + msg.content;
    } else {
      cleaned.push({ role, content: msg.content });
    }
  }
  // Anthropic requires first message to be 'user'
  if (cleaned.length > 0 && cleaned[0].role !== 'user') {
    cleaned.unshift({ role: 'user', content: '(start)' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: cleaned,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    const text = data.content?.[0]?.text?.trim();
    return text || null;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('LLM request timed out');
    } else {
      console.error('Anthropic API error:', error);
    }
    return null;
  }
}

export async function generateResponse(
  studentResponse: string,
  studentName: string,
  challengeNumber: number,
  question: string,
  contextInfo: string,
  conversationHistory: Message[] = []
): Promise<string> {
  if (!studentResponse.trim()) return FALLBACK_RESPONSES.silent;

  const contextPrompt = getContextPrompt(studentName, challengeNumber, question, contextInfo);
  const systemPrompt = MATH_MATE_SYSTEM_PROMPT + '\n\n' + contextPrompt;

  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    ...conversationHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: `Student said: "${studentResponse}"` }
  ];

  const result = await callAnthropic(systemPrompt, messages, 50, 0.7);
  if (result) {
    console.log('Max response:', result);
    return result;
  }
  return FALLBACK_RESPONSES.error;
}

export async function generateGreeting(studentName: string): Promise<string> {
  const fallback = `Hi ${studentName || 'friend'}! Ready to learn fractions? We'll use yummy pizzas and cake!`;

  const result = await callAnthropic(
    GREETING_SYSTEM_PROMPT,
    [{ role: 'user', content: `The student's name is "${studentName}".` }],
    30,
    0.7
  );
  return result || fallback;
}

// Helper to get the right scaffolding response based on turn
function getScaffoldingForTurn(scaffolding: Scaffolding, turnNumber: number): string {
  switch (turnNumber) {
    case 0: return scaffolding.probe1;
    case 1: return scaffolding.probe2;
    case 2: return scaffolding.hint;
    case 3: return scaffolding.scaffold;
    default: return scaffolding.reveal;
  }
}

// Client-side correctness check
function checkClientSideCorrectness(studentResponse: string, correctnessFilter: string): boolean {
  const filterPatterns = correctnessFilter.split('|').map(p => p.trim().toLowerCase());
  const studentLower = studentResponse.toLowerCase();
  const negationWords = ['not', 'no', "isn't", "isnt", "don't", "dont", "never", "wrong"];

  return filterPatterns.some(pattern => {
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedPattern}\\b`, 'i');

    if (!regex.test(studentLower)) return false;

    const matchIndex = studentLower.search(regex);
    const textBefore = studentLower.substring(Math.max(0, matchIndex - 15), matchIndex);
    return !negationWords.some(neg => textBefore.includes(neg));
  });
}

export async function generateEvaluatedResponse(
  studentResponse: string,
  studentName: string,
  correctnessFilter: string,
  scaffolding: Scaffolding,
  turnNumber: number,
  maxTurns: number,
  conversationHistory: Message[] = []
): Promise<EvaluationResult> {
  const turnScaffolding = getScaffoldingForTurn(scaffolding, turnNumber);

  // Client-side correctness check FIRST
  if (studentResponse.trim() && checkClientSideCorrectness(studentResponse, correctnessFilter)) {
    console.log('✅ Client-side correctness matched!');
    return {
      response: scaffolding.reveal.replace(/Good thinking!|Nice effort!|Well done!|Great job trying!/gi, 'Great job!'),
      isCorrect: true,
      shouldEnd: true
    };
  }

  const fallbackResult: EvaluationResult = {
    response: turnScaffolding,
    isCorrect: false,
    shouldEnd: turnNumber >= maxTurns - 1
  };

  if (!studentResponse.trim()) {
    return { response: "I didn't catch that. " + turnScaffolding, isCorrect: false, shouldEnd: false };
  }

  const systemPrompt = getEvaluationPrompt(correctnessFilter, scaffolding, studentName, turnNumber, maxTurns);
  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    ...conversationHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: `Student said: "${studentResponse}"` }
  ];

  const content = await callAnthropic(systemPrompt, messages, 100, 0.5);

  if (!content) return fallbackResult;

  console.log('🤖 Raw LLM response:', content);

  // Client-side correctness as backup
  const clientSideCorrect = checkClientSideCorrectness(studentResponse, correctnessFilter);

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const isCorrect = Boolean(parsed.isCorrect) || clientSideCorrect;
      const shouldEnd = Boolean(parsed.shouldEnd) || isCorrect;

      console.log('✅ FINAL EVALUATION:', { llmIsCorrect: parsed.isCorrect, clientSideCorrect, finalIsCorrect: isCorrect });

      return { response: parsed.response || turnScaffolding, isCorrect, shouldEnd };
    }
  } catch (parseError) {
    console.warn('Failed to parse JSON response:', parseError);
  }

  return { response: content, isCorrect: clientSideCorrect, shouldEnd: clientSideCorrect };
}

// Beat 3: Adventure Hook
export async function generateAdventureHook(studentName: string): Promise<string> {
  const fallback = `Hey ${studentName}! You, me, and Spark are going on a fraction adventure today! We're gonna slice pizza, share cake, and solve cool fraction puzzles — it's gonna be so fun! What's your favorite thing to eat?`;

  const result = await callAnthropic(
    getAdventureHookPrompt(studentName),
    [{ role: 'user', content: `Student just said their name. Their name is: ${studentName}. Greet them and pitch the adventure!` }],
    60,
    0.8
  );

  if (result) {
    const cleaned = stripEmojis(result.replace(/^["']|["']$/g, ''));
    console.log('🎯 Adventure Hook response:', cleaned);
    return cleaned || fallback;
  }
  return fallback;
}

// Beat 4: Bridge + Transition
export async function generateBridgeTransition(
  studentName: string,
  studentResponse: string,
  conversationHistory: Message[] = []
): Promise<string> {
  const fallback = `That's awesome! Alright ${studentName}, Spark's getting impatient — let's jump into our fraction adventure!`;

  if (!studentResponse.trim()) {
    return `No worries! You're gonna love this once we get started. Let's jump in, ${studentName}!`;
  }

  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    ...conversationHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: `Student name: ${studentName}. Student just said: "${studentResponse}". Acknowledge and transition to the lesson!` }
  ];

  const result = await callAnthropic(
    getBridgeTransitionPrompt(studentName),
    messages,
    100,
    0.7
  );

  if (result) {
    const cleaned = stripEmojis(result.replace(/^["']|["']$/g, ''));
    console.log('🎯 Bridge Transition response:', cleaned);
    return cleaned || fallback;
  }
  return fallback;
}

export async function generateCheckpointResponse(
  studentResponse: string,
  studentName: string,
  lo: string,
  conversationHistory: Message[] = []
): Promise<EvaluationResult> {
  const fallbackResult: EvaluationResult = {
    response: "Good try! You're doing great!",
    isCorrect: false,
    shouldEnd: false,
  };

  if (!studentResponse.trim()) {
    return { response: "I didn't catch that. Can you try again?", isCorrect: false, shouldEnd: false };
  }

  const systemPrompt = getCheckpointPrompt(lo, studentName);
  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    ...conversationHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: `Student said: "${studentResponse}"` }
  ];

  const content = await callAnthropic(systemPrompt, messages, 100, 0.5);

  if (!content) return fallbackResult;

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        response: parsed.response || fallbackResult.response,
        isCorrect: Boolean(parsed.isCorrect),
        shouldEnd: Boolean(parsed.shouldEnd) || Boolean(parsed.isCorrect),
      };
    }
  } catch (parseError) {
    console.warn('Failed to parse checkpoint JSON response:', parseError);
  }

  return { response: content, isCorrect: false, shouldEnd: false };
}

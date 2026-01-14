import { MATH_MATE_SYSTEM_PROMPT, GREETING_SYSTEM_PROMPT, getContextPrompt, getEvaluationPrompt, FALLBACK_RESPONSES } from '../config/prompts';
import type { Message, EvaluationResult, Scaffolding } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4.1-nano';
const TIMEOUT_MS = 5000;

export async function generateResponse(
  studentResponse: string,
  studentName: string,
  challengeNumber: number,
  question: string,
  contextInfo: string,
  conversationHistory: Message[] = []
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_KEY;

  if (!apiKey) {
    console.warn('OpenRouter API key not configured');
    return FALLBACK_RESPONSES.error;
  }

  // If student was silent or gave empty response
  if (!studentResponse.trim()) {
    return FALLBACK_RESPONSES.silent;
  }

  const contextPrompt = getContextPrompt(studentName, challengeNumber, question, contextInfo);

  const messages = [
    { role: 'system' as const, content: MATH_MATE_SYSTEM_PROMPT + '\n\n' + contextPrompt },
    ...conversationHistory,
    { role: 'user' as const, content: `Student said: "${studentResponse}"` }
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Math Mate Learning App',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 50, // Keep responses short
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return FALLBACK_RESPONSES.error;
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || FALLBACK_RESPONSES.error;

    console.log('Math Mate response:', reply);
    return reply;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('LLM request timed out');
      return FALLBACK_RESPONSES.timeout;
    }
    console.error('OpenRouter error:', error);
    return FALLBACK_RESPONSES.error;
  }
}

export async function generateGreeting(studentName: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_KEY;

  if (!apiKey || !studentName.trim()) {
    return `Hi ${studentName || 'Friend'}! We have 7 fun challenges. Let's go!`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Math Mate Learning App',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: GREETING_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `The student's name is "${studentName}".`
          }
        ],
        max_tokens: 30,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return `Hi ${studentName}! We have 7 fun challenges. Let's go!`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || `Hi ${studentName}! We have 7 fun challenges. Let's go!`;
  } catch {
    return `Hi ${studentName}! We have 7 fun challenges. Let's go!`;
  }
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

export async function generateEvaluatedResponse(
  studentResponse: string,
  studentName: string,
  correctnessFilter: string,
  scaffolding: Scaffolding,
  turnNumber: number,
  maxTurns: number,
  conversationHistory: Message[] = []
): Promise<EvaluationResult> {
  const apiKey = import.meta.env.VITE_OPENROUTER_KEY;

  // Get the appropriate scaffolding for this turn
  const turnScaffolding = getScaffoldingForTurn(scaffolding, turnNumber);

  // Default fallback result - uses turn-appropriate scaffolding
  const fallbackResult: EvaluationResult = {
    response: turnScaffolding,
    isCorrect: false,
    shouldEnd: turnNumber >= maxTurns - 1
  };

  if (!apiKey) {
    console.warn('OpenRouter API key not configured');
    return fallbackResult;
  }

  // Handle empty/silent response - use current turn's scaffolding
  if (!studentResponse.trim()) {
    return {
      response: "I didn't catch that. " + turnScaffolding,
      isCorrect: false,
      shouldEnd: false
    };
  }

  const systemPrompt = getEvaluationPrompt(
    correctnessFilter,
    scaffolding,
    studentName,
    turnNumber,
    maxTurns
  );

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversationHistory,
    { role: 'user' as const, content: `Student said: "${studentResponse}"` }
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Math Mate Learning App',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 100,
        temperature: 0.5,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status);
      return fallbackResult;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    console.log('🤖 Raw LLM response:', content);

    if (!content) {
      return fallbackResult;
    }

    // Client-side correctness check using the filter regex
    const filterPatterns = correctnessFilter.split('|').map(p => p.trim().toLowerCase());
    const studentLower = studentResponse.toLowerCase();
    const clientSideCorrect = filterPatterns.some(pattern => studentLower.includes(pattern));
    console.log('🔍 Client-side correctness check:', { studentResponse, filterPatterns, clientSideCorrect });

    // Parse JSON from response
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // Use client-side check as override if LLM got it wrong
        const isCorrect = Boolean(parsed.isCorrect) || clientSideCorrect;
        const shouldEnd = Boolean(parsed.shouldEnd) || isCorrect;

        console.log('✅ Final evaluation:', { llmIsCorrect: parsed.isCorrect, clientSideCorrect, finalIsCorrect: isCorrect });

        return {
          response: parsed.response || turnScaffolding,
          isCorrect,
          shouldEnd
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON response:', parseError);
    }

    // If JSON parsing fails, use the content as plain text but still check correctness
    return {
      response: content,
      isCorrect: clientSideCorrect,
      shouldEnd: clientSideCorrect
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('LLM request timed out');
    } else {
      console.error('OpenRouter error:', error);
    }
    return fallbackResult;
  }
}

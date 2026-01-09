import { MATH_MATE_SYSTEM_PROMPT, GREETING_SYSTEM_PROMPT, getContextPrompt, FALLBACK_RESPONSES } from '../config/prompts';
import type { Message } from '../types';

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

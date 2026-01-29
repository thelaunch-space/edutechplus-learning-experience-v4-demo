# Bugs & Recurring Issues

## Patterns to Avoid

- **LLM returning plain text instead of JSON:** Always use `response_format: { type: "json_object" }` in OpenRouter calls. Without it, the model ignores JSON instructions in the system prompt.
- **State update timing:** When advancing phases (PRE → IN → POST), ensure state updates complete before triggering next action. Race conditions cause "stuck" states.
- **Prompt leakage between phases:** Greeting prompts must not leak into post-challenge evaluation. Keep system prompts phase-specific.

## Bugs Fixed — Iteration 1

| Bug | Cause | Fix |
|-----|-------|-----|
| Duplicate greeting | `preScript` triggered twice | Fixed state initialization |
| App stuck after post-challenge | State update timing race | Ensured sequential state transitions |
| Premature "Challenge done" | Greeting prompt leaked into challenge eval | Separated prompt contexts |

## Bugs Fixed — Iteration 2

| Bug | Cause | Fix |
|-----|-------|-----|
| LLM returning plain text | Missing `response_format` param | Added `response_format: { type: "json_object" }` to OpenRouter request |
| Correct answers not recognized | LLM evaluation inconsistent | Added client-side backup check using regex against `correctnessFilter` |
| Awkward 5-second recording wait | Auto-recording with fixed duration | Replaced with PTT (hold-to-talk) |

## Bugs Fixed — Iteration 3

| Bug | Cause | Fix |
|-----|-------|-----|
| Generic "7 fun challenges" intro | Hardcoded fallback message | Updated all fallback greetings to reference "pizzas and cake" |
| Weak acknowledgements | 30-word limit too restrictive, LLM not following instructions | Enhanced prompt with explicit examples, removed word limit, added emphasis on enthusiasm |
| Rushed correct answer flow | No pause between acknowledgement and confetti | Added 1-second pause after acknowledgement before confetti triggers |
| Correctness filter hard to debug | Insufficient logging | Added detailed console logging showing LLM decision, client-side regex match, and final verdict |

## Known Issues

None currently tracked.

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

## Bugs Fixed — Iteration 4

| Bug | Cause | Fix |
|-----|-------|-----|
| Button positioning conflicts | Skip/Done buttons at bottom-right overlapped with applet controls | Moved all buttons to top-right, unified styling and text across video/applet/slide |
| Applet A2 loading reported | Client reported loading issue | Investigation complete: All 4 applet files verified to exist with correct paths. Likely client-side caching issue. |

## Bugs Fixed — Iteration 5

| Bug | Cause | Fix |
|-----|-------|-----|
| MediaBox content misaligned | Single background image stretched with `100% 100%`, wrong `bottom: 32%` offset | Replaced with `<img>` element + wrapper div. Aspect ratio preserved. Content pane `bottom: 36%` matches actual screen area. |
| MediaBox distorts on different screens | `background-size: 100% 100%` ignores aspect ratio | Image element uses `max-width/max-height` with natural aspect ratio (1408:1080) |
| Onboarding robotic/aimless | Multi-turn LLM loop, LLM controlled flow | 5-beat linear structure, code controls flow, LLM handles tone only |
| extractName returns garbage | Only checked for "Friend", not single letters/common words | Hardened with 40+ blocked words, garbage detection for single chars, numbers, short strings |

## Known Issues (as of Feb 11, 2026)

### 🔴 Onboarding Flow — Conversation Design Failures

The onboarding flow has been through multiple broken iterations. Core patterns that keep going wrong:

| Pattern | What goes wrong | Fix applied |
|---------|----------------|-------------|
| **Fallback responses ignore context** | LLM times out → fallback says "That sounds fun!" to a kid saying their name | Fallbacks are now per-turn and name-aware |
| **LLM ignores shouldProceed rules** | Prompt says "don't proceed if reluctant" but LLM sets shouldProceed=true anyway | Code-level enforcement: `if (turnNumber < 3) shouldProceed = false` |
| **Max makes statements, not questions** | Every response ends with a period. Kid has nothing to respond to, gets confused | Prompt rule: turns 1-2 MUST end with a simple question |
| **Name extraction fails silently** | Kid rambles → extractName returns "Friend" → Max says "Friend is a cool name!" | Re-ask once, then use "Buddy" as fallback nickname |
| **No conversation nudging** | After speaking, Max just waits. Kid doesn't know what's expected | Questions give the kid something concrete to respond to |

**Lesson learned:** Never trust the LLM for flow control in onboarding. Use code-level guardrails (minimum turns, forced shouldProceed override). Let the LLM handle TONE, not FLOW.

### Fixed (Feb 11 — 5-Beat rewrite):
| Pattern | Fix applied |
|---------|-------------|
| **extractName returns garbage** | Hardened with garbage detection: single letters, common words, numbers, short gibberish all caught. Re-ask triggers on "Friend" (which covers all garbage). |
| **No learning outcomes in onboarding** | Beat 3 (Adventure Hook) has learning outcomes injected as REQUIRED content in LLM prompt. Must mention "fraction adventure" + 2 activities. |
| **Aimless conversation** | Replaced open-ended while loop with 5-beat linear structure. Each beat has ONE purpose. Only 2 LLM calls, each with a specific job. |
| **LLM controls flow** | Code now controls ALL flow. LLM only handles tone/personalization. No shouldProceed, no turn counting, no while loop. |

## Resolved Issues — Iteration 4

### Dynamic Slide Behavior (Implemented Feb 2, 2026)
- **Reported:** Jan 30, 2026
- **Previous behavior:** Slides were static images with linear narration
- **Implemented solution:** `FractionCompareSlide` component for Node 4 with 5-frame state machine
- **Implementation details:**
  - Frames: question → cut → highlight → compare → celebration
  - Path A (correct first try): Quick animated summary
  - Path B (wrong answer): Interactive tap-to-split scaffolding
  - 15-second auto-timeout fallback for tap interactions
  - Voice-visual synchronization via `runFractionCompareInteraction()`
  - `hasDynamicSlide: true` flag on Challenge type for future expansion
- **Files created:** `src/components/FractionCompareSlide/`
- **Status:** ✅ Focused experiment complete; can be generalized to other nodes if successful

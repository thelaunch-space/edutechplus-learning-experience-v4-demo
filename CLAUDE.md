# Math Mate: Voice-Guided Learning Experience

## Problem

EdutechPlus B2G math content (videos + applets) needs engagement layer for B2C mobile app. Grade 4 students must stay engaged for 20 minutes without a teacher.

## Solution

**Math Mate** - AI voice companion that guides students through 7 learning challenges with:
- Two-way voice interaction at content transitions
- Multi-turn teaching conversations (not just single-turn acknowledgments)
- Correctness evaluation with follow-up teaching if wrong
- Graceful fallbacks for silence or errors

Inspired by Synthesis AI's scripted lessons, but with actual LLM-powered teaching intelligence.

---

## Current Status

**Iteration 1 (Complete):** Single-turn voice interaction, auto-progression. Worked, but felt like a traffic controller, not a tutor.

**Iteration 2 (In Progress):** Multi-turn conversations with depth. See `IMPLEMENTATION-PLAN-ITERATION-2.md` for full plan.

Key changes for Iteration 2:
- Tap-to-speak (replaces 5-sec auto-recording)
- Multi-turn: Greeting 3-4 turns, Post-asset 5-6 turns
- Streaming STT/LLM/TTS for <1s latency
- LLM returns structured JSON: `{ response, isCorrect, shouldEnd }`
- Visual feedback: waveform + mascot animations
- Skip buttons on content assets

---

## Tech Stack

- **Frontend:** React + Vite, Zustand
- **STT:** Deepgram (WebSocket streaming)
- **LLM:** OpenRouter GPT-4.1-nano
- **TTS:** Deepgram Aura (`aura-asteria-en`)

---

## Key Files

| Purpose | Location |
|---------|----------|
| Iteration 2 plan | `IMPLEMENTATION-PLAN-ITERATION-2.md` |
| Iteration 1 feedback | `feedback/feedback-iteration-1.md` |
| Challenge definitions | `src/config/challenges.ts` |
| LLM prompts | `src/config/prompts.ts` |
| Voice interaction logic | `src/hooks/useVoiceInteraction.ts` |
| Session state | `src/store/sessionStore.ts` |

---

## Bugs Fixed (Iteration 1)

### Duplicate Greeting
**Issue:** Math Mate said greeting twice.
**Cause:** Challenge #1's `preScript` was hardcoded to greeting text.
**Fix:** Updated `src/config/challenges.ts` with proper intro for each challenge.

### App Stuck After Post-Challenge
**Issue:** App didn't advance after post-challenge response.
**Cause:** Atomic state update in `goToNextChallenge()` wasn't triggering React effects.
**Fix:** Separated concerns - function returns boolean, explicit phase setting in hook.

### Premature "Challenge Done" in Greeting
**Issue:** Greeting said "Challenge 1 done!" before any challenge completed.
**Cause:** System prompt rule applied to all LLM calls including greeting.
**Fix:** Created separate `GREETING_SYSTEM_PROMPT` without the challenge-done rule.

---

*Last Updated: 2026-01-14*

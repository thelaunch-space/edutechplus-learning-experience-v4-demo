# Iteration 1 Feedback

**Demo Date:** Week of January 6, 2026

---

## What Iteration 1 Demonstrated

An AI companion that takes control, opens assets (videos + applets) in sequence, with voice conversation in between transitions.

**What it proved:** Technical feasibility of voice-guided content sequencing.

---

## Client Feedback

### Core Issue

The AI is a **traffic controller, not a tutor**. It has no intelligence:
- No teaching or guidance
- No course correction
- No concept testing
- Single-turn, surface-level conversation

### Requested Changes

1. **Depth of conversation** - Multi-turn exchanges with actual teaching
2. **Correctness evaluation** - Test if student understood, guide if wrong
3. **Teacher persona** - Feel like a teacher, not an MC/cheerleader
4. **Skip buttons** - Let kids skip videos/applets (not forced to complete)
5. **Tap-to-speak** - Replace auto-recording with explicit user action

---

## Decision: Turn-Based Teaching Structure

We chose a **turn-based model** (like Duolingo/Speak) over real-time voice agents:

| Aspect | Choice |
|--------|--------|
| Input method | Tap-to-speak (not auto-recording) |
| Greeting | 3-4 turns |
| Post-asset check | 5-6 turns max |
| End triggers | Correct answer OR max turns reached |
| LLM output | Structured JSON: `{ response, isCorrect, shouldEnd }` |
| Latency | Design around it with visual feedback |

**Why:** Simpler, more reliable, pedagogically sound, proven pattern.

---

## Implementation

See `IMPLEMENTATION-PLAN-ITERATION-2.md` for full technical plan.

---

*Last Updated: 2026-01-14*

# Learning Journey - Fractions Module

## Complete Node Sequence (21 nodes: 0-20)

| # | ID | Type | Title | LO Group | Status |
|---|-----|------|-------|----------|--------|
| 0 | onboarding | onboarding | Meet Max & Spark | — | ✅ 5-Beat flow |
| 1 | slide-1 | slide | Why Fractions? | LO1 | ✅ Narration |
| 2 | video-1 | video | What are Fractions? | LO1 | ✅ + Post-Q |
| 3 | applet-a1 | applet | Cut and Glue Practice | LO1 | ✅ + Post-Q |
| **4** | **checkpoint-lo1** | **checkpoint** | **Level Up: Equal Parts!** | **LO1** | ✅ Interactive |
| 5 | applet-a2 | applet | Fraction Patterns | LO2 | ✅ + Dynamic Slide |
| 6 | goofy-1 | goofy | Spark's Fraction Joke | — | ✅ Voice-only |
| 7 | applet-a3 | applet | Cake Fractions | LO2 | ✅ + Post-Q |
| **8** | **checkpoint-lo2** | **checkpoint** | **Level Up: Fraction Expert!** | **LO2** | ✅ Interactive |
| 9 | slide-2 | slide | What are Fractions? | LO3 | ✅ Narration |
| 10 | video-2 | video | Bigger Fractions | LO3 | ✅ + Post-Q |
| 11 | applet-a4 | applet | Advanced Practice | LO3 | ✅ + Post-Q |
| **12** | **checkpoint-lo3** | **checkpoint** | **Level Up: Fraction Builder!** | **LO3** | ✅ Interactive |
| 13 | slide-3 | slide | Math Vault: Fraction Definition | LO4 | ✅ Narration |
| 14 | slide-4 | slide | Numerator and Denominator | LO4 | ✅ Narration |
| **15** | **checkpoint-lo4** | **checkpoint** | **Level Up: Vocabulary Master!** | **LO4** | ✅ Interactive |
| 16 | slide-5 | slide (Q) | Discover More Fractions | LO5 | ✅ Question slide |
| 17 | video-3 | video | You Did It! | LO5 | ✅ + Post-Q |
| 18 | slide-6 | slide (Q) | Math Trap: Find the Error | LO5 | ✅ Question slide |
| 19 | slide-7 | slide | Snapshot: More Parts | LO5 | ✅ Narration |
| **20** | **checkpoint-lo5** | **checkpoint** | **Level Up: Fraction Master!** | **LO5** | ✅ Interactive |

## Node Type Definitions

- **Onboarding**: 5-beat scripted flow with 2 LLM calls. Name capture + adventure hook + transition to lesson.
- **Video**: YouTube embed, student watches passively, skip button available.
- **Applet**: Interactive HTML iframe, student completes task, skip button available.
- **Slide**: Static image in MediaBox screen area. Narration slides auto-advance after TTS. Question slides trigger multi-turn Socratic dialogue.
- **Checkpoint**: Interactive review after each LO group. Multi-frame dynamic slide (CheckpointSlide component) + voice Q&A.
- **Goofy**: Voice-only fun break. Pre-scripted lines for Max (and optionally Spark). Auto-advance after TTS. No student response.

## Voice Interaction Pattern

**Two voices:** Max uses Liam (young male), Spark uses Aria (expressive female). All `minionLine` spoken via `speakAsSpark()`, all `tutorLine`/`preScript` via default `speak()` (Max).

Each video/applet node follows:
1. **Pre-node**: Minion moment (if present, Spark→Max voice) + AI introduces content (scripted TTS, Max voice)
2. **Content consumption**: Student views/interacts
3. **Post-node**: AI asks comprehension question (multi-turn Socratic dialogue, up to 5 turns)

## Slide-Specific Behavior

- Narration slides (1, 9, 13, 14, 19): AI narrates → auto-advance. No Q&A.
- Question slides (16, 18): AI asks question → multi-turn Socratic dialogue with confetti.

## Dynamic Interactive Slides

### Original: FractionCompareSlide (Node 5)

Post-challenge for Applet A2. `FractionCompareSlide` — 5-frame state machine:
1. `question` → 2. `cut` (tap to split) → 3. `highlight` (tap to count) → 4. `compare` → 5. `celebration`

Two paths: correct first try (quick animated summary) vs wrong answer (interactive scaffolding with taps).

### Generalized: Dynamic Question Slides (Nodes 2, 3, 7, 10, 11, 16, 17, 18)

All post-challenge questions now use dynamic slides with **voice-first check** before tap scaffold. 3 reusable templates:
- **FractionBuilder** (Nodes 2, 11, 16): Tap pieces to count → fill fraction slots
- **MultipleChoice** (Nodes 7, 10, 17): Tap answer buttons, wrong → wobble + eliminate
- **TapToSelect** (Nodes 3, 18): Tap correct/wrong diagram, detective-style

All use 3-frame state machine: `question` → `scaffold` → `reveal`. **Voice-first pattern:** Max asks question → student answers verbally (PTT) → if correct, quick auto-animation through frames (no taps); if wrong, tap-based scaffold appears. Same pattern as FractionCompareSlide (Node 4).

## Learning Objective Groups

- **LO1** (Nodes 1-3): Equal parts and first fraction names (one-half, one-fourth)
- **LO2** (Nodes 5, 7): Comparing fractions and naming the numerator
- **LO3** (Nodes 9-11): Building bigger fractions (2/4, 3/5)
- **LO4** (Nodes 13-14): Fraction vocabulary — numerator and denominator
- **LO5** (Nodes 16-19): Applying fraction knowledge, error spotting, final review

## Checkpoint Structure

5 checkpoints (Nodes 4, 8, 12, 15, 20), one after each LO group. Spacing: 3, 3, 3, 2, 4 content nodes. "Level Up!" gamification titles. Each uses:
- `CheckpointSlide` component with multi-frame visual
- Voice Q&A with scaffolding (max 4 turns)
- `checkpointId` field linking to `checkpointContent.ts` frame definitions

## Goofy Moment Structure

**Legacy standalone goofy node** (Node 6): `type: 'goofy'` with `goofyScript`. Auto-advance after TTS, no student interaction.

**Minion moments** (8 embedded across regular nodes): `minionMoment` field on any node. Spark speaks first, Max responds. Plays before preScript. Mix of silly jokes, misconception doubts, and hype moments. Nodes with minionMoments: 1, 3, 7, 9, 11, 14, 17, 19.

**Last updated:** 2026-02-16

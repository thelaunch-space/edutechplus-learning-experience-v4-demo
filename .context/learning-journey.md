# Learning Journey - Fractions Module

## Complete Node Sequence (20 nodes: 0-19)

| # | ID | Type | Title | LO Group | Status |
|---|-----|------|-------|----------|--------|
| 0 | onboarding | onboarding | Meet Max & Spark | — | ✅ 5-Beat flow |
| 1 | slide-1 | slide | Why Fractions? | LO1 | ✅ Narration |
| 2 | video-1 | video | What are Fractions? | LO1 | ✅ + Post-Q |
| 3 | applet-a1 | applet | Cut and Glue Practice | LO1 | ✅ + Post-Q |
| 4 | applet-a2 | applet | Fraction Patterns | LO1 | ✅ + Dynamic Slide |
| 5 | goofy-1 | goofy | Spark's Fraction Joke | — | ✅ Voice-only |
| 6 | applet-a3 | applet | Cake Fractions | LO1 | ✅ + Post-Q |
| 7 | checkpoint-lo1 | checkpoint | Checkpoint: Equal Parts | LO1 | ✅ Interactive |
| 8 | slide-2 | slide | What are Fractions? | LO2 | ✅ Narration |
| 9 | video-2 | video | Bigger Fractions | LO2 | ✅ + Post-Q |
| 10 | applet-a4 | applet | Advanced Practice | LO2 | ✅ + Post-Q |
| 11 | goofy-2 | goofy | Max's Fun Fact | — | ✅ Voice-only |
| 12 | slide-3 | slide | Math Vault: Fraction Definition | LO2 | ✅ Narration |
| 13 | slide-4 | slide | Numerator and Denominator | LO2 | ✅ Narration |
| 14 | checkpoint-lo2 | checkpoint | Checkpoint: Bigger Fractions | LO2 | ✅ Interactive |
| 15 | slide-5 | slide (Q) | Discover More Fractions | LO3 | ✅ Question slide |
| 16 | video-3 | video | You Did It! | LO3 | ✅ + Post-Q |
| 17 | slide-6 | slide (Q) | Math Trap: Find the Error | LO3 | ✅ Question slide |
| 18 | slide-7 | slide | Snapshot: More Parts | LO3 | ✅ Narration |
| 19 | checkpoint-lo3 | checkpoint | Checkpoint: Fraction Master | LO3 | ✅ Interactive |

## Node Type Definitions

- **Onboarding**: 5-beat scripted flow with 2 LLM calls. Name capture + adventure hook + transition to lesson.
- **Video**: YouTube embed, student watches passively, skip button available.
- **Applet**: Interactive HTML iframe, student completes task, skip button available.
- **Slide**: Static image in MediaBox screen area. Narration slides auto-advance after TTS. Question slides trigger multi-turn Socratic dialogue.
- **Checkpoint**: Interactive review after each LO group. Multi-frame dynamic slide (CheckpointSlide component) + voice Q&A.
- **Goofy**: Voice-only fun break. Pre-scripted lines for Max (and optionally Spark). Auto-advance after TTS. No student response.

## Voice Interaction Pattern

Each video/applet node follows:
1. **Pre-node**: AI introduces the content (scripted TTS)
2. **Content consumption**: Student views/interacts
3. **Post-node**: AI asks comprehension question (multi-turn Socratic dialogue, up to 5 turns)

## Slide-Specific Behavior

- Narration slides (1, 8, 12, 13, 18): AI narrates → auto-advance. No Q&A.
- Question slides (15, 17): AI asks question → multi-turn Socratic dialogue with confetti.

## Dynamic Interactive Slide (Node 4)

Post-challenge for Applet A2. `FractionCompareSlide` — 5-frame state machine:
1. `question` → 2. `cut` (tap to split) → 3. `highlight` (tap to count) → 4. `compare` → 5. `celebration`

Two paths: correct first try (quick animated summary) vs wrong answer (interactive scaffolding with taps).

## Learning Objective Groups

- **LO1** (Nodes 1-7): Understanding equal parts and basic fraction notation (1/2, 1/4, 1/6)
- **LO2** (Nodes 8-14): Bigger fractions, numerator/denominator vocabulary
- **LO3** (Nodes 15-19): Applying fraction knowledge, error spotting, final review

## Checkpoint Structure

3 checkpoints (Nodes 7, 14, 19), one after each LO group. Each uses:
- `CheckpointSlide` component with multi-frame visual
- Voice Q&A with scaffolding (max 4 turns)
- `checkpointId` field linking to `checkpointContent.ts` frame definitions

## Goofy Moment Structure

2 goofy moments (Nodes 5, 11) placed between LO groups as fun breaks:
- Pre-scripted `goofyScript` with `tutorLine` and optional `minionLine`
- `showMinion: true` shows Spark character during the moment
- Auto-advance after TTS, no student interaction

**Last updated:** 2026-02-11

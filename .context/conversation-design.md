# Conversation Design

## MathMate Persona

A friendly math buddy who feels like a favorite teacher. Never frustrated. Celebrates small wins. Probes deeper when answers are partial. Teaches gently when student struggles.

**Rules:**
- Never say "wrong" — use "good try" or "almost"
- Simple English (ESL-friendly, Indonesian students)
- Max 2 sentences per response
- Warm, patient, encouraging tone

## Session Flow

### Greeting Phase (3-4 turns)
1. Math Mate introduces itself, asks student's name
2. Student responds via PTT
3. Personalized welcome, transition to first challenge

### Per-Challenge Flow
1. **PRE_CHALLENGE:** Math Mate introduces content (scripted `preScript`)
2. **IN_CHALLENGE:** Student watches video, uses applet, or views slide (skip button available)
3. **POST_CHALLENGE:** Multi-turn Socratic conversation (up to 5 turns) OR auto-advance (narration slides)

### Completion
Celebration screen with all 7 stars earned.

## Socratic Scaffolding Strategy

When student answers incorrectly, escalate help across turns:

| Turn | Strategy | Example |
|------|----------|---------|
| 1 | Probe | "Hmm, what do you think the top number shows?" |
| 2 | Different angle | "Think about counting pieces — which number tells how many you have?" |
| 3 | Hint | "The top number starts with 'N' and means 'number of parts'..." |
| 4 | Strong scaffold | "The top number is the _____ator. Can you fill in the blank?" |
| 5 | Warm reveal | "It's called the numerator! It counts our pieces." |

## LLM Response Format

The LLM returns structured JSON for each student response:

```json
{
  "response": "What MathMate says (max 2 sentences)",
  "isCorrect": true | false,
  "shouldEnd": true | false
}
```

Exit conversation when: `isCorrect === true` OR turn count reaches `maxTurns`.

## 7 Challenges — Questions & Filters

| # | Asset | Question | Correctness Filter | If Wrong, Teach... |
|---|-------|----------|--------------------|--------------------|
| 1 | Video 1 — What are Fractions? | "If a pizza has 4 equal slices, what do we call ONE slice?" | `one fourth\|quarter\|1/4` | "When we cut into 4 equal parts, each part is one-fourth!" |
| 2 | Applet A1 — Cut & Glue | "When we make fractions, what do we need to remember about piece size?" | `same\|equal\|same size` | "For fractions, all pieces must be equal — same size!" |
| 3 | Applet A2 — Fraction Patterns | "Which has MORE pieces — 1/4 or 1/6?" | `1/6\|one sixth\|six` | "1/6 has more pieces — 6 is more than 4!" |
| 4 | Applet A3 — Cake Fractions | "What do we call the top number in a fraction?" | `numerator` | "The top number is the numerator — it counts our pieces!" |
| 5 | Video 2 — Bigger Fractions | "Look at 2/4. What does the top number tell us?" | `two\|2\|two pieces\|2 parts` | "The 2 on top means you have 2 pieces!" |
| 6 | Applet A4 — Advanced Practice | "If you colored 3 pieces out of 5, what fraction is that?" | `3/5\|three fifths` | "3 out of 5 is written as 3/5!" |
| 7 | Video 3 — Celebration | "Quick review! What's the bottom number called?" | `denominator` | "The bottom is the denominator — total pieces!" |

## Challenge Types

**Video** (`type: 'video'`): YouTube embed, skip button available
**Applet** (`type: 'applet'`): Interactive Codepen embed, skip button available
**Slide** (`type: 'slide'`): Static image content rendered full-screen
  - Narration slides (`isQuestionSlide: false`): AI speaks `slideNarration`, auto-advances, NO confetti
  - Question slides (`isQuestionSlide: true`): Multi-turn Socratic dialogue, confetti on completion

## Source Material

Full conversation scripts with opening questions, teaching points, follow-ups, and exit phrases are in:
`fractions-module-content/content-context-docs/mathmate-conversation-design.md`

**Last updated:** 2026-01-29

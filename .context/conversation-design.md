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
Celebration screen with all 14 stars earned (one per node).

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

## 14 Nodes — Questions & Filters

See `src/config/challenges.ts` for complete definitions. Key nodes with post-questions:

| # | Asset | Question | Correctness Filter | If Wrong, Teach... |
|---|-------|----------|--------------------|--------------------|
| 2 | Video 1 — What are Fractions? | "If a pizza has 4 equal slices, what do we call ONE slice?" | `one fourth\|quarter\|1/4` | "When we cut into 4 equal parts, each part is one-fourth!" |
| 3 | Applet A1 — Cut & Glue | "When we make fractions, what do we need to remember about piece size?" | `same\|equal\|same size` | "For fractions, all pieces must be equal — same size!" |
| 4 | Applet A2 — Fraction Patterns | "Which has MORE pieces — 1/4 or 1/6?" | `1/6\|one sixth\|six` | "1/6 has more pieces — 6 is more than 4!" |
| 5 | Applet A3 — Cake Fractions | "What do we call the top number in a fraction?" | `numerator` | "The top number is the numerator — it counts our pieces!" |
| 7 | Video 2 — Bigger Fractions | "Look at 2/4. What does the top number tell us?" | `two\|2\|two pieces\|2 parts` | "The 2 on top means you have 2 pieces!" |
| 8 | Applet A4 — Advanced Practice | "If you colored 3 pieces out of 5, what fraction is that?" | `3/5\|three fifths` | "3 out of 5 is written as 3/5!" |
| 11 | Slide 5 — Discover More | "If you have 2 slices out of 6 total, what fraction?" | `2/6\|two sixths` | "2 out of 6 is written as 2/6!" |
| 12 | Video 3 — Celebration | "Quick review! What's the bottom number called?" | `denominator` | "The bottom is the denominator — total pieces!" |
| 13 | Slide 6 — Math Trap | "Which diagram is wrong — 2/4 or 2/6?" | `2/6\|six\|second\|bottom` | "The 2/6 diagram doesn't show 6 equal parts!" |

Nodes 1, 6, 9, 10, 14 are narration slides (no post-question, auto-advance after TTS).

## Challenge Types

**Video** (`type: 'video'`): YouTube embed, skip button available
**Applet** (`type: 'applet'`): Interactive Codepen embed, skip button available
**Slide** (`type: 'slide'`): Image content rendered full-screen
  - Narration slides (`isQuestionSlide: false`): AI speaks `slideNarration`, auto-advances, NO confetti
  - Question slides (`isQuestionSlide: true`): Multi-turn Socratic dialogue, confetti on completion

## Dynamic Slide Interaction Pattern (NEW - Jan 30, 2026)

### Vision: Slides as Interactive "Blackboards"

Slides should function like a teacher's blackboard — revealing content dynamically based on conversation state, not just displaying a static image.

### Current Behavior (Static)
1. Slide appears (full image loads)
2. Voice narrates or asks question
3. Student answers
4. Move to next node

### Desired Behavior (Dynamic)
1. Voice asks initial question
2. Slide appears showing relevant visual
3. Student responds
4. **If wrong:** Slide updates to show scaffolding hint (visual aid)
5. Voice gives verbal scaffold
6. Student tries again
7. **If correct:** Slide updates to show answer with visual confirmation
8. Move to next node

### Example: Fraction Comparison (Node 11)

**Turn 1 (Initial Question):**
- Voice: "If you have 2 slices out of 6 total slices, what fraction is that?"
- Slide: Shows pizza with 6 slices, 2 highlighted

**Turn 2-3 (Student Struggles):**
- Student: "I don't know"
- Voice: "The pieces you have go on top. The total goes on bottom. What do you get?"
- Slide: Updates to show fraction notation 2/? with top highlighted

**Turn 4-5 (More Scaffolding):**
- Student: "Two... something"
- Voice: "Two on top, six on bottom. Say the fraction!"
- Slide: Updates to show 2/6 with arrows pointing to numerator/denominator labels

**Turn 5+ (Correct or Reveal):**
- Student: "Two sixths!" OR Voice reveals answer
- Slide: Shows final answer 2/6 with checkmark/celebration visual

### Implementation (Completed Feb 2, 2026)

**Focused Experiment: FractionCompareSlide (Node 4)**

Built a React component `FractionCompareSlide` that demonstrates the vision. Uses programmatic rendering (not image assets) for flexibility.

**Architecture:**
- 5-frame state machine: `question` → `cut` → `highlight` → `compare` → `celebration`
- Types added to `src/types/index.ts`: `SlideFrame`, `SlideInteractionState`
- State managed in `sessionStore.ts`: `dynamicSlideFrame`, `slideInteraction`, `setDynamicSlideFrame()`, etc.
- Voice coordination in `useVoiceInteraction.ts`: `runFractionCompareInteraction(isCorrect: boolean)`

**Two Interaction Paths:**
- **Path A (Correct first try):** Student says "1/6" → Quick 5-second animation showing all frames
- **Path B (Wrong answer):** Student gives wrong answer → Interactive scaffolding:
  1. Tap indicators appear on rectangles
  2. Student taps to split (or 15-second auto-advance)
  3. Tap indicators appear on pieces
  4. Student taps to highlight (or 15-second auto-advance)
  5. Piece counts appear
  6. Voice asks "Which number is bigger - 4 or 6?"
  7. Student answers verbally
  8. Celebration frame

**Touch Interactions:**
- Tap-to-split: Triggers rectangle cut animation
- Tap-to-highlight: Fills pieces with coral color
- 15-second timeout auto-advances if student doesn't tap

**Visual Design:**
- Split animations with staggered vertical lines
- Pulsing glow on tap indicators
- Piece count badges with pop-in animation
- Celebration banner with sparkle effects

### Future Expansion

The `hasDynamicSlide: true` flag on Challenge type enables identifying nodes that use this pattern. If experiment proves successful:
- Generalize to nodes 11, 13 (question slides)
- Create reusable dynamic slide framework
- Consider SVG-based slides for easier content authoring

## Source Material

Full conversation scripts with opening questions, teaching points, follow-ups, and exit phrases are in:
`fractions-module-content/content-context-docs/mathmate-conversation-design.md`

**Last updated:** 2026-02-02

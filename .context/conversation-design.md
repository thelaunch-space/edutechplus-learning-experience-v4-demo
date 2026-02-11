# Conversation Design

## Max Persona (Iteration 5+)

"Max" is a young boy scientist character — brown messy hair, big round glasses, white lab coat. A friendly math buddy who feels like a favorite teacher. Never frustrated. Celebrates small wins. Probes deeper when answers are partial. Teaches gently when student struggles.

**Rules:**
- Never say "wrong" — use "good try" or "almost"
- Simple English (ESL-friendly, Indonesian students)
- Max 2 sentences per response
- Warm, patient, encouraging tone

## Spark (Minion)

"Spark" is a small cute robot — dark blue/grey metallic body, orange accents, glowing cyan eyes. Goofy, curious, easily confused by fractions. Provides comic relief. NOT a teaching character — only appears at scripted moments (onboarding intro + goofy moments).

## Session Flow

### Onboarding Phase (Node 0) — 5-Beat Structure (Feb 11 rewrite)

**Philosophy:** Scripted backbone, LLM intelligence at the joints. Script controls structure; LLM only fills in personalization. No open-ended loops.

**5 Beats:**

| Beat | What | Scripted/LLM | PTT? | Duration |
|------|------|-------------|------|----------|
| 1: Grand Entrance | Max + Spark intro (no fraction mention — save reveal for Beat 3) | Scripted | No | ~12s |
| 2: Name Capture | "What's your name?" → hardened extractName() | Scripted | Yes (#1) | ~3s + PTT |
| 3: Adventure Hook | Greet by name + pitch "fraction adventure" + learning outcomes + fun question | LLM (`generateAdventureHook`) | Yes (#2) | ~12s + PTT |
| 4: Bridge + Transition | Acknowledge student response + build excitement + transition to lesson | LLM (`generateBridgeTransition`) | No | ~8s |
| 5: Auto-advance | Hide minion, advance to Node 1 | Auto | No | instant |

**Total: ~60-90 seconds, 2 PTT moments, 2 LLM calls.**

**Beat 3 prompt (`getAdventureHookPrompt`):** One-shot. MUST use "fraction adventure", MUST mention 2+ activities (pizza/cake/puzzles), MUST end with fun question. Plain text output (no JSON).

**Beat 4 prompt (`getBridgeTransitionPrompt`):** One-shot. MUST acknowledge what kid said, MUST transition. Handles curveballs: silly responses, reluctance, silence, off-topic. Plain text output (no JSON). MUST NOT ask another question.

**Name extraction (`extractName()`):** Hardened with garbage detection — catches single letters ("I"), common words ("no", "yes", "what", "um"), numbers, short gibberish. Re-asks once on failure, falls back to "Buddy".

**Fallbacks per beat:**
- Beat 3: `"Hey [Name]! You, me, and Spark are going on a fraction adventure today! We're gonna slice pizza, share cake, and solve cool fraction puzzles — it's gonna be so fun! What's your favorite thing to eat?"`
- Beat 4: `"That's awesome! Alright [Name], Spark's getting impatient — let's jump into our fraction adventure!"`
- Silent Beat 4: `"No worries! You're gonna love this once we get started. Let's jump in, [Name]!"`

**Expression choreography:**
- Beat 1: `greeting` (minion visible)
- Beat 2: `greeting` (minion visible)
- Beat 3 speaking: `celebration` → Beat 3 listening: `listening`
- Beat 4: `giggling`
- Beat 5: `neutral` (minion hides)

**Key design decisions (Feb 11):**
- Fraction topic reveal saved for Beat 3 (dramatic adventure pitch) — Beat 1 only introduces characters
- LLM calls use plain text output (no JSON) — simpler, fewer parse failures
- No while loop — exactly 2 LLM calls, linear flow
- Each LLM call has ONE specific job (not multi-turn instructions)

### Per-Challenge Flow (video/applet/slide nodes)
1. **PRE_CHALLENGE:** Max introduces content (scripted `preScript`, expression: `neutral`)
2. **IN_CHALLENGE:** Student watches video, uses applet, or views slide (skip button in NavBar)
3. **POST_CHALLENGE:** Multi-turn Socratic conversation (up to 5 turns) OR auto-advance (narration slides)
   - Asking question: expression → `nudging`
   - Student speaking (PTT): expression → `listening`
   - Correct answer: expression → `celebration`
   - Incorrect/scaffolding: expression → `encouragement`

### Goofy Moments (nodes 5, 11)
Pre-scripted fun breaks. No student interaction, auto-advance.
1. Max sets expression → `giggling`
2. If Spark involved: show minion, speak Spark's line
3. Speak tutor line
4. Wait 1.5s → hide minion → advance

### Checkpoints (nodes 7, 14, 19)
Celebratory review after each learning objective group. Uses `getCheckpointPrompt()`.
1. Max sets expression → `celebration`
2. Speaks summary of what was learned (preScript)
3. Asks 1-2 review questions (PTT turns, max 4 turns)
4. Confetti → advance

**3 Learning Objective Groups:**
- LO1 (nodes 1-6): Equal parts, basic fraction notation
- LO2 (nodes 8-13): Bigger fractions, numerator/denominator
- LO3 (nodes 15-18): Applying fraction knowledge

### Completion
Celebration screen after all 20 nodes complete.

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

## 20 Nodes — Journey Map (Iteration 5)

See `src/config/challenges.ts` for complete definitions.

| # | Type | Title | Notes |
|---|------|-------|-------|
| 0 | onboarding | Meet Max & Spark | Name capture, warm-up Qs |
| 1 | slide | Why Fractions? | Narration, auto-advance |
| 2 | video | What are Fractions? | Q: "ONE slice of 4?" → 1/4 |
| 3 | applet | Cut and Glue Practice | Q: "Piece size?" → equal/same |
| 4 | applet | Fraction Patterns | Q: "MORE pieces 1/4 or 1/6?" → 1/6 + dynamic slide |
| 5 | **goofy** | Spark's Fraction Joke | Auto-play, Spark visible |
| 6 | applet | Cake Fractions | Q: "Top number name?" → numerator |
| 7 | **checkpoint** | Checkpoint LO1 | Review: equal parts, notation |
| 8 | slide | What are Fractions? | Narration, auto-advance |
| 9 | video | Bigger Fractions | Q: "2/4 top number?" → 2 pieces |
| 10 | applet | Advanced Practice | Q: "3 of 5 colored?" → 3/5 |
| 11 | **goofy** | Max's Fun Fact | Auto-play, no minion |
| 12 | slide | Math Vault: Fraction Def | Narration, auto-advance |
| 13 | slide | Numerator & Denominator | Narration, auto-advance |
| 14 | **checkpoint** | Checkpoint LO2 | Review: bigger fractions, N/D |
| 15 | slide | Discover More Fractions | Q: "2 of 6 slices?" → 2/6 |
| 16 | video | You Did It! | Q: "Bottom number?" → denominator |
| 17 | slide | Math Trap: Find Error | Q: "Which diagram wrong?" → 2/6 |
| 18 | slide | Snapshot: More Parts | Narration, auto-advance |
| 19 | **checkpoint** | Checkpoint LO3 | Review: applying fractions |

## Challenge Types

**Video** (`type: 'video'`): YouTube embed, skip button in NavBar
**Applet** (`type: 'applet'`): Interactive iframe embed, skip button in NavBar
**Slide** (`type: 'slide'`): Image content rendered in MediaBox
  - Narration slides (`isQuestionSlide: false`): AI speaks `slideNarration`, auto-advances, NO confetti
  - Question slides (`isQuestionSlide: true`): Multi-turn Socratic dialogue, confetti on completion
**Onboarding** (`type: 'onboarding'`): Pure conversation, OnboardingWelcome visual, no correctness eval
**Checkpoint** (`type: 'checkpoint'`): Review questions after LO groups, CheckpointSlide visual, confetti
**Goofy** (`type: 'goofy'`): Pre-scripted fun break, auto-play voice, auto-advance, no PTT

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

**Last updated:** 2026-02-10

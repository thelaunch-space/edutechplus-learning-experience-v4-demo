# Conversation Design

## Max Persona (Iteration 5+)

"Max" is a young boy scientist character — brown messy hair, big round glasses, white lab coat. A friendly math buddy who feels like a favorite teacher. Never frustrated. Celebrates small wins. Probes deeper when answers are partial. Teaches gently when student struggles.

**Rules:**
- Never say "wrong" — use "good try" or "almost"
- Simple English (ESL-friendly, Indonesian students)
- Max 2 sentences per response
- Warm, patient, encouraging tone

## Spark (Minion)

"Spark" is a small cute robot — dark blue/grey metallic body, orange accents (headphones, antenna, joints), glowing cyan eyes with a smile, cyan chest light. Goofy, curious, easily confused by fractions. Provides comic relief. Think of Spark as the kid in class who means well but gets things hilariously wrong.

NOT a teaching character — appears via `minionMoment` fields embedded in regular nodes (8 moments across the journey). Spark speaks FIRST, then Max responds. Positioned left of tutor at bottom-left, smaller than Max. Uses Aria voice (distinct female voice vs Max's Liam male voice).

**Moment types (mixed throughout):**
- Silly jokes / bad puns (pure comedy relief)
- Silly noises / confusion (endearing confusion)
- Misconception doubts (common student mistakes — Max corrects gently, teaching moment)
- Hype / excitement (energy boost before milestones)

**Implementation:** `minionMoment?: MinionMoment` on any Challenge node. Plays before preScript — Spark appears, speaks `minionLine`, Max responds with `tutorLine`, Spark hides, then normal flow continues. Name-agnostic field (`minionMoment`) so character can be renamed later.

## Max Expression System

7 expression states (static PNGs in `public/tutor-assets/Character/`, transparent background). Start with static image swaps; designed to be replaced with sprite animations later. Full-body character, positioned to overlap sidebar bottom edge.

| File | Expression | Visual | When to use |
|------|-----------|--------|-------------|
| `Neutral.png` | Hands in pockets, calm smile | Default/idle | Narrating content, pre-challenge intros |
| `Greeting.png` | Waving, open smile | Welcome | Onboarding welcome, start of session |
| `Celebration.png` | Both fists raised, excited | Victory | Student correct, checkpoint complete, confetti |
| `Encouragment.png` | Thumbs up with sparkle | Reinforcement | Positive reinforcement ("good try!"), partial correct |
| `Giggling.png` | Hand over mouth laughing | Humor | Goofy moments, jokes, fun breaks |
| `Listening.png` | Hand cupped to ear | Attentive | Student speaking (PTT held down) |
| `Nudging.png` | Pointing forward, leaning in | Prompting | Prompting to respond, giving hints, scaffolding |

**Phase-based mapping (code-driven, not LLM-driven):**
- `greeting` phase / onboarding → `Greeting`
- `pre_challenge` narration → `Neutral`
- `in_challenge` (student watching) → `Neutral`
- `post_challenge` (asking question) → `Nudging`
- Student speaking (PTT active) → `Listening`
- Student correct (`isCorrect: true`) → `Celebration`
- Student incorrect / scaffolding → `Encouragement`
- Goofy moment nodes → `Giggling`
- Checkpoint summary → `Celebration`

## Session Flow

### Onboarding Phase (Node 0) — 7-Beat FTUE Flow (Feb 17 rewrite)

**Philosophy:** Scripted backbone, LLM intelligence at the joints. PTT training with visual FTUE hint. Spark gets a real interactive moment. Interface walkthrough before lesson starts.

**7 Beats:**

| Beat | What | Type | PTT? | LLM? |
|------|------|------|------|------|
| 1 | Max enters portal. Warm self-intro | Scripted | — | — |
| 2 | PTT training: "Press the blue button like a walkie-talkie. Tell me your name!" + FTUE pulsing hint on button | Scripted | — | — |
| 3 | Student says name (PTT #1). FTUE hint disappears. `extractName()` with retry | PTT | YES | — |
| 4 | Max acknowledges name (LLM, 1 sentence). Spark slides in. "Say something to him!" | LLM + Scripted | — | YES |
| 5 | Student talks to Spark (PTT #2) | PTT | YES | — |
| 6 | Spark responds with goofy/silly LLM response (`speakAsSpark()`) | LLM | — | YES |
| 7 | Max: interface walkthrough + lesson preview + "Let's gooo!" → auto-advance to Node 1 | Scripted | — | — |

**Total: ~40-45 seconds, 2 PTT moments, 2 LLM calls.**

**Beat 4 prompt (`getNameAcknowledgmentPrompt`):** Max greets by name. 1 sentence, under 15 words, no question, no Spark/fraction mention. Fallback: `"Hey [name], awesome to meet you!"`

**Beat 6 prompt (`getSparkGoofyResponsePrompt`):** Spark persona. 1 sentence, under 20 words, must be silly/goofy/confused. Bad dad jokes, confused robot humor. Fallback empty: `"Beep boop! Hmm, I think my ears are broken!"`. Fallback LLM fail: `"Beep boop! Hi [name]! I tried to wave but my arm fell off! Hehe!"`

**FTUE PTT Hint:** Pulsing blue ring + "Tap & hold to speak" label above PTT button. Appears on Beat 2, disappears when student starts recording on Beat 3. State: `showPTTHint` in sessionStore, passed to NavBar.

**Name extraction (`extractName()`):** Hardened with garbage detection — catches single letters ("I"), common words ("no", "yes", "what", "um"), numbers, short gibberish. Re-asks once on failure, falls back to "Buddy".

**Key design decisions (Feb 17):**
- Spark NOT visible until Beat 4 (dramatic entrance when Max introduces him)
- Student talks TO Spark (Beat 5) — real interactivity, not just watching
- Interface walkthrough (Beat 7) sets expectations for what's coming
- Fraction topic revealed naturally in Beat 7 walkthrough

**Expression choreography:**
- Beat 1: `greeting` (Spark NOT visible)
- Beat 2: `encouragement` (FTUE hint appears)
- Beat 3: `listening` during PTT
- Beat 4: `celebration` → `giggling` (Spark slides in)
- Beat 5: `listening` during PTT
- Beat 6: Spark speaking (via `speakAsSpark`)
- Beat 7: `encouragement` → `neutral` (Spark hides, auto-advance)

### Per-Challenge Flow (video/applet/slide nodes)
1. **PRE_CHALLENGE:** Max introduces content (scripted `preScript`, expression: `neutral`)
2. **IN_CHALLENGE:** Student watches video, uses applet, or views slide (skip button in NavBar)
3. **POST_CHALLENGE:** Multi-turn Socratic conversation (up to 5 turns) OR auto-advance (narration slides)
   - Asking question: expression → `nudging`
   - Student speaking (PTT): expression → `listening`
   - Correct answer: expression → `celebration`
   - Incorrect/scaffolding: expression → `encouragement`

### Goofy Moments (nodes 5, 11)
Pre-scripted fun breaks. No student interaction, auto-advance. Placed as natural breathers between heavy content nodes (after applets, before new sections). A third placement after Node 12 was considered but not implemented.
1. Max sets expression → `giggling`
2. If Spark involved: show minion, speak Spark's line
3. Speak tutor line
4. Wait 1.5s → hide minion → advance

### Checkpoints (nodes 4, 8, 12, 15, 20)
Celebratory review after each of 5 learning objective groups. Uses `getCheckpointPrompt()`. Dynamic slide fills content area with question pane layout (same pattern as FractionCompareSlide). Voice + tap interactions.
1. Max sets expression → `celebration`
2. Dynamic slide appears — visually summarizes concepts covered in that LO group
3. Speaks summary of what was learned (preScript)
4. Asks 1-2 review/recall questions — steers toward student articulating what they learned
5. Confetti → advance
**Design intent:** Questions are review/recall, not new teaching. Tone: celebratory + reflective ("look how much you've learned!"). Keep short — 3-4 turns max. LLM-driven (not fully scripted) so it feels natural.

**5 Learning Objective Groups:**
- LO1 (nodes 1-3): Equal parts, first fraction names
- LO2 (nodes 5, 7): Comparing fractions, naming the numerator
- LO3 (nodes 9-11): Building bigger fractions (numerator > 1)
- LO4 (nodes 13-14): Fraction vocabulary — numerator and denominator
- LO5 (nodes 16-19): Applying fraction knowledge, error spotting

### Completion
Celebration screen after all 21 nodes (0-20) complete.

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

## 21 Nodes — Journey Map (0-20)

See `src/config/challenges.ts` for complete definitions.

| # | Type | Title | Notes |
|---|------|-------|-------|
| 0 | onboarding | Meet Max & Spark | Name capture, warm-up Qs |
| 1 | slide | Why Fractions? | Narration, auto-advance |
| 2 | video | What are Fractions? | Q: "ONE slice of 4?" → 1/4 |
| 3 | applet | Cut and Glue Practice | Q: "Piece size?" → equal/same |
| 4 | **checkpoint** | Level Up: Equal Parts! | Review: LO1 |
| 5 | applet | Fraction Patterns | Q: "MORE pieces 1/4 or 1/6?" → 1/6 + dynamic slide |
| 6 | **goofy** | Spark's Fraction Joke | Auto-play, Spark visible |
| 7 | applet | Cake Fractions | Q: "Top number name?" → numerator |
| 8 | **checkpoint** | Level Up: Fraction Expert! | Review: LO2 |
| 9 | slide | What are Fractions? | Narration, auto-advance |
| 10 | video | Bigger Fractions | Q: "2/4 top number?" → 2 pieces |
| 11 | applet | Advanced Practice | Q: "3 of 5 colored?" → 3/5 |
| 12 | **checkpoint** | Level Up: Fraction Builder! | Review: LO3 |
| 13 | slide | Math Vault: Fraction Def | Narration, auto-advance |
| 14 | slide | Numerator & Denominator | Narration, auto-advance |
| 15 | **checkpoint** | Level Up: Vocabulary Master! | Review: LO4 |
| 16 | slide | Discover More Fractions | Q: "2 of 6 slices?" → 2/6 |
| 17 | video | You Did It! | Q: "Bottom number?" → denominator |
| 18 | slide | Math Trap: Find Error | Q: "Which diagram wrong?" → 2/6 |
| 19 | slide | Snapshot: More Parts | Narration, auto-advance |
| 20 | **checkpoint** | Level Up: Fraction Master! | Review: LO5 |

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

### Generalized Dynamic Question Slides (NEW - Feb 11, 2026)

Expanded the dynamic slide approach to ALL post-challenge questions across the journey. 8 nodes now use tap-based dynamic slides instead of voice-only Q&A on empty screens.

**3 Reusable Templates:**

| Template | Component | Used in Nodes | Mechanic |
|----------|-----------|---------------|----------|
| `fraction-builder` | `FractionBuilder` | 2, 10, 15 | Tap pieces to count → number fills fraction slot (numerator then denominator) |
| `multiple-choice` | `MultipleChoice` | 6, 9, 16 | Tap word/answer buttons. Wrong → wobble + eliminate. Right → celebrate |
| `tap-to-select` | `TapToSelect` | 3, 17 | Tap correct diagram/bar. Wrong → hint + try again. Right → reveal |

**Architecture:**
- Types: `DynamicSlideTemplate`, `QuestionSlideFrame`, `QuestionSlideState` in `src/types/index.ts`
- Content config: `src/config/dynamicSlideContent.ts` (per-node configs for each template)
- Components: `src/components/DynamicSlides/{FractionBuilder,MultipleChoice,TapToSelect}/`
- Renderer: `src/components/DynamicSlides/DynamicSlideRenderer.tsx` (picks template by challenge config)
- Store: `questionSlideFrame`, `questionSlideState`, `resetQuestionSlideState()` in sessionStore
- Voice: `runDynamicQuestionInteraction()` in useVoiceInteraction.ts (orchestrates taps + voice)
- Challenge flags: `dynamicSlideTemplate` and `dynamicSlideId` on Challenge type

**Interaction Flow (all templates) — Voice-First Check:**
1. Max speaks the question (voice)
2. Dynamic slide appears on `question` frame
3. **Student answers verbally (PTT)** — voice-first check
4. **If correct (regex match):** Quick auto-animation through scaffold→reveal frames (no taps needed), celebrate
5. **If wrong:** Tap-based scaffold appears — student interacts by tapping
6. If wrong tap: visual feedback (wobble/eliminate) + Max speaks scaffold hint
7. If correct/complete: reveal frame with celebration
8. Confetti → advance to next node

**Frame state machine (simpler than FractionCompareSlide):**
`question` → `scaffold` (tapping enabled) → `reveal` (celebration)

**Timeout:** 20-second auto-complete if student doesn't tap (same pattern as FractionCompareSlide).

**Design:** All templates follow the 3-zone layout (Question pane / Visual area / Answer pane) and use the same CSS variables, animation patterns, and design system as FractionCompareSlide.

**Voice-First Check Pattern:** All dynamic question slides use a voice-first check before showing the tap scaffold. Max asks the question verbally, the student answers via PTT, and the answer is checked against `correctnessFilter`. If correct, the slide auto-animates through scaffold/reveal frames without requiring taps. If wrong, the tap-based scaffold appears for interactive learning.

**Scaffold Field:** The `scaffold` field in the Scaffolding type is optional. When present, it is used on turn 4 before the reveal. When absent, the reveal is used directly.

### Legacy: FractionCompareSlide (Node 4)

The original `FractionCompareSlide` for Node 4 is preserved as-is. It uses the `hasDynamicSlide: true` flag and its own 5-frame state machine. The new templates use `dynamicSlideTemplate` + `dynamicSlideId` flags instead.

## Voice System (Feb 16, 2026)

Two distinct ElevenLabs voices for auditory differentiation:

| Character | Voice | ID | Settings | Rationale |
|-----------|-------|-----|----------|-----------|
| **Max** | Liam (young male) | `TX3LPaxmHKxFdv7VOQHJ` | stability: 0.5, similarity: 0.75, style: 0.4 | Matches Max's teen boy scientist look |
| **Spark** | Aria (expressive female) | `9BWtsMINqrJLrRacOk9x` | stability: 0.35, similarity: 0.7, style: 0.65 | Animated delivery, immediately distinct from Max |

**Implementation:** `speakText(text, voice)` in `tts.ts` accepts `'max'` (default) or `'spark'`. `speakAsSpark()` helper in `useVoiceInteraction.ts` wraps all `minionLine` calls. All `tutorLine` uses default `speak()` (Max's voice). No extra API cost — same ElevenLabs tier.

**Post-question wrap-up:** 5 rotating phrases (no consecutive repeats) replace the hardcoded "Nice work! You're learning so fast." after dynamic question confetti.

## Micro-Conversations (Feb 17, 2026)

Single-turn LLM-powered exchanges injected into passive nodes to break dead zones. Each follows a fixed pattern — no loops, no follow-up questions.

**Pattern:**
1. Max asks a scripted question (TTS'd verbatim from `microConversation.prompt`)
2. Student responds via PTT (1 turn)
3. LLM generates 1 warm acknowledgment (60 token cap, no follow-up question)
4. Flow continues normally

**4 Micro-Conversation Types:**

| Type | Purpose | LLM Instruction |
|------|---------|-----------------|
| `curiosity` | Prediction before new content | React with interest to their guess, don't reveal the answer |
| `reaction` | After funny Spark moments | Laugh WITH them, share the moment, any answer works |
| `recall` | Quick "do you remember?" check | If right: celebrate briefly. If wrong: give answer casually |
| `personal` | Connect math to their world | React warmly to what THEY said, connect to fractions |

**4 Injection Points (position field):**
- `after_narration` — In `runSlideInteraction()`, after `slideNarration` on narration slides
- `after_goofy` — In `runGoofyMomentInteraction()`, after Spark's minionLine
- `after_minion` — In `runPreChallengeInteraction()`, after minionMoment plays
- `after_prescript` — In `runPreChallengeInteraction()`, after preScript speaks

**Configuration:** `microConversation?: MicroConversationConfig` on Challenge interface. Each config contains: `type`, `position`, `prompt` (scripted question), `context` (for LLM), `transitionTo` (for LLM bridging), `fallback` (if LLM fails/student silent).

**LLM Prompt (`getMicroConversationPrompt`):** Type-specific instructions. Rules: 1 sentence under 20 words, no follow-up question, simple English, no emojis. Fallback if empty/nonsensical input.

**Service Function:** `generateMicroConversationResponse()` in `openrouter.ts`. 60 max tokens, 0.8 temperature. Strips emojis. Falls back to config's `fallback` string on failure.

**8 nodes with micro-conversations:** 1, 2, 6, 9, 10, 13, 14, 19.

## Source Material

Full conversation scripts with opening questions, teaching points, follow-ups, and exit phrases are in:
`fractions-module-content/content-context-docs/mathmate-conversation-design.md`

**Last updated:** 2026-02-17 (7-beat FTUE onboarding rewrite)

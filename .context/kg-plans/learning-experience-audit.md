# Learning Experience Design Audit — Math Mate Fractions Module

**Date:** 2026-02-17
**Auditor:** Claude (instructional designer + content curator + Grade 4 teacher lens)
**Requested by:** KG (Krishna Goutham)

---

## Objective

Evaluate the complete Math Mate learning experience — from first conversation to end — through the lens of a Grade 4 Asian student (ESL, 9-10 years old). Identify every point where the student might feel disconnected, unheard, or disengaged. Deliver crystal-clear, prioritized action items focused on learning design and meaningful conversations, not architecture or tech.

---

## What's Working Well

1. **Concept-before-vocabulary pedagogy** — Students use fractions for 6+ nodes before "numerator" is named (Node 7). The word attaches to an existing mental model, not a new abstract concept.
2. **Spark's misconception modeling** — When Spark says "three-FORTHS" (Node 11), forgets "numerator" (Node 9), or cuts paper into unequal pieces (Node 3), it inoculates students against the exact errors they'd make.
3. **"D for Down, D for Denominator" mnemonic** (Node 14) — Concrete, alliterative, voiceable.
4. **Math Trap error detection** (Node 18) — The only Evaluate-level task (Bloom's taxonomy). Genuine higher-order thinking.
5. **Voice-first check on dynamic slides** — Asking verbally before showing taps mirrors how a good tutor works.
6. **5-step scaffolding structure** — probe → different angle → hint → scaffold → reveal prevents both cold reveals and endless loops.
7. **Minion moment distribution** — 8 moments at peak cognitive load points. The 5/4 improper fraction joke (Node 6) plants a seed for future learning.
8. **Content complexity progression** — Three dimensions advance semi-independently (numerator complexity, denominator range, task type).

---

## Content & Scaffolding Findings

These are issues with the written content in `challenges.ts` and `prompts.ts` — independent of the student involvement problem.

### C1. PreScripts are traffic controllers, not teachers

**The single most persistent issue across all 5 iterations of client feedback.** Iteration 1: "The AI is a traffic controller, not a tutor." Iteration 5: "Pre-content scripts give away the concept instead of building curiosity."

Every preScript should: **Recall** what the kid just did → **Tease** what's coming → **Frame** what to pay attention to.

Worst offenders: Nodes 10, 12, 16, 17.

**Where:** `challenges.ts` — all preScript fields | **Effort:** ~2 hrs

### C2. AI doesn't acknowledge what the child actually said

The evaluation prompt tells the LLM to "warmly acknowledge" but does NOT instruct it to reference the student's specific words. A child who says "is it... maybe... one fourth?" gets "Nice one!" instead of "Yes, one-fourth — you got it!"

**Where:** `prompts.ts` — `getEvaluationPrompt` | **Effort:** ~15 min

### C3. Hints give away the answer at Turn 2 of 5

Nodes 11, 12, 16, 20: the `hint` level IS the answer ("It's 3 over 5. How do we write that?"). Turns 3-4 then become redundant re-asks.

**Where:** `challenges.ts` — scaffolding.hint fields | **Effort:** ~1 hr

### C4. Unreachable reveal messages on nodes 8, 15, and 20

Bug: `maxTurns: 4` but 5 scaffold levels. The `reveal` is dead code. Fix: `maxTurns: 5`.

**Where:** `challenges.ts` | **Effort:** ~5 min

### C5. Empty transcripts consume scaffold turns

When STT fails, empty string goes to LLM as a wrong answer, burning scaffold turns. `FALLBACK_RESPONSES.silent` exists but is never wired in.

**Where:** `useVoiceInteraction.ts` | **Effort:** ~30 min

### M1. Node 10 correctness filter too broad

Bare `"two"` and `"2"` match "between" or "twenty." Fix: require "pieces/parts" with the number.

**Where:** `challenges.ts` node 10 | **Effort:** ~5 min

### M2. Node 15 correctness filter matches question echoing

`"how many"` matches if student echoes the question; bare `"three"` is too broad.

**Where:** `challenges.ts` node 15 | **Effort:** ~5 min

### M4. No progress indicator

A 9-year-old has no idea they're on node 5 of 21 or how much is left.

**Where:** New UI component | **Effort:** ~2 hrs

### M5. Chat log grows without landmarks

By node 15, the chat has 60+ messages with no visual separator between node conversations.

**Where:** `ChatHistory.tsx` | **Effort:** ~30 min

### M6. Node 17 celebration bait-and-switch

"You Did It!" video immediately followed by a vocabulary question. Rewrite preScript to set up the final review question.

**Where:** `challenges.ts` node 17 | **Effort:** ~5 min

### M7. Denominator is under-tested

Numerator tested at Node 7 AND Checkpoint LO4. Denominator only tested once (Node 17), never at a checkpoint.

### P1. Node 17 hint misses the mnemonic

Hint says "sounds similar to numerator" but kid learned "D for Down, D for Denominator" at Node 14.

**Where:** `challenges.ts` node 17 scaffolding.hint | **Effort:** ~5 min

### P3. Node 18 "find the mistake" — "Tap the wrong one!" confuses

Better: "Tap the one with the mistake."

**Where:** `dynamicSlideContent.ts` | **Effort:** ~15 min

### P4. FractionBuilder "tap ALL pieces" misleading in denominator phase

Better: "Now count the rest!"

**Where:** `useVoiceInteraction.ts` | **Effort:** ~15 min

### P5. Dynamic slide voice-first check uses regex only

Synonyms like "one quarter" for "one fourth" may not match. Consider routing through LLM.

**Where:** `useVoiceInteraction.ts` | **Effort:** ~2 hrs

---

## Student Involvement Audit — "Am I Part of This?"

**The core problem:** 6 out of 21 nodes (29%) have ZERO student input. Worse, when you look across node boundaries, there are 5 "dead zones" of 5-8 consecutive AI monologues where the student is a passive spectator.

### Node-by-Node Interaction Map

Legend: `[M]` = Max speaks, `[S]` = Spark speaks, `[PTT]` = student speaks, `[TAP]` = student taps, `[WATCH]` = video/applet, `[AUTO]` = auto-advance

| Node | Type | Sequence | Student Inputs | Passive Speeches |
|------|------|----------|---------------|-----------------|
| 0 | Onboarding | `[M] intro → [M] "name?" → [PTT] → [M] hook → [PTT] → [M] bridge → [AUTO]` | 2 PTT | 4 |
| 1 | Slide (narr) | `[S] minion → [M] reply → [M] preScript → [M] narration → [AUTO]` | **0** | 4 |
| 2 | Video | `[M] preScript → [WATCH] → [M] question → [PTT] → [M+TAP] dynamic slide` | 1+ PTT, taps | 2 |
| 3 | Applet | `[S] minion → [M] reply → [M] preScript → [WATCH] → [M] question → [PTT] → [M+TAP]` | 1+ PTT, taps, applet | 3 |
| 4 | Checkpoint | `[M] preScript → [M] question → [PTT] → multi-turn` | 1+ PTT | 2 |
| 5 | Applet | `[M] preScript → [WATCH] → [M] question → [PTT] → [TAP+PTT] FractionCompare` | 1+ PTT, taps, applet | 1 |
| 6 | Goofy | `[M] tutorLine → [S] minionLine → [AUTO]` | **0** | 2 |
| 7 | Applet | `[S] minion → [M] reply → [M] preScript → [WATCH] → [M] question → [PTT] → [M+TAP]` | 1+ PTT, taps, applet | 3 |
| 8 | Checkpoint | `[M] preScript → [M] question → [PTT] → multi-turn` | 1+ PTT | 2 |
| 9 | Slide (narr) | `[S] minion → [M] reply → [M] preScript → [M] narration → [AUTO]` | **0** | 4 |
| 10 | Video | `[M] preScript → [WATCH] → [M] question → [PTT] → [M+TAP] dynamic slide` | 1+ PTT, taps | 1 |
| 11 | Applet | `[S] minion → [M] reply → [M] preScript → [WATCH] → [M] question → [PTT] → [M+TAP]` | 1+ PTT, taps, applet | 3 |
| 12 | Checkpoint | `[M] preScript → [M] question → [PTT] → multi-turn` | 1+ PTT | 2 |
| 13 | Slide (narr) | `[M] preScript → [M] narration → [AUTO]` | **0** | 2 |
| 14 | Slide (narr) | `[S] minion → [M] reply → [M] preScript → [M] narration → [AUTO]` | **0** | 4 |
| 15 | Checkpoint | `[M] preScript → [M] question → [PTT] → multi-turn` | 1+ PTT | 2 |
| 16 | Slide (Q) | `[M] preScript → [M] question → [PTT] → multi-turn + [TAP]` | 1+ PTT, taps | 2 |
| 17 | Video | `[S] minion → [M] reply → [M] preScript → [WATCH] → [M] question → [PTT] → [M+TAP]` | 1+ PTT, taps | 3 |
| 18 | Slide (Q) | `[M] preScript → [M] question → [PTT] → multi-turn + [TAP]` | 1+ PTT, taps | 2 |
| 19 | Slide (narr) | `[S] minion → [M] reply → [M] preScript → [M] narration → [AUTO]` | **0** | 4 |
| 20 | Checkpoint | `[M] preScript → [M] question → [PTT] → multi-turn` | 1+ PTT | 2 |

**Zero-input nodes:** 1, 6, 9, 13, 14, 19 (29% of journey)

---

### The 5 Passive Dead Zones

Individual nodes might look fine, but the student experiences them back-to-back. Cross-node chaining creates massive stretches of AI-only dialogue.

#### DZ1: Node 1 → Node 2 (5 consecutive AI speeches, ~45-60s)

```
Node 1: [S] "Wait wait wait... fractions?" → [M] "Not quite, Spark..." → [M] preScript → [M] slideNarration
→ auto-advance →
Node 2: [M] preScript
```

Student just finished exciting onboarding (2 PTT moments), then sits through 5 monologues before the first video.

#### DZ2: Node 6 → Node 7 (5 consecutive AI speeches, ~40-50s)

```
Node 6: [M] "Hey Spark, do you know..." → [S] "I tried to eat 5/4..."
→ auto-advance →
Node 7: [S] "Why did the fraction go to the doctor?" → [M] "Ha! That's terrible..." → [M] preScript
```

Two comedy bits stacked directly. Student watches two characters perform a skit they can't participate in.

#### DZ3: Node 9 → Node 10 (5 consecutive AI speeches, ~45-55s)

```
Node 9: [S] "I know this one! The numerator is the... um..." → [M] "Almost, buddy!" → [M] preScript → [M] slideNarration
→ auto-advance →
Node 10: [M] preScript
```

#### DZ4: Node 13 → 14 → 15 (THE WORST — 8 consecutive AI speeches, ~90-120s)

```
Node 13: [M] preScript → [M] slideNarration
→ auto-advance →
Node 14: [S] "Max... I keep forgetting..." → [M] "D for Down, D for Denominator!" → [M] preScript → [M] slideNarration
→ auto-advance →
Node 15: [M] preScript → [M] question
```

**8 consecutive AI speeches** during the most abstract content (formal vocabulary). This is exactly where a 9-year-old ESL student will check out.

#### DZ5: Node 19 → Node 20 (6 consecutive AI speeches, ~50-60s)

```
Node 19: [S] "WE DID IT!" → [M] "Almost there, Spark!" → [M] preScript → [M] slideNarration
→ auto-advance →
Node 20: [M] preScript → [M] question
```

Celebration energy from "WE DID IT!" dissipates into passive listening before the final checkpoint.

---

### Redundant/Low-Value Moments

| Location | What's said | Why it's redundant |
|----------|-------------|-------------------|
| Node 9 slideNarration | "See how these objects are cut into equal parts?..." | Repeats preScript. Node 10's preScript says it a third time. |
| Node 14 preScript | "Can you spot them?" | Rhetorical — doesn't wait for an answer. Missed opportunity. |
| Node 19 slideNarration | "You're a fraction expert now!" | Student already proved this at Node 18. Telling them what they showed is filler. |

---

### The Fix: LLM-Powered Micro-Conversations (1 Turn, Capped)

#### Design Philosophy

Break every passive dead zone by giving the student a single conversational moment that feels personal and warm. NOT scripted robot responses — real LLM-generated acknowledgments that reference what the student actually said.

**The pattern (same for all 4 types):**

```
Max asks something specific (scripted prompt)
  → Student speaks (1 PTT)
    → LLM generates 1 personalized acknowledgment (1 call, capped)
      → Flow continues. No follow-up question. No loop.
```

**1 turn. 1 LLM call. No follow-up question from the LLM.** The LLM prompt explicitly says "acknowledge what the student said and transition — do NOT ask another question." Same proven pattern as Beat 4 of onboarding. The student can't derail because there's no loop.

**Fallback for silence/gibberish:** Every micro-moment has a scripted fallback if STT returns empty or nonsensical input. The flow never blocks.

---

#### Type 1: Curiosity Prompts (before content — activate prediction circuits)

**What it is:** Before a video or new concept, Max asks the student to *predict* or *wonder* — not answer correctly, just think out loud.

**Why it works (learning science):** When a student makes a prediction before seeing the answer, their brain stays alert to check if they were right. This is the "prediction effect" — one of the most validated techniques in instructional design. A 9-year-old who guessed "maybe 4 slices?" watches the video thinking "was I right?"

**Why it works (kid psychology):** Kids are natural guessers. "Take a guess!" feels like a game, not a test. There's no wrong answer — any prediction works. The LLM makes them feel smart regardless.

**Example — Node 2 (before video):**

> Max: "This video shows a pizza getting sliced up. Before we watch — if 4 friends want to share equally, how many slices do you think they need?"
>
> Student: "Um... four?"
>
> LLM: "Four slices — one each! Smart thinking. Let's see if the video agrees!"
>
> → Video plays. Student watches actively because they have a stake.

**Example — Node 10 (before video):**

> Max: "So far the top number has always been one. What do you think happens when it's two instead? Take a guess!"
>
> Student: "Maybe... you get two pieces?"
>
> LLM: "Two pieces — interesting guess! Let's see if you're right."

**LLM prompt constraints:** Echo student's words/idea. Connect to what's coming. 1-2 sentences max. MUST NOT ask another question. Fallback: "No worries! Let's watch and find out together!"

---

#### Type 2: Reaction Prompts (after funny/surprising moments — make them part of the comedy)

**What it is:** After a Spark joke or misconception, instead of auto-advancing, Max turns to the student and invites their reaction. Like a teacher who goes "can you believe that?"

**Why it works (kid psychology):** Comedy is a *shared* experience. When someone turns to you and says "wasn't that hilarious?", you feel part of it. Right now the student watches Max and Spark perform a skit, and then it's over. They're in the audience, not on stage. Inviting a reaction makes them a participant — and the LLM can riff on whatever they say.

**Why it works (learning science):** Sneaks in recall practice disguised as banter. The student doesn't feel tested — they feel included.

**Example — Node 6 (goofy moment):**

> Max: "Hey Spark, do you know what a fraction is?"
> Spark: "I tried to eat 5/4 of a cake once... it didn't end well! My tummy hurt for DAYS!"
> Max (to student): "Haha! Spark tried to eat MORE than a whole cake! What do you think happened to Spark's tummy?"
>
> Student: "It exploded!" / "He got sick" / "He's silly"
>
> LLM: "Ha! Exploded! That's what happens when you eat more than a whole cake! Poor Spark."

**Note:** This is NOT a factual quiz ("Was Spark right or wrong?"). That kills the comedy. It's an imaginative/empathetic reaction prompt — any answer works. The LLM's job is to laugh *with* them.

**Example — Node 9 (minion moment):**

> Spark: "Oooh! I know this one! The numerator is the... um... hmm... I forgot!"
> Max: "Almost, buddy!"
> Max (to student): "Oh no, Spark forgot! Hey [Name], do you remember? What's the top number called?"
>
> Student: "Numerator!" / "Um... numer... ator?"
>
> LLM: "Numerator! You remembered and Spark didn't — he's going to be so jealous!"
>
> If student doesn't remember: "That's okay! It's 'numerator' — even Spark forgets! We'll practice more."

**Why "you vs. Spark" works:** The student is *helping* the silly robot. That's inherently motivating — they feel competent and needed. It's not a test where Max judges them.

---

#### Type 3: Recall Check-ins (quick "I bet you know this!" dares)

**What it is:** A quick, low-stakes moment where Max asks the student to recall something they recently learned — framed as a dare or challenge, not a test.

**Why it works (kid psychology):** Kids LOVE showing off what they know. A 9-year-old who learned "numerator" 3 minutes ago wants to prove they remember. "I bet you know this!" is a dare wrapped in a compliment — it says "I believe you're smart enough to remember."

**Why it works (learning science):** Active recall (retrieving a word from memory) strengthens the memory trace far more than passive re-hearing. Even a failed recall attempt primes the brain to encode the word more deeply when they hear it again. This is the "testing effect" — one of the strongest findings in cognitive science.

**Example — Node 13 (after slideNarration defines numerator/denominator):**

> Max: "Those are some big math words! I bet you can remember one of them. What's the top number called?"
>
> Student: "Numerator!" / "Um... I forgot"
>
> LLM: "Numerator! See, you already know real math vocabulary!" / (if forgot): "It's numerator! Big word, right? Don't worry — you'll remember it by the end, I promise."

**Example — Node 14 (after "D for Down" mnemonic):**

> Max: "Your turn! Spark just learned a trick — D for Down, D for... what was it?"
>
> Student: "Denominator!" / "I don't know"
>
> LLM: "Denominator! D for Down — you're faster than Spark!" / (if doesn't know): "Denominator! D for Down, D for Denominator. Spark's trick works!"

---

#### Type 4: Personal Connection Prompts (link math to their world)

**What it is:** Max briefly connects the math concept to the student's personal experience. The student shares something from their life, and the LLM weaves it back into the math.

**Why it works (kid psychology):** Abstract math becomes real when it connects to YOUR life. A child who says "I share my lunch with my best friend" now has a *personal reason* to care about equal parts. For ESL students especially, connecting to personal context bridges the language gap.

**Why it works (learning science):** Self-referential encoding — information connected to personal experience is encoded more deeply in long-term memory. When the student later thinks about fractions, they'll recall the moment Max connected it to *their* life.

**Example — Node 1 (after slideNarration about sharing cake):**

> Max: "Fractions are all about sharing! When do YOU share things with your friends?"
>
> Student: "I share my lunch" / "We share toys" / "I don't know"
>
> LLM: "Sharing lunch — that's fractions in real life! Every time you split food equally, you're using fractions. Let's learn how!"

**Example — Node 19 (final summary slide):**

> Max: "You've learned so many fractions today! If you could share a pizza with your friends right now, how many slices would you want?"
>
> Student: "I want 3!" / "All of them!" / "Half"
>
> LLM: "Three slices! If the pizza has 6 slices, that's three-sixths — see, you're already using fractions in real life! One last challenge and you're a Fraction Master!"

---

### How Each Dead Zone Gets Fixed

| Dead Zone | Nodes | AI Speeches | Micro-Moment | New Flow |
|-----------|-------|-------------|-------------|----------|
| **DZ1** | 1 → 2 | 5 | **Type 4** (personal) at end of Node 1: "When do YOU share things?" | 3 → student → LLM → 1 |
| **DZ2** | 6 → 7 | 5 | **Type 2** (reaction) at end of Node 6: "What happened to Spark's tummy?" | 2 → student → LLM → 3 |
| **DZ3** | 9 → 10 | 5 | **Type 2** (recall reaction) at Node 9: "Spark forgot! Do YOU remember?" | 2 → student → LLM → 2 |
| **DZ4** | 13→14→15 | **8** | **Type 3** (recall) end of Node 13 + **Type 3** (recall) end of Node 14 | 2 → student → LLM → 2 → student → LLM → 2 |
| **DZ5** | 19 → 20 | 6 | **Type 4** (personal) at end of Node 19: "How many slices would YOU want?" | 3 → student → LLM → 2 |

**Result:** Every dead zone broken. Every zero-input node gets 1 PTT moment. Longest passive stretch drops from 8 speeches (~2 min) to 3 speeches (~20s).

---

### LLM Prompt Template (shared across all 4 types)

```
You are Max, a warm young scientist talking to {studentName} (Grade 4, ESL).

YOUR ONE JOB: Acknowledge what the student said, then transition.

CONTEXT: {what just happened}
STUDENT SAID: "{transcript}"
TRANSITION TO: {what's next}

RULES:
- 1-2 short sentences max, under 25 words total
- MUST reference what the student said (echo a key word or idea)
- MUST transition to what's next (e.g., "Let's keep going!" / "Let's find out!")
- MUST NOT ask another question
- VERY simple English (ESL kids)
- If student said something silly/random: laugh briefly, then transition
- If student was silent or unclear: "No worries! {fallback transition}"
```

**Cost:** 1 Haiku call per micro-moment (~0.1-0.2s, negligible). Same model already used for all evaluation calls.

---

## Consolidated Action Plan

### Tier 1 — Content Fixes (`challenges.ts` + `prompts.ts`, no code changes)

| # | Action | Ref | Effort |
|---|--------|-----|--------|
| 1 | Rewrite all preScripts: recall → tease → frame | C1 | ~2 hrs |
| 2 | Rewrite hint-level scaffolding where hint = answer | C3 | ~1 hr |
| 3 | Add "echo student's key word" to evaluation prompt | C2 | ~15 min |
| 4 | Fix Node 17 hint → use "D for Down" mnemonic | P1 | ~5 min |
| 5 | Tighten Node 10 correctness filter | M1 | ~5 min |
| 6 | Tighten Node 15 correctness filter | M2 | ~5 min |
| 7 | Fix Node 17 preScript — celebration tone | M6 | ~5 min |
| 8 | Fix maxTurns: 4 → 5 on nodes 8, 15, 20 | C4 | ~5 min |

**Total Tier 1: ~3.5 hours**

### Tier 2 — Micro-Conversations (break all dead zones) ✅ COMPLETE (Feb 17, 2026)

| # | Action | Dead Zone | Type | Node | Status |
|---|--------|-----------|------|------|--------|
| 9 | ✅ Recall check-in: "What's the top number called?" | DZ4 | 3 - Recall | 13 | Done |
| 10 | ✅ Personal connection: "Split into 4 pieces?" | DZ4 | 4 - Personal | 14 | Done |
| 11 | ✅ Reaction: "What happened to Spark's tummy?" | DZ2 | 2 - Reaction | 6 | Done |
| 12 | ✅ Curiosity: "What do you think a fraction is?" | DZ1 | 1 - Curiosity | 1 | Done |
| 13 | ✅ Recall: "What are equal parts called?" | DZ3 | 3 - Recall | 9 | Done |
| 14 | ✅ Curiosity: "Which is bigger, 1/2 or 1/4?" | DZ5 | 1 - Curiosity | 19 | Done |
| 15 | ✅ Personal: "Where have YOU seen splitting in half?" | — | 4 - Personal | 2 | Done |
| 16 | ✅ Curiosity: "What's the top number called?" | — | 1 - Curiosity | 10 | Done |

**Implementation:** `MicroConversationConfig` type + `getMicroConversationPrompt()` + `generateMicroConversationResponse()` + `runMicroConversation()` helper with 4 injection points in voice hook. All 5 dead zones broken. 8 Haiku calls per session added.

### Tier 3 — Bug Fixes & UI

| # | Action | Ref | File | Effort |
|---|--------|-----|------|--------|
| 17 | Detect empty transcripts → re-prompt, don't consume turn | C5 | `useVoiceInteraction.ts` | ~30 min |
| 18 | Add node separator in chat between conversations | M5 | `ChatHistory.tsx` | ~30 min |
| 19 | Progress indicator (node X of 21 or journey map) | M4 | New component | ~2 hrs |

**Total Tier 3: ~3 hours**

### Tier 4 — Polish

| # | Action | Ref | File | Effort |
|---|--------|-----|------|--------|
| 20 | Reframe "tap the wrong one" → "tap the mistake" | P3 | `dynamicSlideContent.ts` | ~15 min |
| 21 | Fix FractionBuilder "tap ALL" → "count the rest" | P4 | `useVoiceInteraction.ts` | ~15 min |
| 22 | Route voice-first check through LLM for synonyms | P5 | `useVoiceInteraction.ts` | ~2 hrs |

**Total Tier 4: ~2.5 hours**

---

## How to Use This Document

Tag this file in any new Claude Code session:

```
@.context/kg-plans/learning-experience-audit.md
```

Then say: "Execute Tier 2" (or whichever tier). Claude will have full context of what was audited, what was found, and exactly what needs to change — including which files, fields, and LLM prompt templates to use.

---

## Cross-Reference

| Related file | Read when... |
|-------------|-------------|
| `.context/conversation-design.md` | You're touching voice/LLM logic or challenge flow |
| `.context/client-feedback/iteration-5.md` | You need the raw client feedback that drove these findings |
| `src/config/challenges.ts` | You're making Tier 1 content changes |
| `src/config/prompts.ts` | You're updating the evaluation prompt or adding micro-conversation prompts |
| `src/hooks/useVoiceInteraction.ts` | You're wiring micro-conversations or fixing bugs |

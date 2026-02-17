# Learning Experience Design Audit — Math Mate Fractions Module

**Date:** 2026-02-17
**Auditor:** Claude (instructional designer + content curator + Grade 4 teacher lens)
**Requested by:** KG (Krishna Goutham)

---

## Objective

Evaluate the complete Math Mate learning experience — from first conversation to end — through the lens of a Grade 4 Asian student (ESL, 9-10 years old). Identify every point where the student might feel disconnected, unheard, or disengaged. Deliver crystal-clear, prioritized action items focused on learning design and meaningful conversations, not architecture or tech.

---

## Review Method

6 parallel research agents audited the entire codebase simultaneously:

1. **Challenge Nodes** — All 21 node definitions in `challenges.ts`: preScripts, postQuestions, correctnessFilters, scaffolding objects, minionMoments, maxTurns
2. **LLM Prompts & Voice Flow** — All 6 prompt structures in `prompts.ts` + the full 1,605-line `useVoiceInteraction.ts` (all 8 interaction flows, PTT mechanics, turn management)
3. **Context Docs & Learning Journey** — `.context/` files: PRD, conversation design, learning journey, progress, bugs, feature wishlist, all 5 iterations of client feedback
4. **Dynamic Slides & Content** — All 3 dynamic slide templates (FractionBuilder, MultipleChoice, TapToSelect), FractionCompareSlide, `dynamicSlideContent.ts`, `checkpointContent.ts`
5. **Conversation JSONs & Client Feedback** — All 14 conversation JSONs, 14 asset context files, journey metadata, and all 5 iteration feedback documents
6. **UI Components & App Flow** — App.tsx layout, ChatHistory, ChatMessage, NavBar, TutorCharacter, MinionCharacter, YouTubePlayer, AppletContainer

Each agent produced an exhaustive report. Findings were synthesized and cross-referenced against 5 iterations of client feedback to validate that recommendations address persistent, confirmed issues.

---

## What's Working Well

These are genuine strengths — not filler praise:

1. **Concept-before-vocabulary pedagogy** — Students use fractions for 6+ nodes before "numerator" is named (Node 7). The word attaches to an existing mental model, not a new abstract concept. This is the standout structural decision.

2. **Spark's misconception modeling** — When Spark says "three-FORTHS" (Node 11), forgets "numerator" (Node 9), or cuts paper into unequal pieces (Node 3), it inoculates students against the exact errors they'd make. The correction happens in a low-stakes, funny context before the student faces the concept.

3. **"D for Down, D for Denominator" mnemonic** (Node 14) — Concrete, alliterative, voiceable. One of the strongest pedagogical moments in the entire module.

4. **Math Trap error detection** (Node 18) — The only Evaluate-level task (Bloom's taxonomy). Asking kids to find mistakes instead of produce answers is genuine higher-order thinking. Correctly placed near the end as a capstone.

5. **Voice-first check on dynamic slides** — Asking verbally before showing taps mirrors how a good tutor works: give the student a chance to know it, then scaffold if they don't.

6. **5-step scaffolding structure** — probe → different angle → hint → scaffold → reveal prevents both cold reveals and endless loops. The structure is pedagogically sound.

7. **Minion moment distribution** — 8 moments placed at peak cognitive load points (transitions, vocabulary nodes, harder concepts). The 5/4 improper fraction joke (Node 6) plants a seed for future learning.

8. **Content complexity progression** — Three dimensions advance semi-independently (numerator complexity, denominator range, task type), preventing cognitive overload from multi-dimensional jumps.

---

## Findings

### Critical (Will Break the Learning Feel)

#### C1. PreScripts are traffic controllers, not teachers

**The single most persistent issue across all 5 iterations of client feedback.** Iteration 1: "The AI is a traffic controller, not a tutor." Iteration 5: "Pre-content scripts give away the concept instead of building curiosity."

Current pattern: "Now watch this video!" / "Here's your next challenge!"

What's missing — every preScript should:
- **Recall** what the kid just did ("Remember how you cut that pizza?")
- **Tease** what's coming ("But what if you took MORE than one piece?")
- **Frame** what to pay attention to ("Watch how the top number changes")

Worst offenders:

| Node | Current | Problem |
|------|---------|---------|
| 10 (Video 2) | "So far, all our fractions had a one on top..." | Nearly identical to Node 9's preScript. Kid just heard this. |
| 12 (Checkpoint LO3) | "You can build fractions with bigger numbers now! Quick check — let's see!" | Shortest, least celebratory checkpoint. Misses acknowledging the conceptual leap. |
| 16 (Slide 5) | "You've been doing brilliantly! Here's a picture of a pizza..." | Generic praise, no recall of numerator/denominator from LO4. |
| 17 (Video 3) | "You're almost at the finish line! Before we wrap up..." | This is the CELEBRATION video. "Before we wrap up" minimizes it. |

**Where:** `challenges.ts` — all preScript fields
**Effort:** ~2 hours of content rewriting

#### C2. AI doesn't acknowledge what the child actually said

From Iteration 2 live transcript, client observed: "You've already made a tree... and just traversing that tree without acknowledging what I'm saying."

The evaluation prompt tells the LLM to "warmly acknowledge" but does NOT instruct it to reference the student's specific words. A child who says "is it... maybe... one fourth?" gets "Nice one!" instead of "Yes, one-fourth — you got it!"

**Where:** `prompts.ts` — `getEvaluationPrompt`, add one instruction line
**Effort:** ~15 minutes

#### C3. Hints give away the answer at Turn 2 of 5

The scaffolding ladder collapses at the `hint` level. In many nodes, the hint IS the answer:

| Node | Hint (Turn 2) | Problem |
|------|--------------|---------|
| 11 (Applet A4) | "It's 3 over 5. How do we write that as a fraction?" | Gives the answer, asks student to repeat it |
| 12 (Checkpoint LO3) | "It's 2 over 5. How do we say that as a fraction?" | Same — answer given |
| 16 (Slide 5) | "It's 2 over 6. How do we write that as a fraction?" | Same |
| 20 (Checkpoint LO5) | "It's 2 over 6. How do we say that?" | Same |

Turns 3-4 then become redundant re-asks of what was already revealed. The escalation should be: easy → medium → directional clue → strong scaffold → reveal. Not: easy → easy → answer → repeat answer → repeat answer.

**Where:** `challenges.ts` — scaffolding.hint fields on affected nodes
**Effort:** ~1 hour

#### C4. Unreachable reveal messages on nodes 8, 15, and 20

Bug: These nodes define 5 scaffold levels (probe1, probe2, hint, scaffold, reveal) but set `maxTurns: 4`. The exit condition `turnCount >= maxTurns - 1 = 3` fires after turn 3 (scaffold). The `reveal` at turn 4 is never reached.

Impact: A struggling student on the FINAL checkpoint (Node 20) hears "Two pieces out of six — put that together as a fraction!" instead of "It's 2/6 — two-sixths! You're a fraction master!" The celebration payoff is dead code.

**Where:** `challenges.ts` — change `maxTurns: 4` → `5` on nodes 8, 15, 20
**Effort:** ~5 minutes

#### C5. Empty transcripts consume scaffold turns

When STT fails (network error, tap-not-hold, silence), `listenAndTranscribe()` returns `''`. This empty string goes to the LLM as if the student said nothing. The LLM treats it as a wrong answer and escalates scaffolding. A student with a mic issue burns through all turns and gets the reveal without ever being heard.

`FALLBACK_RESPONSES.silent` exists but is never wired into the multi-turn flows.

**Where:** `useVoiceInteraction.ts` — multi-turn loop, add empty transcript detection
**Effort:** ~30 minutes

---

### Medium (Will Make the Experience Feel Generic)

#### M1. Node 10 correctness filter too broad

`correctnessFilter: "two|2|two pieces|2 pieces|2 parts|two parts"` — bare `"two"` and `"2"` match unrelated utterances like "between" or "twenty."

**Where:** `challenges.ts` node 10 correctnessFilter
**Fix:** Require "pieces/parts" with the number, e.g. `"two pieces|2 pieces|two parts|2 parts|it tells us two|it means two|it's two"`

#### M2. Node 15 correctness filter matches question echoing

`correctnessFilter: "three|3|three pieces|3 pieces|how many|parts we have"` — `"how many"` matches if the student echoes the question; bare `"three"` is too broad.

**Where:** `challenges.ts` node 15 correctnessFilter
**Fix:** Remove `"how many"` and bare `"three|3"`, keep `"three pieces|3 pieces|parts we have"`

#### M3. Two consecutive passive slides (Nodes 13-14)

Both are narration-only with zero student interaction. Creates a ~2-minute passive stretch during the most abstract section (formal vocabulary). The minionMoment at Node 14 helps, but attention is most likely to drop here.

**Fix options:** (a) Add a goofy moment between them (see P2), (b) Make Node 14 a question slide with a quick identification task, (c) Add a brief PTT moment ("Can you say 'denominator' for me?")

#### M4. No progress indicator

A 9-year-old has no idea they're on node 5 of 21 or how much is left. No journey map, no "3 more to go!" Learning fatigue hits without visible milestones.

**Where:** New UI component (align with UI revamp)

#### M5. Chat log grows without landmarks

By node 15, the chat has 60+ messages with no visual separator between node conversations. The student loses track of the current question.

**Where:** `ChatHistory.tsx` — add node separator between conversations

#### M6. Node 17 celebration bait-and-switch

PreScript frames it as "a little surprise" and video is "You Did It!" — but immediately after the 30-second celebration, the student gets a vocabulary recall question. The celebration framing sets an expectation that is broken.

**Where:** `challenges.ts` node 17 preScript — rewrite to frame the video as earned celebration AND set up that one final review question is coming

#### M7. Denominator is under-tested

Numerator gets a question at Node 7 AND Checkpoint LO4. Denominator is only tested once (Node 17) and never at a checkpoint. LO4 claims to cover both but only tests numerator.

**Fix options:** (a) Add a denominator question to LO4 checkpoint, (b) Ensure Node 17's question carries more weight in the flow

---

### Polish (Nice-to-Have for Demo)

#### P1. Node 17 hint misses the mnemonic

Hint says: "The bottom one sounds a bit similar to numerator." But the kid learned "D for Down, D for Denominator" at Node 14. The hint should use that mnemonic.

**Where:** `challenges.ts` node 17 scaffolding.hint

#### P2. Missing third goofy moment after Node 12

`conversation-design.md` explicitly notes this was "considered but not implemented." After Checkpoint LO3, the journey enters its most abstract section (vocabulary). A comedy break here would reduce the passive stretch.

**Where:** `challenges.ts` — insert new goofy node after node 12

#### P3. Node 18 "find the mistake" instruction can confuse

"Tap the wrong one!" — kids associate "wrong" with "the wrong answer." Tapping something labeled "wrong" to get it RIGHT is cognitively unusual. Better: "Tap the one with the mistake."

**Where:** `dynamicSlideContent.ts` node-17-math-detective questionText

#### P4. FractionBuilder "tap ALL pieces" instruction misleading

In denominator phase, already-tapped pieces are inert. "Tap ALL pieces" confuses when 3 of 5 don't respond. Better: "Now count the rest!"

**Where:** `useVoiceInteraction.ts` dynamic question interaction, denominator phase instruction

#### P5. Dynamic slide voice-first check uses regex only

The voice-first answer check uses client-side regex, not LLM. Synonyms like "one quarter" for "one fourth" may not be in the filter. Consider routing through LLM for more flexible matching.

**Where:** `useVoiceInteraction.ts` runDynamicQuestionInteraction voice-first section

---

## Prioritized Action Plan

### Tier 1 — Content Changes Only (highest ROI, `challenges.ts` + `prompts.ts`)

| # | Action | Ref | File | Effort |
|---|--------|-----|------|--------|
| 1 | Rewrite all 12 preScripts: recall → tease → frame | C1 | `challenges.ts` | ~2 hrs |
| 2 | Rewrite hint-level scaffolding where hint = answer | C3 | `challenges.ts` | ~1 hr |
| 3 | Add "echo student's key word" to evaluation prompt | C2 | `prompts.ts` | ~15 min |
| 4 | Fix Node 17 hint → use "D for Down" mnemonic | P1 | `challenges.ts` | ~5 min |
| 5 | Tighten Node 10 correctness filter | M1 | `challenges.ts` | ~5 min |
| 6 | Tighten Node 15 correctness filter | M2 | `challenges.ts` | ~5 min |
| 7 | Fix Node 17 preScript — celebration tone | M6 | `challenges.ts` | ~5 min |

**Total Tier 1: ~3.5 hours, zero code changes outside config**

### Tier 2 — Small Code Changes (fix bugs + quick wins)

| # | Action | Ref | File | Effort |
|---|--------|-----|------|--------|
| 8 | Fix unreachable reveal: nodes 8, 15, 20 → maxTurns 5 | C4 | `challenges.ts` | ~5 min |
| 9 | Detect empty transcripts → re-prompt, don't consume turn | C5 | `useVoiceInteraction.ts` | ~30 min |
| 10 | Add node separator in chat between conversations | M5 | `ChatHistory.tsx` | ~30 min |
| 11 | Node-specific wrap-ups after dynamic question confetti | C1 | `useVoiceInteraction.ts` | ~30 min |

**Total Tier 2: ~1.5 hours**

### Tier 3 — Larger Changes (align with UI revamp)

| # | Action | Ref | File | Effort |
|---|--------|-----|------|--------|
| 12 | Progress indicator (node X of 21 or journey map) | M4 | New component | ~2 hrs |
| 13 | Goofy moment after Node 12 (before vocabulary section) | P2 | `challenges.ts` | ~1 hr |
| 14 | Make Node 14 interactive (quick identification question) | M3 | `challenges.ts` + config | ~2 hrs |
| 15 | Route voice-first check through LLM for synonym handling | P5 | `useVoiceInteraction.ts` | ~2 hrs |
| 16 | Reframe Node 18 "tap the wrong one" → "tap the mistake" | P3 | `dynamicSlideContent.ts` | ~15 min |
| 17 | Fix FractionBuilder "tap ALL" → "count the rest" | P4 | `useVoiceInteraction.ts` | ~15 min |

**Total Tier 3: ~7.5 hours**

---

## How to Use This Document

Tag this file in any new Claude Code session:

```
@.context/kg-plans/learning-experience-audit.md
```

Then say: "Execute Tier 1" (or whichever tier). Claude will have full context of what was audited, what was found, and exactly what needs to change — including which files and fields to edit.

---

## Cross-Reference

| Related file | Read when... |
|-------------|-------------|
| `.context/conversation-design.md` | You're touching voice/LLM logic or challenge flow |
| `.context/client-feedback/iteration-5.md` | You need the raw client feedback that drove these findings |
| `src/config/challenges.ts` | You're making Tier 1 content changes |
| `src/config/prompts.ts` | You're updating the evaluation prompt (item #3) |
| `src/hooks/useVoiceInteraction.ts` | You're making Tier 2-3 code changes |

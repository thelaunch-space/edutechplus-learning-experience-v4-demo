# Iteration 5 — Requirements Document

**Status:** APPROVED — Ready for implementation
**Date:** 2026-02-10

---

## Overview

Iteration 5 introduces a visual and personality overhaul to Math Mate. The experience shifts from a functional voice tutor to a character-driven classroom with a Master Tutor (with expressive states), a Minion sidekick, a redesigned UI using team-provided assets, and an onboarding flow that warms students up before the lesson begins.

**Two categories of change:**
1. **UI Overhaul** — New visual assets for the content screen, sidebar, tutor expressions, minion, and navigation
2. **Flow Changes** — Onboarding (Node 0), tutor personality, and strategically placed "fun moments" throughout the journey

---

## Part 1: UI Changes

### 1.1 Overall Layout & Layering

**Reference:** `assets-from-team/Frame.jpg` shows the target layout and relative positioning of all elements.

**Layer stack (bottom to top):**
1. `BG.jpg` — Full-screen background (blue gradient with hexagonal/circuit-board patterns). Covers the entire viewport.
2. `MediaBox.png` — Positioned on the **right side** (~70% width). Has a glowing sci-fi/tech border with a **white interior** where all content renders (videos, applets, slides, dynamic slides). Includes decorative bottom bar with nav button area.
3. **Sidebar area** — The **remaining left space** (~30% width). No separate asset — the BG shows through naturally. Chat messages and tutor character are overlaid here.
4. **Master Tutor + Minion** — Positioned at **bottom-left**, overlapping the sidebar/MediaBox boundary (as shown in Frame.jpg). Tutor is larger, minion (robot) is smaller and to his left.
5. **Nav buttons** — Bottom area below the MediaBox. Placeholder buttons for now (team will provide separate button assets).

**Design language:** Sci-fi/tech classroom aesthetic (blue gradients, glowing cyan borders, hexagonal patterns). This **replaces** the previous Candy-Land pastel theme.

### 1.2 Content Screen (MediaBox — Right Pane)

**What:** The main area where videos, applets, slides, and dynamic slides are displayed.

**Asset:** `assets-from-team/MediaBox.png` — used as a frame/border around the content area. The white interior is where content renders.

**Notes:**
- Must still support all existing content types: YouTube embeds, applet iframes, static slides, dynamic slides (FractionCompareSlide)
- MediaBox is the decorative frame — content renders inside the white area
- The bottom bar of MediaBox has built-in nav button placeholders (we'll overlay real interactive buttons on top)

### 1.3 Sidebar (Left Pane / Chat Area)

**What:** The chat area where AI messages and student transcriptions appear.

**Implementation:** No separate sidebar asset. The BG.jpg shows through as the sidebar background. Chat messages are overlaid on top.

**Chat bubble styling:** Restyle to fit the new blue sci-fi theme (implementation decision — move away from green/white WhatsApp look to something that works with the blue background).

**Notes:**
- Chat functionality (message list, typing indicators, auto-scroll) stays the same
- Chat messages scroll in the upper portion of the sidebar; tutor character sits at the bottom

### 1.4 Master Tutor "Max" — Expressions System

**What:** Max is a young boy character — brown messy hair, big round glasses, white lab coat with an atom/science logo. Friendly young scientist look.

**Current state:** No visible character — just a text name "Math Mate" in chat bubbles.

**Change:** Display the Master Tutor character at **bottom-left of the sidebar** with contextual expressions that change based on conversation state.

**7 expression states available (static PNGs, transparent background):**

| File | Expression | When to use |
|------|-----------|-------------|
| `Character/Neutral.png` | Hands in pockets, calm smile | Default/idle, narrating content, pre-challenge intros |
| `Character/Greeting.png` | Waving, open smile | Onboarding welcome, start of session, meeting student |
| `Character/Celebration.png` | Both fists raised, excited | Student answers correctly, checkpoint complete, confetti moments |
| `Character/Encouragment.png` | Thumbs up with sparkle | Positive reinforcement ("good try!", "almost!"), partial correct |
| `Character/Giggling.png` | Hand over mouth laughing | Goofy moments, jokes, fun breaks, minion references |
| `Character/Listening.png` | Hand cupped to ear | While student is speaking (PTT held down) |
| `Character/Nudging.png` | Pointing forward, leaning in | Prompting student to respond, giving hints, scaffolding |

**Expression mapping approach (phase-based — simplest):**
- Map expressions to **conversation phases** already defined in code, not LLM-driven:
  - `greeting` phase → `Greeting`
  - `pre_challenge` phase (narration) → `Neutral`
  - `in_challenge` (student watching/interacting) → `Neutral`
  - `post_challenge` (asking question, waiting) → `Nudging`
  - Student speaking (PTT active) → `Listening`
  - Student correct (`isCorrect: true`) → `Celebration`
  - Student incorrect, scaffolding → `Encouragment`
  - Goofy moment nodes → `Giggling`
  - Checkpoint summary → `Celebration`

**Notes:**
- Start with static image swaps; designed to be replaced with sprite animations later
- Full-body character, positioned to overlap sidebar bottom edge

### 1.5 Minion "Spark"

**What:** A small cute robot — dark blue/grey metallic body, orange accents (headphones, antenna, joints), glowing cyan eyes with a smile, cyan chest light.

**Asset:** `assets-from-team/bot.png` — single expression only (for now).

**Personality:** Goofy, curious, easily confused by fractions. Provides comic relief. Think of Spark as the kid in class who means well but gets things hilariously wrong.

**Role:**
- NOT a teaching character — does not ask pedagogical questions
- Provides fun moments, light humor, and energy boosts
- Appears at specific scripted moments (not always visible)
- **1-2 interventions only** across the entire journey

**Display:** Positioned to the left of the Master Tutor at bottom-left (as shown in Frame.jpg). Smaller than the tutor. Only visible during onboarding intro and goofy moments — hidden otherwise.

**Voice:** Dead simple — basic TTS for the 1-2 moments it speaks. Mostly visual.

### 1.6 Navigation Buttons

**What:** Next/Skip button + Hold-to-Talk button.

**Current assets:** Nav buttons are baked into MediaBox.png as visual reference. **Team will provide separate button assets.** Use CSS placeholder buttons until then.

**Reference from Frame.jpg:**
- **Center-bottom:** Pill-shaped button with forward arrow (Next/Skip) — we only use the forward arrow (no prev)
- **Bottom-right:** Circular play button — this is the **Hold-to-Talk** button

**Change:**
- **Next/Skip** button — same functionality as today's "Skip →", but with a **consistent fixed position** (bottom-center, below MediaBox) throughout the entire experience
- **Hold-to-Talk** button — same hold behavior as today, positioned bottom-right. This is a **laptop-first** experience.
- **No Prev button** — forward-only progression

### 1.7 Progress Bar — Remove

**What:** The sticky top bar showing node progress.

**Change:** Remove entirely. The new UI layout handles progress context without it.

---

## Part 2: Flow Changes

### 2.1 Onboarding Flow (Node 0) — HIGH PRIORITY

**What:** A new warm-up conversation before the learning journey begins. Technically Node 0 — precedes the current Node 1.

**Flow sequence:**
1. Max appears (Greeting expression) and introduces himself — "Hi! I'm Max, your math buddy!"
2. Max introduces Spark — "And this is my friend Spark! He's a little goofy but super fun." (Spark appears/animates)
3. Max explains learning objectives — "Today we're going to learn about fractions — how to cut things into equal parts, what numerators and denominators are..."
4. Max explains what kinds of activities they'll do — "We'll watch some videos, play with some cool apps, and I'll ask you some fun questions..."
5. **Only after the above**, open it up for student interaction
6. Student gets to answer 1-2 light questions (e.g., "Do you like pizza?" / "Have you ever shared a cake with friends?")
7. Max acknowledges responses warmly
8. Transition: "Alright, let's start our lesson!"

**Conversation rules:**
- **Max 5 turns total** (including tutor's opening and student responses)
- Turn-based PTT interaction (same as existing)
- **No correctness filter** — there are no right/wrong answers here
- Questions should be **lightweight** — student can answer casually/randomly
- **Do NOT make it steerable** — student shouldn't be able to derail into a completely different topic. Keep the conversation anchored to the introduction.
- LLM should acknowledge student responses but gently steer back if they go off-topic
- Think of it as a **1-minute warm-up exercise**

**Onboarding visual (content area):** MediaBox shows a simple **welcome screen** — centered text ("Welcome to Fractions!" or similar) inside the white area. Built with CSS + text, no extra assets needed. Normal content loading resumes from Node 1.

**Technical implementation approach:**
- New challenge entry at index 0 in the challenges array
- Type: could be a new `'onboarding'` type, or reuse existing conversation phase with special flags
- No video/applet/slide content — this is pure conversation
- Tutor expressions change during onboarding (excited when introducing, warm when asking questions)
- Minion character appears/animates when introduced

**LLM prompt for Node 0:**
- Persona: Warm, excited to meet the student
- Must introduce self and minion first (scripted/semi-scripted opening)
- Must cover learning objectives before opening to questions
- Must keep student responses to 1-2 turns
- Must gracefully close and transition to Node 1
- No evaluation, no correctness checks
- Goal: Make the student comfortable and excited

### 2.2 Master Tutor Personality — Throughout Journey

**What:** The Master Tutor should feel more alive throughout the entire journey, not just in onboarding.

**Changes:**
- Expression states change contextually during all nodes (see 1.3)
- Tutor's language should feel consistent with the personality established in onboarding
- Max references Spark occasionally during the journey ("Even Spark got confused by this one!")

**No change to:**
- Existing Socratic scaffolding logic
- Existing correctness evaluation
- Existing turn limits per challenge

### 2.3 Fun / Goofy Moments — Strategic Placement

**What:** Short, scripted fun breaks where the tutor (and possibly the minion) inject humor or levity into the experience.

**Rules:**
- **Voice-only, no student response** — tutor/minion speaks, student listens, auto-advance to next node
- Must NOT derail the lesson into a tangential topic
- Should feel like natural breathers between learning nodes
- The minion can be referenced/shown during these moments
- These are **not assessment nodes** — no correctness evaluation, no PTT

**Implementation approach:**
- Insert as new nodes (or mini-nodes) at strategic points in the 14-node journey
- Could be between heavy content nodes (e.g., after an applet + question, before the next video)
- Content: short joke, fun fact, or goofy observation related to fractions/math
- Example: After Node 5 (Cake Fractions), Spark could say something like "I tried to eat 5/4 of a cake once... it didn't end well!"

**Suggested placement (to be refined):**
- After Node 4 (Fraction Patterns applet) — student has done 2 applets, needs a breather
- After Node 8 (Advanced Practice) — before the summary/review section begins
- After Node 12 (Celebration video) — before the final diagnostic slides

**Content:** Pre-scripted jokes/fun facts (we write these upfront). Can be refined later by content team.

**Minion in goofy moments:** Minion does simple animations/expressions. May have basic TTS (simple voice line). Keep it dead simple — 1-2 minion interventions total across the entire journey.

### 2.4 Checkpoint / Acknowledgment Flow (Dynamic Slides) — HIGH PRIORITY

**What:** After a group of nodes that collectively cover a learning objective, insert a **checkpoint dynamic slide** that summarizes what was learned and confirms understanding.

**Context:** The 14 nodes teach concepts that map to 2-3 learning objectives. Instead of treating each node as isolated, we group them by learning objective and place a checkpoint at the end of each group.

**Proposed learning objective groupings:**

| Learning Objective | Nodes Covered | Checkpoint After |
|-------------------|---------------|-----------------|
| LO1: What fractions are (equal parts, basic notation) | Nodes 1-5 (Why Fractions → Cake Fractions) | After Node 5 |
| LO2: Bigger fractions (numerators > 1, reading fractions) | Nodes 6-10 (Preview → Numerator/Denominator) | After Node 10 |
| LO3: Applying fraction knowledge (identify, compare, spot errors) | Nodes 11-14 (Discover More → Snapshot) | After Node 14 (or before Node 14 as final checkpoint) |

**Checkpoint flow:**
1. Dynamic slide appears — visually summarizes the concepts covered in that group
2. Tutor acknowledges what was learned: "You just learned about X, Y, and Z!"
3. Tutor asks 1-2 clarifying/review questions to confirm understanding
4. Conversation steers toward a summarization moment — student articulates what they learned
5. Tutor wraps up: "Great job! Now let's move on to..."

**Rules:**
- These are **dynamic slides** (programmatic, not static images) — similar to FractionCompareSlide
- Dynamic slide fills the **content area** with a standard "question pane" layout
- Uses a **combo of voice + interactions** — student taps/clicks elements depending on right/wrong answers (same pattern as FractionCompareSlide)
- Conversation is LLM-driven (not fully scripted) — needs to feel natural
- Questions should be review/recall, not new teaching
- Keep it short — aim for 3-4 turns max
- Tone: celebratory + reflective ("look how much you've learned!")

**Implementation approach:**
- New checkpoint challenge nodes inserted after each learning objective group
- Type: `'checkpoint'` or reuse `'slide'` with `isCheckpoint: true` flag
- Each checkpoint has a custom dynamic slide component summarizing that LO's concepts
- LLM prompt tailored per checkpoint (knows which concepts to review)

---

## Part 3: What Does NOT Change

Confirming scope boundaries:

- **No multiple buddy system** — just Master Tutor + 1 Minion (revised from earlier 3-buddy proposal)
- **No ElevenLabs switch yet** — staying on Deepgram Aura-2 for now
- **No personalized quiz** — deferred
- **Existing 14-node journey content stays the same** — we're adding Node 0, checkpoint nodes, and goofy moments around them
- **Existing Socratic scaffolding logic unchanged**
- **Existing dynamic slide (Node 4 FractionCompareSlide) unchanged**

---

## Part 4: Asset Inventory

**Folder:** `assets-from-team/`

### Assets Received

| File | What it is | How we use it |
|------|-----------|---------------|
| `BG.jpg` | Full-screen blue background with hexagonal patterns | Bottom layer — covers entire viewport |
| `Frame.jpg` | **Reference mockup only** — shows target layout/positioning | NOT used in code. Visual guide for placement of all elements. |
| `MediaBox.png` | Content area frame with glowing sci-fi border, white interior | Overlaid on BG, right side (~70% width). Content renders inside white area. |
| `bot.png` | Minion character (robot), single expression | Shown at bottom-left, smaller than tutor. Visible during onboarding + goofy moments. |
| `Character/Neutral.png` | Tutor — calm, hands in pockets | Default/idle expression |
| `Character/Greeting.png` | Tutor — waving | Welcome/onboarding |
| `Character/Celebration.png` | Tutor — fists raised, excited | Correct answer, checkpoint complete |
| `Character/Encouragment.png` | Tutor — thumbs up | Positive reinforcement |
| `Character/Giggling.png` | Tutor — hand over mouth laughing | Goofy moments, jokes |
| `Character/Listening.png` | Tutor — hand cupped to ear | Student speaking (PTT active) |
| `Character/Nudging.png` | Tutor — pointing, leaning in | Prompting, hints, scaffolding |

### Assets Still Needed (Using Placeholders Until Received)

| Category | What's needed | Status |
|----------|--------------|--------|
| **Nav buttons** | Next/Skip button + Hold-to-Talk button as separate interactive assets (PNG/SVG) | Awaiting from team — using CSS placeholders |

---

## Implementation Order (Proposed)

1. **Asset integration prep** — Review uploaded assets, define file naming, plan CSS changes
2. **UI overhaul** — Content screen, sidebar, nav button (consistent position), remove progress bar
3. **Master Tutor expressions** — Display character, map expressions to phases (approach decided after asset review)
4. **Onboarding flow (Node 0)** — New challenge, LLM prompt, conversation logic
5. **Minion character** — Display at onboarding + 1-2 strategic moments (simple TTS)
6. **Checkpoint dynamic slides** — 2-3 checkpoint nodes after each learning objective group
7. **Fun/goofy moments** — Pre-scripted mini-nodes at strategic journey points
8. **Polish & test** — End-to-end flow testing, mobile responsiveness

---

## Resolved Questions

1. ~~**Prev button**~~ — **No prev button.** Forward-only progression. Only Next/Skip with consistent positioning.
2. **Tutor expression trigger** — Phase-based mapping (simplest approach). 7 expressions mapped to conversation phases. See Section 1.4 for full mapping table.
3. **Minion voice** — Dead simple. Basic TTS for 1-2 interventions. Mostly visual.
4. **Goofy moment content** — Pre-scripted (we write them). Content team can refine later.
5. ~~**Progress bar**~~ — **Remove it.** New UI handles progress.
6. **Learning objective grouping** — Confirmed: 3 groups (LO1: nodes 1-5, LO2: nodes 6-10, LO3: nodes 11-14).
7. **Checkpoint interaction style** — Dynamic slides with voice + tap interactions (same pattern as FractionCompareSlide). Fills content area with question pane.
8. **Goofy moment format** — Voice-only, no student response. Auto-advance after TTS.
9. **Hold-to-Talk** — Keep hold-to-talk behavior (laptop-first experience). New position (bottom-right) and styling only.
10. **Layout structure** — BG.jpg (full screen) → MediaBox.png (right ~70%) → remaining left = sidebar (BG shows through). Characters at bottom-left overlapping boundary.
11. **Sidebar background** — No separate asset needed. BG.jpg is visible as the sidebar background naturally.
12. **Chat bubble styling** — Restyle to match blue sci-fi theme (tech decision).
13. **Nav buttons** — Placeholder CSS buttons until team provides separate assets.
14. **Design language** — Shifting from Candy-Land pastel to sci-fi/tech classroom aesthetic.
15. **Tutor name** — **"Max"** — short, friendly, easy for ESL kids. Replaces "Math Mate" as character name. App/product may still be called "Math Mate" but the tutor character is Max.
16. **Minion name** — **"Spark"** — fits the glowing eyes/antenna. Personality: goofy, curious, easily confused by fractions, provides comic relief.
17. **Onboarding content area visual** — During Node 0, the MediaBox shows a **welcome screen**: centered text ("Welcome to Fractions!" or similar) inside the white area. No extra assets needed — CSS + text. Once Node 1 starts, real content loads in.
18. **Node numbering** — Journey grows from 14 to ~20 nodes. Will use sequential numbering during implementation (Node 0 = onboarding, then existing 14 nodes interspersed with checkpoints and goofy moments).

## Remaining Open Questions

None — all questions resolved. Ready for implementation.

---

*This document will be updated as implementation progresses.*

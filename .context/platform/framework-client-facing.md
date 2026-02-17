# Math Mate Platform — Content Authoring Framework

**Document Type:** Proposal
**Status:** Framework designed, pending implementation
**Last updated:** 2026-02-02

---

## Overview

This document proposes how your content team will create learning journeys using the Math Mate platform. The framework has been designed based on the working demo — the next phase is building the authoring tools.

---

## What is Math Mate?

Math Mate is an AI-powered learning companion that guides students through educational content. Your content team creates the **learning journeys** — the platform brings them to life with voice, conversation, and interactivity.

*Note: "Math Mate" is a working name for the product. You can rename the product and the AI companion (called "Buddies") to match your brand.*

---

## How Content Creation Works

### The AI-Assisted Workflow

Your content team doesn't start from scratch. Here's how it works:

1. **You provide the basics** — Topic, learning objectives, assets (videos, applets, slides)
2. **AI drafts everything** — Questions, correct answer criteria, teaching hints, scripts
3. **Your team reviews and edits** — Refine the AI's draft to match your pedagogy
4. **Publish** — Students can now take the journey

**Why this approach?**
- Faster content creation (AI does the heavy lifting)
- Your experts focus on quality, not blank pages
- Consistent structure across all content

*This workflow will be enabled through a content authoring interface — currently in the design phase.*

---

## What Your Content Team Controls

### 1. Learning Journeys

A **Journey** is a complete learning experience (like "Introduction to Fractions"). Each journey contains multiple **Nodes**.

**You define:**
- Journey title and description
- Target grade level
- Subject area
- Estimated duration
- **Learning objectives** — What students will learn
- **Key vocabulary** — Terms to introduce
- Sequence of nodes

### 2. Nodes (The Building Blocks)

A **Node** is one piece of content the student experiences.

**Node Types:**

| Type | What It Is | Example |
|------|------------|---------|
| **Video** | Student watches a video | "What are Fractions?" YouTube video |
| **Applet** | Student interacts with an activity | Paper cutting fraction game |
| **Slide** | Student sees an image while AI explains | Diagram showing numerator/denominator |
| **Interactive Slide** | Student taps/interacts with visual elements | Compare 1/4 vs 1/6 with animations |

### 3. Conversations (The Teaching Moments)

Each node can have conversations **before** and **after** the content.

#### Before Content (Introduction)
- AI introduces what's coming
- Builds anticipation
- Sets context

**You write:** The exact script AI will speak (or let AI draft it for you)

#### After Content (Check Understanding)
This is where the teaching happens. You control:

| Component | What It Does | Example |
|-----------|--------------|---------|
| **Opening Question** | The first question AI asks | "If a pizza has 4 slices, what's one slice called?" |
| **Correct Answers** | What counts as right | "one fourth", "quarter", "1/4" |
| **Teaching Hints** | How AI helps when student struggles | See below |

#### Teaching Hints (Probes)

When a student answers incorrectly, AI guides them step-by-step using **probes** — escalating hints that help them reach the answer.

**You decide how many probes each question needs (2 to 5):**

| Probe # | Strategy | Example |
|---------|----------|---------|
| 1 | Probing question | "Fractions have special names! When there are 4 pieces, what's ONE called?" |
| 2 | Different angle | "Think about the number FOUR. Each piece is a 'fourth'. So one of them is...?" |
| 3 | Stronger hint | "Think about it — one piece, out of four. Put those together!" |
| 5 (last) | Reveal answer | "It's one-fourth! Or you can say 'one quarter'. Great job!" |

**Flexibility:**
- Simple concepts might only need 2-3 probes
- Harder concepts might need 4-5 probes
- The **last probe always reveals the answer** warmly
- You decide what's right for each question

**If student gets it right on the first try:** AI celebrates and moves on quickly.

### 4. What AI Handles Automatically

Your team doesn't need to write:

- **Acknowledgements** — "Yes! That's right!" / "Good try, but not quite..."
- **Transitions** — Natural flow between hints
- **Off-topic handling** — When student says something unexpected
- **Encouragement** — Keeping the tone warm and supportive

**The AI brings personality. Your team brings pedagogy.**

---

## Interactive Slides (Templates)

For nodes that need student interaction (tapping, comparing, etc.), you'll choose from pre-built templates:

### Template: Question + Visual Scaffolding

**How it works:**
1. AI asks your question
2. Visual appears (rectangles, shapes, etc.)
3. If wrong: Student taps to interact, AI guides with your hints
4. If right first try: Quick animation shows the concept, then celebrates

**You provide:**
- The question
- Up to 3 teaching hints
- The correct answer
- Visual elements (from template options)

*More templates will be added based on your content needs.*

---

## Buddy System (Future Feature)

Students will be able to choose their AI companion ("Buddy"):

- **Default Buddy** — The friendly tutor (currently called "Math Mate" in the demo)
- **Additional Buddies** — Different personalities, voices, characters

Each Buddy has a defined persona that shapes how they speak and encourage students. Your content works with any Buddy — they deliver it with their own style.

*You control Buddy names, personalities, and voices to match your brand.*

---

## What You'll Need to Provide

For each journey, your content team prepares:

### 1. Assets (Required)
- [ ] Videos (YouTube links or MP4 files)
- [ ] Applets (HTML5 interactive activities)
- [ ] Slide images (PNG/JPG)

### 2. Asset Descriptions (Required — Critical for AI)

For each video, applet, or slide, you provide a short description of **what it teaches**:

| Asset | What to Describe |
|-------|------------------|
| **Video** | What happens, what concepts are taught, what visuals appear |
| **Applet** | What student does, what they learn by doing it |
| **Slide** | What's shown, what the key message is |

**Example for a video:**
> "This video shows a pizza being cut into 4 equal slices. It introduces the term 'one-fourth' and emphasizes that all parts must be equal."

**Why this matters:** AI can't watch your videos or interact with your applets. These descriptions tell AI what the student just experienced, so it can ask relevant questions and reference the content.

### 3. Learning Objectives (Required)
- [ ] What students will learn by completing this journey
- [ ] Key vocabulary/terms to introduce

### 4. Node Sequence (Required)
- [ ] Which content in what order

### 5. Conversation Configuration (AI Can Draft)

For each node with questions:
- Opening question
- Acceptable correct answers
- 2-5 probes (escalating hints, last one reveals the answer)

**Your choice:** Write these yourself, OR let AI draft them from your asset descriptions and learning objectives. You always review and edit before publishing.

---

## Summary: You Control the Teaching, AI Brings It to Life

| Aspect | Who Owns It |
|--------|-------------|
| What question to ask | Your content team |
| What counts as correct | Your content team |
| How to teach when student struggles | Your content team |
| How to acknowledge student responses | AI (automatically) |
| Tone, encouragement, natural conversation | AI (with Buddy persona) |
| Voice delivery | AI (text-to-speech) |

---

## Next Steps

This framework has been validated through the working demo. To move forward:

1. **Review this proposal** — Does this match how your content team wants to work?
2. **Provide feedback** — What controls are missing? What's unclear?
3. **Build phase** — Once approved, we build the authoring interface

Your feedback shapes the final product.

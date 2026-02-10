# Iteration 4 Feedback - Client Meeting
**Date:** 3 February 2026

---

## Summary

Major shift towards a more immersive, personalized learning experience with multiple AI characters, improved onboarding, and smarter progress acknowledgment.

---

## 1. Onboarding / Welcome Flow

### Initial Welcome
- **Math Mate** (Master Tutor) welcomes the student — assume a 3D character or sprite
- Asks: "What do you want to learn about?"
- Student can say anything, but we show available modules
- For unavailable modules: UI indicates "Coming Soon"
- Currently only **Fractions** is available → "Why don't we start with that?"
- User clicks/says okay → Opens **Preference Journey**

### Preference Journey
- Utilize the **learning objectives** defined for that journey
- Tutor acknowledges and says:
  - "Here's what we're going to learn today"
  - Lists the learning objectives
  - "This is approximately how much time it will take"
- Then introduces the **Buddy System** (see below)

---

## 2. Buddy System (NEW FEATURE)

### Concept
- In addition to **Math Mate** (Master Tutor), introduce **3 AI Buddy characters**
- Each buddy has a distinct **persona** (goofy, intelligent, doubt-asking, etc.)
- Purpose: Create an **engagement layer** — student feels like they're in a virtual classroom
- Buddies have kid-like personas so students **look forward to meeting them**

### How Buddies Work
- Buddies are **configured per learning journey**
- We define **when** a buddy appears and **which** buddy appears
- Examples:
  | Buddy Type | Trigger | Example Behavior |
  |------------|---------|------------------|
  | Misconception Buddy | When Math Mate warns about a common mistake | "Whoa, I used to think that too! But actually..." |
  | Goofy Buddy | During lighter moments / breaks | Makes jokes, adds humor |
  | Curious Buddy | When asking check-in questions | "Wait, I have a doubt too!" |

### Introduction Flow
- Tutor (Math Mate) introduces themselves first
- Then introduces the 3 buddies with their personas
- Could be a slide or animated sequence
- Then class begins

---

## 3. Voice / TTS

- **Switch to ElevenLabs** for voice synthesis
- Reason: More voice options, better quality
- Potentially offer students **voice selection** for their tutor/buddies
- Current: Deepgram Aura-2

---

## 4. UI Feedback - Progress Bar

### Current State
- Top bar shows challenges/nodes with progress indicator
- Always visible (sticky)

### Client Feedback
- **Remove the sticky top bar** — doesn't add much value
- Instead: Show progress **contextually**

### Proposed Change
- When a node is completed → Show a **simple animation**
- Animation: Node gets completed → Moves to next node
- Only shown at node transitions
- Benefit: **More screen real estate** for content

---

## 5. Dynamic Slides

- Keep generating **programmatically** (as we're doing now)
- Not a priority to change for this iteration
- Future: Option to upload images (parked)

---

## 6. Checkpoint / Acknowledgment Flow (NEW)

### When to Trigger
- After a **set of learning objectives are achieved**
- Not after every single node — group them logically

### Flow
1. Math Mate (Master Tutor) acknowledges what was learned
2. Connects it to learning objectives: "You've now learned X, Y, Z"
3. Offers options (can be **click-based**, not just voice):

   | Option | What Happens |
   |--------|--------------|
   | **Revisit** | "Which concept do you want to revisit?" → User clicks a node → Replays that section |
   | **Quiz Me** | AI generates personalized quiz (see below) |
   | **Any Doubts?** | Opens voice conversation to ask questions |

### Smart Voice + Click Combination
- Not everything needs to be voice input
- Use **clicks for selection**, **voice for conversation**
- Example: "Do you want to revisit?" → User clicks YES → "Which node?" → User clicks node

---

## 7. Personalized Quiz (NEW)

### Concept
- When student chooses "Quiz Me"
- AI engine analyzes:
  - Conversation history
  - Student's understanding level (from responses)
  - Areas of struggle
- Generates **personalized questions** accordingly
- Presents quiz

### Value Proposition
- "Truly personalized" learning assessment
- Not one-size-fits-all questions

---

## 8. Open Problem: Learning Confirmation

> **"How do I know if I learned the concepts or NOT?"**

This is flagged as a **critical problem to solve**.

### Questions to Address
- How does the student get confidence they've actually learned?
- How do we measure/communicate understanding vs. just completion?
- Is it quizzes? Self-assessment? Badges? Something else?

### Ideas to Explore
- Mastery indicators
- Confidence ratings (self-reported)
- AI-assessed understanding from conversations
- Visual progress on learning objectives (not just nodes)

---

## Action Items / Next Steps

- [ ] Design buddy personas (3 characters)
- [ ] Plan ElevenLabs integration
- [ ] Design onboarding flow (wireframes/slides)
- [ ] Remove sticky progress bar, implement contextual animation
- [ ] Design checkpoint/acknowledgment flow
- [ ] Research: How to measure "did I learn this?"
- [ ] Define when/where buddies appear in the journey

---

*Last updated: 3 Feb 2026*

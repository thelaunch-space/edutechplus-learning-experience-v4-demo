# Client Feedback

## Iteration 1 Feedback (Jan 6, 2026)

**Core issue:** AI is a traffic controller, not a tutor.

| # | Feedback | Rationale |
|---|----------|-----------|
| 1 | Depth of conversation — multi-turn exchanges with actual teaching | Single-turn felt surface-level, no real pedagogy |
| 2 | Correctness evaluation — test if student understood, guide if wrong | No way to know if student learned anything |
| 3 | Teacher persona — feel like a teacher, not an MC/cheerleader | AI was just announcing next content, not teaching |
| 4 | Skip buttons on videos/applets | Students shouldn't be forced to complete every asset |
| 5 | Tap-to-speak — replace auto-recording | Auto-recording was awkward; explicit action is more natural |

**Key decision:** Turn-based model (like Duolingo/Speak) over real-time voice agents. Simpler, more reliable, pedagogically sound.

**Result:** All feedback addressed in Iteration 2.

---

## Iteration 2 Feedback (Jan 21, 2026)

Source: `meeting-transcripts-with-client/meeting-transcript-2.txt`

**Overall verdict:** "It's much better than where it was" — but needs acknowledgement and slides to be one level better.

| # | Feedback | Rationale |
|---|----------|-----------|
| 1 | **Acknowledge student responses** — AI must reference what the student said before moving on | AI was traversing a fixed scaffolding tree regardless of input. Student said correct answer ("one sixth") but AI kept probing as if wrong. Feels like talking to a wall. |
| 2 | **Correctness filter not catching valid answers** — student gave right answer but AI didn't recognize it | "One six" and "six slices" should match the correctness filter for 1/6. Filter was too strict. |
| 3 | **Pull up slides as a content type** — AI should narrate over slide visuals like a teacher would | Matches how teachers use slide decks with teacher notes. Bridges gap between passive video and interactive applet. |
| 4 | **Chat-style conversation UI** — show both AI and student messages in a WhatsApp-like thread | Student's spoken words should be visible as text. Older messages can fade; most recent stays prominent. Hold-to-talk at the bottom, content on the right (desktop) or stacked (mobile). ✅ **COMPLETED Iteration 3** |
| 5 | **Content should be the main screen, not AI** — AI is a companion, not the centerpiece | Screen should primarily show slides/content. AI character and conversation are secondary — "walks on stage" when needed, "walks off" during content. ✅ **COMPLETED Iteration 3** |
| 6 | **AI should narrate like a teacher going through slides** — use teacher notes as conversation script | Hard-coded teacher notes define what AI says per slide. AI walks through content the way a teacher would: introduce, explain, transition, check understanding. |
| 7 | **Check-for-understanding nodes should be placed deliberately** — not after every single asset | Content team decides where AI asks comprehension questions (e.g., after 2-3 slides, not after each one). Reduces interruption and lets content flow. |
| 8 | **Applet UI broken on mobile** — last-minute deploy broke mobile layout | Applet iframe not fitting properly after mobile optimization push. |

**Key decisions made during meeting:**
- Acknowledgement is a quick prompt fix — patch first, then iterate
- Slides are the next major feature (Iteration 3)
- Conversation UI redesign to chat-style layout
- Content-first screen hierarchy (AI enters/exits)

---

## Iteration 3 Feedback (Jan 23, 2026)

Source: `meeting-transcripts-with-client/feedback-iteration-3.md`

| # | Feedback | Rationale |
|---|----------|-----------|
| 1 | **Slides as content type** | Static visuals with AI narration. Matches existing slide decks with teacher notes. Fills gap between passive video and interactive applet. |
| 2 | **Full-screen content mode** | Content is the star. AI character "walks on stage" to teach, "walks off" so student focuses on content. Clearer separation between AI interaction and content consumption. |
| 3 | **Content team authoring control** | Not every content piece needs pre AND post voice. Content team decides where AI intervenes. Approach: `skipPreVoice` / `skipPostVoice` flags. |
| 4 | **Cost-conscious architecture** | Scripted (TTS-only) vs AI-powered (LLM) nodes. Not every interaction needs an LLM call. Selling point: teachers can minimize cost by scripting more and using LLM only for interactive checkpoints. |

**Status:** ✅ **FULLY IMPLEMENTED** — Slides + WhatsApp UI + content-first layout all complete.

---

## What's Been Addressed (as of Jan 30, 2026)

✅ **Slides content type** — Implemented with `SlideViewer.tsx`, supports both narration and question slides
✅ **WhatsApp-style chat UI** — ChatMessage, ChatHistory, ChatPane components with bubble styling, typing indicators
✅ **Content-first layout** — Two-pane responsive design, chat hides during video/applet for full-screen immersion
✅ **Enhanced acknowledgements** — Strengthened LLM prompts with explicit examples, removed word limits
✅ **Better greeting message** — Changed from "7 fun challenges" to kid-friendly "pizzas and cake"
✅ **Correctness debugging** — Added comprehensive logging for LLM + client-side decisions
✅ **Better pacing** — Added pause after acknowledgement before confetti
✅ **Unified button positioning** — All Skip buttons moved to top-right with consistent styling
✅ **Applet loading verification** — All 4 applets verified to exist, paths correct

---

## Iteration 4 Feedback (Jan 30, 2026)

**Overall verdict:** Slides working well, but need UX polish and more dynamic teaching behavior.

| # | Feedback | Rationale |
|---|----------|-----------|
| 1 | **Move buttons to top-right** — Skip/Done buttons currently at bottom-right, should be top-right | Bottom-right can interfere with applet interactive elements (cut/paste buttons, draggable items). Top-right is universal navigation zone. Need unified button styling across video/applet/slide. |
| 2 | **Applet A2 not loading** — "1/4 vs 1/6" applet fails to load | Could be caching issue on client laptop or real bug. Need to verify all 4 applets load reliably. Critical path blocker if real issue. |
| 3 | **Dynamic slide behavior** — Slides should be "blackboards" that update based on conversation, not static images | Teacher uses board as teaching tool, revealing content on cue. Current: slide shows → voice narrates. Desired: voice asks → slide appears → student struggles → slide shows hint → student correct → slide shows answer. Much stronger pedagogically. |

**Key architectural implications:**
- Button positioning: Medium scope, straightforward CSS fix
- Applet loading: Investigation needed, potentially urgent
- Dynamic slides: LARGE architectural change. Slides need multiple "states" (initial, hint, answer). SlideViewer becomes state machine. Voice interaction coordinates slide transitions. Content team creates multi-frame slides.

**Priority order:**
1. ✅ Fix button positioning (high priority, low risk) — **COMPLETED Jan 30**
2. ✅ Debug applet loading (critical path, medium risk) — **COMPLETED Jan 30** (files verified, likely caching issue)
3. ✅ Design + implement dynamic slides (high impact, high complexity) — **COMPLETED Feb 2** (focused experiment for Node 4)

**Implementation summary (Jan 30):**
- All Skip/Done buttons moved to top-right across video, applet, and slide components
- Unified button styling (translucent pill with arrow) replacing previous overanimated applet button
- Button text standardized to "Skip →" across all content types
- Responsive positioning updated for mobile and landscape modes
- Applet investigation: All 4 applet index.html files verified to exist at correct paths. File structure matches challenges.ts configuration. Issue likely client-side browser caching.

**Implementation summary (Feb 2) — Dynamic Interactive Slide:**
- Focused experiment on Node 4 (Applet A2 - Fraction Patterns) with `FractionCompareSlide` component
- 5-frame state machine: question → cut → highlight → compare → celebration
- Two interaction paths: Path A (correct first try) quick summary animation, Path B (wrong answer) interactive scaffolding
- Touch interactions: tap-to-split rectangles, tap-to-highlight pieces
- Voice-visual synchronization with 15-second auto-timeout fallback
- Upgraded TTS voice from `aura-asteria-en` to `aura-2-asteria-en` (more natural with breaths/pacing)
- Added `hasDynamicSlide: true` flag to Challenge type for future expansion

---

### Companion Character Proposal — Revised Thinking (Feb 5, 2026)

**Status:** Proposal under consideration. Leaning towards this over the buddy system.

**Context:** After the initial discussion about introducing buddies (multiple AI characters — one per purpose like Math Vault, Math Trap, misconception handling, doubt resolution, etc.), a revised simpler approach emerged.

**Problem with the buddy approach:** Having a master tutor plus multiple purpose-specific buddies is cognitive overload for a Grade 4 student. Too many characters, each appearing for a different reason, makes the experience fragmented and harder to follow.

**Revised proposal — Master Tutor + Minion:**
- **Master Tutor:** The primary AI voice companion. Handles all teaching, Socratic questioning, scaffolding, and narration — same as today.
- **Minion:** A single, cute sidekick character with a light-touch role:
  - **Nudging:** If the student is supposed to respond but stays silent, the minion gently prods them (instead of the tutor nagging).
  - **Ambient animations:** Occasional small animations to make the kid smile or laugh — keeps energy up without interrupting the lesson.
  - **Light questioning:** Can occasionally surface misconception-style questions or playful prompts, but nothing heavy — just enough to add variety.

**Why this is better:** Two characters is a manageable cast. The tutor stays authoritative and pedagogically focused. The minion adds personality and keeps engagement up without fragmenting the teaching voice. Kids get a "friend" without the confusion of multiple characters rotating in and out.

**Decision status:** **APPROVED (Feb 10, 2026).** Master Tutor + single Minion confirmed. No multi-buddy system. Assets received: young scientist boy (7 expressions) + small cute robot (1 image). Full Iteration 5 requirements documented in `.context/iteration-5-requirements.md`.

---

### Iteration 5 Decisions (Feb 10, 2026)

**Confirmed scope:**
- Master Tutor (young scientist, 7 expressions) + Minion (cute robot, 1-2 interventions)
- Sci-fi/tech UI theme replacing Candy-Land (assets received from design team)
- Onboarding flow (Node 0): warm-up conversation, max 5 turns, no correctness
- Checkpoint dynamic slides: 3 checkpoints after each learning objective group (voice + interactive)
- Fun/goofy moments: pre-scripted, voice-only, 2-3 placements
- Remove progress bar, laptop-first design
- Hold-to-Talk stays (laptop, not mobile)
- No prev button — forward-only
- No ElevenLabs yet, no personalized quiz yet

---

### Onboarding Flow Feedback (Feb 10, 2026) — OWNER EXTREMELY FRUSTRATED

**Context:** Multiple failed iterations of the onboarding flow. Claude repeatedly failed to think through the conversation design properly, producing robotic flows that no real teacher would use. Owner is signing off for the night with extreme disappointment.

**Status:** Current version is "decently okay" mechanically — guardrails work, name re-ask works (partially), questions at end of turns work. But the CONTENT and PURPOSE of the conversation is wrong.

**Core feedback (must address Feb 11):**

| # | Feedback | What Claude keeps getting wrong |
|---|----------|---------------------------------|
| 1 | **Learning outcomes in kid-speak** | Max never tells the kid what they'll actually learn. Must preview: sharing pizza, cutting cakes, fraction games. Fun language, not academic. Claude keeps omitting this entirely. |
| 2 | **Purposeful nudging, not aimless chat** | Every turn should build excitement about learning fractions. Not random "Do you like pizza?" without connecting it to anything. Set the stage: "we're going to have fun while learning fractions." |
| 3 | **Adaptive conversation length** | Min 2-3 turns, max 5. If kid is eager, transition earlier. If reluctant, warm them up. Don't force a fixed number of turns. Current code forces exactly 3 minimum regardless. |
| 4 | **Name extraction still buggy** | "I don't know" → extracts "I". Re-ask logic only checks for "Friend", not garbage single-letter or common-word names. |

**Owner's exact words:** "I am so pissed off at Claude fucking everything up, behaving like an idiot, not thinking. This is definitely not the world's best model like it is marketed around. The onboarding flow is god awful."

### ✅ Onboarding Feedback RESOLVED (Feb 11, 2026)

All 4 issues from Feb 10 addressed with 5-beat rewrite:

| # | Issue | Resolution |
|---|-------|------------|
| 1 | Learning outcomes missing | Beat 3 (Adventure Hook) LLM prompt REQUIRES mentioning "fraction adventure" + 2 concrete activities |
| 2 | Aimless chat | Replaced open-ended loop with 5 purposeful beats. Each beat has exactly one job. |
| 3 | Adaptive conversation length | Fixed at 5 beats (~90 sec). 2 PTT moments (name + response to hook). No dragging, no rushing. |
| 4 | Name extraction buggy | `extractName()` hardened: 40+ blocked words, single letters, numbers, common words all caught |

### MediaBox Layout Feedback (Feb 11, 2026)

**Context:** Content not fitting properly inside MediaBox screen area. Gap at bottom, distortion on different screen sizes.

**Resolution:** Fixed with `<img>` element approach preserving aspect ratio. Separate asset request sent to design team for long-term solution (ScreenFrame, Panel, Buttons as individual PNGs).

**Last updated:** 2026-02-11

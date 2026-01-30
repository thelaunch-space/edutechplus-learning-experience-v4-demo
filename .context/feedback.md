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
3. 📋 Design + implement dynamic slides (high impact, high complexity) — **DEFERRED** to separate design phase

**Implementation summary (Jan 30):**
- All Skip/Done buttons moved to top-right across video, applet, and slide components
- Unified button styling (translucent pill with arrow) replacing previous overanimated applet button
- Button text standardized to "Skip →" across all content types
- Responsive positioning updated for mobile and landscape modes
- Applet investigation: All 4 applet index.html files verified to exist at correct paths. File structure matches challenges.ts configuration. Issue likely client-side browser caching.

**Last updated:** 2026-01-30

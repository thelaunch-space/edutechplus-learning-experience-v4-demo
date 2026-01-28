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
| 4 | **Chat-style conversation UI** — show both AI and student messages in a WhatsApp-like thread | Student's spoken words should be visible as text. Older messages can fade; most recent stays prominent. Hold-to-talk at the bottom, content on the right (desktop) or stacked (mobile). |
| 5 | **Content should be the main screen, not AI** — AI is a companion, not the centerpiece | Screen should primarily show slides/content. AI character and conversation are secondary — "walks on stage" when needed, "walks off" during content. |
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

**Status:** Pending approval for implementation.

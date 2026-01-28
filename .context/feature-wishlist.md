# Feature Wishlist

## Iteration 3 (Next)

1. **Acknowledge student responses** — AI must reference what the student said before moving on, not just traverse a fixed scaffolding tree *(transcript-2)*
2. **Slides content type** — `type: 'slide'` with `imageUrl`, rendered full-screen. AI narrates over slide using teacher notes *(transcript-2, feedback-iter-3)*
3. **Full-screen content mode** — content is the star. AI character enters/exits as needed *(transcript-2, feedback-iter-3)*
4. **Chat-style conversation UI** — WhatsApp-like thread showing both AI and student messages. Older messages fade, recent stays prominent *(transcript-2)*
5. **Flexible voice nodes** — `skipPreVoice` / `skipPostVoice` flags per challenge. Content team controls where AI intervenes *(feedback-iter-3)*
6. **Scripted vs AI-powered nodes** — `interactive: boolean` flag. If false, just TTS the script (no LLM). If true, Socratic back-and-forth *(feedback-iter-3)*
7. **AI narrates like a teacher** — use teacher notes as conversation script per slide. Introduce, explain, transition, check understanding *(transcript-2)*
8. **Fix correctness filter strictness** — valid answers like "one six" / "six slices" should match. Filter was too strict *(transcript-2)*

## Deferred / Future

- **Corrective slides / routing logic** — branch to remedial content if student struggles *(feedback-iter-3, transcript-2)*
- **On-demand doubts** — tap-to-speak outside structured conversation for ad-hoc questions *(impl-plan-iter-2)*
- **Pre-asset multi-turn** — currently just scripted intro; could become interactive *(impl-plan-iter-2)*
- **Content authoring portal** — GUI for content team to drag/drop nodes, replace config file editing *(feedback-iter-3)*

# Feature Wishlist

## Completed (Iteration 3)

1. ✅ **Slides content type** — `type: 'slide'` with `imageUrl`, rendered full-screen via SlideViewer component
2. ✅ **Narration vs question slides** — `isQuestionSlide` flag controls behavior (narrate + auto-advance vs Socratic dialogue)
3. ✅ **Enhanced acknowledgements** — Strengthened LLM prompts with explicit examples, removed 30-word limit for better quality
4. ✅ **Better greeting message** — Changed from "7 fun challenges" to reference "pizzas and cake" for kid-friendly language
5. ✅ **Improved correctness debugging** — Comprehensive console logging showing LLM + client-side decisions
6. ✅ **Better pacing** — Added 1-second pause after acknowledgement before confetti triggers

## Iteration 4 (Next)

1. **Acknowledge student responses** — AI must reference what the student said before moving on, not just traverse a fixed scaffolding tree *(transcript-2)*
2. **Chat-style conversation UI** — WhatsApp-like thread showing both AI and student messages. Older messages fade, recent stays prominent *(transcript-2)*
3. **Flexible voice nodes** — `skipPreVoice` / `skipPostVoice` flags per challenge. Content team controls where AI intervenes *(feedback-iter-3)*
4. **Scripted vs AI-powered nodes** — `interactive: boolean` flag. If false, just TTS the script (no LLM). If true, Socratic back-and-forth *(feedback-iter-3)*
5. **Visual context integration** — Add `visualDescription` field to slides so AI can reference on-screen content (e.g., "Look at the pizza!")
6. **Fix correctness filter strictness** — valid answers like "one six" / "six slices" should match. Filter was too strict *(transcript-2)*

## Deferred / Future

- **Corrective slides / routing logic** — branch to remedial content if student struggles *(feedback-iter-3, transcript-2)*
- **On-demand doubts** — tap-to-speak outside structured conversation for ad-hoc questions *(impl-plan-iter-2)*
- **Pre-asset multi-turn** — currently just scripted intro; could become interactive *(impl-plan-iter-2)*
- **Content authoring portal** — GUI for content team to drag/drop nodes, replace config file editing *(feedback-iter-3)*

**Last updated:** 2026-01-29

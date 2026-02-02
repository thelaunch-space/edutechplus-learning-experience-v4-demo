# Feature Wishlist

## Completed (Iteration 3)

1. ✅ **Slides content type** — `type: 'slide'` with `slideUrl`, rendered full-screen via SlideViewer component
2. ✅ **Narration vs question slides** — `isQuestionSlide` flag controls behavior (narrate + auto-advance vs Socratic dialogue)
3. ✅ **WhatsApp-style chat UI** — ChatMessage, ChatHistory, ChatPane components with message bubbles, typing indicators, two-pane responsive layout
4. ✅ **Content-first display** — Chat hides during video/applet playback for full-screen immersion, shows during conversation phases
5. ✅ **Enhanced acknowledgements** — Strengthened LLM prompts with explicit examples, removed 30-word limit for better quality
6. ✅ **Better greeting message** — Changed from "7 fun challenges" to reference "pizzas and cake" for kid-friendly language
7. ✅ **Improved correctness debugging** — Comprehensive console logging showing LLM + client-side decisions
8. ✅ **Better pacing** — Added 1-second pause after acknowledgement before confetti triggers

## Completed (Iteration 4 — Jan 30, 2026)

1. ✅ **Unified button positioning** — Moved Skip/Done buttons to top-right across video/applet/slide. Unified styling (translucent pill with arrow). Standardized text to "Skip →" *(feedback-jan-30)*
2. ✅ **Debug Applet A2 loading** — Verified all 4 applet files exist at correct paths. Issue likely client-side caching *(feedback-jan-30)*

## Completed (Iteration 4 — Feb 2, 2026)

3. ✅ **Dynamic interactive slide (Node 4)** — FractionCompareSlide with 5-frame state machine (question → cut → highlight → compare → celebration). Two interaction paths: Path A (correct first try) with quick animated summary, Path B (wrong answer) with interactive tap-to-split scaffolding. 15-second auto-timeout fallback. *(feedback-jan-30)*

## Future Iterations

### Medium Priority
4. **Acknowledge student responses** — AI must reference what the student said before moving on, not just traverse a fixed scaffolding tree *(transcript-2)* [PARTIALLY ADDRESSED via prompt improvements]
5. **Fix correctness filter strictness** — valid answers like "one six" / "six slices" should match. Filter was too strict *(transcript-2)*

### Lower Priority (Deferred)
7. **Flexible voice nodes** — `skipPreVoice` / `skipPostVoice` flags per challenge. Content team controls where AI intervenes *(feedback-iter-3)*
8. **Scripted vs AI-powered nodes** — `interactive: boolean` flag. If false, just TTS the script (no LLM). If true, Socratic back-and-forth *(feedback-iter-3)*
9. **Visual context integration** — Add `visualDescription` field to slides so AI can reference on-screen content (e.g., "Look at the pizza!")

## Deferred / Future

- **Corrective slides / routing logic** — branch to remedial content if student struggles *(feedback-iter-3, transcript-2)*
- **On-demand doubts** — tap-to-speak outside structured conversation for ad-hoc questions *(impl-plan-iter-2)*
- **Pre-asset multi-turn** — currently just scripted intro; could become interactive *(impl-plan-iter-2)*
- **Content authoring portal** — GUI for content team to drag/drop nodes, replace config file editing *(feedback-iter-3)*

**Last updated:** 2026-02-02

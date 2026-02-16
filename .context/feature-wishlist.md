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

### Completed (post-Iteration 5)
4. ✅ **Acknowledge student responses** — Prompts now explicitly acknowledge correct/wrong/off-topic before scaffolding *(transcript-2)*
5. ✅ **Correctness filter improvements** — Word boundary matching + negation detection (15 negation words). Dual-layer: client-side regex + LLM eval *(transcript-2)*
6. ✅ **ElevenLabs TTS** — Switched from Deepgram Aura-2 to ElevenLabs Aria (`eleven_turbo_v2_5`). Browser TTS fallback.
7. ✅ **Anthropic LLM** — Switched from OpenRouter GPT-4.1-nano to Anthropic Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

### Lower Priority (Deferred)
7. **Flexible voice nodes** — `skipPreVoice` / `skipPostVoice` flags per challenge. Content team controls where AI intervenes *(feedback-iter-3)*
8. **Scripted vs AI-powered nodes** — `interactive: boolean` flag. If false, just TTS the script (no LLM). If true, Socratic back-and-forth *(feedback-iter-3)*
9. **Visual context integration** — Add `visualDescription` field to slides so AI can reference on-screen content (e.g., "Look at the pizza!")

## Completed (Iteration 5 — Feb 10, 2026)

Details merged into `progress.md` (Iteration 5 section) and `conversation-design.md`.

1. ✅ **UI overhaul** — Sci-fi/tech theme replacing Candy-Land. BG.jpg + MediaBox.png layout, laptop-first.
2. ✅ **Master Tutor "Max" expressions** — 7 expression states, phase-based switching, crossfade transitions
3. ✅ **Minion "Spark" robot** — Sidekick character, appears during onboarding + goofy moments
4. ✅ **Onboarding flow (Node 0)** — Warm-up conversation: intro, name capture, warm-up Qs. Replaces GREETING phase.
5. ✅ **Checkpoint dynamic slides** — 3 checkpoints after LO groups (nodes 7, 14, 19). Voice + review questions, confetti.
6. ✅ **Fun/goofy moments** — 2 pre-scripted moments (nodes 5, 11). Voice-only, auto-advance.
7. ✅ **Remove progress bar** — Deleted ProgressBar component entirely
8. ✅ **Unified nav buttons** — NavBar with Next/Skip (center) + PTT (right, Button.png) in fixed positions

## Completed (Post-Iteration 5 — Feb 11, 2026)

9. ✅ **Dynamic question slides (8 nodes)** — 3 reusable templates (FractionBuilder, MultipleChoice, TapToSelect) replacing voice-only Q&A on empty screens. Per-node visual configs in `dynamicSlideContent.ts`.
10. ✅ **Voice-first correctness check** — Student answers verbally first. If correct → quick auto-animation (no taps). If wrong → tap-based scaffold.
11. ✅ **Per-choice MCQ hints** — Each wrong button gives unique feedback instead of repeating generic hint.
12. ✅ **Conversational flow polish** — Wrong answer acknowledgement, tap instructions, timeout speech, post-completion wrap-up.

## Completed (Post-Iteration 5 — Feb 16, 2026)

13. ✅ **Minion moments (8 embedded)** — `minionMoment` field on regular nodes. Spark speaks first, Max responds. Mix of silly jokes, misconception doubts, and hype. Plays before preScript. Nodes: 1, 3, 7, 9, 11, 14, 17, 19.
14. ✅ **Scaffold quality fixes** — Removed phonetic spelling hints ("one-f..."), forced parroting ("Can you say that?"), and ambiguous questions. Reduced scaffold turns from 5→4 where parroting turn was removed.
15. ✅ **5 Learning Outcomes with "Level Up!" checkpoints** — Restructured from 3 LOs (6-7 nodes each) to 5 LOs (2-4 nodes each). 5 checkpoints at nodes 4, 8, 12, 15, 20. Spacing: 3, 3, 3, 2, 4. Converted goofy-2 to checkpoint-lo3. Journey expanded from 20 to 21 nodes.

## Completed (Post-Iteration 5 — Feb 16, 2026) — UX Polish

16. ✅ **Voice differentiation** — Max uses Liam (young male), Spark uses Aria (expressive female). `speakText()` accepts voice parameter. All minionLine calls use `speakAsSpark()`.
17. ✅ **Tighter preScripts** — Cut filler from 6 wordy nodes (1, 3, 5, 7, 8, 11). Teaching content preserved, removed redundancy and padding.
18. ✅ **Faster confetti** — Reduced from 5s → 3s. Still celebratory, less dead time.
19. ✅ **Rotating wrap-up phrases** — 5 variants replacing hardcoded "Nice work! You're learning so fast." No consecutive repeats.

## Upcoming: Asset Replacement

- **Character animation frames** — Replace 7 static Max PNGs with animation frames per expression
- **Separate layout assets** — ScreenFrame.png + Panel.png replacing single MediaBox.png
- **New button assets** — Replacing current Button.png + CSS-based nav buttons
- **Status:** Awaiting upload from design team

## Deferred / Future

- **Corrective slides / routing logic** — branch to remedial content if student struggles *(feedback-iter-3, transcript-2)*
- **On-demand doubts** — tap-to-speak outside structured conversation for ad-hoc questions *(impl-plan-iter-2)*
- ~~**ElevenLabs TTS switch**~~ ✅ Done — now using ElevenLabs Aria
- **Personalized quiz** — AI-generated quiz based on conversation history and struggle areas *(feedback-iter-4)*
- **Content authoring portal** — GUI for content team to drag/drop nodes *(feedback-iter-3)* **[FRAMEWORK DESIGNED — see `.context/platform/` and `content-inputs/`]**

## Platform Scaling (Framework Designed, Build Deferred)

Framework documentation and reference implementation complete:
- `.context/platform/framework-client-facing.md` — Client-friendly guide
- `.context/platform/framework-technical.md` — Technical spec
- `content-inputs/` — Reference content structure

**Build phases when ready:**
1. Backend setup (Convex + Clerk)
2. Progress persistence
3. Content authoring GUI
4. Analytics dashboard

**Last updated:** 2026-02-16

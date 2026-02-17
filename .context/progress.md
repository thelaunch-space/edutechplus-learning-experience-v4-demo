# Progress

## Iteration 1 (Complete)

**Goal:** Prove technical feasibility of voice-guided content sequencing.

**Delivered:** Single-turn voice interaction with auto-progression through 7 challenges. Auto 5-second recording window.

**Outcome:** Client said it was a "traffic controller, not a tutor." No teaching depth, no correctness evaluation, no course correction.

## Iteration 2 (Complete)

**Goal:** Transform single-turn traffic controller into multi-turn tutor with conversation depth.

**Delivered:**
- Hold-to-Talk (PTT) replacing auto-recording
- Multi-turn Socratic conversations (up to 5 turns per challenge)
- Structured LLM responses: `{ response, isCorrect, shouldEnd }`
- Conversation history preserved across turns
- Correctness filters + scaffolding per challenge
- Playful Candy-Land UI with Fredoka + Nunito fonts, bouncy animations
- Skip buttons on videos/applets
- YouTube embeds for video content

**Key technical decisions:**
- Turn-based model (like Duolingo/Speak) over real-time voice agents
- Structured JSON output from LLM for conversation control
- Client-side backup correctness check (regex against `correctnessFilter`)

## Iteration 3 (Complete — 2026-01-29)

**Goal:** Implement slide content type with narration/question variants + WhatsApp-style chat UI.

**Delivered:**

**Slide Content Type:**
- New `'slide'` content type with `slideUrl`, `slideNarration`, `isQuestionSlide` fields
- SlideViewer component for full-screen slide rendering with skip button
- 7 slide images added to `/public/fractions-module-content/slides/`
- Narration slides: Auto-advance after TTS speaks scripted narration (no confetti)
- Question slides: Multi-turn Socratic dialogue with confetti on completion
- Complete 14-node learning journey (7 existing + 7 new slides)

**WhatsApp-Style Chat UI (Complete):**
- **ChatMessage** component with WhatsApp-style bubbles (green for user, white for assistant)
- **ChatHistory** component with message list, auto-scroll, and typing indicators (bouncing dots)
- **ChatPane** component integrating chat history with hold-to-talk PTT button
- **Two-pane layout** in App.tsx:
  - Desktop/Tablet: Sidebar chat on left, content on right
  - Mobile: Overlay chat pane at bottom
- **Content-first display:** Chat hides during video/applet playback for full-screen immersion
- **Conditional visibility:** Chat shows during greeting/pre/post phases and slide interactions
- Message bubbles with slide-in animations, recent message pulse effect
- Typing indicators: "Math Mate is thinking..." / "Math Mate is talking..."

**Components created:**
- `src/components/ChatMessage.tsx` + `.module.css`
- `src/components/ChatHistory.tsx` + `.module.css`
- `src/components/ChatPane.tsx` + `.module.css`

**Key technical changes:**
- Updated `Challenge` type to include slide-specific fields
- Updated `App.tsx` to implement two-pane responsive layout with conditional chat visibility
- Slide behavior controlled by `isQuestionSlide` flag (narrate vs question)
- Total challenges increased from 7 → 14 nodes
- Session store tracks `allMessages` array for chat history
- Voice interaction displays real-time text in chat thread

**Prior Iteration 3 work (2026-01-28):**
- Enhanced introduction fallback message from "7 fun challenges" to "pizzas and cake"
- Strengthened LLM evaluation prompt with explicit acknowledgement examples
- Removed 30-word limit for better acknowledgement quality
- Added 1-second pause after correct answer acknowledgement before confetti
- Comprehensive correctness debugging logs

## Iteration 4 (Complete — Feb 2, 2026)

**New client feedback received:** Shifted priorities based on UX issues and pedagogical improvements.

### ✅ Completed (Jan 30, 2026)

**Priority 1: Button Positioning (UI Fix) — DONE**
- ✅ Moved Skip/Done buttons from bottom-right to top-right across all content types
- ✅ Unified button styling (translucent pill with arrow)
- ✅ Standardized button text to "Skip →"
- ✅ Updated responsive positioning for mobile and landscape modes
- ✅ Prevents interference with applet interactive elements
- **Files modified:**
  - `src/components/YouTubePlayer.module.css`
  - `src/components/AppletContainer.module.css` + `AppletContainer.tsx`
  - `src/components/SlideViewer.module.css`

**Priority 2: Applet Loading Investigation (Bug) — DONE**
- ✅ Verified all 4 applet index.html files exist at correct paths
- ✅ Confirmed file structure matches challenges.ts configuration:
  - A1: `A1. M2-Fraction Cut and Glue Practice/index.html` ✓
  - A2: `A2.M2-Fraction Paper Cut Snapshot/index.html` ✓
  - A3: `A3. M2-Fraction Statement Cake Snapshot/index.html` ✓
  - A4: `A4.M2-Fraction Cut and Glue Practice 2/index.html` ✓
- **Conclusion:** Issue likely client-side browser caching, not codebase bug

### ✅ Completed (Feb 2, 2026)

**Priority 3: Dynamic Interactive Slide (Focused Experiment) — DONE**
- ✅ Implemented `FractionCompareSlide` for Node 4 (Applet A2 - Fraction Patterns)
- ✅ 5-frame state machine: question → cut → highlight → compare → celebration
- ✅ Two interaction paths:
  - **Path A (Correct first try):** Quick animated summary showing rectangles splitting, highlighting, and counts
  - **Path B (Wrong answer):** Interactive scaffolding with tap-to-split and tap-to-highlight interactions
- ✅ Voice-visual synchronization: Math Mate narrates while slide animates
- ✅ Touch interaction: Students tap rectangles to split them, tap pieces to highlight
- ✅ Automatic timeout fallback: If student doesn't tap within 15 seconds, auto-advances
- ✅ Added `hasDynamicSlide: true` flag to Challenge type for Node 4
- ✅ Full two-pane layout with chat visible during dynamic slide interaction

**Files created:**
- `src/components/FractionCompareSlide/FractionCompareSlide.tsx` - Interactive slide component with 5 frames
- `src/components/FractionCompareSlide/FractionCompareSlide.module.css` - Playful Candy-Land styling with animations

**Files modified:**
- `src/types/index.ts` - Added `SlideFrame`, `SlideInteractionState`, and `hasDynamicSlide` to Challenge type
- `src/store/sessionStore.ts` - Added dynamic slide state management (frame, interaction tracking, reset)
- `src/hooks/useVoiceInteraction.ts` - Added `runFractionCompareInteraction()` for voice-slide coordination
- `src/config/challenges.ts` - Added `hasDynamicSlide: true` to Node 4 (applet-a2)
- `src/App.tsx` - Integrated FractionCompareSlide rendering and tap handlers

**Design details:**
- Rectangles with split animations (vertical divider lines appearing with stagger)
- Tap indicators with pulsing glow animation
- Piece highlight with coral color fill
- Piece count badges with pop-in animation
- Celebration answer banner with sparkle animations
- Responsive design for mobile, tablet, and desktop

### ✅ Completed (Feb 2, 2026) — Framework & Content Structure

**Priority 4: Content Authoring Framework Design — DONE**
- ✅ Created `framework-wip.md` — Client-friendly guide explaining what content teams control
- ✅ Created `framework-technical.md` — Technical spec for building the scalable platform
- ✅ Created `content-inputs/` folder — Reference implementation of content team inputs:
  - `journey-metadata.json` — Journey-level config (title, objectives, vocabulary)
  - `node-sequence.json` — 14-node sequence definition
  - `asset-contexts/*.md` — 14 files describing what each video/applet/slide teaches
  - `conversations/*.json` — 14 files with pre/post conversation configs

**Key framework decisions:**
- Scaffolding uses flexible `probes[]` array (2-5 per question, not fixed 5)
- Asset context descriptions required — AI can't watch videos
- AI drafts conversation config from asset descriptions; content team reviews/edits
- Linear node sequence for v1 (no branching)
- Buddy system (configurable AI personas) planned for future

**Files created:**
- `.context/platform/framework-client-facing.md`
- `.context/platform/framework-technical.md`
- `content-inputs/` folder (34 files)

---

## Iteration 5 (Complete — Feb 10, 2026)

**Goal:** Visual overhaul (sci-fi theme), character system (Master Tutor "Max" with 7 expressions + Minion "Spark" robot), onboarding flow, checkpoint dynamic slides, and fun moments.

**Status:** Implementation complete. Build passing.

**Scope boundaries (explicitly decided NOT to do):**
- No multiple buddy system — just Master Tutor + 1 Minion (revised from earlier 3-buddy proposal in iteration-4 feedback)
- No personalized quiz — deferred
- Existing Socratic scaffolding logic unchanged
- Existing FractionCompareSlide (Node 4) unchanged
- Forward-only progression (no prev button)
- Nav button assets: using CSS placeholders until design team provides separate assets

**Key naming decisions:** Tutor = "Max" (short, friendly, easy for ESL kids). Minion = "Spark" (fits the glowing eyes/antenna).

**UI layer stack:** BG.jpg (full screen) → MediaBox.png (right ~70%, white interior) → sidebar (left ~30%, BG shows through naturally, no separate asset) → characters (bottom-left, overlapping sidebar/content boundary) → nav buttons (bottom).

### ✅ Completed

**1. UI Overhaul — DONE**
- ✅ BG.jpg full-screen background replacing candy-land gradient
- ✅ MediaBox.png frame for right content pane (~70%), white interior
- ✅ Transparent sidebar (~30%) with chat overlay on background
- ✅ Sci-fi themed chat bubbles (cyan/teal user, white/blue assistant)
- ✅ Content renderers (YouTube, applet, slide) restyled for light MediaBox interior
- ✅ Progress bar removed entirely
- ✅ NavBar with consistent Next/Skip button (center) and PTT button (right, using Button.png)

**Files modified:** `App.module.css`, `ChatMessage.module.css`, `ChatPane.module.css`, `ChatHistory.module.css`, `YouTubePlayer.module.css`, `AppletContainer.module.css`, `SlideViewer.module.css`, `WelcomeScreen.tsx` + `.module.css`
**Files deleted:** `ProgressBar.tsx`, `ProgressBar.module.css`
**Files created:** `NavBar.tsx` + `.module.css`

**2. Master Tutor "Max" — 7 Expression States — DONE**
- ✅ TutorCharacter component with crossfade transitions between expressions
- ✅ Phase-based expression switching throughout all voice flows:
  - Onboarding: `greeting` → `neutral`
  - Pre-challenge narration: `neutral`
  - Post-challenge question: `nudging`
  - PTT active (student speaking): `listening`
  - Student correct: `celebration`
  - Student incorrect/scaffolding: `encouragement`
  - Goofy moments: `giggling`
  - Checkpoints: `celebration`
- ✅ Positioned bottom-left overlapping sidebar/content boundary

**Files created:** `TutorCharacter.tsx` + `.module.css`

**3. Minion "Spark" Robot — DONE**
- ✅ MinionCharacter component with slide-in/fade entrance animation
- ✅ Visible during onboarding intro and goofy moments, hidden otherwise
- ✅ Positioned left of tutor at bottom-left

**Files created:** `MinionCharacter.tsx` + `.module.css`

**4. Onboarding Flow (Node 0) — DONE**
- ✅ New `'onboarding'` challenge type at index 0
- ✅ Replaces old GREETING phase (SessionPhase changed from GREETING → ONBOARDING)
- ✅ `runOnboardingInteraction()` in voice hook: intro → name capture → warm-up questions (max 5 turns)
- ✅ `ONBOARDING_SYSTEM_PROMPT` for LLM (no correctness eval, warm/anchored)
- ✅ `generateOnboardingResponse()` in OpenRouter service (plain text, no JSON)
- ✅ OnboardingWelcome component for MediaBox content area

**Files modified:** `types/index.ts` (SessionPhase), `sessionStore.ts`, `useVoiceInteraction.ts`, `openrouter.ts`, `prompts.ts`, `challenges.ts`
**Files created:** `OnboardingWelcome.tsx` + `.module.css`

**5. Checkpoint Dynamic Slides (3x) — DONE**
- ✅ New `'checkpoint'` challenge type at nodes 7, 14, 19
- ✅ 3 checkpoints after each LO group:
  - LO1 (nodes 1-6): Equal parts & basic notation
  - LO2 (nodes 8-13): Bigger fractions & numerator/denominator
  - LO3 (nodes 15-18): Applying fraction knowledge
- ✅ `runCheckpointInteraction()` in voice hook: celebratory summary → review questions → confetti
- ✅ `getCheckpointPrompt()` in prompts + `generateCheckpointResponse()` in OpenRouter
- ✅ CheckpointSlide component (sci-fi themed, visual LO summary)

**Files created:** `CheckpointSlide/CheckpointSlide.tsx` + `.module.css`

**6. Fun/Goofy Moments (2x) — DONE**
- ✅ New `'goofy'` challenge type at nodes 5 and 11
- ✅ `runGoofyMomentInteraction()` in voice hook: auto-play, no PTT, auto-advance
- ✅ Pre-scripted content in `goofyMoments.ts`
- ✅ Minion appears during Spark's joke (goofy-1), hidden for Max's fun fact (goofy-2)

**Files created:** `src/config/goofyMoments.ts`

**7. App Integration — DONE**
- ✅ App.tsx fully rewritten with new layout structure
- ✅ ChatPane simplified (PTT moved to NavBar)
- ✅ All new useEffects for onboarding, checkpoint, goofy triggers
- ✅ Journey expanded from 14 → 20 nodes (0-19)
- ✅ Tutor name changed from "Math Mate" to "Max" in all prompts

**Files modified:** `App.tsx`, `ChatPane.tsx`

### Assets

**Copied to `public/tutor-assets/`:** BG.jpg, MediaBox.png, bot.png, Button.png, Character/ (7 PNGs)
**Pending:** Final nav button assets from design team (using CSS placeholders)

### ⚠️ CRITICAL — Onboarding Flow Still Broken (Feb 10, 2026)

**Status:** Actively being fixed. Multiple failed attempts. Resume tomorrow.

**The problem:** The onboarding flow (Node 0) is fundamentally broken in conversation design. Claude has repeatedly failed to think through the interaction properly, producing robotic, thoughtless flows that no real teacher would use. The owner is extremely frustrated.

**Issues found through testing:**
1. **Fallback fires on Turn 1** — When LLM times out after kid says their name, the fallback was a generic "That sounds fun!" instead of a name-aware greeting. **Fixed:** Fallbacks now name-aware per turn.
2. **LLM sets shouldProceed=true on reluctant responses** — Kid says "No, I'm not interested" and the system ends the conversation and starts the lesson. **Fixed:** Code-level minimum 3 turns enforced regardless of LLM output.
3. **Max never asks questions** — Every Max response was a statement ending with a period. Kid has no idea what to say next, literally asks "What do you want me to say now?" **Fixed:** Prompt now requires turns 1-2 to end with a simple question (e.g., "Do you like pizza?").
4. **Name extraction fails silently** — When kid doesn't give a clear name, system calls them "Friend" and says "Your name is super fun!" **Fixed:** Re-asks once ("I didn't catch that — what should I call you?"), falls back to "Buddy" if still fails.

**What changed (code):**
- `src/config/prompts.ts` — `ONBOARDING_SYSTEM_PROMPT` → `getOnboardingSystemPrompt(turnNumber, studentName)` — turn-aware, question-enforcing
- `src/services/openrouter.ts` — `generateOnboardingResponse()` accepts `turnNumber`, name-aware fallbacks per turn, max_tokens 80→120
- `src/hooks/useVoiceInteraction.ts` — Multi-turn loop (max 4 LLM turns), name re-ask on failure, minimum 3 turns enforced
- `src/config/challenges.ts` — Warmer preScript with Spark humor, maxTurns 3→5

**Latest test (Feb 10 evening):** Current version is "decently okay" but still missing critical elements. See feedback below.

**Owner feedback — MUST address in next session (Feb 11):**
Claude has been repeatedly messing up the onboarding conversation design. Multiple failed iterations due to not thinking through what a real teacher would do. The current version works mechanically but is still missing the SOUL of the interaction:

1. **Learning outcomes are MISSING** — Max never tells the kid what they'll actually learn. Must include a fun, kid-friendly preview of learning outcomes: "We're gonna learn how to share pizza fairly, cut cakes into equal pieces, and figure out cool fraction puzzles!" NOT academic language. Make it sound like a game/adventure.
2. **Warm greeting should set the stage** — The whole point of onboarding is to make the kid feel excited about learning fractions. Every turn should nudge toward: "we're going to have fun while learning fractions." Don't just chat aimlessly.
3. **Conversation turn logic** — Max 5 total turns. Min 2-3 conversation turns. Once the child shows interest/engagement, start encouraging and smoothly transition into the lesson. Don't drag it out if the kid is eager, don't rush if the kid needs warming up.
4. **Name extraction still buggy** — Kid said "I don't know" and extractName returned "I" instead of triggering the re-ask (re-ask only fires when result is "Friend", not other garbage like "I").

### ✅ Onboarding Flow — 5-Beat Rewrite (Feb 11, 2026)

**Problem:** Previous onboarding was a multi-turn LLM loop that produced robotic, aimless conversations. No learning outcomes, name extraction returned garbage, LLM controlled flow.

**Solution:** Replaced with "Scripted Backbone, LLM Intelligence at the Joints" — 5-beat linear structure:

| Beat | What | Type |
|------|------|------|
| 1 | Grand Entrance (Max + Spark, no fraction reveal) | Scripted |
| 2 | Name Capture (hardened extractName) | Scripted + PTT |
| 3 | Adventure Hook (greet + learning outcomes + fun Q) | LLM + PTT |
| 4 | Bridge + Transition (acknowledge + transition) | LLM |
| 5 | Auto-advance to Node 1 | Auto |

**Key changes:**
- `extractName()` — Garbage detection: single letters, common words, numbers (40+ blocked words)
- `getAdventureHookPrompt()` — Replaces turn-based prompt. One job: greet + pitch fraction adventure + ask fun Q
- `getBridgeTransitionPrompt()` — Replaces turn-based prompt. One job: acknowledge + transition
- `generateAdventureHook()` / `generateBridgeTransition()` — Replace `generateOnboardingResponse()`. Plain text output (no JSON)
- `runOnboardingInteraction()` — Linear 5-beat flow, no while loop, exactly 2 LLM calls
- Beat 1 saves fraction reveal for Beat 3 (adventure framing: "You, me, and Spark are going on a fraction adventure!")
- Fallbacks pre-written per beat (not generic)

**Files modified:** `useVoiceInteraction.ts`, `prompts.ts`, `openrouter.ts`, `challenges.ts`
**Files updated:** `.context/conversation-design.md`, `.context/bugs-and-recurring-issues.md`

### ✅ MediaBox Layout Fix (Feb 11, 2026)

**Problem:** MediaBox.png was used as a CSS background with `background-size: 100% 100%`, stretching it to fill the container regardless of aspect ratio. Content positioning (`bottom: 32%`) was wrong — content bled into the panel zone. On different screen resolutions the image distorted and content didn't align with the screen borders.

**Solution:** Replaced background-image approach with an actual `<img>` element inside a wrapper div:
- `mediaBoxWrapper` sizes itself to the rendered image
- `mediaBoxImg` uses `max-width: 100%; max-height: 100vh` — scales to fit while preserving native 1408:1080 aspect ratio
- Content pane positioned with corrected percentages (`bottom: 36%`) relative to the wrapper (= image dimensions)
- Works correctly on any screen resolution without distortion

**Files modified:** `App.tsx` (wrapper + img element), `App.module.css` (new layout classes)

**Asset request sent to design team:** Separate assets (ScreenFrame.png, Panel.png, buttons) for long-term solution. Current single-image approach works but separate assets would be more flexible.

### Deployment (Feb 11, 2026)

- All Iteration 5 changes committed and pushed to both `main` and `staging` branches
- Netlify auto-deploys from `main`
- Env vars needed on Netlify: `VITE_DEEPGRAM_KEY`, `VITE_ANTHROPIC_KEY`, `VITE_ELEVENLABS_KEY`

### Dynamic Question Slides — Full Implementation (Feb 11, 2026)

**Goal:** Replace voice-only Q&A on empty screens with tap-based visual dynamic slides for all 8 post-challenge question nodes, then add voice-first correctness check.

**Phase 1: 3 Reusable Templates**
- **FractionBuilder** (Nodes 2, 10, 15): Tap pieces to count → fill fraction slots
- **MultipleChoice** (Nodes 6, 9, 16): Tap answer buttons, wrong → wobble + eliminate
- **TapToSelect** (Nodes 3, 17): Tap correct option from visual choices

**Files created:**
- `src/components/DynamicSlides/FractionBuilder/` (tsx + css)
- `src/components/DynamicSlides/MultipleChoice/` (tsx + css)
- `src/components/DynamicSlides/TapToSelect/` (tsx + css)
- `src/components/DynamicSlides/DynamicSlideRenderer.tsx`
- `src/config/dynamicSlideContent.ts` (per-node content configs)

**Files modified:** `types/index.ts`, `sessionStore.ts`, `useVoiceInteraction.ts`, `challenges.ts`, `App.tsx`

**Phase 2: Voice-First Check + Conversational Flow Polish**
- Added voice-first check to `runDynamicQuestionInteraction()`:
  1. Max speaks question → student answers verbally (PTT)
  2. Check against `correctnessFilter` regex
  3. **Path A (correct):** "That's right!" + quick auto-animation through frames
  4. **Path B (wrong):** "Good try! Let me help you figure this out." + tap scaffold
- Added per-choice MCQ hints (`choiceHints[]` on `MultipleChoiceConfig`) — each wrong button gives unique feedback instead of repeating the same hint
- Added tap instructions for all templates before scaffold ("Tap the answer you think is right!")
- Added timeout speech for all templates ("No worries! Let me show you.") — no more silent auto-reveals
- Added post-completion wrap-up after confetti ("Nice work! You're learning so fast.")
- Fixed hint bubble: only shows after a wrong tap (not always), updates per-choice, CSS overflow fixed

### Post-Iteration 5 — Feb 16, 2026

**Minion Moments (8 embedded):**
- 8 minionMoment fields embedded across regular nodes (1, 3, 7, 9, 11, 14, 17, 19)
- Spark speaks first → Max responds → Spark hides → normal flow continues
- Mix of silly jokes, misconception doubts, and hype moments

**Scaffold Quality Fixes:**
- Enriched preScripts for 14+ nodes (warm, contextual introductions replacing navigational placeholders)
- Enriched slideNarrations for 4 narration slides
- Fixed Node 3 correctness filter (was too broad: "same" matched false positives)
- LLM prompt enhancement: warmer tone, response variability, turn-awareness, natural scaffold delivery
- Removed dead code: generateResponse(), generateGreeting(), GREETING_PROMPT, GREETING_SYSTEM_PROMPT

**5 Learning Outcomes Restructuring:**
- Expanded from 3 LO groups to 5 LO groups
- 5 checkpoints (nodes 4, 8, 12, 15, 20) — one after each LO group
- LO1: Equal parts and first fraction names (nodes 1-3)
- LO2: Comparing fractions and naming the numerator (nodes 5, 7)
- LO3: Building bigger fractions (nodes 9-11)
- LO4: Fraction vocabulary — numerator and denominator (nodes 13-14)
- LO5: Applying fraction knowledge, error spotting, final review (nodes 16-19)

### Voice Differentiation + UX Polish (Feb 16, 2026)

**Problem:** QA testing revealed: (1) Max and Spark use the same Aria voice — Spark auditorily invisible, (2) Aria (young female) doesn't match Max's teen boy look, (3) some preScripts are wordy with filler, (4) 5s confetti wait is dead time, (5) identical wrap-up phrase after every dynamic question.

**Changes:**
- **Two distinct voices:** Max → Liam (young male, `TX3LPaxmHKxFdv7VOQHJ`), Spark keeps Aria (female, `9BWtsMINqrJLrRacOk9x`) with more animated settings
- `speakText()` now accepts `voice: 'max' | 'spark'` parameter (defaults to `'max'`)
- `speakAsSpark()` helper in useVoiceInteraction — used at all 4 minionLine call sites
- Tightened 6 wordy preScripts (nodes 1, 3, 5, 7, 8, 11) — cut filler, kept teaching content
- Confetti duration: 5000ms → 3000ms
- Rotating wrap-up phrases (5 variants, no consecutive repeats) replacing hardcoded "Nice work! You're learning so fast."

**Files modified:** `tts.ts`, `useVoiceInteraction.ts`, `challenges.ts`, `Confetti.tsx`

### UI Overhaul v2 — 3-Panel Layout (Feb 16-17, 2026)

**Branch:** `ui-overhaul-v2`

**Committed (48b2848):**
- 3-panel layout: top-panel (decorative header) + center-panel (content with frame border) + bottom-panel (NavBar)
- Animated sprite characters: Max (7 expressions × 60 frames each) + Spark (4 expressions × 60 frames)
- SpriteAnimator component with preloading, crossfade transitions, RAF-based animation loop
- TutorCharacter with portal entry animation (75 frames at 30fps = 2.5s)
- New assets in `/tutor-assets/new/`: main-bg.jpg, center-panel.png, center-panel-bg.jpg, top-panel.png, bottom-panel.png, tutor-sprites/, spark-sprites/, tutor-entry/
- `isTutorEntering` gating: portal must complete before voice interactions start
- Chat node separators in ChatHistory (visual dividers between learning nodes)

**Uncommitted CSS fix (Feb 17):**
- ✅ Center panel background overflow — added `overflow: hidden; border-radius: 12px` to `.centerPanel`, increased `.contentPane` border-radius to 12px. Prevents dotted grid (`center-panel-bg.jpg`) from bleeding past frame image corners.

**🔴 OPEN BUG: Character visibility during goofy/minion moments**
- Max and Spark characters disappear during goofy moments and minionMoment interactions
- Characters ARE visible during onboarding
- Sprites load successfully (200 status in Network tab, ~355kB each)
- Code logic verified correct: `tutorVisible=true` throughout, `showMinion=true` set properly, z-index hierarchy correct (characterArea=20 > sidebar=10 > rightSide=5)
- **Root cause unknown — needs DevTools Elements panel inspection.** Suspected CSS issue: stacking context, positioning, or clipping. NOT a logic bug.
- **Next step:** Right-click bottom-left during goofy moment → Inspect → check if characterArea/minionArea divs exist with non-zero dimensions

**Portal animation timing:** Verified correct, no changes needed. `isTutorEntering` properly gates all phase-transition effects.

### Tier 2: Micro-Conversations (Feb 17, 2026) ✅

**Goal:** Break 5 "dead zones" where students hear 5-8 consecutive AI speeches with zero input. Add LLM-powered single-turn micro-conversations to 8 passive nodes.

**Pattern:** Max asks (scripted TTS) → Student speaks (1 PTT) → LLM acknowledges (1 Haiku call, 60 tokens max) → flow continues. No loops, no follow-up questions.

**8 micro-conversations added:**

| Node | Type | Position | Dead Zone Fixed |
|------|------|----------|----------------|
| 1 (Slide: Why Fractions?) | curiosity | after_narration | DZ1 |
| 2 (Video: What are Fractions?) | personal | after_prescript | DZ1 |
| 6 (Goofy: Spark's Joke) | reaction | after_goofy | DZ2 |
| 9 (Slide: What are Fractions?) | recall | after_minion | DZ3 |
| 10 (Video: Bigger Fractions) | curiosity | after_prescript | DZ3 |
| 13 (Slide: Fraction Definition) | recall | after_narration | DZ4 |
| 14 (Slide: Numerator & Denominator) | personal | after_narration | DZ4 |
| 19 (Slide: Snapshot: More Parts) | curiosity | after_narration | DZ5 |

**Files modified:**
- `src/types/index.ts` — Added `MicroConversationType`, `MicroConversationPosition`, `MicroConversationConfig` types + `microConversation?` field on Challenge
- `src/config/prompts.ts` — Added `getMicroConversationPrompt()` with 4 type-specific instruction sets
- `src/services/openrouter.ts` — Added `generateMicroConversationResponse()` (60 token cap, 0.8 temp)
- `src/config/challenges.ts` — Added `microConversation` configs to 8 nodes
- `src/hooks/useVoiceInteraction.ts` — Added `runMicroConversation()` helper + 4 injection points (after_narration in slides, after_goofy in goofy, after_minion and after_prescript in pre-challenge)

**Result:** Every dead zone broken. Every zero-input node gets 1 PTT moment. Longest passive stretch drops from 8 speeches (~2 min) to 3 speeches (~20s). 8 additional Haiku calls per session.

### FTUE Onboarding Rewrite — 7-Beat Flow (Feb 17, 2026)

**Problem:** Old 5-beat onboarding lacked PTT training, gave Spark no interactive moment, didn't explain the interface, didn't preview learning outcomes.

**Solution:** 7-beat FTUE flow:

| Beat | What | PTT? | LLM? |
|------|------|------|------|
| 1 | Max warm self-intro | — | — |
| 2 | PTT training + FTUE pulsing hint on button | — | — |
| 3 | Student says name (PTT #1), hint disappears | YES | — |
| 4 | Max acknowledges name (LLM), Spark slides in | — | YES |
| 5 | Student talks to Spark (PTT #2) | YES | — |
| 6 | Spark responds with goofy LLM response | — | YES |
| 7 | Interface walkthrough + "Let's gooo!" → auto-advance | — | — |

**New prompts:** `getNameAcknowledgmentPrompt()` (1 sentence, 15 words), `getSparkGoofyResponsePrompt()` (silly robot persona, 20 words)
**New service functions:** `generateNameAcknowledgment()` (temp 0.8, 40 tokens), `generateSparkGoofyResponse()` (temp 0.9, 40 tokens)
**New UI state:** `showPTTHint` in sessionStore → pulsing ring + label on PTT button during Beat 2
**Dead code removed:** `getAdventureHookPrompt`, `getBridgeTransitionPrompt`, `generateAdventureHook`, `generateBridgeTransition`

**Files modified:** `prompts.ts`, `openrouter.ts`, `useVoiceInteraction.ts`, `challenges.ts`, `sessionStore.ts`, `NavBar.tsx`, `NavBar.module.css`, `App.tsx`
**Context files updated:** `conversation-design.md`, `progress.md`

### ⏳ Next Up

1. **🔴 Fix character visibility bug** — DevTools investigation during goofy/minion moments (see open bug above)
2. **UI asset replacement** — Waiting for new character animations, ScreenFrame.png, Panel.png from design team
3. **useVoiceInteraction.ts refactor** — Split 1,543-line file into per-flow modules
4. **Dead component cleanup** — Delete VideoPlayer, Waveform, VoiceInteraction, SlideViewer

### Dead Code Candidates

**Dead components (4 pairs — tsx + css module each):**
- `src/components/VideoPlayer.tsx` — replaced by YouTubePlayer
- `src/components/Waveform.tsx` — old audio visualization, unused
- `src/components/VoiceInteraction.tsx` — old voice UI, replaced by ChatPane + NavBar
- `src/components/SlideViewer.tsx` — superseded, App.tsx renders slides inline as `<img>`

**Dead exports:**
- `generateGreeting()` in `services/openrouter.ts` — unused, onboarding uses different functions
- `GREETING_PROMPT` in `config/prompts.ts` — never imported
- `config/goofyMoments.ts` (entire file) — goofy content lives inline in challenges.ts `goofyScript` fields
- `SessionState` interface in `types/index.ts:174–210` — stale duplicate, real one is in sessionStore.ts
- `lastTranscript`, `lastResponse`, `error`, `listenAndRespond` returned by useVoiceInteraction but never consumed by App.tsx
- `skipToChallenge()`, `clearChatMessages()` in sessionStore.ts — never called (debug panel removed)

**Dead CSS:**
- `.debug` panel styles in `App.module.css:103–143`

**Dead assets:**
- `public/fractions-module-content/content-context-docs/` — reference docs, not runtime assets
- `public/fractions-module-content/videos/` — empty directory
- Multiple `.DS_Store` files in public/ (add to .gitignore)

### Code Health Notes

- `useVoiceInteraction.ts` is 1,543 lines — largest file by far. Contains all 6 interaction flows (onboarding, pre-challenge, post-challenge, dynamic question, checkpoint, goofy). Could benefit from splitting into per-flow modules if it grows further.
- `openrouter.ts` retains legacy filename (was OpenRouter, now Anthropic direct). Low priority rename.
- Total codebase: ~6,275 lines of TS/TSX. Manageable.

### Deferred

- Flexible voice nodes (`skipPreVoice`/`skipPostVoice` flags)
- Correctness filter improvements
- Personalized quiz
- Platform build (Convex + Clerk, authoring GUI, analytics)
- Separate MediaBox assets (ScreenFrame, Panel, Buttons) from design team

See `.context/feature-wishlist.md` for detailed feature list.

**Last updated:** 2026-02-17

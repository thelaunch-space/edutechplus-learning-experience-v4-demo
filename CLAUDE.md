# Math Mate — AI Voice Companion for Grade 4 Math

## Quick Context

Math Mate is a voice-guided learning experience for Grade 4 fractions. An AI companion guides students through 20 nodes (onboarding + videos + applets + slides + checkpoints + goofy moments) with multi-turn Socratic conversations, evaluating understanding and scaffolding when students struggle. Built for EdutechPlus B2C mobile app — no teacher present.

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **State:** Zustand
- **STT:** Deepgram Nova-2 (REST API)
- **LLM:** Anthropic Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- **TTS:** ElevenLabs Aria (`eleven_turbo_v2_5`), browser TTS fallback

## Key Files

| File | Purpose |
|------|---------|
| `src/config/challenges.ts` | 20 node definitions (onboarding, videos, applets, slides, checkpoints, goofy) with questions, correctness filters, scaffolding |
| `src/config/prompts.ts` | LLM system prompts (Socratic evaluation) |
| `src/hooks/useVoiceInteraction.ts` | Voice interaction + PTT + multi-turn loop + slide interaction |
| `src/services/openrouter.ts` | Anthropic LLM service (Claude Haiku 4.5) — file retains legacy name |
| `src/services/deepgram.ts` | Speech-to-text service |
| `src/services/tts.ts` | Text-to-speech service |
| `src/store/sessionStore.ts` | Session state + conversation history (allMessages array) |
| `src/types/index.ts` | TypeScript type definitions (includes `'slide'` content type) |
| `src/App.tsx` | Main app with two-pane responsive layout, conditional chat visibility |
| `src/components/ChatMessage.tsx` | WhatsApp-style chat bubbles (green for user, white for assistant) |
| `src/components/ChatHistory.tsx` | Message list with auto-scroll, typing indicators |
| `src/components/ChatPane.tsx` | Chat UI integrating history + PTT button |
| `src/components/SlideViewer.tsx` | Full-screen slide renderer for narration/question slides |
| `src/components/YouTubePlayer.tsx` | YouTube embed with Skip button |
| `src/components/AppletContainer.tsx` | iframe wrapper for interactive applets |
| `src/components/FractionCompareSlide/` | Dynamic interactive slide for Node 4 (5-frame state machine with tap interactions) |
| `src/components/DynamicSlides/` | 3 reusable dynamic question slide templates: FractionBuilder, MultipleChoice, TapToSelect |
| `src/config/dynamicSlideContent.ts` | Content configs for all 8 dynamic question slides (per-node visual + text definitions) |
| `src/components/` | Other React components with CSS Modules |

## Context Files

| File | Read when... |
|------|-------------|
| `.context/prd.md` | You need product requirements, user persona, or architecture overview |
| `.context/progress.md` | You need iteration history or current project status |
| `.context/conversation-design.md` | You're touching voice/LLM logic, prompts, or challenge flow |
| `.context/feedback.md` | You need client feedback context or decision rationale |
| `.context/bugs-and-recurring-issues.md` | You're debugging or investigating unexpected behavior |
| `.context/feature-wishlist.md` | You need to know what's planned or deferred |
| `.context/learning-journey.md` | You need the complete content roadmap (20 nodes) and implementation status |
| `.context/framework-wip.md` | You need to understand what content teams control (client-friendly doc) |
| `.context/framework-technical.md` | You're building the scalable platform (schemas, architecture, migration) |
| `.context/iteration-5-requirements.md` | You're working on Iteration 5 features (UI overhaul, onboarding, expressions, checkpoints) |

## Dev Commands

```bash
npm install
npm run dev
```

Requires `.env` with: `VITE_DEEPGRAM_KEY`, `VITE_ANTHROPIC_KEY`, `VITE_ELEVENLABS_KEY`

## Code Style & Conventions

- CSS Modules (not Tailwind)
- Zustand for state management
- Fredoka + Nunito fonts (kid-friendly typography)
- **Iteration 5+:** Sci-fi/tech classroom theme (blue gradients, glowing borders, hexagonal patterns) replacing previous Candy-Land pastel theme
- Laptop-first design (students are on laptops, not mobile)

## Critical Rules

- **MUST** update relevant `.context/` files after any meaningful codebase change
- **MUST** read `.context/conversation-design.md` before touching voice/LLM logic
- **MUST** read `.context/bugs-and-recurring-issues.md` before debugging
- **MUST** ensure LLM responses are parsed as JSON (regex extraction from Anthropic plain-text responses)
- **MUST** keep LLM responses under 2 sentences for student-facing text
- **MUST** use AskUserQuestion tool for any product/requirements/design ambiguity — never guess or assume. For technical decisions (implementation approach, code architecture), use your own judgement. For anything the user/client cares about (UX, flow, wording, placement, feature scope), ask first.
- **MUST** read `.context/progress.md` "Next Up" section before starting new work — it tracks upcoming tasks and asset dependencies

## ⚠️ Start-of-Session Reminder

**Refactor `useVoiceInteraction.ts` first** — 1,543 lines, largest file by far. Contains all 6 interaction flows (onboarding, pre-challenge, post-challenge, dynamic question, checkpoint, goofy). Split into per-flow modules (e.g. `flows/onboarding.ts`, `flows/dynamicQuestion.ts`) before adding more features. Also delete 3 dead components: `VideoPlayer.tsx`, `Waveform.tsx`, `VoiceInteraction.tsx`.

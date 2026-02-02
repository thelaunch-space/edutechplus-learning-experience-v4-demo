# Math Mate — AI Voice Companion for Grade 4 Math

## Quick Context

Math Mate is a voice-guided learning experience for Grade 4 fractions. An AI companion guides students through 14 nodes (videos + applets + slides) with multi-turn Socratic conversations, evaluating understanding and scaffolding when students struggle. Built for EdutechPlus B2C mobile app — no teacher present.

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **State:** Zustand
- **STT:** Deepgram Nova-2 (WebSocket)
- **LLM:** OpenRouter GPT-4.1-nano (JSON response format)
- **TTS:** Deepgram Aura-2 (`aura-2-asteria-en`)

## Key Files

| File | Purpose |
|------|---------|
| `src/config/challenges.ts` | 14 challenge definitions (videos, applets, slides) with questions, correctness filters, scaffolding |
| `src/config/prompts.ts` | LLM system prompts (Socratic evaluation) |
| `src/hooks/useVoiceInteraction.ts` | Voice interaction + PTT + multi-turn loop + slide interaction |
| `src/services/openrouter.ts` | OpenRouter LLM service |
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
| `.context/learning-journey.md` | You need the complete content roadmap (14 nodes) and implementation status |

## Dev Commands

```bash
npm install
npm run dev
```

Requires `.env` with: `VITE_DEEPGRAM_API_KEY`, `VITE_OPENROUTER_API_KEY`

## Code Style & Conventions

- CSS Modules (not Tailwind)
- Zustand for state management
- Fredoka + Nunito fonts (kid-friendly typography)
- Playful, Candy-Land themed UI for grade 4 students
- Mobile-first responsive design

## Critical Rules

- **MUST** update relevant `.context/` files after any meaningful codebase change
- **MUST** read `.context/conversation-design.md` before touching voice/LLM logic
- **MUST** read `.context/bugs-and-recurring-issues.md` before debugging
- **MUST** use `response_format: { type: "json_object" }` for all OpenRouter calls
- **MUST** keep LLM responses under 2 sentences for student-facing text

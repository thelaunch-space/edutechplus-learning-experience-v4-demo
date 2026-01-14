# Math Mate: Voice-Guided Learning Experience

## Problem

EdutechPlus B2G math content (videos + applets) needs engagement layer for B2C mobile app. Grade 4 students must stay engaged for 20 minutes without a teacher.

## Solution

**Math Mate** - AI voice companion that guides students through 7 learning challenges with:
- Two-way voice interaction at content transitions
- Multi-turn Socratic teaching conversations
- Correctness evaluation with scaffolded follow-up if wrong
- Hold-to-talk (PTT) for natural conversation flow
- Playful, kid-friendly UI designed for grade 4 students

Inspired by Synthesis AI's scripted lessons, but with actual LLM-powered teaching intelligence.

---

## Current Status

**Iteration 1 (Complete):** Single-turn voice interaction, auto-progression. Worked, but felt like a traffic controller, not a tutor.

**Iteration 2 (Complete):** Multi-turn conversations with Socratic teaching depth.

Key features implemented:
- **Hold-to-Talk (PTT):** Press and hold to speak, release to send - like a walkie-talkie
- **Socratic Scaffolding:** Turn-aware teaching with probing questions, hints, and scaffolds
- **Structured LLM Response:** Returns `{ response, isCorrect, shouldEnd }` for conversation control
- **Conversation History:** Context preserved across turns for coherent dialogue
- **Playful UI:** Candy-Land theme with Fredoka + Nunito fonts, bouncy animations

---

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript, Zustand state management
- **STT:** Deepgram Nova-2
- **LLM:** OpenRouter GPT-4.1-nano (with JSON response format)
- **TTS:** Deepgram Aura (`aura-asteria-en`)

---

## Key Files

| Purpose | Location |
|---------|----------|
| Challenge definitions + scaffolding | `src/config/challenges.ts` |
| LLM prompts (Socratic evaluation) | `src/config/prompts.ts` |
| Voice interaction + PTT logic | `src/hooks/useVoiceInteraction.ts` |
| OpenRouter service | `src/services/openrouter.ts` |
| Session state + conversation history | `src/store/sessionStore.ts` |
| Type definitions | `src/types/index.ts` |

### UI Components (CSS Modules)

| Component | Style |
|-----------|-------|
| Global theme | `src/index.css` |
| Welcome screen | `src/components/WelcomeScreen.module.css` |
| Math Mate avatar | `src/components/MathMateAvatar.module.css` |
| Voice interaction + PTT | `src/components/VoiceInteraction.module.css` |
| Progress bar | `src/components/ProgressBar.module.css` |
| Completion screen | `src/components/CompletionScreen.module.css` |

---

## Conversation Flow

### Greeting Phase
1. Math Mate introduces itself, asks student's name
2. Student responds via PTT
3. Personalized welcome, transition to first challenge

### Per-Challenge Flow
1. **PRE_CHALLENGE:** Math Mate introduces the content
2. **IN_CHALLENGE:** Student watches video or uses applet (skip button available)
3. **POST_CHALLENGE:** Multi-turn Socratic conversation
   - Math Mate asks comprehension question
   - Student responds via PTT
   - If correct: celebrate and advance
   - If wrong: scaffolded teaching (probe → hint → scaffold → reveal)
   - Max 5 turns per challenge

### Socratic Scaffolding (per turn)
| Turn | Strategy | Example |
|------|----------|---------|
| 1 | Probe | "Hmm, what do you think the top number shows?" |
| 2 | Different angle | "Think about counting pieces - which number tells how many you have?" |
| 3 | Hint | "The top number starts with 'N' and means 'number of parts'..." |
| 4 | Strong scaffold | "The top number is the _____ator. Can you fill in the blank?" |
| 5 | Warm reveal | "It's called the numerator! It counts our pieces." |

---

## Running the App

```bash
npm install
npm run dev
```

Requires environment variables:
- `VITE_DEEPGRAM_API_KEY`
- `VITE_OPENROUTER_API_KEY`

---

## Historical Notes

### Bugs Fixed (Iteration 1)
- Duplicate greeting (preScript issue)
- App stuck after post-challenge (state update timing)
- Premature "Challenge done" (greeting prompt leak)

### Bugs Fixed (Iteration 2)
- LLM returning plain text instead of JSON (added `response_format`)
- Conversation not recognizing correct answers (added client-side backup check)
- Awkward 5-second recording wait (replaced with PTT)

---

*Last Updated: 2026-01-14*

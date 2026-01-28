# Product Requirements

## Problem

EdutechPlus has B2G math content (videos + applets) that needs an engagement layer for their B2C mobile app. Grade 4 students (ages 9-10, Indonesian, ESL) must stay engaged for 20 minutes without a teacher present.

## Solution

**Math Mate** — an AI voice companion that guides students through 7 learning challenges covering fractions. Inspired by Synthesis AI's scripted lessons, but with LLM-powered teaching intelligence.

Core capabilities:
- Two-way voice interaction at content transitions
- Multi-turn Socratic teaching conversations
- Correctness evaluation with scaffolded follow-up
- Hold-to-talk (PTT) for natural conversation
- Playful, kid-friendly UI (Candy-Land theme)

## User Persona

- Grade 4 student, age 9-10
- Indonesian, ESL (simple English required)
- Using mobile device (touch-first)
- No teacher present — Math Mate IS the teacher

## Success Criteria

- Student stays engaged for full 20-minute session (7 challenges)
- Demonstrates understanding through Socratic Q&A after each content piece
- Feels like talking to a tutor, not a traffic controller

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| State | Zustand |
| STT | Deepgram Nova-2 (WebSocket streaming) |
| LLM | OpenRouter GPT-4.1-nano (JSON response format) |
| TTS | Deepgram Aura (`aura-asteria-en`) |
| Styling | CSS Modules, Fredoka + Nunito fonts |

## Architecture

```
Student speaks → Deepgram STT → OpenRouter LLM → Deepgram TTS → Student hears
                                    ↑
                        challenges.ts config
                        (questions, filters, scaffolding)
```

Content is defined in `src/config/challenges.ts`. Each challenge bundles:
- Content asset (video/applet) with path/URL
- Pre-script (intro narration)
- Post-question + correctness filter + scaffolding hints
- Max turns (currently 5 for all)

## License

Proprietary — EdutechPlus

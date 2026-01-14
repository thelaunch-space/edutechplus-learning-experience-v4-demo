# Math Mate

AI-powered voice companion for Grade 4 fractions learning.

## Overview

Math Mate is a voice-guided learning experience that helps students learn fractions through interactive conversations. It combines educational videos and applets with an AI tutor that uses Socratic teaching methods.

## Features

- **Voice Interaction:** Hold-to-talk (PTT) for natural conversation
- **Socratic Teaching:** Multi-turn dialogues that guide students to answers
- **7 Learning Challenges:** Progressive fractions curriculum
- **Kid-Friendly UI:** Playful Candy-Land theme designed for ages 9-10
- **Mobile-First:** Fully responsive, optimized for touch devices

## Tech Stack

- React 18 + TypeScript + Vite
- Zustand (state management)
- Deepgram (speech-to-text + text-to-speech)
- OpenRouter (LLM for teaching conversations)
- CSS Modules with custom animations

## Getting Started

### Prerequisites

- Node.js 18+
- Deepgram API key
- OpenRouter API key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
VITE_DEEPGRAM_API_KEY=your_deepgram_key
VITE_OPENROUTER_API_KEY=your_openrouter_key
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components with CSS modules
│   ├── WelcomeScreen    # Start screen
│   ├── VoiceInteraction # PTT button and conversation UI
│   ├── MathMateAvatar   # Animated mascot
│   ├── VideoPlayer      # Educational video player
│   ├── AppletContainer  # Interactive applet iframe
│   ├── ProgressBar      # Quest-style progress tracker
│   └── CompletionScreen # Celebration screen
├── config/
│   ├── challenges.ts    # Challenge definitions + scaffolding
│   └── prompts.ts       # LLM system prompts
├── hooks/
│   └── useVoiceInteraction.ts  # Voice interaction logic
├── services/
│   ├── deepgram.ts      # Speech-to-text
│   ├── tts.ts           # Text-to-speech
│   └── openrouter.ts    # LLM API
├── store/
│   └── sessionStore.ts  # Zustand state
└── types/
    └── index.ts         # TypeScript types
```

## Learning Flow

1. **Welcome:** Student starts, Math Mate asks for name
2. **Per Challenge:**
   - Pre-challenge introduction
   - Watch video or use applet
   - Post-challenge conversation (Socratic Q&A)
3. **Completion:** Celebration with all 7 stars earned

## License

Proprietary - EdutechPlus

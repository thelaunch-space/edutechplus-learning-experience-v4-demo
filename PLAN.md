# EdutechPlus Math Mate MVP - Implementation Plan

## Overview
Build a voice-enabled Grade 4 fractions learning app with AI companion "Math Mate". 7 challenges (~20 min total) with voice interactions between each.

**Tech Stack:** React + Vite, Zustand, Deepgram (STT), OpenRouter (LLM - GPT-4.1 Nano), OpenAI (TTS)

**UI Style:** Simple but polished - clean layout, bright colors, professional progress indicators

---

## Phase 1: Project Setup & Core Shell

### 1.1 Initialize React + Vite
```bash
npm create vite@latest . -- --template react-ts
npm install zustand
```

### 1.2 Move Assets to Public Folder
- Copy `fractions-module-content/` to `public/fractions-module-content/`
- Videos and applets served statically

### 1.3 Create Core Components
| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app, phase-based routing |
| `src/store/sessionStore.ts` | Zustand store for all state |
| `src/config/challenges.ts` | 7 challenges with paths, pre/post scripts |
| `src/components/VideoPlayer.tsx` | HTML5 video with onEnded |
| `src/components/AppletContainer.tsx` | Iframe with postMessage listener |
| `src/components/ProgressBar.tsx` | Challenge progress indicator |

### 1.4 Challenge Flow State Machine
```
GREETING → PRE_CHALLENGE → IN_CHALLENGE → POST_CHALLENGE → (repeat) → COMPLETE
```

---

## Phase 2: Voice Infrastructure

### 2.1 Microphone Recording
- `src/hooks/useMicrophone.ts`
- Use `MediaRecorder` API
- Output: audio Blob (webm format)
- Handle iOS Safari quirks (user gesture required)

### 2.2 Deepgram STT Integration
- `src/services/deepgram.ts`
- POST audio blob to `https://api.deepgram.com/v1/listen`
- Returns transcript string
- Fallback on error: empty string, graceful continue

### 2.3 OpenAI TTS Integration
- `src/services/openai.ts`
- POST to `https://api.openai.com/v1/audio/speech`
- Voice: `nova` (friendly, energetic)
- Play via `Audio` element
- Fallback: skip TTS, show text

### 2.4 OpenRouter LLM Integration
- `src/services/openrouter.ts`
- Model: `openai/gpt-4.1-nano` (ultra-fast, very cheap)
- System prompt enforces:
  - Max 15 words
  - Simple English
  - Encouraging tone
  - End with "Challenge X done!"
- Fallback: "Great! Let's continue!"

---

## Phase 3: Voice Interaction Flow

### 3.1 Voice Interaction Hook
- `src/hooks/useVoiceInteraction.ts`
- Orchestrates: Speak → Listen → Transcribe → Generate → Speak

### 3.2 Interaction States
```typescript
type VoiceState =
  | 'IDLE'
  | 'MATH_MATE_SPEAKING'
  | 'WAITING_FOR_STUDENT'
  | 'STUDENT_RECORDING'
  | 'PROCESSING'
  | 'ERROR';
```

### 3.3 Voice UI Components
| Component | Shows |
|-----------|-------|
| `MathMateAvatar.tsx` | Animated character (simple SVG/image) |
| `SpeakingState.tsx` | "Math Mate is talking" with animation |
| `ListeningState.tsx` | Mic button, "Your turn!" |
| `ThinkingState.tsx` | Loading spinner |

---

## Phase 4: Integration & Polish

### 4.1 Challenge Sequence
| # | Type | Asset | Duration |
|---|------|-------|----------|
| 1 | Video | video-1.mp4 | 2.5 min |
| 2 | Applet | A1 Cut & Glue | 4 min |
| 3 | Applet | A2 Paper Cut | 2 min |
| 4 | Applet | A3 Cake Statement | 3 min |
| 5 | Video | video-2.mp4 | 1.9 min |
| 6 | Applet | A4 Cut & Glue 2 | 3 min |
| 7 | Video | video-3.mp4 | 30 sec |

### 4.2 Kid-Friendly UI
- Large touch targets (44px min)
- Colorful, playful colors
- Clear visual feedback
- Progress stars/badges

### 4.3 Error Handling
- All API calls wrapped with try/catch
- Graceful fallbacks (never block progression)
- Retry button for failed interactions
- Text input fallback if mic fails

---

## Key Implementation Details

### Environment Variables (`.env`)
```
VITE_DEEPGRAM_KEY=xxx
VITE_OPENAI_KEY=xxx
VITE_OPENROUTER_KEY=xxx
```

### Iframe Applet Communication
Applets already send `postMessage` with `{ type: 'ASSET_COMPLETE' }` on completion. Listen in AppletContainer:
```typescript
window.addEventListener('message', (e) => {
  if (e.data?.type === 'ASSET_COMPLETE') onComplete();
});
```

### LLM System Prompt (Math Mate)
```
You are Math Mate, an encouraging AI tutor for Grade 4 students.

RULES:
1. Max 15 words per response
2. Very simple English (second language learners)
3. Always positive and encouraging
4. End with "Challenge {n} done!" after each challenge
5. If unclear answer, gently encourage: "Good try!"

Context: [current challenge info]
Student Name: [name or "Friend"]
```

### Audio Unlock for iOS
First user tap unlocks AudioContext:
```typescript
const unlockAudio = () => {
  const ctx = new AudioContext();
  ctx.resume();
};
```

---

## File Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── VideoPlayer.tsx
│   ├── AppletContainer.tsx
│   ├── ProgressBar.tsx
│   ├── VoiceInteraction.tsx
│   └── MathMateAvatar.tsx
├── hooks/
│   ├── useMicrophone.ts
│   └── useVoiceInteraction.ts
├── services/
│   ├── deepgram.ts
│   ├── openai.ts
│   └── openrouter.ts
├── store/
│   └── sessionStore.ts
└── config/
    ├── challenges.ts
    └── prompts.ts
```

---

## Demo Features
- Quick reset button (hidden: triple-tap logo)
- Skip to any challenge (for demo convenience)
- Pre-loaded name option for faster walkthrough

---

## Gotchas to Handle
1. **Folder names have spaces** - URL-encode applet paths
2. **iOS audio** - requires user gesture to play
3. **Mic permissions** - request on first interaction, not on load
4. **Slow LLM** - show "thinking" animation
5. **API key exposure** - acceptable for demo, use .env

---

## Success Criteria
- [ ] All 7 challenges play in sequence
- [ ] Voice interaction works: speak → hear response
- [ ] Progress bar updates correctly
- [ ] Works on mobile (iPhone Safari tested)
- [ ] Graceful fallbacks on any error
- [ ] Total session ~20 minutes
- [ ] Demo reset works smoothly

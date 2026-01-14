# Implementation Plan: Iteration 2

**Goal:** Transform single-turn "traffic controller" into multi-turn "tutor" with depth of conversation.

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Recording | Auto 5-sec window | Tap-to-speak + 1.5s silence detection |
| Turns | 1 per node | Greeting: 3-4, Post-asset: 5-6 |
| Correctness | None | LLM evaluates, returns `{ response, isCorrect, shouldEnd }` |
| Latency | ~2 sec dead air | <1 sec (streaming STT/LLM/TTS) |
| Visuals | 3 dots | Waveform bars + mascot CSS animations |
| Skip | None | Skip button on videos/applets |

---

## Phase 1: Streaming Infrastructure

### 1.1 Deepgram STT → WebSocket
**File:** `src/services/deepgram.ts`

- Replace POST request with WebSocket connection
- Stream audio chunks as user speaks
- Use `is_final` event for final transcript
- Implement 1.5s silence detection to auto-stop

```typescript
const ws = new WebSocket('wss://api.deepgram.com/v1/listen', ['token', DEEPGRAM_API_KEY]);
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.is_final) {
    onFinalTranscript(data.channel.alternatives[0].transcript);
  }
};
```

### 1.2 OpenRouter LLM → Streaming
**File:** `src/services/openrouter.ts`

- Add `stream: true` to request body
- Process chunks with ReadableStream
- Parse structured JSON from streamed response

### 1.3 Deepgram TTS → Streaming
**File:** `src/services/tts.ts`

- Stream audio response
- Start playback when first chunk arrives
- Don't wait for full audio

---

## Phase 2: Core Turn Logic

### 2.1 State Changes
**File:** `src/store/sessionStore.ts`

Add:
```typescript
currentTurn: number           // 0, 1, 2...
maxTurns: number              // 5 for post-asset, 3 for greeting
turnHistory: TurnRecord[]     // { transcript, response, isCorrect }
conversationContext: Message[] // For LLM context
```

Actions:
```typescript
incrementTurn()
resetTurn()
addToTurnHistory(record)
addToConversationContext(message)
clearConversationContext()
```

### 2.2 Structured LLM Response
**File:** `src/services/openrouter.ts`

LLM must return JSON:
```json
{
  "response": "Great! So the top number is called...?",
  "isCorrect": false,
  "shouldEnd": false
}
```

Update system prompt to enforce JSON output.

### 2.3 Multi-Turn Loop
**File:** `src/hooks/useVoiceInteraction.ts`

New function: `runMultiTurnInteraction(type: 'greeting' | 'post-asset')`

```
Loop:
  1. Math Mate speaks (TTS)
  2. Wait for tap-to-speak
  3. Record until release/silence
  4. STT → LLM (with conversation history) → TTS
  5. Check: isCorrect OR shouldEnd OR turnCount >= maxTurns?
     - Yes → exit loop, advance
     - No → increment turn, continue loop
```

### 2.4 Correctness Filter
**File:** `src/config/challenges.ts`

Add to each challenge:
```typescript
postQuestion: "What do we call the top number in a fraction?",
correctnessFilter: "Says 'numerator'",
teachingHint: "The top number is the numerator - it tells how many pieces we have!",
maxTurns: 5
```

#### Challenge Questions & Correctness Filters

| # | Asset | Concept | Question | Correctness Filter | If Wrong, Teach... |
|---|-------|---------|----------|--------------------|--------------------|
| 1 | Video 1 - What are Fractions? | Fractions = parts of whole | "If a pizza is cut into 4 equal pieces, what do we call one piece?" | Says "one fourth" / "quarter" / "1/4" | "When we cut into 4 equal parts, each part is one-fourth!" |
| 2 | Applet A1 - Cut and Glue | Equal parts matter | "In a fraction, must all pieces be the same size or different sizes?" | Says "same" / "equal" | "For fractions, all pieces must be the same size - equal parts!" |
| 3 | Applet A2 - Fraction Patterns | Comparing fractions | "Which has MORE pieces - 1/4 or 1/6?" | Says "1/6" / "six" | "1/6 means 6 pieces, 1/4 means 4 pieces. 6 is more!" |
| 4 | Applet A3 - Cake Fractions | Vocabulary: numerator | "What do we call the top number in a fraction?" | Says "numerator" | "The top number is the numerator - it tells how many pieces we have!" |
| 5 | Video 2 - Bigger Fractions | Numerator can be > 1 | "In the fraction 2/4, what does the 2 mean?" | Says "two pieces" / "2 parts" / "how many we have" | "The 2 means we have 2 pieces out of 4 total!" |
| 6 | Applet A4 - Advanced Practice | Creating fractions | "If you colored 3 pieces out of 5, what fraction is that?" | Says "3/5" / "three fifths" | "3 out of 5 is written as 3/5. Top is what you have, bottom is total!" |
| 7 | Video 3 - Celebration | Review + closing | "Quick review! What's the bottom number called?" | Says "denominator" | "The bottom is the denominator - it shows total pieces!" |

### 2.5 System Prompts
**File:** `src/config/prompts.ts`

New prompt that:
- Evaluates student response against `correctnessFilter`
- Returns structured JSON
- Asks follow-up questions if incorrect
- Keeps responses under 20 words

---

## Phase 3: Tap-to-Speak + Visual Feedback

### 3.1 Tap-to-Speak Button
**File:** `src/components/VoiceInteraction.tsx`

- Replace auto-recording with button
- `onTouchStart` / `onMouseDown` → start recording
- `onTouchEnd` / `onMouseUp` → stop recording
- OR: silence detection stops automatically

### 3.2 Waveform Component
**File:** `src/components/Waveform.tsx` (NEW)

- 5-7 vertical bars
- Web Audio API `AnalyserNode` for frequency data
- Bars height = audio volume
- Only visible when recording

### 3.3 Mascot Animations
**File:** `src/components/MathMateAvatar.tsx`

CSS classes for states:
- `listening`: subtle pulse, eyes attentive
- `thinking`: gentle bounce, thinking expression
- `talking`: mouth animation, energetic

### 3.4 Turn Indicator
**File:** `src/components/VoiceInteraction.tsx`

Show: "Your turn!" / "Math Mate is thinking..."

---

## Phase 4: Skip + Polish

### 4.1 Skip Buttons
**Files:** `src/components/VideoPlayer.tsx`, `src/components/AppletContainer.tsx`

- Add "Skip →" button
- On click: call `onComplete()` to advance to post-challenge

### 4.2 Test All Scenarios

- Greeting: 3-4 turns, exits on confirmation
- Post-asset: answer wrong multiple times → follow-ups
- Post-asset: answer correct on turn 1 → immediate advance
- Max turns reached → graceful exit
- Skip button → advances correctly
- Latency under 1 second

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/services/deepgram.ts` | WebSocket STT, silence detection |
| `src/services/openrouter.ts` | Streaming, structured JSON, conversation history |
| `src/services/tts.ts` | Streaming playback |
| `src/store/sessionStore.ts` | Turn tracking, conversation context |
| `src/hooks/useVoiceInteraction.ts` | Multi-turn loop, tap-to-speak |
| `src/config/prompts.ts` | Evaluation prompt with JSON output |
| `src/config/challenges.ts` | `correctnessFilter`, `maxTurns` |
| `src/components/VoiceInteraction.tsx` | Tap button, turn indicator |
| `src/components/Waveform.tsx` | NEW - audio visualizer |
| `src/components/MathMateAvatar.tsx` | CSS animations |
| `src/components/VideoPlayer.tsx` | Skip button |
| `src/components/AppletContainer.tsx` | Skip button |

---

## Not in Scope (Deferred)

- Corrective slides / routing logic
- Tap-to-speak for on-demand doubts (outside structured conversation)
- Pre-asset multi-turn (keep simple intro)

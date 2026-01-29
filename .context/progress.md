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

## Iteration 3 (Complete)

**Goal:** Fix correctness filter failures, improve acknowledgement quality, and enhance introduction message.

**Delivered:**
- Enhanced introduction fallback message from "7 fun challenges" to "pizzas and cake"
- Strengthened LLM evaluation prompt with explicit acknowledgement examples
- Removed 30-word limit for better acknowledgement quality
- Added 1-second pause after correct answer acknowledgement before confetti
- Comprehensive correctness debugging logs (LLM decision + client-side regex + final verdict)

**Key improvements:**
- More engaging, kid-friendly language in greeting
- Clearer, more enthusiastic acknowledgements when students answer correctly
- Better timing/pacing for acknowledgements (pause before celebration)
- Enhanced debugging capability for future correctness filter issues

## Iteration 4 (Next — Pending)

**Client asks from Jan 23, 2026 feedback session:**

1. **Slides as new content type** — static visual content with AI narration
2. **Full-screen content mode** — content is the star; AI character enters/exits as needed
3. **Content team authoring control** — define WHERE voice nodes appear and WHAT AI says first (via `skipPreVoice`, `skipPostVoice` flags)
4. **Cost-conscious architecture** — scripted (TTS-only) vs AI-powered (LLM) nodes, so not every interaction needs an LLM call

See `.context/feedback.md` for full rationale and `.context/feature-wishlist.md` for detailed feature list.

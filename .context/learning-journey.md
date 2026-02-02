# Learning Journey - Fractions Module

## Complete Node Sequence (14 nodes)

| # | Type | Title | Description | Status |
|---|------|-------|-------------|--------|
| 1 | Slide | Why Fractions? | Motivation hook - sharing cake with friends | ✅ Implemented |
| 2 | Video | What are Fractions? | Intro to fractions using pizza/cake examples | ✅ Implemented |
| 3 | Applet | Cut and Glue Practice | Hands-on: cutting paper into equal parts (halves, quarters) | ✅ Implemented |
| 4 | Applet | Fraction Patterns | Visual comparison: 1/2, 1/4, 1/6 - which has more pieces? | ✅ Implemented + **Dynamic Slide** |
| 5 | Applet | Cake Fractions | Vocabulary lesson: numerator (top), denominator (bottom) | ✅ Implemented |
| 6 | Slide | What are Fractions? | Preview for Video 2 - cutting objects into equal parts | ✅ Implemented |
| 7 | Video | Bigger Fractions | Numerators > 1: examples like 2/4, 3/6 | ✅ Implemented |
| 8 | Applet | Advanced Practice | Create fractions with bigger numerators: 2/5, 3/5 | ✅ Implemented |
| 9 | Slide | Math Vault: Fraction Definition | Formal definition - fraction = part of whole, has 2 parts | ✅ Implemented |
| 10 | Slide | Numerator and Denominator | Visual breakdown of 1/4 with labeled parts | ✅ Implemented |
| 11 | Slide | Discover More Fractions | Quick check: "What fraction is 2 slices out of 6?" | ✅ Implemented |
| 12 | Video | You Did It! | Celebration + final review: "What's the bottom number called?" | ✅ Implemented |
| 13 | Slide | Math Trap: Find the Error | Diagnostic - spot mistake in 2/4 vs 2/6 bar diagrams | ✅ Implemented |
| 14 | Slide | Snapshot: More Parts | Final summary - fractions can show multiple parts (2/5, 3/5, 4/6) | ✅ Implemented |

## Node Type Definitions

- **Video**: YouTube embed or MP4, student watches passively, skip button available
- **Applet**: Interactive HTML activity, student completes task, skip button available
- **Slide**: Static image shown full-screen (right pane), AI narrates over it using side pane (left)
- **Conversation**: Voice interaction - AI speaks (TTS or LLM-based), student responds via PTT

## Voice Interaction Pattern

Each node (video/applet/slide) follows this pattern:
1. **Pre-node**: AI introduces the content (scripted TTS)
2. **Content consumption**: Student views/interacts with content
3. **Post-node**: AI asks comprehension question (multi-turn Socratic dialogue, up to 5 turns)

## Slide-Specific Behavior

- **Layout**: Right pane = slide image, Left pane = chat + AI
- **Pre-slide intro**: AI says "Let me show you something..." (scripted)
- **During slide**:
  - Content slides (1,2,9,10,14): AI narrates what's on slide (TTS)
  - Question slides (11,13): AI asks question, student responds (LLM-based Socratic dialogue)
- **Post-slide**: Move to next node (no additional Q&A for most slides)

## Implementation Notes

- Total journey: 14 nodes (all implemented as of 2026-01-29)
- Slide content type added with `slideUrl`, `slideNarration`, `isQuestionSlide` fields
- 7 slide images located in: `/public/fractions-module-content/slides/`
- SlideViewer component handles full-screen slide rendering
- Narration slides (nodes 1,6,9,10,14): Auto-advance after TTS narration
- Question slides (nodes 11,13): Multi-turn Socratic dialogue with confetti

## Dynamic Interactive Slide (Node 4)

Node 4 (Applet A2 - Fraction Patterns) has a special post-challenge interaction that uses an interactive dynamic slide instead of the standard voice-only post-challenge flow.

**Component:** `FractionCompareSlide`

**Question:** "Which has MORE pieces - 1/4 or 1/6?"

**5-Frame State Machine:**
1. `question` - Shows question text and fraction labels (1/4, 1/6)
2. `cut` - Shows empty rectangles with tap indicators; student taps to split
3. `highlight` - Shows split rectangles; student taps pieces to highlight them
4. `compare` - Shows piece counts (4 pieces, 6 pieces)
5. `celebration` - Shows answer banner with confetti

**Two Interaction Paths:**
- **Path A (Correct first try):** Student says "1/6" → Quick animated summary showing all frames automatically
- **Path B (Wrong answer):** Student gives wrong answer → Interactive scaffolding with tap-to-split, tap-to-highlight, then verbal "6 is bigger" question

**Key Features:**
- Voice-visual synchronization: Math Mate speaks while slide animates
- Tap interactions with 15-second auto-timeout fallback
- Uses `hasDynamicSlide: true` flag on Challenge type

**Last updated:** 2026-02-02

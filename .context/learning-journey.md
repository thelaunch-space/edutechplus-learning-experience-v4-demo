# Learning Journey - Fractions Module

## Complete Node Sequence (14 nodes)

| # | Type | Title | Description | Status |
|---|------|-------|-------------|--------|
| 1 | Slide | Why Fractions? | Motivation hook - sharing cake with friends | ⏳ Yet to be added |
| 2 | Video | What are Fractions? | Intro to fractions using pizza/cake examples | ✅ Implemented |
| 3 | Applet | Cut and Glue Practice | Hands-on: cutting paper into equal parts (halves, quarters) | ✅ Implemented |
| 4 | Applet | Fraction Patterns | Visual comparison: 1/2, 1/4, 1/6 - which has more pieces? | ✅ Implemented |
| 5 | Applet | Cake Fractions | Vocabulary lesson: numerator (top), denominator (bottom) | ✅ Implemented |
| 6 | Slide | What are Fractions? | Preview for Video 2 - cutting objects into equal parts | ⏳ Yet to be added |
| 7 | Video | Bigger Fractions | Numerators > 1: examples like 2/4, 3/6 | ✅ Implemented |
| 8 | Applet | Advanced Practice | Create fractions with bigger numerators: 2/5, 3/5 | ✅ Implemented |
| 9 | Slide | Math Vault: Fraction Definition | Formal definition - fraction = part of whole, has 2 parts | ⏳ Yet to be added |
| 10 | Slide | Numerator and Denominator | Visual breakdown of 1/4 with labeled parts | ⏳ Yet to be added |
| 11 | Slide | Discover More Fractions | Quick check: "What fraction is 2 slices out of 6?" | ⏳ Yet to be added |
| 12 | Video | You Did It! | Celebration + final review: "What's the bottom number called?" | ✅ Implemented |
| 13 | Slide | Math Trap: Find the Error | Diagnostic - spot mistake in 2/4 vs 2/6 bar diagrams | ⏳ Yet to be added |
| 14 | Slide | Snapshot: More Parts | Final summary - fractions can show multiple parts (2/5, 3/5, 4/6) | ⏳ Yet to be added |

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

- Total journey: 14 nodes (7 existing + 7 new slides)
- Slides 1,2,6,9,10,11,13,14 need to be added to `challenges.ts`
- New Challenge type: `'slide'` with `imageUrl` field
- Slide images located in: `/public/fractions-module-content/slides/`

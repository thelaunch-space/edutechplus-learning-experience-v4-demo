# Iteration 3 Feedback

**Date:** January 23, 2026

---

## Client Ask

1. **Add "slides"** as a new content type
2. **Full-screen content mode** - videos/applets should be immersive, AI character appears when needed and goes away when not
3. **Content team authoring control** - they want to define WHERE AI voice nodes appear and WHAT the AI says first
4. **Cost-conscious architecture** - support a mix of scripted (TTS-only) and AI-powered (LLM) nodes, so the client can demonstrate that this setup doesn't have to be expensive

---

## Rationale

**Why slides?**
Currently we have videos (passive watching) and applets (interactive). Slides fill the gap for static visual content that AI can narrate over - like a teacher talking through a diagram. This matches how their existing content is structured (they already have slide decks with teacher notes).

**Why full-screen + AI enters/exits?**
Right now the AI avatar and chat are always visible, making the content feel secondary. The client wants the content to be the star - when a student is watching a video or using an applet, that should be the full experience. The AI is a character that "walks on stage" to teach, then "walks off" so the student can focus on content. This creates clearer separation between "AI is talking to me" and "I'm consuming content."

**Why content team control over voice nodes?**
Current architecture forces a voice interaction before AND after every content piece. But sometimes you want two videos back-to-back without AI interruption. Or you want AI to do a checkpoint after 3 pieces of content, not after each one. The content team knows their pedagogical flow - they should decide where AI intervenes.

**Why cost-conscious architecture?**
The client wants to showcase to the world that this setup doesn't have to be expensive. The key insight: not every voice interaction needs an LLM call. For example, when showing a slide with narration, the content team can pre-script the narration text - we just run it through TTS (cheap) instead of generating it via LLM (expensive). AI (LLM) is only used where it adds value: Socratic teaching, responding to student answers, dynamic follow-ups. Everything else can be scripted.

This flexibility is a selling point: teachers can author and operate the content, and if cost is a concern, they can minimize AI usage by scripting more and using LLM only for interactive checkpoints. The architecture should support both scripted nodes (TTS only, no LLM) and AI-powered nodes (LLM generates responses based on student input).

---

## Current Architecture

In `challenges.ts`, each challenge bundles content + voice:
```
Challenge = content (video/applet) + preScript + postQuestion + scaffolding
```

The phase machine runs: `PRE_CHALLENGE → IN_CHALLENGE → POST_CHALLENGE` for every challenge.

**What's already good:**
- `preScript` and `postQuestion` are already authored by content team
- `scaffolding` controls AI follow-up behavior
- Adding a new content type is straightforward

**What's rigid:**
- Every content piece MUST have both PRE and POST voice
- No way to have content-only nodes or voice-only nodes

---

## Approach

**For slides:** Add `type: 'slide'` with an `imageUrl` field. Render as full-screen image. If there's a `preScript`, AI narrates it while slide is shown.

**For full-screen + AI character:** During `IN_CHALLENGE` phase, hide the chat pane and avatar, show only the content full-screen with a skip button. Add enter/exit animations when transitioning between phases.

**For flexible voice nodes:** Add optional flags to challenge config:
```typescript
{
  skipPreVoice?: boolean,   // skip the PRE_CHALLENGE voice
  skipPostVoice?: boolean,  // skip the POST_CHALLENGE voice
}
```

This lets content team control flow without restructuring the data model. Set `skipPostVoice: true` on a video if you want it to flow directly to the next content.

**For cost-conscious scripted vs AI nodes:** Distinguish between voice nodes that are purely scripted (just TTS the text) vs interactive (use LLM to evaluate/respond). Could be a flag like `interactive: boolean` on POST voice - if false, just speak the script and move on; if true, engage in Socratic back-and-forth with LLM.

**Future (content portal):** Eventually a GUI where content team drags/drops nodes. But for now, the config flags give them the control they need.

---

*Execution pending approval.*

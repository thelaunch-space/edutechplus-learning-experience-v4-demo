# Iteration 5 Feedback — Client Demo
**Date:** February 12, 2026
**Sources:** Written summary + voice transcript from in-person meeting (KG + Vinay + Nishant)

---

## Conversation & Pedagogy

### 1. Pre-content bridging — Set the stage with prerequisites, provoke curiosity

Don't reveal concepts — build curiosity. Pre-asset tutor talk currently gives away the punchline ("the top number can be more than 1") instead of being Socratic: "So far we've only seen numerators of 1... what happens if it's bigger? Let's find out."

Before each content asset, the tutor should:
- Reinforce prerequisite knowledge ("Now that you know what a half is...")
- Tease what's coming without spoiling it ("...why don't you watch this video which will teach you a lot more about halves and quarters?")
- Frame the activity with purpose ("There's one very important thing about fractions. Let's watch this video so you can be fair when giving out cake.")

### 2. Post-content bridging — Learning > Doing

After content, focus on what was LEARNED, not what was DONE. "You learned this by doing this. Your primary is learning, not doing." If space is tight, the "doing" summary can be skipped — the "learning" summary never should be.

Flow: Acknowledge what student did → Name what they learned → Connect to what's next. Not an abrupt jump into the next question.

### 3. Contextual injection — Teach, don't fill

Client compared current approach to ChatGPT voice mode — feels like an AI chatting, not a teacher teaching. Every tutor utterance must be pedagogically meaningful. When bridging between nodes, talk about the concept itself, reinforce what was just learned, connect to what's next. Not filler, not rushing.

### 4. Question quality — Shorter, academic, direct

Tighter questions. "What did you notice?" style. Current nudging questions are too English-heavy, not academic enough. The ChatGPT demo had better question patterns — short, directed, limited answer space.

### 5. Dialogue length — Concise but meaningful

Too much tutor dialogue is a problem. Needs to be concise but the student must understand what's happening. "Not too much dialogue, but I should be able to understand what is happening."

### 6. "Are you ready?" micro-prompts

Before major content assets (video, applet), a simple "You're about to do X. Are you ready?" gets engagement and creates a clean handoff. Just a click/yes to proceed.

### 7. Summary applet guidance — Walk through each click

For short/summary applets (like the fraction click applets), the tutor should guide through each click step-by-step, tracking and responding. Not just "do the applet" — walk them through it. Longer applets can be left for independent exploration.

---

## Flow & Handoffs

### 8. Handoff problem — Flow feels disconnected

The transitions between AI talking → content → AI talking feel like things are being thrown at the student. "I am not able to understand the flow. It just suddenly feels like something is being thrown at me. It's disconnected." This is the core problem — fixing conversations alone won't solve it without visual cues.

### 9. Visual cues for section transitions

Different tropes (summary, interaction, teaching moment, content playback) should have distinct visual treatments — background shifts, character repositioning, layout changes. Subconscious cues that register "something changed" even if the student doesn't think about it. Each trope gets its own visual identity.

### 10. Never-empty screen rule

The content area should ALWAYS show something relevant. Voice alone isn't enough — visuals must reinforce what's being heard. "Seeing that and the voice reinforcing it is much, much more stronger." When the tutor is summarizing or bridging, display supporting visuals — don't leave the screen blank.

---

## Character & UI

### 11. Tutor portal concept — Zap in/out, not always visible

The tutor character shouldn't be visible all the time — it takes too much space and feels static. New concept: Max "zaps" into a portal and disappears when video/applet content plays (full-screen immersion). When content ends and it's time to talk, Max zaps back out from the portal to converse. Conversation only happens when the tutor is visible. This frees up screen real estate for content and creates a clear visual distinction between "content mode" and "conversation mode."

### 12. Spark/minion underutilized

Spark was introduced in onboarding and then disappeared entirely. Client expected humor throughout ("shittiest dad jokes ever") but nothing happened after the intro. The character needs actual usage beyond the introduction — humor, interjections, personality moments.

### 13. Layout & space optimization

Character takes too much space. Speak button + next button should be compacted into a smaller area. More screen real estate for content. Consider moving character + controls to a compact corner. 16:9 frame for content is non-negotiable (all assets are in that aspect ratio) — the container is needed but can be optimized.

### 14. UI direction — Age it up

Current aesthetic is too childish. Direction: cleaner, more mature. Design team (Nishant) will provide updated assets. Background too busy, layout too boxy.

---

## Voice & Input

### 15. Voice — Not warm enough

TTS voice needs to feel more soothing for a kids' tutor.

### 16. Pacing — Dead air feels broken

Pauses while waiting for PTT feel like the app froze. Need to explore solutions for natural-feeling pauses/nudges.

### 17. Type input as voice fallback

Students should eventually be able to type when voice recognition frustrates them. "Sometimes it could get really frustrating when you're trying to talk, it doesn't understand... let me just type it."

---

## Technical & Architecture

### 18. Correctness filter bug — "same" false positive

"Same size" vs "same number" — client said "same number of pieces" and it matched because "same" was in the filter. Answer should have been "same size" / "equal." Needs tighter matching logic.

### 19. LLM minimization strategy

Most of the experience should be scripted/decision-tree based. LLM only for: (1) acknowledgment — first 2-3 words referencing what student said, (2) 1-2 open-ended moments per experience where student can say anything. Everything else is pointers/scripted branches. Cost-conscious by design.

### 20. Session length / checkpoint resume

25 minutes is a long experience for this age group. The 3 existing checkpoints can serve as "safe states" — student finishes up to a checkpoint, can leave, and resume from the next one. Consider optimizing for 15-minute sessions if 25 proves too long.

---

## Framework & Process

### 21. FTUE — Voice-driven onboarding with interaction training (HIGHEST PRIORITY)

Current onboarding is too shallow. Needs a proper first-time user experience:
- Voice-driven (not text being read off)
- Introduces the tutor as a character with warmth and depth
- Communicates learning outcomes
- Explicitly teaches PTT interaction — "Press and hold while you speak. Can you try that now?"
- Student practices PTT in a low-stakes moment
- Feels like a real conversation, not a script

### 22. Enrich pre/post scripts — Pedagogical, not navigational

The existing `preScript`/`postScript` in `challenges.ts` and `content-inputs/asset-contexts/` already define what each asset teaches. The problem is the scripts read like navigation ("Let's watch this video about fractions") instead of teaching ("You've learned about halves. There's one very important thing about fractions — let's watch this video to find out"). Enrich the existing content with academic/teaching language that sets the stage before and summarizes learning after. No new file structure needed — just better content in what's already there.

### 23. Iteration cadence — Every 2 days

Client wants meetings every 2 days for faster feedback loops. Prefers in-person. Goal: observable differences between each meeting.

---

*Last updated: 2026-02-16*

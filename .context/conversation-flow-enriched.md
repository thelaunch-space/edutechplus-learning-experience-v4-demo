# Full Conversation Flow — Enriched (Working Draft)

**Purpose:** Complete end-to-end experience showing every word the student hears and every interaction they do. Current vs. enriched scripts. Marks LLM vs. scripted.

**Legend:**
- **SCRIPTED** = TTS only, no LLM call
- **LLM** = Requires LLM call
- **PTT** = Student presses hold-to-talk
- **TAP** = Student taps on dynamic slide
- **AUTO** = Auto-advance, no student action

---

## Node 0: Onboarding — Meet Max & Spark
**Type:** `onboarding` | **LO:** — | **Duration:** ~90s

Already has 5-beat structure (see `conversation-design.md`). No changes needed for this pass — FTUE rewrite is a separate task.

| Beat | What happens | Type |
|------|-------------|------|
| 1 | Max + Spark grand entrance | SCRIPTED |
| 2 | "What's your name?" → student answers | SCRIPTED + PTT |
| 3 | Adventure hook (greet by name, pitch fractions, fun Q) | LLM + PTT |
| 4 | Acknowledge response, transition to lesson | LLM |
| 5 | Auto-advance to Node 1 | AUTO |

---

## Node 1: Why Fractions? (Motivation Slide)
**Type:** `slide` (narration) | **LO1** | **Duration:** ~1 min

### Pre-Asset (SCRIPTED)

**Current:**
> "Let me show you something fun!"

**Enriched:**
> "You know how sometimes you share food with friends? Like splitting a pizza or cutting a cake? Well, there's actually math behind fair sharing — and that's what we're learning today! Take a look at this."

### Content
Student sees motivation slide (friends sharing cake). Max narrates:

**Current slideNarration:**
> "Ever tried sharing a cake with friends? Let's see how sharing cake helps us understand halves, quarters, and more!"

**Enriched slideNarration:**
> "Look at these friends sharing a cake! When you share food equally, you're already using fractions — you just didn't know it yet! Today we'll learn how to talk about halves, quarters, and more."

### Post-Asset
None — narration slide, auto-advance.

---

## Node 2: What are Fractions? (Video 1)
**Type:** `video` | **LO1** | **Duration:** ~2.5 min

**What the video teaches:** Pizza cut into 4 equal slices. One slice = "one-fourth" / "a quarter." All parts MUST be equal.

### Pre-Asset (SCRIPTED)

**Current:**
> "Let's start our first challenge! Watch this video about fractions."

**Enriched:**
> "Now that you know fractions are about sharing, let's see it in action! In this video, you'll watch a pizza get sliced up — and you'll learn a really cool math name for each slice. Pay attention!"

### Content
Student watches YouTube video (2.5 min). Skip button available.

### Post-Asset — Voice-First Check + Dynamic Slide

**Question (SCRIPTED):** "You just learned that fractions have special names. If a pizza is cut into 4 equal slices, what is the fraction name for ONE slice?"

**Step 1 — Voice-first (PTT):**
Student answers verbally. Checked against filter: `one fourth|quarter|1/4|one-fourth|a fourth`

**If correct (LLM):**
> "Yes! That's right, [name]! One-fourth — or you can say a quarter!" → Quick auto-animation through FractionBuilder (pizza, 4 pieces, 1 highlighted) → Confetti

**If wrong → Step 2 — Dynamic Slide (FractionBuilder: pizza, 4 pieces, 1 highlighted):**

| Turn | Scaffold (SCRIPTED) | Student action |
|------|-----------|------|
| 1 | "Fractions have special names! When there are 4 equal pieces, what's the fraction name for just ONE piece?" | TAP pieces to count |
| 2 | "Think about the number FOUR. Each piece is called a 'fourth'. So what do we call ONE of them?" | TAP/PTT |
| 3 | "Think about it — one piece, out of four. Put those together!" | TAP/PTT |
| 4 | "It's one-fourth! Or you can say 'one quarter'. That's the special fraction name. Great job!" | AUTO-reveal |

### Bridge to Next (built into Node 3's preScript)

---

## Node 3: Cut and Glue Practice (Applet A1)
**Type:** `applet` | **LO1** | **Duration:** ~4 min

**What the applet teaches:** Virtual scissors to cut paper into equal parts. Hands-on practice that parts must be same size.

### Pre-Asset (SCRIPTED)

**Current:**
> "Now you'll cut paper into fractions! Use the scissors to make equal parts. Try it!"

**Enriched:**
> "In the video, you saw that a pizza needs to be cut into equal parts to make fractions. Now it's your turn! You've got scissors and paper — try cutting them into equal pieces. Here's the important part: every piece has to be the same size. Ready?"

### Content
Student uses applet — cutting, arranging pieces. Skip button available.

### Post-Asset — Voice-First Check + Dynamic Slide

**Question (SCRIPTED):** "When we make fractions, what do we need to remember about the size of the pieces?"

**Step 1 — Voice-first (PTT):**
Checked against filter: `same|equal|same size`
**NOTE: Correctness filter bug — "same" is too broad. "Same number" would false-match. Needs tightening to `equal|same size|equal size`.**

**If correct (LLM):**
> "That's right! The pieces must be equal — same size!" → Quick auto-animation through TapToSelect → Confetti

**If wrong → Step 2 — Dynamic Slide (TapToSelect: 2 chocolate bars, one equal, one unequal):**

| Turn | Scaffold (SCRIPTED) | Student action |
|------|-----------|------|
| 1 | "If you share a chocolate bar with your friend, would it be fair if one piece is big and one tiny?" | TAP correct bar |
| Wrong tap | "Hmm, look again! One kid gets a big piece and one gets tiny. Is that fair?" | TAP again |
| Correct tap | "Yes! All pieces are the SAME size!" | AUTO-reveal |

### Bridge to Next (built into Node 4's preScript)

---

## Node 4: Fraction Patterns (Applet A2)
**Type:** `applet` | **LO1** | **Duration:** ~2 min

**What the applet teaches:** Visual comparison of 1/2, 1/4, 1/6. More cuts = more pieces. Bigger denominator = more pieces.

### Pre-Asset (SCRIPTED)

**Current:**
> "Watch how fractions change from 1/2 to 1/4 to 1/6. Pay attention!"

**Enriched:**
> "You've been cutting things into equal parts — great job! But here's a question: what happens when you cut into MORE pieces? In this activity, you'll see one-half, one-fourth, and one-sixth side by side. Watch carefully and count the pieces!"

### Content
Student uses applet — comparing fraction visualizations. Skip button available.

### Post-Asset — Voice-First Check + FractionCompareSlide

**Question (SCRIPTED):** "Which has MORE pieces — one-fourth or one-sixth?"

**Step 1 — Voice-first (PTT):**
Checked against filter: `1/6|one sixth|six|1 6`

**If correct (LLM):**
> "That's right! One-sixth has more pieces!" → Quick auto-animation through 5-frame FractionCompareSlide → Confetti

**If wrong → Step 2 — FractionCompareSlide (5-frame state machine):**

| Frame | What happens | Student action |
|-------|-------------|------|
| 1: Question | Two rectangles shown, labels "1/4" and "1/6" | — |
| 2: Cut | "Tap to split them into pieces!" | TAP each rectangle (or 15s timeout) |
| 3: Highlight | Rectangles split. "Now tap to count the pieces!" | TAP pieces to highlight (or 15s timeout) |
| 4: Compare | Piece counts shown (4 vs 6). "Which number is bigger — 4 or 6?" | PTT |
| 5: Celebration | "1/6 has more pieces! 6 is more than 4!" | AUTO → Confetti |

---

## Node 5: Spark's Fraction Joke (Goofy Moment)
**Type:** `goofy` | **Duration:** ~30s

No preScript. Spark appears.

| Speaker | Line | Type |
|---------|------|------|
| Max | "Hey Spark, do you know what a fraction is?" | SCRIPTED |
| Spark | "I tried to eat 5/4 of a cake once... it didn't end well! My tummy hurt for DAYS!" | SCRIPTED |

Auto-advance. Spark hides.

---

## Node 6: Cake Fractions (Applet A3)
**Type:** `applet` | **LO1** | **Duration:** ~3 min

**What the applet teaches:** Fraction vocabulary through a cake story. Introduces "numerator" (top) and "denominator" (bottom).

### Pre-Asset (SCRIPTED)

**Current:**
> "Time to learn fraction words with a cake story. Watch closely!"

**Enriched:**
> "So far, you've been making fractions and comparing them — amazing! But did you know the top and bottom numbers in a fraction have special math names? In this cake activity, you'll discover what those names are. Pay close attention!"

### Content
Student uses applet — cake-based vocabulary exploration. Skip button available.

### Post-Asset — Voice-First Check + Dynamic Slide

**Question (SCRIPTED):** "What do we call the top number in a fraction?"

**Step 1 — Voice-first (PTT):**
Checked against filter: `numerator`

**If correct (LLM):**
> "Amazing! Numerator — that's exactly right!" → Quick auto-animation through MultipleChoice → Confetti

**If wrong → Step 2 — Dynamic Slide (MultipleChoice: 4 options with cake visual):**

Display: Fraction 3/4 with top number highlighted. Cake with 4 pieces, 3 shaded.

| Choice | If tapped |
|--------|-----------|
| **Numerator** | Correct! → "Numerator = counts pieces you HAVE" |
| Denominator | "That's the BOTTOM number! We want the top one." |
| Fraction | "Fraction is the whole thing! We need the name for just the top number." |
| Number | "Close, but there's a special math name for it. It starts with N..." |

Scaffold hint: "This number COUNTS your pieces. It starts with N..."

---

## Node 7: Checkpoint — Equal Parts & Fractions (LO1)
**Type:** `checkpoint` | **LO1** | **Duration:** ~2 min

**Reviews:** Equal parts, basic notation (1/4, 1/6), numerator concept.

### Pre-Asset (SCRIPTED)

**Current:**
> "Wow, you've learned a lot already! Let's see what you remember!"

**Enriched:**
> "What an adventure so far! You learned that fractions are about equal parts, you cut paper into halves and quarters, you compared one-fourth and one-sixth, and you even discovered what a numerator is. Let's see how much stuck!"

### Content — CheckpointSlide Visual
LO1 summary visual (pizza, 4 pieces, 1 highlighted). Expression: `celebration`.

### Question (LLM — uses `getCheckpointPrompt`)
"If you cut a pizza into 4 equal slices and eat 1, what fraction did you eat?"
Filter: `1/4|one fourth|one quarter|one-fourth`

| Turn | Scaffold |
|------|----------|
| 1 | "You ate 1 slice. There are 4 total. How do we write that as a fraction?" |
| 2 | "Remember, the piece you ate goes on top, total pieces on bottom." |
| 3 | "It's 1 over 4. What fraction is that?" |
| 4 | "One slice out of four — put those words together and you've got it!" |
| 5 | "It's 1/4 — one-fourth! You're doing amazing!" |

Confetti → auto-advance.

---

## Node 8: What are Fractions? (Preview Slide for Video 2)
**Type:** `slide` (narration) | **LO2** | **Duration:** ~1 min

### Pre-Asset (SCRIPTED)

**Current:**
> "Let me show you what's coming next!"

**Enriched:**
> "Great job on that checkpoint! Now, here's something interesting — so far, all our fractions had a one on top, like one-fourth or one-sixth. But what if the top number is bigger? Hmm... take a look at this!"

### Content
Student sees preview slide (objects cut into equal parts, fraction notation). Max narrates:

**Current slideNarration:**
> "Watch how cutting an object into equal parts shows a fraction and how to write it in math!"

**Enriched slideNarration:**
> "See how these objects are cut into equal parts? Each part is a fraction. And here's the exciting part — sometimes you take MORE than one piece! Let's see what that looks like."

### Post-Asset
None — narration slide, auto-advance.

---

## Node 9: Bigger Fractions (Video 2)
**Type:** `video` | **LO2** | **Duration:** ~1.9 min

**What the video teaches:** Fractions where numerator > 1. Examples: 2/4, 3/6. Top number tells how many pieces you HAVE.

### Pre-Asset (SCRIPTED)

**Current:**
> "Now we'll make fractions like 2/4 and 3/6. The top number can be more than 1!"

**Enriched (curiosity, don't reveal):**
> "So far, all our fractions had a one on top — one-fourth, one-sixth. But what happens when you take MORE than one piece? Watch this video to find out!"

### Content
Student watches YouTube video (1.9 min). Skip button available.

### Post-Asset — Voice-First Check + Dynamic Slide

**Question (SCRIPTED):** "Look at the fraction 2/4. What does the top number tell us?"

**Step 1 — Voice-first (PTT):**
Checked against filter: `two|2|two pieces|2 pieces|2 parts|two parts`

**If correct (LLM):**
> "Yes! The 2 means two pieces!" → Quick auto-animation through MultipleChoice → Confetti

**If wrong → Step 2 — Dynamic Slide (MultipleChoice: 4 options with bar visual):**

Display: Fraction 2/4 with numerator highlighted. Bar with 4 pieces, 2 shaded.

| Choice | If tapped |
|--------|-----------|
| **2 pieces** | Correct! → "2 pieces! The top number tells us how many pieces we have." |
| 2 cuts | "Cuts and pieces are different! Count the colored pieces instead." |
| 4 pieces | "4 is the bottom number — that's the total. Look at the top!" |
| Half | "Half is right in a way, but what does the number 2 actually tell us?" |

---

## Node 10: Advanced Practice (Applet A4)
**Type:** `applet` | **LO2** | **Duration:** ~3 min

**What the applet teaches:** Creating fractions with numerator > 1. Shade pieces, write fractions like 2/5, 3/5.

### Pre-Asset (SCRIPTED)

**Current:**
> "Now make fractions with bigger top numbers. Try 2/5 or 3/5!"

**Enriched:**
> "In the video, you saw fractions like two-fourths and three-sixths — the top number was bigger than one! Now it's your turn. You'll get to color pieces and write the fractions yourself. Let's see what you can create!"

### Content
Student uses applet — cutting, coloring, writing fractions. Skip button available.

### Post-Asset — Voice-First Check + Dynamic Slide

**Question (SCRIPTED):** "If you colored 3 pieces out of 5, what fraction is that?"

**Step 1 — Voice-first (PTT):**
Checked against filter: `3/5|three fifths|three-fifths|3 over 5|three over five`

**If correct (LLM):**
> "That's right! Three-fifths!" → Quick auto-animation through FractionBuilder → Confetti

**If wrong → Step 2 — Dynamic Slide (FractionBuilder: bar, 5 pieces, 3 highlighted):**

Student taps pieces to count (3 on top, 5 on bottom) → fraction builds visually → reveal.

| Turn | Scaffold |
|------|----------|
| 1 | "You colored 3 pieces. Total is 5 pieces. How do we write that?" |
| 2 | "Remember: colored pieces go on TOP, total pieces go on BOTTOM. What do you get?" |
| 3 | "It's 3 over 5. How do we write that as a fraction?" |
| 4 | "Three on top, five on bottom. Say the fraction!" |
| 5 | "It's 3/5! Three pieces out of five. Excellent effort!" |

---

## Node 11: Max's Fun Fact (Goofy Moment)
**Type:** `goofy` | **Duration:** ~30s

No preScript. Spark does NOT appear.

| Speaker | Line | Type |
|---------|------|------|
| Max | "Fun fact! Did you know that if you cut a pizza into a million pieces, each piece would be one-millionth? That's a LOT of tiny bites!" | SCRIPTED |

Auto-advance.

---

## Node 12: Math Vault — Fraction Definition (Slide)
**Type:** `slide` (narration) | **LO2** | **Duration:** ~1 min

### Pre-Asset (SCRIPTED)

**Current:**
> "Time to learn the official math definition!"

**Enriched:**
> "You've been making fractions, comparing them, and learning their parts. Now it's time to unlock the official math definition — straight from the Math Vault!"

### Content
Student sees formal fraction definition slide. Max narrates:

**Current slideNarration:**
> "A fraction is a number that represents a part of a whole. It has two parts: the numerator on top and the denominator on bottom!"

**Enriched slideNarration:**
> "Here's the official definition: a fraction is a number that shows a part of a whole. The top number is the numerator — it counts the pieces you have. The bottom number is the denominator — it shows how many equal pieces there are in total!"

### Post-Asset
None — narration slide, auto-advance.

---

## Node 13: Numerator and Denominator (Slide)
**Type:** `slide` (narration) | **LO2** | **Duration:** ~1 min

### Pre-Asset (SCRIPTED)

**Current:**
> "Let's break down the parts of a fraction!"

**Enriched:**
> "Let's take a closer look! Every fraction has two important parts — and you already know their names. Can you spot them?"

### Content
Student sees visual breakdown of 1/4 with labeled arrows. Max narrates:

**Current slideNarration:**
> "In one-fourth, the numerator is 1 — it shows how many parts we have. The denominator is 4 — it shows total equal parts!"

**Enriched slideNarration (unchanged — already clear):**
> "In one-fourth, the numerator is 1 — it shows how many parts we have. The denominator is 4 — it shows the total number of equal parts!"

### Post-Asset
None — narration slide, auto-advance.

---

## Node 14: Checkpoint — Bigger Fractions (LO2)
**Type:** `checkpoint` | **LO2** | **Duration:** ~2 min

**Reviews:** Numerators > 1, reading fractions, numerator/denominator roles.

### Pre-Asset (SCRIPTED)

**Current:**
> "You're becoming a fraction expert! Let's check what you know about bigger fractions!"

**Enriched:**
> "Amazing progress! You've learned that the top number can be bigger than one, you know what numerator and denominator mean, and you've built fractions like three-fifths. Time for another quick check!"

### Content — CheckpointSlide Visual
LO2 summary visual (fraction notation 3/5, 5 pieces, 3 highlighted). Expression: `celebration`.

### Question (LLM — uses `getCheckpointPrompt`)
"In the fraction 3/5, what does the 3 tell us?"
Filter: `three|3|three pieces|3 pieces|how many|parts we have`

| Turn | Scaffold |
|------|----------|
| 1 | "The top number in a fraction counts something. What does the 3 count?" |
| 2 | "Remember, the numerator tells us how many pieces we HAVE." |
| 3 | "The 3 means we have three..." |
| 4 | "Three pieces! The numerator 3 means we have 3 pieces." |
| 5 | "The 3 tells us we have 3 pieces out of 5! Great thinking!" |

Confetti → auto-advance.

---

## Node 15: Discover More Fractions (Question Slide)
**Type:** `slide` (question) | **LO3** | **Duration:** ~2 min

### Pre-Asset (SCRIPTED)

**Current:**
> "Let's test what you've learned!"

**Enriched:**
> "You've been doing brilliantly! Here's a picture of a pizza — look carefully and see if you can figure out the fraction."

### Content
Student sees slide (pizza with 6 slices, 2 highlighted).

### Post-Asset — Voice-First Check + Dynamic Slide

**Question (SCRIPTED):** "If you have 2 slices out of 6 total slices, what fraction is that?"

**Step 1 — Voice-first (PTT):**
Checked against filter: `2/6|two sixths|two-sixths|2 over 6|two over six`

**If correct (LLM):**
> "Yes! Two-sixths!" → Quick auto-animation through FractionBuilder → Confetti

**If wrong → Step 2 — Dynamic Slide (FractionBuilder: pizza, 6 pieces, 2 highlighted):**

Student taps pieces to count → fraction builds → reveal.

Scaffold follows same pattern as Node 2/10 FractionBuilder.

---

## Node 16: You Did It! (Celebration Video)
**Type:** `video` | **LO3** | **Duration:** ~30s

**What the video teaches:** Celebration + quick denominator reminder.

### Pre-Asset (SCRIPTED)

**Current:**
> "You've learned so much! Watch this final message!"

**Enriched:**
> "You're almost at the finish line! Before we wrap up, here's a little surprise. Watch this!"

### Content
Student watches celebration video (30s). Skip button available.

### Post-Asset — Voice-First Check + Dynamic Slide

**Question (SCRIPTED):** "Quick review! What's the bottom number called?"

**Step 1 — Voice-first (PTT):**
Checked against filter: `denominator`

**If correct (LLM):**
> "Yes! Denominator! You remembered!" → Quick auto-animation through MultipleChoice → Confetti

**If wrong → Step 2 — Dynamic Slide (MultipleChoice: 3 options with bar visual):**

Display: Fraction 3/4 with denominator highlighted.

| Choice | If tapped |
|--------|-----------|
| Numerator | "That's the TOP number! We want the bottom one." |
| **Denominator** | Correct! → "Denominator = total equal pieces" |
| Calculator | "Ha! Not a calculator — but good thinking! It starts with D..." |

---

## Node 17: Math Trap — Find the Error (Question Slide)
**Type:** `slide` (question) | **LO3** | **Duration:** ~2 min

### Pre-Asset (SCRIPTED)

**Current:**
> "Can you spot the mistake?"

**Enriched:**
> "Time to put on your detective hat! I'm going to show you two fraction diagrams, but one of them has a mistake hidden in it. Can you figure out which one is wrong?"

### Content
Student sees slide (two bar diagrams: 2/4 and 2/6, one is wrong).

### Post-Asset — Voice-First Check + Dynamic Slide

**Question (SCRIPTED):** "Look at the two bar diagrams. One shows 2/4 and one shows 2/6. Which diagram is wrong?"

**Step 1 — Voice-first (PTT):**
Checked against filter: `2/6|two sixths|second|bottom|six`

**If correct (LLM):**
> "Good eye! The 2/6 diagram is wrong!" → Quick auto-animation through TapToSelect → Confetti

**If wrong → Step 2 — Dynamic Slide (TapToSelect: 2 bars, tap the wrong one):**

| Option | If tapped |
|--------|-----------|
| 2/4 bar | "That one is actually correct! Count the pieces — they match. Try the other one!" |
| **2/6 bar** | "Good eye! This says 2/6 but only has 4 parts, not 6!" → Reveal |

---

## Node 18: Snapshot — More Parts (Final Slide)
**Type:** `slide` (narration) | **LO3** | **Duration:** ~1 min

### Pre-Asset (SCRIPTED)

**Current:**
> "Let's wrap up what we learned!"

**Enriched:**
> "You spotted that error like a real math detective! Now let's take one final look at everything you've learned about fractions."

### Content
Student sees summary slide (multiple fractions: 2/5, 3/5, 4/6). Max narrates:

**Current slideNarration:**
> "Remember, fractions can show multiple parts! Like 2/5, 3/5, or 4/6. You're a fraction expert now!"

**Enriched slideNarration:**
> "Look at all these fractions — two-fifths, three-fifths, four-sixths! The numerator can be any number, not just one. You've come so far — you really are a fraction expert now!"

### Post-Asset
None — narration slide, auto-advance.

---

## Node 19: Checkpoint — Fraction Master (LO3)
**Type:** `checkpoint` | **LO3** | **Duration:** ~2 min

**Reviews:** Applying fraction knowledge, identifying fractions, error spotting.

### Pre-Asset (SCRIPTED)

**Current:**
> "You've completed the whole journey! Let's celebrate what you've learned!"

**Enriched:**
> "What a journey! You started by sharing cake, learned about equal parts, discovered numerators and denominators, and even caught a sneaky math trap! One last challenge — and then you're officially a Fraction Master!"

### Content — CheckpointSlide Visual
LO3 summary visual (chocolate bar, 6 pieces, 2 highlighted). Expression: `celebration`.

### Question (LLM — uses `getCheckpointPrompt`)
"If you have a chocolate bar cut into 6 pieces and you eat 2, what fraction did you eat?"
Filter: `2/6|two sixths|two-sixths|2 over 6`

| Turn | Scaffold |
|------|----------|
| 1 | "You ate 2 pieces. Total is 6. What fraction is that?" |
| 2 | "Pieces you ate go on top. Total pieces on bottom." |
| 3 | "It's 2 over 6. How do we say that?" |
| 4 | "Two pieces out of six — put that together as a fraction!" |
| 5 | "It's 2/6 — two-sixths! You're a fraction master!" |

Confetti → CompletionScreen.

---

## Summary: LLM vs. Scripted

| What | Type | Count |
|------|------|-------|
| All preScripts | SCRIPTED | 16 |
| All slideNarrations | SCRIPTED | 5 |
| All goofyScripts | SCRIPTED | 2 |
| Post-question voice-first asks | SCRIPTED | 8 |
| Post-question scaffolding (wrong path) | SCRIPTED | 8 |
| Correct-answer acknowledgments | LLM | 8 |
| Checkpoint conversations | LLM | 3 |
| Onboarding Beats 3-4 | LLM | 2 |
| **Total LLM calls per session** | | **~13 max** |

Most of the experience is scripted. LLM is used for: (1) acknowledging correct answers warmly, (2) checkpoint review Q&A, (3) onboarding personalization.

---

*Working document — to be reviewed before implementing changes to challenges.ts*

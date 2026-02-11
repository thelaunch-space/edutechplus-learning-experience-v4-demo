import type { Challenge } from '../types';

export const challenges: Challenge[] = [
  // Node 0: Onboarding - Meet Max & Spark (5-Beat structure)
  {
    id: 'onboarding',
    number: 0,
    type: 'onboarding',
    path: '',
    title: 'Meet Max & Spark',
    duration: '1.5 min',
    preScript: "Hey there! I'm Max, and I LOVE solving puzzles! Oh — and see this little guy? That's Spark! He's my robot buddy. He thinks he's super smart... but honestly, he gets confused by the silliest things. You'll see!",
    postQuestion: "So, what's your name?",
    contextInfo: 'Onboarding warm-up conversation. No assessment.',
    maxTurns: 5,
  },
  // Slide 1: Why Fractions? (motivation hook)
  {
    id: 'slide-1',
    number: 1,
    type: 'slide',
    path: '',
    slideUrl: '/fractions-module-content/slides/slide-1-why-fractions.png',
    title: 'Why Fractions?',
    duration: '1 min',
    preScript: "Let me show you something fun!",
    slideNarration: "Ever tried sharing a cake with friends? Let's see how sharing cake helps us understand halves, quarters, and more!",
    postQuestion: '',
    contextInfo: 'Motivation slide showing why we learn fractions - sharing cake with friends.',
    correctnessFilter: '',
    scaffolding: {
      probe1: '',
      probe2: '',
      hint: '',
      scaffold: '',
      reveal: ''
    },
    maxTurns: 0,
    isQuestionSlide: false
  },
  // Video 1: What are Fractions?
  {
    id: 'video-1',
    number: 2,
    type: 'video',
    path: '/fractions-module-content/videos/video-1.mp4',
    youtubeId: 'kD3wbmePp_8',
    title: 'What are Fractions?',
    duration: '2.5 min',
    preScript: "Let's start our first challenge! Watch this video about fractions.",
    postQuestion: "If a pizza has 4 equal slices, what do we call ONE slice?",
    contextInfo: "This video teaches basic fraction concepts using pizza and cake examples. Kids learn that fractions are parts of a whole.",
    correctnessFilter: "one fourth|quarter|1/4|one-fourth|a fourth",
    scaffolding: {
      probe1: "Fractions have special names! When there are 4 equal pieces, what's the special name for just ONE piece?",
      probe2: "Think about the number FOUR. Each piece is called a 'fourth'. So what do we call ONE of them?",
      hint: "One piece out of four. The fraction name starts with 'one-f...'",
      scaffold: "The word is one-FOURTH. Can you say that?",
      reveal: "It's one-fourth! Or you can say 'one quarter'. That's the special fraction name. Great job!"
    },
    maxTurns: 5
  },
  // Applet A1: Cut and Glue Practice
  {
    id: 'applet-a1',
    number: 3,
    type: 'applet',
    path: '/fractions-module-content/applets/A1. M2-Fraction Cut and Glue Practice/index.html',
    title: 'Cut and Glue Practice',
    duration: '4 min',
    preScript: "Now you'll cut paper into fractions! Use the scissors to make equal parts. Try it!",
    postQuestion: "When we make fractions, what do we need to remember about the size of the pieces?",
    contextInfo: "Interactive paper cutting activity. Kids practice making equal parts (halves, quarters). They use virtual scissors and glue.",
    correctnessFilter: "same|equal|same size",
    scaffolding: {
      probe1: "If you share a chocolate bar with your friend, would it be fair if one piece is big and one tiny?",
      probe2: "When we share equally, what must be true about each piece?",
      hint: "For fair sharing, pieces must be what kind of size?",
      scaffold: "Think about the word 'same' - same size means equal!",
      reveal: "Same size! For fractions, all pieces must be equal - same size. Nice effort!"
    },
    maxTurns: 5
  },
  // Applet A2: Fraction Patterns
  {
    id: 'applet-a2',
    number: 4,
    type: 'applet',
    path: '/fractions-module-content/applets/A2.M2-Fraction Paper Cut Snapshot/index.html',
    title: 'Fraction Patterns',
    duration: '2 min',
    preScript: "Watch how fractions change from 1/2 to 1/4 to 1/6. Pay attention!",
    postQuestion: "Which has MORE pieces - 1/4 or 1/6?",
    contextInfo: "Visual comparison of fractions 1/2, 1/4, 1/6. Correct answer: 1/6 has more pieces (6 pieces vs 4 pieces).",
    correctnessFilter: "1/6|one sixth|six|1 6",
    scaffolding: {
      probe1: "If you cut a cake into 4 slices vs 6 slices, which way makes more pieces?",
      probe2: "Look at the bottom numbers - 4 and 6. Which number is bigger?",
      hint: "More cuts = more pieces. Does 1/4 or 1/6 have more cuts?",
      scaffold: "6 is bigger than 4. So which fraction has more pieces - 1/4 or 1/6?",
      reveal: "1/6 has more pieces! 6 is more than 4. Good thinking!"
    },
    maxTurns: 5,
    hasDynamicSlide: true  // Uses interactive FractionCompareSlide for post-challenge
  },
  // Goofy Moment 1: Spark's Fraction Joke
  {
    id: 'goofy-1',
    number: 5,
    type: 'goofy',
    path: '',
    title: 'Spark\'s Fraction Joke',
    duration: '30 sec',
    preScript: '',
    postQuestion: '',
    contextInfo: 'Fun break - goofy moment with Spark.',
    maxTurns: 0,
    goofyScript: {
      tutorLine: "Hey Spark, do you know what a fraction is?",
      minionLine: "I tried to eat 5/4 of a cake once... it didn't end well! My tummy hurt for DAYS!",
      showMinion: true,
    },
  },
  // Applet A3: Cake Fractions
  {
    id: 'applet-a3',
    number: 6,
    type: 'applet',
    path: '/fractions-module-content/applets/A3. M2-Fraction Statement Cake Snapshot/index.html',
    title: 'Cake Fractions',
    duration: '3 min',
    preScript: "Time to learn fraction words with a cake story. Watch closely!",
    postQuestion: "What do we call the top number in a fraction?",
    contextInfo: "Cake-based vocabulary lesson. Teaches: equal parts (same size pieces), numerator (top number), denominator (bottom number).",
    correctnessFilter: "numerator",
    scaffolding: {
      probe1: "In 3/4, the 3 is on top. It counts how many pieces you have. What's its special name?",
      probe2: "The top number has a fancy math name. It starts with 'N'...",
      hint: "It rhymes with 'later' and starts with 'numer'...",
      scaffold: "Say it with me: numer-AY-tor. What's the word?",
      reveal: "It's the numerator! The top number that counts your pieces. Great job trying!"
    },
    maxTurns: 5
  },
  // Checkpoint LO1: Equal Parts & Fractions
  {
    id: 'checkpoint-lo1',
    number: 7,
    type: 'checkpoint',
    path: '',
    title: 'Checkpoint: Equal Parts & Fractions',
    duration: '2 min',
    preScript: "Wow, you've learned a lot already! Let's see what you remember!",
    postQuestion: "If you cut a pizza into 4 equal slices and eat 1, what fraction did you eat?",
    contextInfo: 'Checkpoint reviewing LO1: equal parts, basic fraction notation (1/2, 1/4, 1/6), numerator concept.',
    isCheckpoint: true,
    checkpointLO: 'LO1: Understanding equal parts and basic fraction notation',
    checkpointId: 'lo1',
    maxTurns: 4,
    correctnessFilter: '1/4|one fourth|one quarter|one-fourth',
    scaffolding: {
      probe1: "You ate 1 slice. There are 4 total. How do we write that as a fraction?",
      probe2: "Remember, the piece you ate goes on top, total pieces on bottom.",
      hint: "It's 1 over 4. What fraction is that?",
      scaffold: "One slice out of four. Say it: one-fourth!",
      reveal: "It's 1/4 — one-fourth! You're doing amazing!"
    },
  },
  // Slide 2: What are Fractions? (preview for Video 2)
  {
    id: 'slide-2',
    number: 8,
    type: 'slide',
    path: '',
    slideUrl: '/fractions-module-content/slides/slide-2-what-are-fractions.png',
    title: 'What are Fractions?',
    duration: '1 min',
    preScript: "Let me show you what's coming next!",
    slideNarration: "Watch how cutting an object into equal parts shows a fraction and how to write it in math!",
    postQuestion: '',
    contextInfo: 'Preview slide for Video 2 - introduces cutting objects into equal parts.',
    correctnessFilter: '',
    scaffolding: {
      probe1: '',
      probe2: '',
      hint: '',
      scaffold: '',
      reveal: ''
    },
    maxTurns: 0,
    isQuestionSlide: false
  },
  // Video 2: Bigger Fractions
  {
    id: 'video-2',
    number: 9,
    type: 'video',
    path: '/fractions-module-content/videos/video-2.mp4',
    youtubeId: 'pag3P1l3Tdk',
    title: 'Bigger Fractions',
    duration: '1.9 min',
    preScript: "Now we'll make fractions like 2/4 and 3/6. The top number can be more than 1!",
    postQuestion: "Look at the fraction 2/4. What does the top number tell us?",
    contextInfo: "Advanced concept: numerators greater than 1. Examples: 2/4 (two quarters), 3/6 (three sixths).",
    correctnessFilter: "two|2|two pieces|2 pieces|2 parts|two parts",
    scaffolding: {
      probe1: "Look at 2/4. The top number is 2. What does that 2 tell us?",
      probe2: "If the top number is 2, how many pieces do you have?",
      hint: "The answer is the same as the top number...",
      scaffold: "The top number is 2. How many pieces is that?",
      reveal: "Two pieces! The 2 on top means you have 2 pieces. Well done!"
    },
    maxTurns: 5
  },
  // Applet A4: Advanced Practice
  {
    id: 'applet-a4',
    number: 10,
    type: 'applet',
    path: '/fractions-module-content/applets/A4.M2-Fraction Cut and Glue Practice 2/index.html',
    title: 'Advanced Practice',
    duration: '3 min',
    preScript: "Now make fractions with bigger top numbers. Try 2/5 or 3/5!",
    postQuestion: "If you colored 3 pieces out of 5, what fraction is that?",
    contextInfo: "Advanced cutting practice. Kids create fractions like 2/5, 3/5. They should say both numerator and denominator.",
    correctnessFilter: "3/5|three fifths|three-fifths|3 over 5|three over five",
    scaffolding: {
      probe1: "You colored 3 pieces. Total is 5 pieces. How do we write that?",
      probe2: "Remember: colored pieces go on TOP, total pieces go on BOTTOM. What do you get?",
      hint: "It's 3 over 5. How do we write that as a fraction?",
      scaffold: "Three on top, five on bottom. Say the fraction!",
      reveal: "It's 3/5! Three pieces out of five. Excellent effort!"
    },
    maxTurns: 5
  },
  // Goofy Moment 2: Max's Fun Fact
  {
    id: 'goofy-2',
    number: 11,
    type: 'goofy',
    path: '',
    title: 'Max\'s Fun Fact',
    duration: '30 sec',
    preScript: '',
    postQuestion: '',
    contextInfo: 'Fun break - goofy moment.',
    maxTurns: 0,
    goofyScript: {
      tutorLine: "Fun fact! Did you know that if you cut a pizza into a million pieces, each piece would be one-millionth? That's a LOT of tiny bites!",
      showMinion: false,
    },
  },
  // Slide 3: Math Vault - Fraction Definition
  {
    id: 'slide-3',
    number: 12,
    type: 'slide',
    path: '',
    slideUrl: '/fractions-module-content/slides/slide-3-math-vault-fraction-definition.png',
    title: 'Math Vault: Fraction Definition',
    duration: '1 min',
    preScript: "Time to learn the official math definition!",
    slideNarration: "A fraction is a number that represents a part of a whole. It has two parts: the numerator on top and the denominator on bottom!",
    postQuestion: '',
    contextInfo: 'Formal definition of fractions with numerator and denominator introduction.',
    correctnessFilter: '',
    scaffolding: {
      probe1: '',
      probe2: '',
      hint: '',
      scaffold: '',
      reveal: ''
    },
    maxTurns: 0,
    isQuestionSlide: false
  },
  // Slide 4: Numerator and Denominator
  {
    id: 'slide-4',
    number: 13,
    type: 'slide',
    path: '',
    slideUrl: '/fractions-module-content/slides/slide-4-numerator-and-denominator.png',
    title: 'Numerator and Denominator',
    duration: '1 min',
    preScript: "Let's break down the parts of a fraction!",
    slideNarration: "In one-fourth, the numerator is 1 - it shows how many parts we have. The denominator is 4 - it shows total equal parts!",
    postQuestion: '',
    contextInfo: 'Visual breakdown of 1/4 showing numerator (top) and denominator (bottom).',
    correctnessFilter: '',
    scaffolding: {
      probe1: '',
      probe2: '',
      hint: '',
      scaffold: '',
      reveal: ''
    },
    maxTurns: 0,
    isQuestionSlide: false
  },
  // Checkpoint LO2: Bigger Fractions
  {
    id: 'checkpoint-lo2',
    number: 14,
    type: 'checkpoint',
    path: '',
    title: 'Checkpoint: Bigger Fractions',
    duration: '2 min',
    preScript: "You're becoming a fraction expert! Let's check what you know about bigger fractions!",
    postQuestion: "In the fraction 3/5, what does the 3 tell us?",
    contextInfo: 'Checkpoint reviewing LO2: numerators greater than 1, reading fractions, numerator/denominator roles.',
    isCheckpoint: true,
    checkpointLO: 'LO2: Understanding bigger fractions and numerator/denominator',
    checkpointId: 'lo2',
    maxTurns: 4,
    correctnessFilter: 'three|3|three pieces|3 pieces|how many|parts we have',
    scaffolding: {
      probe1: "The top number in a fraction counts something. What does the 3 count?",
      probe2: "Remember, the numerator tells us how many pieces we HAVE.",
      hint: "The 3 means we have three...",
      scaffold: "Three pieces! The numerator 3 means we have 3 pieces.",
      reveal: "The 3 tells us we have 3 pieces out of 5! Great thinking!"
    },
  },
  // Slide 5: Discover More Fractions (question slide)
  {
    id: 'slide-5',
    number: 15,
    type: 'slide',
    path: '',
    slideUrl: '/fractions-module-content/slides/slide-5-discover-more-fractions.png',
    title: 'Discover More Fractions',
    duration: '2 min',
    preScript: "Let's test what you've learned!",
    postQuestion: "If you have 2 slices out of 6 total slices, what fraction is that?",
    contextInfo: 'Quick check question - student should identify 2/6 as the fraction.',
    correctnessFilter: "2/6|two sixths|two-sixths|2 over 6|two over six",
    scaffolding: {
      probe1: "You have 2 slices. There are 6 total. Which number goes on top?",
      probe2: "The pieces you have go on top. The total goes on bottom. What do you get?",
      hint: "It's 2 over 6. How do we write that as a fraction?",
      scaffold: "Two on top, six on bottom. Say the fraction!",
      reveal: "It's 2/6! Two slices out of six. Great job!"
    },
    maxTurns: 5,
    isQuestionSlide: true
  },
  // Video 3: You Did It!
  {
    id: 'video-3',
    number: 16,
    type: 'video',
    path: '/fractions-module-content/videos/video-3.mp4',
    youtubeId: '6M7MIfeL7ak',
    title: 'You Did It!',
    duration: '30 sec',
    preScript: "You've learned so much! Watch this final message!",
    postQuestion: "Quick review! What's the bottom number called?",
    contextInfo: "Celebration video. End of session. Kid should feel accomplished and proud.",
    correctnessFilter: "denominator",
    scaffolding: {
      probe1: "In 3/4, the 4 is on the bottom. It shows total pieces. What's its name?",
      probe2: "The bottom number has a name that starts with 'D'...",
      hint: "It sounds like 'de-NOM-in-ator'...",
      scaffold: "Say it with me: de-NOM-in-ator. What's the word?",
      reveal: "It's the denominator! The bottom number showing total pieces. Amazing work today!"
    },
    maxTurns: 5
  },
  // Slide 6: Math Trap - Find the Error (question slide)
  {
    id: 'slide-6',
    number: 17,
    type: 'slide',
    path: '',
    slideUrl: '/fractions-module-content/slides/slide-6-math-trap-find-the-error.png',
    title: 'Math Trap: Find the Error',
    duration: '2 min',
    preScript: "Can you spot the mistake?",
    postQuestion: "Look at the two bar diagrams. One shows 2/4 and one shows 2/6. Which diagram is wrong?",
    contextInfo: 'Diagnostic slide - student should identify the incorrect fraction diagram.',
    correctnessFilter: "2/6|two sixths|second|bottom|six",
    scaffolding: {
      probe1: "Count the shaded parts in each diagram. Do they match the fractions written?",
      probe2: "Look carefully - does 2/6 really have 2 out of 6 parts shaded?",
      hint: "Check the bottom diagram. How many total parts does it show?",
      scaffold: "The 2/6 diagram should have 6 total parts. Does it?",
      reveal: "The 2/6 diagram is wrong! It doesn't show 6 equal parts. Good thinking!"
    },
    maxTurns: 5,
    isQuestionSlide: true
  },
  // Slide 7: Snapshot - More Parts
  {
    id: 'slide-7',
    number: 18,
    type: 'slide',
    path: '',
    slideUrl: '/fractions-module-content/slides/slide-7-snapshot-more-parts.png',
    title: 'Snapshot: More Parts',
    duration: '1 min',
    preScript: "Let's wrap up what we learned!",
    slideNarration: "Remember, fractions can show multiple parts! Like 2/5, 3/5, or 4/6. You're a fraction expert now!",
    postQuestion: '',
    contextInfo: 'Final summary slide - fractions can have numerators greater than 1.',
    correctnessFilter: '',
    scaffolding: {
      probe1: '',
      probe2: '',
      hint: '',
      scaffold: '',
      reveal: ''
    },
    maxTurns: 0,
    isQuestionSlide: false
  },
  // Checkpoint LO3: Fraction Master
  {
    id: 'checkpoint-lo3',
    number: 19,
    type: 'checkpoint',
    path: '',
    title: 'Checkpoint: Fraction Master',
    duration: '2 min',
    preScript: "You've completed the whole journey! Let's celebrate what you've learned!",
    postQuestion: "If you have a chocolate bar cut into 6 pieces and you eat 2, what fraction did you eat?",
    contextInfo: 'Final checkpoint reviewing LO3: applying fraction knowledge, identifying fractions, spotting errors.',
    isCheckpoint: true,
    checkpointLO: 'LO3: Applying fraction knowledge',
    checkpointId: 'lo3',
    maxTurns: 4,
    correctnessFilter: '2/6|two sixths|two-sixths|2 over 6',
    scaffolding: {
      probe1: "You ate 2 pieces. Total is 6. What fraction is that?",
      probe2: "Pieces you ate go on top. Total pieces on bottom.",
      hint: "It's 2 over 6. How do we say that?",
      scaffold: "Two-sixths! Can you say that?",
      reveal: "It's 2/6 — two-sixths! You're a fraction master!"
    },
  },
];

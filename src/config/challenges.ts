import { Challenge } from '../types';

export const challenges: Challenge[] = [
  {
    id: 'video-1',
    number: 1,
    type: 'video',
    path: '/fractions-module-content/videos/video-1.mp4',
    title: 'What are Fractions?',
    duration: '2.5 min',
    preScript: "Let's start our first challenge! Watch this video about fractions.",
    postQuestion: "If a pizza has 4 equal slices, what do we call ONE slice? Say one-fourth or one quarter!",
    contextInfo: "This video teaches basic fraction concepts using pizza and cake examples. Kids learn that fractions are parts of a whole.",
    correctnessFilter: "one fourth|quarter|1/4|one-fourth|a fourth",
    scaffolding: {
      probe1: "Think about sharing a pizza. If you cut it into 4 equal parts and take ONE, how much is that?",
      probe2: "When we divide something into 4 parts, each part has a special name. Any guess?",
      hint: "Four equal parts... each part is one-????",
      scaffold: "It starts with 'fourth' - one-f___th!",
      reveal: "It's one-fourth! When we have 4 equal parts, each is one-fourth. Great trying!"
    },
    maxTurns: 5
  },
  {
    id: 'applet-a1',
    number: 2,
    type: 'applet',
    path: '/fractions-module-content/applets/A1. M2-Fraction Cut and Glue Practice/index.html',
    title: 'Cut and Glue Practice',
    duration: '4 min',
    preScript: "Now you'll cut paper into fractions! Use the scissors to make equal parts. Try it!",
    postQuestion: "In a fraction, must all pieces be the same size or different sizes?",
    contextInfo: "Interactive paper cutting activity. Kids practice making equal parts (halves, quarters). They use virtual scissors and glue.",
    correctnessFilter: "same|equal|same size",
    scaffolding: {
      probe1: "If you share a chocolate bar with your friend, would it be fair if one piece is big and one tiny?",
      probe2: "When we share equally, what must be true about each piece?",
      hint: "For fair sharing, pieces must be the _____ size?",
      scaffold: "The word rhymes with 'game' - s___e size!",
      reveal: "Same size! For fractions, all pieces must be equal - same size. Nice effort!"
    },
    maxTurns: 5
  },
  {
    id: 'applet-a2',
    number: 3,
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
      scaffold: "6 is bigger than 4, so 1/___ has more pieces!",
      reveal: "1/6 has more pieces! 6 is more than 4. Good thinking!"
    },
    maxTurns: 5
  },
  {
    id: 'applet-a3',
    number: 4,
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
      scaffold: "Numer-___-tor!",
      reveal: "It's the numerator! The top number that counts your pieces. Great job trying!"
    },
    maxTurns: 5
  },
  {
    id: 'video-2',
    number: 5,
    type: 'video',
    path: '/fractions-module-content/videos/video-2.mp4',
    title: 'Bigger Fractions',
    duration: '1.9 min',
    preScript: "Now we'll make fractions like 2/4 and 3/6. The top number can be more than 1!",
    postQuestion: "In 2/4, the 2 tells us how many pieces we have. How many pieces is that?",
    contextInfo: "Advanced concept: numerators greater than 1. Examples: 2/4 (two quarters), 3/6 (three sixths).",
    correctnessFilter: "two|2|two pieces|2 pieces|2 parts|two parts",
    scaffolding: {
      probe1: "Look at 2/4. The top number is 2. What does that 2 tell us?",
      probe2: "If the top number is 2, how many pieces do you have?",
      hint: "The answer is the same as the top number...",
      scaffold: "It's a small number - t___!",
      reveal: "Two pieces! The 2 on top means you have 2 pieces. Well done!"
    },
    maxTurns: 5
  },
  {
    id: 'applet-a4',
    number: 6,
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
      scaffold: "Three over five is written as 3/_____",
      reveal: "It's 3/5! Three pieces out of five. Excellent effort!"
    },
    maxTurns: 5
  },
  {
    id: 'video-3',
    number: 7,
    type: 'video',
    path: '/fractions-module-content/videos/video-3.mp4',
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
      scaffold: "Denom-___-tor!",
      reveal: "It's the denominator! The bottom number showing total pieces. Amazing work today!"
    },
    maxTurns: 5
  }
];

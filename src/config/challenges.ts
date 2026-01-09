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
    postQuestion: "What food did you see in the video? Pizza, cake, or something else?",
    contextInfo: "This video teaches basic fraction concepts using pizza and cake examples. Kids learn that fractions are parts of a whole."
  },
  {
    id: 'applet-a1',
    number: 2,
    type: 'applet',
    path: '/fractions-module-content/applets/A1. M2-Fraction Cut and Glue Practice/index.html',
    title: 'Cut and Glue Practice',
    duration: '4 min',
    preScript: "Now you'll cut paper into fractions! Use the scissors to make equal parts. Try it!",
    postQuestion: "How many pieces did you make? Just say a number!",
    contextInfo: "Interactive paper cutting activity. Kids practice making equal parts (halves, quarters). They use virtual scissors and glue."
  },
  {
    id: 'applet-a2',
    number: 3,
    type: 'applet',
    path: '/fractions-module-content/applets/A2.M2-Fraction Paper Cut Snapshot/index.html',
    title: 'Fraction Patterns',
    duration: '2 min',
    preScript: "Watch how fractions change from 1/2 to 1/4 to 1/6. Pay attention!",
    postQuestion: "Which has MORE pieces - 1/4 or 1/6? Just say one!",
    contextInfo: "Visual comparison of fractions 1/2, 1/4, 1/6. Correct answer: 1/6 has more pieces (6 pieces vs 4 pieces)."
  },
  {
    id: 'applet-a3',
    number: 4,
    type: 'applet',
    path: '/fractions-module-content/applets/A3. M2-Fraction Statement Cake Snapshot/index.html',
    title: 'Cake Fractions',
    duration: '3 min',
    preScript: "Time to learn fraction words with a cake story. Watch closely!",
    postQuestion: "What did the cake teach you? Equal parts, numerator, or something else?",
    contextInfo: "Cake-based vocabulary lesson. Teaches: equal parts (same size pieces), numerator (top number), denominator (bottom number)."
  },
  {
    id: 'video-2',
    number: 5,
    type: 'video',
    path: '/fractions-module-content/videos/video-2.mp4',
    title: 'Bigger Fractions',
    duration: '1.9 min',
    preScript: "Now we'll make fractions like 2/4 and 3/6. The top number can be more than 1!",
    postQuestion: "Quick! Can the top number be 2 or 3? Say yes or no!",
    contextInfo: "Advanced concept: numerators greater than 1. Examples: 2/4 (two quarters), 3/6 (three sixths)."
  },
  {
    id: 'applet-a4',
    number: 6,
    type: 'applet',
    path: '/fractions-module-content/applets/A4.M2-Fraction Cut and Glue Practice 2/index.html',
    title: 'Advanced Practice',
    duration: '3 min',
    preScript: "Now make fractions with bigger top numbers. Try 2/5 or 3/5!",
    postQuestion: "What fraction did you make? Say the top number and bottom number!",
    contextInfo: "Advanced cutting practice. Kids create fractions like 2/5, 3/5. They should say both numerator and denominator."
  },
  {
    id: 'video-3',
    number: 7,
    type: 'video',
    path: '/fractions-module-content/videos/video-3.mp4',
    title: 'You Did It!',
    duration: '30 sec',
    preScript: "You've learned so much! Watch this final message!",
    postQuestion: "You finished all 7 challenges! Say bye or see you!",
    contextInfo: "Celebration video. End of session. Kid should feel accomplished and proud."
  }
];

import type { FractionBuilderConfig, MultipleChoiceConfig, TapToSelectConfig } from '../types';

// ===== FRACTION BUILDER CONFIGS =====
// Template: Tap pieces to count → number fills into fraction slot

export const fractionBuilderSlides: Record<string, FractionBuilderConfig> = {
  // Node 2 — Post Video-1: "Pizza Slice"
  'node-2-pizza-slice': {
    shape: 'pizza',
    totalPieces: 4,
    highlightedPieces: 1,
    fractionAnswer: '1/4',
    fractionLabel: 'One-fourth!',
    questionText: 'If a pizza has 4 equal slices, what do we call ONE slice?',
  },

  // Node 10 — Post Applet-A4: "Build the Fraction"
  'node-10-build-fraction': {
    shape: 'bar',
    totalPieces: 5,
    highlightedPieces: 3,
    fractionAnswer: '3/5',
    fractionLabel: 'Three-fifths!',
    questionText: 'If you colored 3 pieces out of 5, what fraction is that?',
  },

  // Node 15 — Slide-5: "Pizza Builder"
  'node-15-pizza-builder': {
    shape: 'pizza',
    totalPieces: 6,
    highlightedPieces: 2,
    fractionAnswer: '2/6',
    fractionLabel: 'Two-sixths!',
    questionText: 'If you have 2 slices out of 6 total slices, what fraction is that?',
  },
};

// ===== MULTIPLE CHOICE CONFIGS =====
// Template: Tap word/answer buttons, wrong → wobble + eliminate

export const multipleChoiceSlides: Record<string, MultipleChoiceConfig> = {
  // Node 6 — Post Applet-A3: "Fraction Anatomy"
  'node-6-fraction-anatomy': {
    questionText: 'What do we call the TOP number in a fraction?',
    fractionDisplay: '3/4',
    highlightPosition: 'numerator',
    choices: ['Numerator', 'Denominator', 'Fraction', 'Number'],
    correctIndex: 0,
    visual: {
      type: 'cake',
      totalPieces: 4,
      highlightedPieces: 3,
    },
    scaffoldHint: 'This number COUNTS your pieces. It starts with N...',
    choiceHints: [
      '',  // correct — not used
      "That's the BOTTOM number! We want the top one.",
      "Fraction is the whole thing! We need the name for just the top number.",
      "Close, but there's a special math name for it. It starts with N...",
    ],
    revealLabel: 'Numerator = counts pieces you HAVE',
    bonusLabel: 'Denominator = total pieces',
  },

  // Node 9 — Post Video-2: "What Does the 2 Mean?"
  'node-9-what-does-2-mean': {
    questionText: 'Look at 2/4. What does the top number tell us?',
    fractionDisplay: '2/4',
    highlightPosition: 'numerator',
    choices: ['2 pieces', '2 cuts', '4 pieces', 'Half'],
    correctIndex: 0,
    visual: {
      type: 'bar',
      totalPieces: 4,
      highlightedPieces: 2,
    },
    scaffoldHint: 'Count the colored pieces! The top number matches!',
    choiceHints: [
      '',  // correct — not used
      "Cuts and pieces are different! Count the colored pieces instead.",
      "4 is the bottom number — that's the total. Look at the top!",
      "Half is right in a way, but what does the number 2 actually tell us?",
    ],
    revealLabel: '2 pieces! The top number tells us how many pieces we have.',
  },

  // Node 16 — Post Video-3: "The Bottom Number"
  'node-16-bottom-number': {
    questionText: "What's the BOTTOM number in a fraction called?",
    fractionDisplay: '3/4',
    highlightPosition: 'denominator',
    choices: ['Numerator', 'Denominator', 'Calculator'],
    correctIndex: 1,
    visual: {
      type: 'bar',
      totalPieces: 4,
      highlightedPieces: 4,
    },
    scaffoldHint: 'The bottom number shows the TOTAL pieces. It starts with D...',
    choiceHints: [
      "That's the TOP number! We want the bottom one.",
      '',  // correct — not used
      "Ha! Not a calculator — but good thinking! It starts with D...",
    ],
    revealLabel: 'Denominator = total equal pieces',
    bonusLabel: 'Numerator = pieces you have',
  },
};

// ===== TAP TO SELECT CONFIGS =====
// Template: Tap the correct option from visual choices

export const tapToSelectSlides: Record<string, TapToSelectConfig> = {
  // Node 3 — Post Applet-A1: "Fair Share Test"
  'node-3-fair-share': {
    questionText: 'Which chocolate bar is fair for sharing?',
    options: [
      {
        label: 'Bar A',
        isCorrect: true,
        visual: {
          type: 'bar',
          totalPieces: 4,
          highlightedPieces: 4,
          isEqual: true,
        },
      },
      {
        label: 'Bar B',
        isCorrect: false,
        visual: {
          type: 'bar',
          totalPieces: 4,
          highlightedPieces: 4,
          isEqual: false,
        },
      },
    ],
    correctFeedback: 'Yes! All pieces are the SAME size!',
    wrongFeedback: "Hmm, look again! One kid gets a big piece and one gets tiny. Is that fair?",
    revealText: 'EQUAL! Same size pieces!',
  },

  // Node 17 — Slide-6: "Math Detective"
  'node-17-math-detective': {
    questionText: 'Which diagram has a mistake? Tap the wrong one!',
    options: [
      {
        label: '2/4',
        isCorrect: false,
        visual: {
          type: 'bar',
          totalPieces: 4,
          highlightedPieces: 2,
          isEqual: true,
        },
      },
      {
        label: '2/6',
        isCorrect: true,
        visual: {
          type: 'bar',
          totalPieces: 6,
          highlightedPieces: 2,
          displayedPieces: 4,  // Intentionally wrong — says 2/6 but only draws 4 sections
          isEqual: true,
        },
      },
    ],
    correctFeedback: "Good eye! This says 2/6 but only has 4 parts, not 6!",
    wrongFeedback: "That one is actually correct! Count the pieces — they match. Try the other one!",
    revealText: "The 2/6 diagram only had 4 parts, not 6!",
  },
};

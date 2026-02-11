import type { CheckpointId } from '../types';

export interface CheckpointVisual {
  type: 'pizza' | 'fraction-notation' | 'chocolate-bar';
  title: string;
  pieces: number;
  highlighted: number;
  fractionLabel: string;
  questionText: string;
  scaffoldHint: string;
  celebrationText: string;
}

export const checkpointVisuals: Record<CheckpointId, CheckpointVisual> = {
  lo1: {
    type: 'pizza',
    title: 'Equal Parts & Fractions',
    pieces: 4,
    highlighted: 1,
    fractionLabel: '1/4',
    questionText: 'Eat 1 of 4 slices = ?',
    scaffoldHint: '1 slice out of 4 total',
    celebrationText: 'One-fourth! 1/4',
  },
  lo2: {
    type: 'fraction-notation',
    title: 'Bigger Fractions',
    pieces: 5,
    highlighted: 3,
    fractionLabel: '3/5',
    questionText: 'What does the 3 mean?',
    scaffoldHint: '3 pieces we HAVE',
    celebrationText: 'Three pieces! 3/5',
  },
  lo3: {
    type: 'chocolate-bar',
    title: 'Fraction Master',
    pieces: 6,
    highlighted: 2,
    fractionLabel: '2/6',
    questionText: 'Eat 2 of 6 pieces = ?',
    scaffoldHint: '2 pieces out of 6 total',
    celebrationText: 'Two-sixths! 2/6',
  },
};

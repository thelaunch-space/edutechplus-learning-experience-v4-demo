import type { TutorExpression } from '../types';

export interface GoofyMoment {
  tutorLine: string;
  minionLine?: string;
  expression: TutorExpression;
  showMinion: boolean;
}

export const goofyMoments: GoofyMoment[] = [
  {
    tutorLine: "Hey Spark, do you know what a fraction is?",
    minionLine: "I tried to eat 5/4 of a cake once... it didn't end well! My tummy hurt for DAYS!",
    expression: 'giggling',
    showMinion: true,
  },
  {
    tutorLine: "Fun fact! Did you know that if you cut a pizza into a million pieces, each piece would be one-millionth? That's a LOT of tiny bites!",
    expression: 'giggling',
    showMinion: false,
  },
];

import type { UnsolvedStigidPuzzle } from '@/apiV1/puzzle/puzzle.types';
import predefinedPuzzles from './digitsPuzzles.json';

export function getConvertedOldPuzzle(
  d?: string
): UnsolvedStigidPuzzle[] | undefined {
  const oldPuzzle = getOldPuzzle(d);
  if (oldPuzzle) {
    return oldPuzzle.targets.map((target, i) => ({
      target,
      numbers: oldPuzzle.numbers[i],
      steps: [],
    }));
  }
}

function getOldPuzzle(d?: string) {
  try {
    const puzzleIndex = getPuzzleId(d) % predefinedPuzzles.length;
    return predefinedPuzzles[puzzleIndex];
  } catch (e) {
    return predefinedPuzzles[0];
  }
}
function getPuzzleId(d?: string) {
  const magicNum = 864e5;
  const startDate = new Date('4/10/2023'),
    timeBetween =
      new Date(d).setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0);
  let n = Math.round(timeBetween / magicNum);
  return n < 0 && (n = 0), n;
}

export const OLD_PUZZLES = {
  '2023-07-19': [
    {
      target: 53,
      numbers: [1, 3, 4, 5, 10, 25],
      steps: [],
    },
    {
      target: 146,
      numbers: [2, 5, 7, 11, 15, 25],
      steps: [],
    },
    {
      target: 229,
      numbers: [3, 6, 7, 9, 11, 15],
      steps: [],
    },
    {
      target: 351,
      numbers: [4, 6, 7, 8, 11, 20],
      steps: [],
    },
    {
      target: 463,
      numbers: [5, 7, 9, 11, 13, 23],
      steps: [],
    },
  ],
  '2023-07-20': [
    {
      target: 56,
      numbers: [2, 3, 4, 5, 10, 25],
      steps: [],
    },
    {
      target: 137,
      numbers: [2, 3, 5, 9, 10, 15],
      steps: [],
    },
    {
      target: 254,
      numbers: [3, 8, 11, 15, 20, 25],
      steps: [],
    },
    {
      target: 338,
      numbers: [3, 6, 7, 8, 9, 15],
      steps: [],
    },
    {
      target: 417,
      numbers: [3, 5, 7, 9, 13, 19],
      steps: [],
    },
  ],
};

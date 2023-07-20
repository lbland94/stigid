import {
  randomIntPrimesUnlikely,
  weightedRandomNoReplacement,
} from '@/utilities/random';
import {
  PuzzleGenerateDefinition,
  StigidOperation,
  StigidPuzzle,
  Tuple,
  UnsolvedStigidPuzzle,
} from './puzzle.types';
import puzzleModel, { type IStigidPuzzle } from './puzzle.model';
import dayjs from '@/utilities/dayjs';

// TODO: Move to data?
export const puzzleGroup: PuzzleGenerateDefinition[] = [
  {
    target: {
      min: 40,
      max: 100,
    },
    numbers: {
      groups: [
        {
          max: -1,
          weight: 2,
          weights: [0.1, 1, 1, 1, 2, 1, 1, 1, 1, 0.5, 0.5],
          options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          max: 1,
          weight: 0.5,
          weights: [
            0.02, 1, 0.02, 2, 0.02, 1, 0.02, 1, 0.5, 1, 0.02, 1, 0.02, 2,
          ],
          options: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
        },
      ],
    },
  },
  {
    target: {
      min: 100,
      max: 200,
    },
    numbers: {
      groups: [
        {
          max: 5,
          weight: 1,
          weights: [0.1, 1, 1, 1, 2, 1, 1, 1, 1, 0.5, 0.5],
          options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          max: 2,
          weight: 1,
          weights: [
            0.02, 1, 0.02, 2, 0.02, 1, 0.02, 1, 0.5, 1, 0.02, 1, 0.02, 2,
          ],
          options: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
        },
      ],
    },
  },
  {
    target: {
      min: 200,
      max: 300,
    },
    numbers: {
      groups: [
        {
          max: 5,
          weight: 1,
          weights: [0.1, 1, 1, 1, 2, 1, 1, 1, 1, 0.5, 0.5],
          options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          max: 2,
          weight: 1,
          weights: [
            0.02, 1, 0.02, 2, 0.02, 1, 0.02, 1, 0.5, 1, 0.02, 1, 0.02, 2,
          ],
          options: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
        },
        {
          max: 1,
          weight: 1,
          weights: [0.25, 0.25],
          options: [50, 75],
        },
      ],
    },
  },
  {
    target: {
      min: 300,
      max: 400,
    },
    numbers: {
      groups: [
        {
          max: 5,
          weight: 1,
          weights: [0.1, 1, 1, 1, 2, 1, 1, 1, 1, 0.5, 0.5],
          options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          max: 2,
          weight: 1,
          weights: [
            0.02, 1, 0.02, 2, 0.02, 1, 0.02, 1, 0.5, 1, 0.02, 1, 0.02, 2,
          ],
          options: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
        },
        {
          max: 1,
          weight: 1,
          weights: [1, 1],
          options: [50, 75],
        },
      ],
    },
  },
  {
    target: {
      min: 400,
      max: 500,
    },
    numbers: {
      groups: [
        {
          max: 4,
          weight: 1,
          weights: [0.1, 1, 1, 1, 2, 1, 1, 1, 1, 0.5, 0.5],
          options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        },
        {
          max: 2,
          weight: 1,
          weights: [
            0.02, 1, 0.02, 2, 0.02, 1, 0.02, 1, 0.5, 1, 0.02, 1, 0.02, 2,
          ],
          options: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
        },
        {
          max: 1,
          weight: 1,
          weights: [1.5, 1.5],
          options: [50, 75],
        },
      ],
    },
  },
];

export const operations: Record<string, StigidOperation> = {
  '*': {
    name: 'Multiply',
    symbol: '*',
    apply: (x, y) => x * y,
    check: (x, y) => x !== 1 && y !== 1,
  },
  '/': {
    name: 'Divide',
    symbol: '/',
    apply: (x, y) => x / y,
    check: (x, y) => x % y === 0 && x > y && y !== 1,
  },
  '+': {
    name: 'Add',
    symbol: '+',
    apply: (x, y) => x + y,
    check: () => true,
  },
  '-': {
    name: 'Subtract',
    symbol: '-',
    apply: (x, y) => x - y,
    check: (x, y) => x > y,
  },
};

export class PuzzleService {
  /**
   * Generate full stack of puzzles
   */
  public static generatePuzzleGroup(group: PuzzleGenerateDefinition[]) {
    const vettedPuzzles: StigidPuzzle[] = [];
    const maxAttempts = 5;
    for (const puzzle of group) {
      let attemptCount = 0;
      let option = this.generatePuzzle(puzzle);
      let solution = this.solveWithStats(option);

      // TODO: Better heuristics to determine if puzzle is too difficult (or too easy) instead of merely possible
      while (
        attemptCount < maxAttempts &&
        (solution.solutions.every((v) => v === 0) || solution.solutions[0] > 0)
      ) {
        option = this.generatePuzzle(puzzle);
        solution = this.solveWithStats(option);
      }
      vettedPuzzles.push(solution);
    }
    return vettedPuzzles;
  }
  /**
   * Generate a new puzzle with a target in the specified range
   */
  public static generatePuzzle(definition: PuzzleGenerateDefinition) {
    const target = randomIntPrimesUnlikely(
      definition.target.min,
      definition.target.max
    );
    const numbers = weightedRandomNoReplacement(
      [...definition.numbers.groups],
      6
    );
    const puzzle: UnsolvedStigidPuzzle = {
      target,
      numbers: numbers as Tuple<number, 6>,
      steps: [],
    };
    return puzzle;
  }

  /**
   * Solve an individual puzzle
   */
  public static solveStigidPuzzle(puzzle: UnsolvedStigidPuzzle) {
    const solutions: UnsolvedStigidPuzzle[] = [];
    if (puzzle.numbers.length > 1) {
      const neighbors = this.allNeighbors(puzzle);
      solutions.push(...neighbors.solved);
      for (const neighbor of neighbors.unsolved) {
        solutions.push(...this.solveStigidPuzzle(neighbor));
      }
    }
    return solutions;
  }

  /**
   * Return stats about solved puzzle instead of individual solutions
   */
  public static solveWithStats(puzzle: UnsolvedStigidPuzzle): StigidPuzzle {
    const solutions = this.solveStigidPuzzle(puzzle).sort(
      (a, b) => a.steps.length - b.steps.length
    );
    const solutionsDistro = solutions.reduce(
      (dist, s) => {
        dist[s.steps.length - 1]++;
        return dist;
      },
      [0, 0, 0, 0, 0] as Tuple<number, 5>
    );
    return {
      target: puzzle.target,
      numbers: puzzle.numbers as Tuple<number, 6>,
      solutions: solutionsDistro,
    };
  }

  /**
   * Find all neighbor puzzles (sub-puzzles reachable in one operation) of the passed puzzle.
   */
  private static allNeighbors(puzzle: UnsolvedStigidPuzzle): {
    unsolved: UnsolvedStigidPuzzle[];
    solved: UnsolvedStigidPuzzle[];
  } {
    const ops = Object.values(operations);
    const neighborPuzzles: UnsolvedStigidPuzzle[] = [];
    const solutions: UnsolvedStigidPuzzle[] = [];
    for (let i = 0; i < puzzle.numbers.length; i++) {
      const r1 = puzzle.numbers[i];
      for (let j = i + 1; j < puzzle.numbers.length; j++) {
        const r2 = puzzle.numbers[j];
        for (const op of ops) {
          if (op.check(r1, r2)) {
            const v = op.apply(r1, r2);
            const remainingNums = [...puzzle.numbers];
            remainingNums.splice(j, 1);
            remainingNums.splice(i, 1);
            if (v === puzzle.target) {
              solutions.push({
                target: puzzle.target,
                numbers: [...remainingNums, v],
                steps: [
                  ...puzzle.steps,
                  { a: r1, b: r2, operationSymbol: op.symbol },
                ],
              });
            } else {
              neighborPuzzles.push({
                target: puzzle.target,
                numbers: [...remainingNums, v],
                steps: [
                  ...puzzle.steps,
                  { a: r1, b: r2, operationSymbol: op.symbol },
                ],
              });
            }
          } else if (op.check(r2, r1)) {
            const v = op.apply(r2, r1);
            const remainingNums = [...puzzle.numbers];
            remainingNums.splice(j, 1);
            remainingNums.splice(i, 1);
            if (v === puzzle.target) {
              solutions.push({
                target: puzzle.target,
                numbers: [...remainingNums, v],
                steps: [
                  ...puzzle.steps,
                  { a: r2, b: r1, operationSymbol: op.symbol },
                ],
              });
            } else {
              neighborPuzzles.push({
                target: puzzle.target,
                numbers: [...remainingNums, v],
                steps: [
                  ...puzzle.steps,
                  { a: r2, b: r1, operationSymbol: op.symbol },
                ],
              });
            }
          }
        }
      }
    }
    return {
      unsolved: neighborPuzzles,
      solved: solutions,
    };
  }

  /**
   * Upsert a puzzle to the database
   */
  public static async upsertPuzzle(
    puzzles: StigidPuzzle[],
    date?: string | Date | dayjs.Dayjs
  ) {
    const d = dayjs(date).startOf('day');
    const number = d.diff(dayjs('2023-04-09', 'YYYY-MM-DD'), 'days');
    return await puzzleModel
      .findOneAndUpdate(
        {
          date: { $gte: d.toDate(), $lt: d.endOf('day').toDate() },
        },
        { date: d.toDate(), number, puzzles },
        { upsert: true, new: true }
      )
      .exec();
  }

  /**
   * Save a puzzle to the database
   */
  public static async savePuzzle(
    puzzles: StigidPuzzle[],
    date?: string | Date | dayjs.Dayjs
  ) {
    const d = dayjs(date).startOf('day');
    const number = d.diff(dayjs('2023-04-09', 'YYYY-MM-DD'), 'days');
    const dbPuzzle = new puzzleModel({ date: d.toDate(), number, puzzles });
    return await dbPuzzle.save();
  }

  /**
   * Fetches a puzzle from the database
   */
  public static async getPuzzle(
    date: string | Date | dayjs.Dayjs
  ): Promise<IStigidPuzzle> {
    const d = dayjs(date).startOf('day');
    return await puzzleModel
      .findOne({
        date: { $gte: d.toDate(), $lt: d.endOf('day').toDate() },
      })
      .exec();
  }
}

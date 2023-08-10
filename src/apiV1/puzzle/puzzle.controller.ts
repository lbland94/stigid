import { Request, Response } from 'express';
import { PuzzleService, puzzleGroup } from './puzzle.service';
import { StigidPuzzle, Tuple } from './puzzle.types';
import dayjs from '@/utilities/dayjs';
import {
  IUpdatePuzzleBody,
  IUpdatePuzzleQuery,
} from '@/types/puzzle/updatePuzzle';
import { IGetPuzzleQuery } from '@/types/puzzle/getPuzzle';
import { IGeneratePuzzleQuery } from '@/types/puzzle/generatePuzzle';
// import { getConvertedOldPuzzle } from '@/data/oldPuzzles';

export class PuzzleController {
  /**
   * Get a puzzle, optionally with a date
   */
  public static async getPuzzle(
    req: Request<any, any, any, IGetPuzzleQuery>,
    res: Response
  ) {
    try {
      const puzzle = await PuzzleService.getPuzzle(
        req.query.date
          ? dayjs(req.query.date as string | undefined, 'YYYY-MM-DD')
          : dayjs()
      );
      res.status(200).json(puzzle.toJSON());
    } catch (e) {
      res.status(404).json(e);
    }
  }

  /**
   * Update or create a puzzle for a given day
   */
  public static async updatePuzzle(
    req: Request<any, any, IUpdatePuzzleBody, IUpdatePuzzleQuery>,
    res: Response
  ) {
    try {
      const date = req.query.date
        ? dayjs(req.query.date, 'YYYY-MM-DD')
        : undefined;

      const solvedPuzzles: StigidPuzzle[] = [];
      if (!date || date.isValid()) {
        for (const puzzle of req.body) {
          const solutions = PuzzleService.solveStigidPuzzle(puzzle).sort(
            (a, b) => a.steps.length - b.steps.length
          );
          const solutionsDistro = solutions.reduce(
            (dist, s) => {
              dist[s.steps.length - 1]++;
              return dist;
            },
            [0, 0, 0, 0, 0] as Tuple<number, 5>
          );
          solvedPuzzles.push({
            target: puzzle.target,
            numbers: puzzle.numbers as Tuple<number, 6>,
            solutions: solutionsDistro,
          });
        }
        const savedPuzzle = await PuzzleService.upsertPuzzle(
          solvedPuzzles,
          date
        );
        res.status(200).json(savedPuzzle);
        return;
      }
      res.status(400).json({ error: 'Invalid date', date: date?.toString() });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  /**
   * Generate a puzzle for a given date
   */
  public static async generatePuzzle(
    req: Request<any, any, any, IGeneratePuzzleQuery>,
    res: Response
  ) {
    try {
      // const date = req.query.date
      //   ? dayjs(req.query.date, 'YYYY-MM-DD')
      //   : undefined;
      const puzzles = PuzzleService.generatePuzzleGroup(puzzleGroup);
      res.status(200).json({ date: 'random', number: -1, puzzles });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  /**
   * Save an old puzzle
   */
  // public static async oldPuzzle(
  //   req: Request<any, any, any, IGeneratePuzzleQuery>,
  //   res: Response
  // ) {
  //   try {
  //     const date = req.query.date
  //       ? dayjs(req.query.date, 'YYYY-MM-DD')
  //       : dayjs();
  //     if (!date.isValid()) {
  //       res.status(500).json({ error: 'bad date', date: date?.toJSON() });
  //       return;
  //     }
  //     const puzzles = getConvertedOldPuzzle(date.format('M/D/YYYY'));
  //     const solvedPuzzles: StigidPuzzle[] = [];
  //     for (const puzzle of puzzles) {
  //       const solutions = PuzzleService.solveStigidPuzzle(puzzle).sort(
  //         (a, b) => a.steps.length - b.steps.length
  //       );
  //       const solutionsDistro = solutions.reduce(
  //         (dist, s) => {
  //           dist[s.steps.length - 1]++;
  //           return dist;
  //         },
  //         [0, 0, 0, 0, 0] as Tuple<number, 5>
  //       );
  //       solvedPuzzles.push({
  //         target: puzzle.target,
  //         numbers: puzzle.numbers as Tuple<number, 6>,
  //         solutions: solutionsDistro,
  //       });
  //     }
  //     const savedPuzzle = await PuzzleService.upsertPuzzle(solvedPuzzles, date);
  //     res.status(200).json(savedPuzzle);
  //   } catch (e) {
  //     res.status(500).json(e);
  //   }
  // }

  /**
   * Generate a puzzle for a given date
   */
  public static async regeneratePuzzle(
    req: Request<any, any, any, IGeneratePuzzleQuery>,
    res: Response
  ) {
    try {
      const date = req.query.date
        ? dayjs(req.query.date, 'YYYY-MM-DD')
        : undefined;
      const puzzles = PuzzleService.generatePuzzleGroup(puzzleGroup);
      const newPuzzle = await PuzzleService.savePuzzle(puzzles, date);
      res.status(200).json(newPuzzle);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

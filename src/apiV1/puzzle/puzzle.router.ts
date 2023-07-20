import express from 'express';
import { PuzzleController } from './puzzle.controller';
import { validator } from '@/middleware/validator';
import {
  UpdatePuzzleBody,
  UpdatePuzzleQuery,
} from '@/types/puzzle/updatePuzzle';
import { GetPuzzleQuery } from '@/types/puzzle/getPuzzle';
import { GeneratePuzzleQuery } from '@/types/puzzle/generatePuzzle';

/**
 * @swagger
 *
 * /v1/puzzle:
 *   get:
 *     tags:
 *       - puzzle
 *     produces:
 *       - applications/json
 */

export const puzzleRouter = express.Router();

puzzleRouter.get(
  '',
  validator.query(GetPuzzleQuery),
  PuzzleController.getPuzzle
);
puzzleRouter.post(
  '/generate',
  validator.query(GeneratePuzzleQuery),
  PuzzleController.generatePuzzle
);
puzzleRouter.put(
  '/generate',
  validator.query(GeneratePuzzleQuery),
  PuzzleController.regeneratePuzzle
);
puzzleRouter.put(
  '',
  validator.query(UpdatePuzzleQuery),
  validator.body(UpdatePuzzleBody),
  PuzzleController.updatePuzzle
);

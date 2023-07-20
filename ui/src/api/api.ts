import { PuzzleApi } from './modules/puzzle/puzzle.api';

export class Api {
  public puzzle: PuzzleApi;

  public constructor(apiConfig: { puzzle: string }) {
    this.puzzle = new PuzzleApi(apiConfig.puzzle);
  }
}

export const api = new Api({
  puzzle: import.meta.env?.VITE_APP_PUZZLE_API,
});

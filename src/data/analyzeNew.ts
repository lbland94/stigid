import { PuzzleService, puzzleGroup } from '@/apiV1/puzzle/puzzle.service';
import fs from 'fs';
import path from 'path';

function analyzeNewPuzzles() {
  const solved: any[] = [];
  const puzzleAnalysis = Array.from(Array(5)).map((v, i) => ({
    puzzle: i,
    numberFreq: Array.from(Array(25)).reduce(
      (obj, v, i) => ({ [i + 1]: 0, ...obj }),
      {} as Record<number, number>
    ) as Record<number, number>,
    numberOcc: Array.from(Array(25)).reduce(
      (obj, v, i) => ({ [i + 1]: 0, ...obj }),
      {} as Record<number, number>
    ) as Record<number, number>,
    avgSteps: 0,
    minSteps: Infinity,
    maxSteps: 0,
    avgTarget: 0,
    minTarget: Infinity,
    maxTarget: 0,
    minLow: Infinity,
    maxLow: 0,
    avgLow: 0,
    minHigh: Infinity,
    maxHigh: 0,
    avgHigh: 0,
  }));

  const days = 120;

  for (let i = 0; i < days; i++) {
    const puzzle = PuzzleService.generatePuzzleGroup(puzzleGroup);

    console.log('solved', `${i + 1} / 120`);

    for (let j = 0; j < 5; j++) {
      puzzleAnalysis[j].avgTarget =
        (puzzleAnalysis[j].avgTarget * i + puzzle[j].target) / (i + 1);
      puzzleAnalysis[j].minTarget = Math.min(
        puzzleAnalysis[j].minTarget,
        puzzle[j].target
      );
      puzzleAnalysis[j].maxTarget = Math.max(
        puzzleAnalysis[j].minTarget,
        puzzle[j].target
      );
      const solvedIn = puzzle[j].solutions.findIndex((s) => s > 0) + 1;
      puzzleAnalysis[j].avgSteps =
        (puzzleAnalysis[j].avgSteps * i + solvedIn) / (i + 1);
      puzzleAnalysis[j].minSteps = Math.min(
        puzzleAnalysis[j].minSteps,
        solvedIn
      );
      puzzleAnalysis[j].maxSteps = Math.max(
        puzzleAnalysis[j].maxSteps,
        solvedIn
      );

      const low = puzzle[j].numbers.reduce((c, n) => (n <= 11 ? c + 1 : c), 0);
      puzzleAnalysis[j].avgLow = (puzzleAnalysis[j].avgLow * i + low) / (i + 1);
      puzzleAnalysis[j].minLow = Math.min(puzzleAnalysis[j].minLow, low);
      puzzleAnalysis[j].maxLow = Math.max(puzzleAnalysis[j].maxLow, low);

      const high = puzzle[j].numbers.reduce((c, n) => (n > 11 ? c + 1 : c), 0);
      puzzleAnalysis[j].avgHigh =
        (puzzleAnalysis[j].avgHigh * i + high) / (i + 1);
      puzzleAnalysis[j].minHigh = Math.min(puzzleAnalysis[j].minHigh, high);
      puzzleAnalysis[j].maxHigh = Math.max(puzzleAnalysis[j].maxHigh, high);

      for (const num of puzzle[j].numbers) {
        if (puzzleAnalysis[j].numberOcc[num] === undefined) {
          puzzleAnalysis[j].numberOcc[num] = 0;
        }
        puzzleAnalysis[j].numberOcc[num]++;
      }
    }
  }

  for (const an of puzzleAnalysis) {
    const total = Object.values(an.numberOcc).reduce((tot, v) => tot + v, 0);
    an.numberFreq = Object.keys(an.numberOcc).reduce((obj, v) => {
      obj[v] = an.numberOcc[v] / total;
      return obj;
    }, {} as Record<number, number>);
  }

  fs.writeFileSync(
    path.join(__dirname, 'new-puzzles.json'),
    JSON.stringify(puzzleAnalysis, null, 2)
  );
}

analyzeNewPuzzles();

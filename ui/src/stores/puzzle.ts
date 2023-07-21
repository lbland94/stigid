import { defineStore } from 'pinia';
import dayjs from '@/utilities/dayjs';
import type { StigidDaily, UnsolvedStigidPuzzle, StigidPuzzleStep } from '@/api/modules/puzzle/puzzle.interfaces';
import { api } from '@/api/api';
import { operations, operatorDisplay, operatorEmoji } from '@/utilities/puzzle';

export const usePuzzleStore = defineStore('puzzle', {
  state: () => ({
    date: dayjs().format('YYYY-MM-DD'),
    puzzle: {} as StigidDaily | {},
    solutions: [] as UnsolvedStigidPuzzle[],
  }),
  actions: {
    addStep(puzzle: number, step: StigidPuzzleStep) {
      const p = (this.puzzle as StigidDaily).puzzles?.[puzzle];
      if (!this.solutions[puzzle] && p) {
        this.solutions[puzzle] = {
          target: p.target,
          numbers: p.numbers,
          steps: [],
        };
      }
      this.solutions[puzzle].steps.push(step);
    },
    async fetchPuzzle() {
      try {
        if (!(this.puzzle as StigidDaily)?.date || this.date !== dayjs().format('YYYY-MM-DD')) {
          this.puzzle = await api.puzzle.getPuzzle();
          this.date = dayjs().format('YYYY-MM-DD');
          this.solutions = [];
        }
      } catch (e) {
        // nothing
      }
    },
    undo(puzzleIndex: number) {
      if (this.solutions[puzzleIndex]?.steps?.length) {
        this.solutions[puzzleIndex].steps.splice(this.solutions[puzzleIndex].steps.length - 1);
      }
    },
    reset() {
      this.solutions = [];
      this.puzzle = {};
      this.date = dayjs().format('YYYY-MM-DD');
    },
  },
  getters: {
    numbers(state): Array<Array<{ number: number; index: number; hidden: boolean }>> {
      return (state.puzzle as StigidDaily).puzzles?.map((puzzle, i) => {
        const solution = state.solutions?.[i] || {};
        const startingNums = puzzle.numbers.map((n, j) => ({
          number: n,
          index: j,
          hidden: false,
        }));
        for (const s of solution?.steps || []) {
          const aInd = startingNums.findIndex((n) => s.a === n.number);
          const bInd = startingNums.findIndex((n, i) => s.b === n.number && i !== aInd);

          startingNums[aInd].hidden = true;
          startingNums[bInd].number = operations[s.operationSymbol].apply(
            startingNums[aInd].number,
            startingNums[bInd].number
          );
        }
        return startingNums;
      });
    },
    stars(): number[] {
      return (((this as any).numbers as Array<Array<{ number: number; index: number; hidden: boolean }>>) || []).map(
        (nums, i) => {
          const puzzle = ((this as any)?.puzzle as StigidDaily).puzzles?.[i];
          const target = puzzle?.target;
          const closest = Math.min(...nums.filter((n) => !n.hidden).map((n) => Math.abs(n.number - target)));
          if (closest > 25) return 0;
          if (closest > 11) return 1;
          if (closest > 0) return 2;
          return 3;
        }
      );
    },
    solutionSteps(state): Array<Array<UnsolvedStigidPuzzle['steps'][number] & { result: number; display: string }>> {
      return state.solutions.map((solution) => {
        return solution.steps.map((s) => ({
          ...s,
          result: operations[s.operationSymbol].apply(s.a, s.b),
          display: operatorDisplay[s.operationSymbol as keyof typeof operatorDisplay],
        }));
      });
    },
    shareText(state): string {
      const puzzle = state.puzzle as StigidDaily;
      const totalStars = ((this as any).stars as number[]).reduce((tot, s) => tot + s, 0);
      let str = `Digits #${puzzle.number} (${totalStars}/15⭐)`;
      for (let i = 0; i < puzzle.puzzles.length; i++) {
        const p = puzzle.puzzles[i];

        const closestNums = ((this as any).numbers as Array<Array<{ number: number; index: number; hidden: boolean }>>)[
          i
        ]
          .filter((n) => !n.hidden)
          .map((n) => ({ distance: Math.abs(n.number - p.target), number: n.number }))
          .sort((a, b) => a.distance - b.distance);
        const closest = closestNums[0].number;

        const opEmoji: string = state.solutions[i]?.steps
          .map((s) => operatorEmoji[s.operationSymbol as keyof typeof operatorEmoji])
          .join('');

        str += `\n${String(closest).padEnd(3, ' ')} ${`(${p.target})`.padEnd(5, ' ')} ${opEmoji}`;
      }
      if (totalStars === 15) {
        const totalSteps = state.solutions.reduce((total, s) => total + s.steps.length, 0);
        const fewestSteps = puzzle.puzzles.reduce((total, p) => total + p.solutions.findIndex((v) => v > 0) + 1, 0);
        str += `\n\nSteps: ${totalSteps} (${fewestSteps})`;
      }
      return str;
    },
  },
  persist: {
    storage: localStorage,
  },
});

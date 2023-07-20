export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

export type StigidNumberOptions = Tuple<number, 6>;
export interface StigidPuzzle {
  target: number;
  numbers: StigidNumberOptions;
  solutions: Tuple<number, 5>;
}

export interface StigidPuzzleStep {
  a: number;
  b: number;
  operationSymbol: string;
}

export interface UnsolvedStigidPuzzle {
  target: number;
  numbers: number[];
  steps: StigidPuzzleStep[];
}

export interface StigidOperation {
  name: string;
  symbol: string;
  apply: (x: number, y: number) => number;
  check: (x: number, y: number) => boolean;
}

export interface PuzzleGenerateDefinition {
  target: {
    min: number;
    max: number;
  };
  numbers: {
    groups: Array<{
      max: number;
      weight: number;
      weights: number[];
      options: number[];
    }>;
  };
}

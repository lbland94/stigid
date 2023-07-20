import type { StigidOperation } from '@/api/modules/puzzle/puzzle.interfaces';

export const operatorDisplay = {
  '*': '×',
  '/': '÷',
  '+': '+',
  '-': '−',
};

export const operatorEmoji = {
  '*': '✖',
  '/': '➗',
  '+': '➕',
  '-': '➖',
};

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
    check: (x, y) => x % y === 0 && x >= y && y !== 1,
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

export const ranks = [
  { stars: 0, name: 'Beginner' },
  { stars: 3, name: 'Moving Up' },
  { stars: 6, name: 'Solid' },
  { stars: 9, name: 'Nice' },
  { stars: 12, name: 'Great' },
  { stars: 14, name: 'Amazing' },
  { stars: 15, name: 'Genius' },
];

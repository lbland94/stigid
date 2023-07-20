import { PuzzleService, puzzleGroup } from '@/apiV1/puzzle/puzzle.service';
import dbConnect from '@/config/db';
import { parentPort } from 'worker_threads';

let connection: Awaited<ReturnType<typeof dbConnect>>;

async function cancel() {
  try {
    await connection.connection.close();
  } finally {
    if (parentPort) parentPort.postMessage('cancelled');
    else process.exit(0);
  }
}

if (parentPort) {
  parentPort.once('message', (message) => {
    if (message === 'cancel') return cancel();
  });
}

(async () => {
  try {
    connection = await dbConnect();
    const puzzles = PuzzleService.generatePuzzleGroup(puzzleGroup);
    await PuzzleService.savePuzzle(puzzles);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  process.exit(0);
})();

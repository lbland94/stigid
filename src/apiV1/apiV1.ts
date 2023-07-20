import { Router } from 'express';
import { puzzleRouter } from './puzzle/puzzle.router';

const router: Router = Router();

router.use('/puzzle', puzzleRouter);

export default router;

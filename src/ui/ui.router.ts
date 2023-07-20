import express, { Request, Response, NextFunction } from 'express';
import path from 'path';

export const useUiRouter = (options?: Partial<{ uiPath: string }>) => {
  const uiRouter = express.Router();
  uiRouter.use(
    '',
    express.static(path.resolve(__dirname, options?.uiPath || '../ui'))
  );
  uiRouter.get('*', (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(
      path.resolve(__dirname, options?.uiPath || '../ui', 'index.html')
    );
  });
  return uiRouter;
};

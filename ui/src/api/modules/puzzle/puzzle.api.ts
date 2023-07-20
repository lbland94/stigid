import { ApiModule } from '@/api/modules/base/ApiModule';
import type { StigidDaily } from './puzzle.interfaces';

export class PuzzleApi extends ApiModule {
  constructor(baseUrl: string) {
    super(baseUrl, '');
  }

  public async getPuzzle(date?: string) {
    return this.get<StigidDaily>('/puzzle', {
      params: {
        date,
      },
    });
  }
}

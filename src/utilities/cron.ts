import Bree from 'bree';
import tsWorker from '@breejs/ts-worker';
import later from '@breejs/later';
import ms from 'ms';

Bree.extend(tsWorker);

const sched = later.parse.recur().on('00:00:00').time();

const cron = new Bree({
  acceptedExtensions: ['js', 'ts'],
  defaultExtension: process.env.NODE_ENV === 'production' ? 'js' : 'ts',
  logger: false,
  jobs: [
    {
      name: 'generate-puzzle',
      interval: { schedules: sched.schedules } as any,
      closeWorkerAfterMs: ms('5m'),
    },
  ],
});

export async function startCron() {
  await cron.start();
}

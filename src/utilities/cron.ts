import Bree from 'bree';
import tsWorker from '@breejs/ts-worker';
import later from '@breejs/later';
import ms from 'ms';

Bree.extend(tsWorker);

const sched = later.parse
  .recur()
  .on('00:00:00')
  .time()
  .after(8)
  .month()
  .after(8)
  .dayOfMonth()
  .before(9)
  .month()
  .and()
  .on('00:00:00')
  .time()
  .after(9)
  .month()
  .and()
  .on('00:00:00')
  .time()
  .after(2024)
  .year();

const cron = new Bree({
  acceptedExtensions: ['js', 'ts'],
  defaultExtension: process.env.NODE_ENV === 'production' ? 'js' : 'ts',
  logger: false,
  jobs: [
    {
      name: 'generate-puzzle',
      interval: sched as any,
      closeWorkerAfterMs: ms('5m'),
    },
  ],
});

export async function startCron() {
  await cron.start();
}

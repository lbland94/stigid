import app from './App';
import CONFIG from '@/config/config';
import dbConnect from './config/db';
import { startCron } from './utilities/cron';

const PORT = CONFIG.PORT;

dbConnect()
  .then(() => {
    // Don't do anything
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

startCron()
  .then(() => {})
  .catch((e) => console.log(e));

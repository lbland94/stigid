import CONFIG from './config';
import mongoose from 'mongoose';

// Connecting to the database
export default async () => {
  try {
    return await mongoose
      .connect(CONFIG.DB_HOST, {
        user: CONFIG.DB_USER,
        pass: CONFIG.DB_PASSWORD,
      })
      .then((val) => {
        // listen for requests
        console.log('The Conection is Ok');
        return val;
      });
  } catch (err) {
    console.log(`${err} Could not Connect to the Database. Exiting Now...`);
    process.exit();
  }
};

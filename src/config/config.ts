import dotenv from 'dotenv';
dotenv.config();

const conf = {
  APP: process.env.APP || 'development',
  PORT: process.env.PORT || '3000',
  EXTERNAL_URL: process.env.EXTERNAL_URL || 'http://localhost:3000',

  DB_HOST: process.env.DB_HOST || 'mongodb://server:port/database',
  DB_USER: process.env.DB_USER || 'username',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
};

export default conf;

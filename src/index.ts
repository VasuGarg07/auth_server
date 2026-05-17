import app from './app';
import CONFIG from './config';
import { verifyDbConnection } from './db';

const start = async () => {
  await verifyDbConnection();
  app.listen(CONFIG.PORT, () => {
    console.log(`Auth server running on port ${CONFIG.PORT}`);
  });
};

start();
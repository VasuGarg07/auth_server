import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import CONFIG from './config';
import * as schema from './schema';

if (!CONFIG.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(CONFIG.DATABASE_URL);
export const db = drizzle(client, { schema });

export const verifyDbConnection = async () => {
  try {
    await client`SELECT 1`;
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

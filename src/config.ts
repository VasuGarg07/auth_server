import 'dotenv/config';

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || '';
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH || 'keys/private.pem';
const PUBLIC_KEY_PATH = process.env.PUBLIC_KEY_PATH || 'keys/public.pem';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '1h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '2d';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '';

const CONFIG = {
  PORT,
  DATABASE_URL,
  PRIVATE_KEY_PATH,
  PUBLIC_KEY_PATH,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  ALLOWED_ORIGINS
} as const;

export default CONFIG;
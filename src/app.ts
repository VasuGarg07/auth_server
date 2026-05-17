import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import CONFIG from './config';
import { errorHandler } from './middleware';
import routes from './routes';

const app = express();
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

const allowedOrigins = CONFIG.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : '*',
  credentials: false,
}));

app.use(express.json());

app.use(routes);
app.use(errorHandler);

export default app;
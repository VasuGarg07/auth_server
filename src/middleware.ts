import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { ApiError, ERROR_STRINGS } from './utils';
import { TokenPayload, verifyToken } from './jwt';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const validate = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return next(new ApiError(400, firstIssue.message, { path: firstIssue.path }));
    }
    req.body = result.data;
    next();
  };


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(new ApiError(401, ERROR_STRINGS.InvalidToken));
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new ApiError(401, ERROR_STRINGS.InvalidToken));
  }
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message, ...err.data });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};
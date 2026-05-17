import { compare, hash } from 'bcrypt';
import { createHash } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
  statusCode: number;
  data?: object;

  constructor(statusCode: number, message: string, data?: object) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

export const SUCCESS_STRINGS = {
  UserCreated: 'User created successfully',
  LoginSuccess: 'Login successful',
  TokenRefreshed: 'Token refreshed',
  PasswordChanged: 'Password changed successfully',
  LogoutSuccess: 'Logged out successfully',
} as const;

export const ERROR_STRINGS = {
  InvalidCreds: 'Invalid credentials',
  InvalidToken: 'Invalid or expired token',
  NoRefToken: 'Refresh token is required',
  UserExists: 'User already exists',
  UserNotFound: 'User not found',
  InactiveAccount: 'Account is inactive',
  NotImplemented: 'Not implemented yet',
} as const;


// bcrypt — for passwords and security answers (slow by design)
export const hashData = (data: string) => hash(data, 10);
export const compareData = (data: string, hashedData: string) => compare(data, hashedData);
export const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex');


// Wraps async route handlers so thrown errors flow into errorHandler middleware
export const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};

// Convert "7d" / "15m" / "2h" into milliseconds for expiresAt timestamp
export const parseDuration = (str: string): number => {
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid duration format: ${str}`);
  const [, value, unit] = match;
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return parseInt(value) * multipliers[unit as keyof typeof multipliers];
};
import { eq, or } from 'drizzle-orm';
import { db } from './db';
import { refreshTokens, users } from './schema';
import {
  ApiError,
  compareData,
  ERROR_STRINGS,
  hashData,
  hashToken,
  parseDuration,
} from './utils';
import { signAccessToken, signRefreshToken, verifyToken } from './jwt';
import CONFIG from './config';




const issueTokenPair = async (id: string, username: string, email: string) => {
  const payload = { id, username, email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await db.insert(refreshTokens).values({
    userId: id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + parseDuration(CONFIG.REFRESH_TOKEN_EXPIRES_IN)),
  });

  return { accessToken, refreshToken };
};


export const registerUser = async (
  username: string,
  email: string,
  password: string,
  securityQuestion: string,
  securityAnswer: string,
) => {
  const existing = await db.query.users.findFirst({
    where: or(eq(users.username, username), eq(users.email, email)),
  });

  if (existing) {
    throw new ApiError(409, ERROR_STRINGS.UserExists, { id: existing.id });
  }

  const [newUser] = await db.insert(users).values({
    username,
    email,
    password: await hashData(password),
    securityQuestion,
    securityAnswer: await hashData(securityAnswer),
  }).returning({ id: users.id });

  return { id: newUser.id };
};

export const loginUser = async (username: string, password: string) => {
  // Username field also accepts email — matches existing behaviorhttps://claude.ai/projects
  const user = await db.query.users.findFirst({
    where: or(eq(users.username, username), eq(users.email, username)),
  });

  if (!user || !user.isActive) {
    throw new ApiError(401, ERROR_STRINGS.InvalidCreds);
  }

  const isPasswordValid = await compareData(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, ERROR_STRINGS.InvalidCreds);
  }

  return issueTokenPair(user.id, user.username, user.email);
};

export const changeUserPassword = async (
  username: string,
  securityAnswer: string,
  newPassword: string,
) => {
  const user = await db.query.users.findFirst({
    where: or(eq(users.username, username), eq(users.email, username)),
  });

  if (!user) {
    throw new ApiError(401, ERROR_STRINGS.InvalidCreds);
  }

  const isAnswerValid = await compareData(securityAnswer, user.securityAnswer);
  if (!isAnswerValid) {
    throw new ApiError(401, ERROR_STRINGS.InvalidCreds);
  }

  await db.update(users)
    .set({ password: await hashData(newPassword) })
    .where(eq(users.id, user.id));
};

export const refreshTokenPair = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(400, ERROR_STRINGS.NoRefToken);
  }

  const incomingHash = hashToken(refreshToken);
  const stored = await db.query.refreshTokens.findFirst({
    where: eq(refreshTokens.tokenHash, incomingHash),
  });

  if (!stored) {
    throw new ApiError(401, ERROR_STRINGS.InvalidToken);
  }

  let decoded;
  try {
    decoded = verifyToken(refreshToken);
  } catch {
    // Token tampered or expired — remove from DB and reject
    await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, incomingHash));
    throw new ApiError(401, ERROR_STRINGS.InvalidToken);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, decoded.id),
  });

  if (!user || !user.isActive) {
    throw new ApiError(401, ERROR_STRINGS.InvalidToken);
  }

  // Rotate: delete old, issue new pair
  await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, incomingHash));
  return issueTokenPair(user.id, user.username, user.email);
};

export const logoutUser = async (refreshToken: string) => {
  if (!refreshToken) return;
  await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, hashToken(refreshToken)));
};
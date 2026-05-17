import { Request, Response } from 'express';
import * as service from './service';
import { getPublicKeyPem } from './jwt';
import { ApiError, ERROR_STRINGS, SUCCESS_STRINGS } from './utils';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, securityQuestion, securityAnswer } = req.body;
  const data = await service.registerUser(username, email, password, securityQuestion, securityAnswer);
  res.status(201).json({ message: SUCCESS_STRINGS.UserCreated, ...data });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const data = await service.loginUser(username, password);
  res.status(200).json({ message: SUCCESS_STRINGS.LoginSuccess, ...data });
};

export const changePassword = async (req: Request, res: Response) => {
  const { username, securityAnswer, newPassword } = req.body;
  await service.changeUserPassword(username, securityAnswer, newPassword);
  res.status(200).json({ message: SUCCESS_STRINGS.PasswordChanged });
};

export const refresh = async (req: Request, res: Response) => {
  const data = await service.refreshTokenPair(req.body.refreshToken);
  res.status(200).json({ message: SUCCESS_STRINGS.TokenRefreshed, ...data });
};

export const logout = async (req: Request, res: Response) => {
  await service.logoutUser(req.body.refreshToken);
  res.status(200).json({ message: SUCCESS_STRINGS.LogoutSuccess });
};

export const me = (req: Request, res: Response) => {
  res.status(200).json({ user: req.user });
};

export const publicKey = (req: Request, res: Response) => {
  res.status(200).json({ publicKey: getPublicKeyPem() });
};

export const health = (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
};


// Future Stubs
export const totpSetup = () => {
  throw new ApiError(501, ERROR_STRINGS.NotImplemented);
};
export const totpVerify = () => {
  throw new ApiError(501, ERROR_STRINGS.NotImplemented);
};
export const oauthCallback = () => {
  throw new ApiError(501, ERROR_STRINGS.NotImplemented);
};
export const verifyEmail = () => {
  throw new ApiError(501, ERROR_STRINGS.NotImplemented);
};
export const requestOtp = () => {
  throw new ApiError(501, ERROR_STRINGS.NotImplemented);
};
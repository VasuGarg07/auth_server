import { Router } from 'express';
import { authenticate, validate } from './middleware';
import { changePasswordSchema, loginSchema, refreshTokenSchema, registerSchema } from './validator';
import { publicKey, health, login, changePassword, refresh, logout, me, totpSetup, totpVerify, oauthCallback, verifyEmail, requestOtp, register } from './controller';

const router = Router();


// Public Endpoints
router.get('/auth/public-key', publicKey);
router.get('/health', health);

// Core Endpoints
router.post('/auth/register', validate(registerSchema), register);
router.post('/auth/login', validate(loginSchema), login);
router.post('/auth/change-password', validate(changePasswordSchema), changePassword);
router.post('/auth/refresh', validate(refreshTokenSchema), refresh);
router.post('/auth/logout', validate(refreshTokenSchema), logout);
router.get('/auth/me', authenticate, me);

// Future stubs
router.post('/auth/totp/setup', totpSetup);
router.post('/auth/totp/verify', totpVerify);
router.get('/auth/oauth/:provider/callback', oauthCallback);
router.post('/auth/verify-email', verifyEmail);
router.post('/auth/request-otp', requestOtp);

export default router;
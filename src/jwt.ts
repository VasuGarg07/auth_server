import { readFileSync } from 'fs';
import jwt, { SignOptions } from 'jsonwebtoken';
import CONFIG from './config';

const privateKey = readFileSync(CONFIG.PRIVATE_KEY_PATH, 'utf-8');
const publicKey = readFileSync(CONFIG.PUBLIC_KEY_PATH, 'utf-8');

export const getPublicKeyPem = (): string => publicKey;

export interface TokenPayload {
    id: string;
    username: string;
    email: string;
}

export const signAccessToken = (payload: TokenPayload): string =>
    jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: CONFIG.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
    });

export const signRefreshToken = (payload: TokenPayload): string =>
    jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: CONFIG.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
    });

export const verifyToken = (token: string): TokenPayload =>
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as TokenPayload;
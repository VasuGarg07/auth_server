# auth-server

A standalone, reusable authentication server. Handles identity — registration, login, token issuance, password reset. Designed to plug into any number of independent apps without modification.

Built with Express 5, TypeScript, Drizzle ORM, and PostgreSQL. Tokens signed with RS256 — resource servers verify locally with the public key, no roundtrip required.

---
## Stack
 
Express 5 · TypeScript · Drizzle · PostgreSQL · jsonwebtoken · bcrypt · Zod
 
## Setup
 
```bash
npm install
 
mkdir keys
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
 
cp .env.example .env   # fill in DATABASE_URL
 
npm run db:migrate
npm run dev
```
 
## API
 
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/auth/register` | — |
| POST | `/auth/login` | — |
| POST | `/auth/refresh` | — |
| POST | `/auth/logout` | — |
| POST | `/auth/change-password` | — |
| GET  | `/auth/me` | Bearer token |
| GET  | `/auth/public-key` | — |
| GET  | `/health` | — |
 
## How resource servers use it
 
Fetch `/auth/public-key` once. Verify incoming JWTs locally with RS256. JWT payload contains `id`, `username`, `email`. RBAC lives in each resource server.
 
## Scripts
 
```
npm run dev           # hot reload
npm run build         # compile to dist/
npm start             # run compiled build
npm run db:generate   # generate migration from schema changes
npm run db:migrate    # apply migrations
npm run db:studio     # DB browser
```
 
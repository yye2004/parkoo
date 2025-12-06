# parkoo
Parking Management System

## Structure
- `backend/`: Node + TypeScript Express API (auth + availability skeleton).
- `mobile/`: Expo + React Native app skeleton.

## Backend quickstart
```bash
cd backend
npm install
npm run dev
```

Environment variables (create `.env` in `backend/`):
```
PORT=4000
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

Endpoints:
- `POST /auth/register` `{ email, password, name, phone?, locale? }`
- `POST /auth/login` `{ email, password }`
- `GET /auth/me` (Bearer token)
- `PATCH /auth/me` to update profile/twoFa flag
- `GET /availability` sample availability snapshot
- `GET /health` health check

## Deploying backend to Vercel (serverless)
Vercel config is in `vercel.json` and `backend/api/index.ts` (serverless wrapper).
Steps:
1) Push to GitHub.
2) In Vercel, “Import Project” and pick this repo.
3) Set root as repo root (Vercel will auto-detect `vercel.json`).
4) Add env vars: `JWT_SECRET`, `JWT_REFRESH_SECRET` (and anything else you need). Vercel sets `PORT` internally; no need to override.
5) Deploy. Vercel gives you a public URL; use it in the mobile app via `EXPO_PUBLIC_API_BASE_URL`.

## Mobile quickstart (Expo)
```bash
cd mobile
npm install
npm run start
# for Android emulator, backend should run and API base defaults to http://10.0.2.2:4000
```

Screens:
- Login/Register using backend auth endpoints
- Availability list with auto-refresh (15s) and manual pull-to-refresh
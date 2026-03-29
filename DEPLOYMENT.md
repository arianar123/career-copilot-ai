# Deployment Guide

## Recommended Stack

- Frontend: `Vercel`
- Backend API: `Render` or `Railway`
- Production database: hosted `PostgreSQL`

The app already supports `DATABASE_URL`, so you can swap local SQLite for Postgres in production without changing application code.

## 1. Deploy the Backend

### Option A: Render

1. Create a new Web Service from the `backend/` folder.
2. Use:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
   - `CORS_ORIGINS=https://your-vercel-domain.vercel.app`
4. If you do not want real model calls yet, leave `OPENAI_API_KEY` empty and keep demo mode enabled on the frontend.

### Option B: Railway

1. Create a new service from the `backend/` folder.
2. Railway can use the same start command:
   - `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add the same environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
   - `CORS_ORIGINS=https://your-vercel-domain.vercel.app`

## 2. Deploy the Frontend

### Vercel

1. Import the `frontend/` folder as a project.
2. Set the framework to `Next.js`.
3. Add environment variables:
   - `NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain`
   - `NEXT_PUBLIC_DEMO_MODE=false` when a real backend key is configured
4. Deploy.

## 3. Production Database

Local SQLite is fine for demo mode, but production should use Postgres.

Example `DATABASE_URL`:

```text
postgresql+psycopg://username:password@host:5432/careercopilot
```

If your host provides a plain Postgres URL, update the SQLAlchemy driver as needed for your platform.

## 4. Final Deployment Checklist

- Backend `/health` returns `200`
- Backend `/docs` loads correctly
- Frontend points to the deployed backend URL
- CORS includes the deployed frontend domain
- Demo banner is disabled only when a valid `OPENAI_API_KEY` is configured
- At least one resume analysis and one mock interview flow succeed in production

## 5. Suggested Portfolio Setup

- Keep demo mode on for the public portfolio version if you do not want model costs
- Mention in the project description that the app supports live AI mode when configured
- Add screenshots or a short demo clip of:
  - resume analysis
  - dashboard insights
  - mock interview coaching

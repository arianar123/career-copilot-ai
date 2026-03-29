# Deployment Guide

## Recommended Stack

- Frontend: `Vercel`
- Backend API: local `FastAPI` for the real Ollama version, or `Render` / `Railway` if you later switch to a hosted model provider
- Production database: hosted `PostgreSQL`

The app already supports `DATABASE_URL`, so you can swap local SQLite for Postgres in production without changing application code.

## 1. Real AI Runtime

### Local Ollama stack

1. Install Ollama and pull a model such as `qwen2.5:1.5b`
2. Run `ollama serve`
3. Start the backend with:
   - `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Use environment variables:
   - `DATABASE_URL`
   - `CORS_ORIGINS=http://127.0.0.1:3100,http://localhost:3100`
   - `OLLAMA_BASE_URL=http://127.0.0.1:11434`
   - `OLLAMA_MODEL=qwen2.5:1.5b`

### Hosted option later

If you want a fully hosted AI deployment later, replace the local model layer with a hosted inference provider, then deploy the backend to `Render` or `Railway`.

## 2. Deploy the Frontend

### Vercel

1. Import the `frontend/` folder as a project.
2. Set the framework to `Next.js`.
3. Add environment variables:
   - `NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain`
   - `NEXT_PUBLIC_DEMO_MODE=false` when a live backend is configured
4. Deploy.

For a stable contest submission, the safest public setup is:

- deploy the frontend
- keep `NEXT_PUBLIC_DEMO_MODE=true`
- use the public site as the judging link
- use the local Ollama stack for the real AI version during development or live demos

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
- Demo banner is disabled only when a live backend is configured
- At least one resume analysis and one mock interview flow succeed in production

## 5. Suggested Portfolio Setup

- Keep demo mode on for the public portfolio version if you do not want model costs
- Mention in the project description that the app supports live AI mode when configured
- Add screenshots or a short demo clip of:
  - resume analysis
  - dashboard insights
  - mock interview coaching

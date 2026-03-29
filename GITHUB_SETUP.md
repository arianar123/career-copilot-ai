# GitHub Setup

## Repo Name

`career-copilot-ai`

## Suggested Description

`AI-powered career intelligence workspace for students: resume analysis, market signals, interview coaching, and progress tracking.`

## Push Commands

Run these from the project root:

```bash
git init
git add .
git commit -m "Initial CareerCopilot AI submission"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/career-copilot-ai.git
git push -u origin main
```

## Important

- Do not commit `backend/.env`
- Do not commit `frontend/.env.local`
- Do not commit `backend/career_copilot.db`

The included `.gitignore` already excludes those files.

## After GitHub

1. Import the repo into Vercel
2. Set the frontend root directory to `frontend`
3. Set `NEXT_PUBLIC_DEMO_MODE=true` for the safest contest deployment
4. Submit the Vercel production URL

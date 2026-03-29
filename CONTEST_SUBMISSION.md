# Contest Submission Brief

## Project Name

CareerCopilot AI

## One-Sentence Pitch

CareerCopilot AI is an AI-powered career intelligence workspace that helps students understand job-market demand, improve their resumes, practice interviews, and track career progress in one system.

## Problem

Students often approach job searching as a disconnected series of tasks:

- resume editing
- searching for jobs
- practicing interviews
- trying to understand which skills matter most

Most tools solve only one small part of that workflow. As a result, students still waste time guessing what to improve, how to position themselves, and which roles they are realistically competitive for.

## Solution

CareerCopilot AI turns career prep into a connected workflow:

- resume analysis against target roles
- skill-gap and roadmap generation
- market intelligence snapshots by role and region
- mock interview coaching with actionable feedback
- dashboard views for progress tracking
- personal workspace defaults and lightweight demo auth

## Why It Stands Out

- It is not just a chatbot. It behaves like a recruiter, coach, and progress tracker.
- It focuses on outcomes, not generic advice.
- It combines multiple AI-assisted workflows into one experience.
- It is easy to demo live because the product has a clear narrative from problem to improvement.
- It includes a stable public demo build plus a real local AI mode for deeper testing.

## Key Features

- Resume score-style analysis with missing skills, weaknesses, and rewritten bullets
- 30 / 60 / 90 day career roadmap generation
- Job market intelligence snapshots
- Mock interview simulator with coaching feedback
- Saved reports dashboard
- Exportable summaries and downloadable reports
- Personal workspace defaults

## Technical Stack

- Frontend: Next.js App Router
- Backend: FastAPI
- Database: SQLite locally, `DATABASE_URL`-ready for Postgres
- AI integration: local `Ollama` workflow, with a public demo-safe frontend mode
- Styling: Custom CSS with intentional visual polish

## Demo Flow

1. Open the resume analysis page and load demo data
2. Generate the analysis report
3. Open market intelligence and show role/region insights
4. Open the dashboard to show saved progress
5. Open the interview coach and generate feedback
6. Show the workspace page and explain personalization

## Innovation Angle

The innovation is not only in model use, but in orchestration. CareerCopilot AI turns fragmented career-prep tasks into one persistent decision-support system, which makes the product feel more like a personal career agent than a set of isolated tools.

## Target Users

- college students
- internship seekers
- early-career job seekers
- career switchers in a later version

## What I Would Build Next

- real job application tracking with Kanban states
- true backend auth and multi-user persistence
- live integrations for job listings and alerts
- richer ATS simulation and recruiter-style scoring

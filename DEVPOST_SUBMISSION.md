# Devpost Submission Draft

## Project Title

CareerCopilot AI

## Tagline

An AI-powered career intelligence workspace for students navigating internships and early-career roles.

## What It Does

CareerCopilot AI helps students turn career prep into a connected workflow instead of a scattered set of tasks. A user can:

- analyze a resume against a target role
- identify skill gaps and rewrite weak resume bullets
- generate a 30 / 60 / 90 day career roadmap
- view job market intelligence for a target role and region
- practice mock interviews and receive coaching feedback
- track progress through a saved dashboard
- personalize the workspace with role, region, and career goals

## Inspiration

Students often jump between separate tools for resumes, job research, interview prep, and progress tracking. That creates friction and confusion, especially for people who are still figuring out how to position themselves. I wanted to build something that feels less like “another AI chatbot” and more like a personal career operating system.

## How We Built It

CareerCopilot AI uses:

- `Next.js` for the frontend experience
- `FastAPI` for the backend API
- `SQLite` for local persistence, with `DATABASE_URL` support for future hosted databases
- an OpenAI-compatible workflow for AI responses, with a safe mock fallback for demo stability

The system was built as a connected set of workflows:

- resume analysis
- market intelligence
- interview coaching
- dashboard tracking
- workspace personalization

## Challenges We Ran Into

- making the product feel like one coherent workflow instead of multiple disconnected AI tools
- keeping the demo stable even when live API access is unavailable
- balancing a polished frontend experience with fast iteration on backend features
- making local setup reliable on Windows for repeated testing and demos

## Accomplishments That We’re Proud Of

- built a multi-feature product instead of a single prompt box
- created a clean, explainable demo flow that judges can follow quickly
- added mock-safe fallbacks so the app remains usable under pressure
- turned career prep into a system that feels persistent and personalized
- packaged the repo with contest-ready assets including a pitch, demo script, and submission brief

## What We Learned

- AI products feel much stronger when they guide decisions instead of only generating text
- workflow design matters as much as model integration
- stable demos require defensive thinking, especially around fallback states and local setup

## What’s Next for CareerCopilot AI

- real backend authentication and multi-user persistence
- job application tracking with Kanban stages
- ATS simulation and recruiter-style scoring
- live job integrations and alerts
- automated outreach and follow-up assistance

## Built With

- Next.js
- React
- TypeScript
- FastAPI
- Python
- SQLite
- OpenAI-compatible API flow

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Career intelligence for students</span>
        <h1>Turn your job search into a system, not a guessing game.</h1>
        <p>
          CareerCopilot analyzes your resume against target roles, highlights repeated
          skill gaps, generates action plans, and helps you practice interviews with a
          coach-style feedback loop.
        </p>
        <div className="action-row">
          <Link className="button" href="/upload">
            Analyze resume
          </Link>
          <Link className="button secondary" href="/market">
            Market trends
          </Link>
          <Link className="button secondary" href="/interview">
            Mock interview
          </Link>
          <Link className="button secondary" href="/dashboard">
            View dashboard
          </Link>
          <Link className="button secondary" href="/workspace">
            Personalize workspace
          </Link>
          <a className="button secondary" href="http://localhost:8000/docs">
            API docs
          </a>
        </div>
      </section>

      <section className="hero highlight-hero">
        <div>
          <span className="eyebrow">Why it stands out</span>
          <h2>It behaves like a recruiter, coach, and progress tracker in one app.</h2>
        </div>
        <div className="metric-row">
          <div className="metric-card">
            <span>Resume match</span>
            <strong>Score + gaps</strong>
          </div>
          <div className="metric-card">
            <span>Career plan</span>
            <strong>30 / 60 / 90</strong>
          </div>
          <div className="metric-card">
            <span>Interview prep</span>
            <strong>Questions + feedback</strong>
          </div>
          <div className="metric-card">
            <span>Market view</span>
            <strong>Signals + salaries</strong>
          </div>
          <div className="metric-card">
            <span>Workspace</span>
            <strong>Saved profile</strong>
          </div>
        </div>
      </section>

      <section className="grid two">
        <article className="card">
          <h2>What the MVP shows employers</h2>
          <ul>
            <li>Document parsing and structured data extraction</li>
            <li>LLM-backed scoring and recommendation generation</li>
            <li>Full-stack product thinking with clean workflows</li>
            <li>Clear outcomes users can act on immediately</li>
          </ul>
        </article>

        <article className="card">
          <h2>Suggested demo flow</h2>
          <ul>
            <li>Upload a resume or paste resume text</li>
            <li>Open market trends to frame what skills matter most</li>
            <li>Paste a target role description</li>
            <li>Review your match score and missing skills</li>
            <li>Open the dashboard and interview coach to show progression</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

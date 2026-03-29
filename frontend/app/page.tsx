import Link from "next/link";

const productSignals = [
  {
    label: "Resume intelligence",
    value: "Match scoring, gap detection, sharper bullets"
  },
  {
    label: "Interview coaching",
    value: "Role-aware questions with better-answer rewrites"
  },
  {
    label: "Market timing",
    value: "Skill demand, salary ranges, and focus signals"
  }
];

const valuePoints = [
  "Document parsing and structured extraction from real resumes",
  "AI-backed recommendations that turn into immediate next steps",
  "A connected workflow instead of five disconnected career tools",
  "A product story that feels useful, demoable, and employable"
];

const demoFlow = [
  "Upload a resume or paste your resume text",
  "Run a market scan to frame which skills are rising",
  "Analyze a target role to surface the match score and missing skills",
  "Open the dashboard to show saved progress across attempts",
  "Use interview mode to practice and improve your answers"
];

export default function HomePage() {
  return (
    <main className="page-shell landing-shell">
      <section className="hero hero-showcase">
        <div className="hero-copy">
          <span className="eyebrow">Career Intelligence Studio</span>
          <p className="hero-kicker">
            Built for students who want more than generic job-search advice.
          </p>
          <h1>Turn your career hunt into a sharp, trackable operating system.</h1>
          <p className="hero-lead">
            CareerCopilot analyzes your resume against target roles, highlights
            repeated skill gaps, generates practical action plans, and helps you
            rehearse interviews with coach-style feedback.
          </p>

          <div className="action-row">
            <Link className="button" href="/upload">
              Start analysis
            </Link>
            <Link className="button secondary" href="/dashboard">
              Open dashboard
            </Link>
            <Link className="button secondary" href="/interview">
              Practice interview
            </Link>
          </div>

          <div className="hero-ribbon">
            <span>Local AI ready</span>
            <span>Resume + market + interview in one flow</span>
          </div>
        </div>

        <div className="hero-aside">
          <div className="signal-card signal-card-accent">
            <span className="signal-label">Job-ready signal</span>
            <strong>78%</strong>
            <p>Example match score after a resume-to-role comparison.</p>
          </div>

          <div className="signal-stack">
            {productSignals.map((signal) => (
              <article className="signal-card" key={signal.label}>
                <span className="signal-label">{signal.label}</span>
                <strong>{signal.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-grid">
        <article className="card feature-panel">
          <div className="section-heading">
            <span className="eyebrow">Why it lands</span>
            <h2>It feels like a recruiter, coach, and progress tracker in one place.</h2>
          </div>

          <div className="feature-lattice">
            <div className="feature-tile">
              <span>Resume analysis</span>
              <strong>Score, gaps, bullet rewrites</strong>
            </div>
            <div className="feature-tile">
              <span>Roadmap generation</span>
              <strong>30 / 60 / 90 day action plan</strong>
            </div>
            <div className="feature-tile">
              <span>Interview simulator</span>
              <strong>Question bank and feedback loop</strong>
            </div>
            <div className="feature-tile">
              <span>Market snapshot</span>
              <strong>Signals, skills, and salary framing</strong>
            </div>
          </div>
        </article>

        <article className="card note-panel">
          <div className="section-heading">
            <span className="eyebrow">What employers notice</span>
            <h2>A portfolio project with technical depth and obvious user value.</h2>
          </div>

          <ul className="editorial-list">
            {valuePoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <div className="section-heading">
            <span className="eyebrow">Suggested walkthrough</span>
            <h2>A cleaner 60-second demo story</h2>
          </div>

          <ol className="number-list">
            {demoFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="card callout-panel">
          <div className="section-heading">
            <span className="eyebrow">Best next screens</span>
            <h2>Jump straight into the strongest product moments.</h2>
          </div>

          <div className="callout-links">
            <Link href="/upload">Analyze a resume</Link>
            <Link href="/market">Scan market demand</Link>
            <Link href="/interview">Run interview coaching</Link>
            <Link href="/workspace">Personalize workspace</Link>
          </div>
        </article>
      </section>
    </main>
  );
}

import Link from "next/link";

import { InterviewCoach } from "../../components/InterviewCoach";

export default function InterviewPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Mock interview</span>
        <h1>Practice answers with a built-in interview coach.</h1>
        <p>
          This feature gives the demo a stronger wow factor by turning static analysis
          into an interactive career preparation workflow.
        </p>
        <div className="action-row">
          <Link className="button secondary" href="/">
            Home
          </Link>
          <Link className="button secondary" href="/dashboard">
            Dashboard
          </Link>
        </div>
      </section>

      <InterviewCoach />
    </main>
  );
}

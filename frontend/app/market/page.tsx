import Link from "next/link";

import { MarketSnapshot } from "../../components/MarketSnapshot";

export default function MarketPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Job market intelligence</span>
        <h1>See what the market is rewarding before you apply.</h1>
        <p>
          This view gives CareerCopilot a strategy layer by surfacing demand, salary
          signals, top skills, and practical focus areas by role.
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

      <MarketSnapshot />
    </main>
  );
}

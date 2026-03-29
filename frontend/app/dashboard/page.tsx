import Link from "next/link";

import { AnalysisHistoryCard } from "../../components/AnalysisHistoryCard";
import { DashboardInsights } from "../../components/DashboardInsights";
import { listRecentAnalyses, type AnalysisSummary } from "../../lib/api";

export default async function DashboardPage() {
  let analyses: AnalysisSummary[] = [];
  let error = "";

  try {
    analyses = await listRecentAnalyses();
  } catch (dashboardError) {
    error =
      dashboardError instanceof Error
        ? dashboardError.message
        : "Could not load the dashboard.";
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Career dashboard</span>
        <h1>Track your recent analyses and revisit improvement plans.</h1>
        <p>
          This is where CareerCopilot starts to feel less like a single prompt and more
          like an ongoing system for career decision-making.
        </p>
        <div className="action-row">
          <Link className="button" href="/upload">
            New analysis
          </Link>
          <Link className="button secondary" href="/">
            Home
          </Link>
        </div>
      </section>

      {analyses.length > 0 ? (
        <>
          <DashboardInsights analyses={analyses} />
          <section className="grid two">
            {analyses.map((analysis) => (
              <AnalysisHistoryCard key={analysis.analysis_id} analysis={analysis} />
            ))}
          </section>
        </>
      ) : (
        <section className="card empty">
          {error || "No saved analyses yet. Run your first report to populate the dashboard."}
        </section>
      )}
    </main>
  );
}

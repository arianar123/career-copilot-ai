"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AnalysisHistoryCard } from "../../components/AnalysisHistoryCard";
import { DashboardInsights } from "../../components/DashboardInsights";
import { useAuth } from "../../components/AuthProvider";
import {
  loadAnalysisHistory
} from "../../lib/analysisHistory";
import type { AnalysisSummary } from "../../lib/api";

export default function DashboardPage() {
  const { session, hydrated } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!session?.email) {
      setAnalyses([]);
      return;
    }

    setAnalyses(loadAnalysisHistory(session.email));
  }, [hydrated, session?.email]);

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

      {!hydrated ? (
        <section className="card empty">Loading your dashboard...</section>
      ) : !session ? (
        <section className="card empty">
          Sign in to keep a persistent analysis history. Signed-out sessions can still
          run reports, but they do not save to the dashboard.
        </section>
      ) : analyses.length > 0 ? (
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
          No saved analyses yet for this account. Run a report while signed in to
          populate your dashboard.
        </section>
      )}
    </main>
  );
}

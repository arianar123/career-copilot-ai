"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AnalysisResults } from "../../../components/AnalysisResults";
import { useAuth } from "../../../components/AuthProvider";
import { loadAnalysisHistory } from "../../../lib/analysisHistory";
import { getAnalysis, type AnalysisResponse } from "../../../lib/api";

export default function AnalysisDetailPage({
  params
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { session, hydrated } = useAuth();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!hydrated) {
        return;
      }

      if (!session?.email) {
        setAnalysis(null);
        setError("Sign in to open saved reports.");
        setLoading(false);
        return;
      }

      const savedIds = new Set(
        loadAnalysisHistory(session.email).map((item) => item.analysis_id)
      );

      if (!savedIds.has(id)) {
        setAnalysis(null);
        setError("This report is not available in the current signed-in workspace.");
        setLoading(false);
        return;
      }

      try {
        const nextAnalysis = await getAnalysis(id);
        setAnalysis(nextAnalysis);
        setError("");
      } catch (pageError) {
        setAnalysis(null);
        setError(
          pageError instanceof Error
            ? pageError.message
            : "Could not load this analysis."
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [hydrated, id, session?.email]);

  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Saved analysis</span>
        <h1>Review a previously generated career report.</h1>
        <p>
          This page gives each signed-in report a stable route inside your workspace.
        </p>
        <div className="action-row">
          <Link className="button secondary" href="/upload">
            Run another analysis
          </Link>
          <Link className="button secondary" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </section>

      {loading ? (
        <section className="card empty">Loading this saved report...</section>
      ) : analysis ? (
        <AnalysisResults result={analysis} />
      ) : (
        <section className="card empty">{error || "Analysis not available."}</section>
      )}
    </main>
  );
}

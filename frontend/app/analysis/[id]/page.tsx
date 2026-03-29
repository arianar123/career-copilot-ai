import Link from "next/link";

import { AnalysisResults } from "../../../components/AnalysisResults";
import { getAnalysis } from "../../../lib/api";

export default async function AnalysisDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let analysis = null;
  let error = "";

  try {
    analysis = await getAnalysis(id);
  } catch (pageError) {
    error =
      pageError instanceof Error ? pageError.message : "Could not load this analysis.";
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Saved analysis</span>
        <h1>Review a previously generated career report.</h1>
        <p>
          This page makes the MVP feel more like a real product by giving every result a
          stable route.
        </p>
        <div className="action-row">
          <Link className="button secondary" href="/upload">
            Run another analysis
          </Link>
        </div>
      </section>

      {analysis ? (
        <AnalysisResults result={analysis} />
      ) : (
        <section className="card empty">{error || "Analysis not available."}</section>
      )}
    </main>
  );
}

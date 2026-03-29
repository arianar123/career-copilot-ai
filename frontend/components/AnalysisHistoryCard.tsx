import Link from "next/link";

import type { AnalysisSummary } from "../lib/api";

export function AnalysisHistoryCard({ analysis }: { analysis: AnalysisSummary }) {
  const createdAt = new Date(analysis.created_at).toLocaleString();

  return (
    <article className="card stack">
      <div>
        <span className="eyebrow">Saved analysis</span>
        <h3>{analysis.target_role}</h3>
        <p>Generated {createdAt}</p>
      </div>
      <div className="score" style={{ fontSize: "42px" }}>
        {analysis.match_score}
      </div>
      <ul className="pill-list">
        {analysis.missing_skills.slice(0, 3).map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
      <div className="action-row">
        <Link className="button" href={`/analysis/${analysis.analysis_id}`}>
          View report
        </Link>
      </div>
    </article>
  );
}

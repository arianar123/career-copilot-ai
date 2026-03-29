import type { AnalysisSummary } from "../lib/api";

function buildInsights(analyses: AnalysisSummary[]) {
  const averageScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((total, analysis) => total + analysis.match_score, 0) /
            analyses.length
        )
      : 0;

  const topScore =
    analyses.length > 0
      ? analyses.reduce(
          (best, analysis) => Math.max(best, analysis.match_score),
          analyses[0]?.match_score ?? 0
        )
      : 0;

  const skillCounts = new Map<string, number>();
  for (const analysis of analyses) {
    for (const skill of analysis.missing_skills) {
      skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1);
    }
  }

  const topGaps = [...skillCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5);

  const recentRoles = analyses.slice(0, 4).map((analysis) => analysis.target_role);

  return {
    averageScore,
    topScore,
    topGaps,
    recentRoles
  };
}

export function DashboardInsights({ analyses }: { analyses: AnalysisSummary[] }) {
  const { averageScore, topScore, topGaps, recentRoles } = buildInsights(analyses);

  return (
    <section className="grid two">
      <article className="card stack">
        <div>
          <span className="eyebrow">Career snapshot</span>
          <h2>How your recent applications are trending</h2>
        </div>
        <div className="metric-row">
          <div className="metric-card">
            <span>Average match</span>
            <strong>{averageScore}</strong>
          </div>
          <div className="metric-card">
            <span>Best score</span>
            <strong>{topScore}</strong>
          </div>
          <div className="metric-card">
            <span>Saved reports</span>
            <strong>{analyses.length}</strong>
          </div>
        </div>
        <div className="bar-chart">
          {analyses.map((analysis) => (
            <div className="bar-group" key={analysis.analysis_id}>
              <div
                className="bar-fill"
                style={{ height: `${Math.max(12, analysis.match_score)}%` }}
                title={`${analysis.target_role}: ${analysis.match_score}`}
              />
              <span>{analysis.match_score}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="card stack">
        <div>
          <span className="eyebrow">Top skill gaps</span>
          <h2>What keeps appearing across roles</h2>
        </div>
        {topGaps.length > 0 ? (
          <div className="gap-list">
            {topGaps.map(([skill, count]) => (
              <div className="gap-row" key={skill}>
                <span>{skill}</span>
                <strong>{count}x</strong>
              </div>
            ))}
          </div>
        ) : (
          <p>No repeated gaps yet.</p>
        )}
        <div>
          <span className="eyebrow">Recent target roles</span>
          <ul className="pill-list">
            {recentRoles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  );
}

export function MatchScoreCard({
  score,
  strengths
}: {
  score: number;
  strengths: string[];
}) {
  return (
    <section className="card stack">
      <div>
        <span className="eyebrow">Match score</span>
        <h3>How close your resume is to the target role</h3>
      </div>
      <div className="score">{score}</div>
      <ul className="pill-list">
        {strengths.map((strength) => (
          <li key={strength}>{strength}</li>
        ))}
      </ul>
    </section>
  );
}

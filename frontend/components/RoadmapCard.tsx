type Roadmap = {
  thirty_days: string[];
  sixty_days: string[];
  ninety_days: string[];
};

export function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  const steps = [
    { label: "30 days", items: roadmap.thirty_days },
    { label: "60 days", items: roadmap.sixty_days },
    { label: "90 days", items: roadmap.ninety_days }
  ];

  return (
    <section className="card stack">
      <div>
        <span className="eyebrow">Career roadmap</span>
        <h3>Your next 90 days, broken into practical moves</h3>
      </div>
      <div className="timeline">
        {steps.map((step) => (
          <div className="timeline-step" key={step.label}>
            <strong>{step.label}</strong>
            <ul>
              {step.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

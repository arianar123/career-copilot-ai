"use client";

import { useEffect, useState } from "react";

import { getMarketSnapshot, type MarketResponse } from "../lib/api";
import { useUserProfile } from "./UserProfileProvider";

export function MarketSnapshot() {
  const { profile, hydrated } = useUserProfile();
  const [targetRole, setTargetRole] = useState("Data Analyst Intern");
  const [region, setRegion] = useState("Chicago, IL");
  const [result, setResult] = useState<MarketResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated) {
      setTargetRole(profile.targetRole);
      setRegion(profile.region);
    }
  }, [hydrated, profile.region, profile.targetRole]);

  function loadDemoMarket() {
    setTargetRole(profile.targetRole || "Data Analyst Intern");
    setRegion(profile.region || "Chicago, IL");
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const snapshot = await getMarketSnapshot({
        target_role: targetRole,
        region
      });
      setResult(snapshot);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not generate market intelligence."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid">
      <form className="card stack" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">Market intelligence</span>
          <h2>See what skills and signals are rising for your target role.</h2>
        </div>

        <div className="action-row">
          <button className="button secondary" type="button" onClick={loadDemoMarket}>
            Load demo market
          </button>
        </div>

        <label className="field">
          <span>Target role</span>
          <input
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Region</span>
          <input
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            placeholder="Chicago, IL"
            required
          />
        </label>

        <div className="action-row">
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Scanning..." : "Generate market snapshot"}
          </button>
        </div>

        {error ? <p>{error}</p> : null}
        <p className="helper-copy">
          Tip: this is a mock-backed intelligence view designed for safe live demos.
        </p>
      </form>

      {result ? (
        <div className="grid two">
          <section className="card stack">
            <div>
              <span className="eyebrow">Role outlook</span>
              <h3>
                {result.target_role} in {result.region}
              </h3>
            </div>
            <div className="metric-row">
              <div className="metric-card">
                <span>Demand</span>
                <strong>{result.demand_level}</strong>
              </div>
              <div className="metric-card">
                <span>Comp range</span>
                <strong style={{ fontSize: "22px" }}>{result.salary_range}</strong>
              </div>
            </div>
          </section>

          <section className="card stack">
            <div>
              <span className="eyebrow">Top skills</span>
              <h3>Most valuable capabilities to build next</h3>
            </div>
            <ul className="pill-list">
              {result.top_skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>

          <section className="card stack">
            <div>
              <span className="eyebrow">Hiring signals</span>
              <h3>What employers appear to be rewarding</h3>
            </div>
            <ul>
              {result.hiring_signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </section>

          <section className="card stack">
            <div>
              <span className="eyebrow">Recommended focus</span>
              <h3>What to do with this information</h3>
            </div>
            <ul>
              {result.recommended_focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <section className="card empty">
          Your market snapshot will appear here after you run the scan.
        </section>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

import { useUserProfile } from "./UserProfileProvider";

export function WorkspaceProfileForm() {
  const { profile, updateProfile, resetProfile } = useUserProfile();
  const [name, setName] = useState(profile.name);
  const [targetRole, setTargetRole] = useState(profile.targetRole);
  const [region, setRegion] = useState(profile.region);
  const [careerGoal, setCareerGoal] = useState(profile.careerGoal);
  const [saved, setSaved] = useState(false);

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateProfile({ name, targetRole, region, careerGoal });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function handleReset() {
    resetProfile();
    setName("Student Builder");
    setTargetRole("Data Analyst Intern");
    setRegion("Chicago, IL");
    setCareerGoal(
      "Land a strong internship with a portfolio that proves practical impact."
    );
    setSaved(false);
  }

  return (
    <div className="grid two">
      <form className="card stack" onSubmit={handleSave}>
        <div>
          <span className="eyebrow">Workspace profile</span>
          <h2>Save your personal defaults once and reuse them across the app.</h2>
        </div>

        <label className="field">
          <span>Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>

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
          <input value={region} onChange={(event) => setRegion(event.target.value)} required />
        </label>

        <label className="field">
          <span>Career goal</span>
          <textarea
            value={careerGoal}
            onChange={(event) => setCareerGoal(event.target.value)}
            required
          />
        </label>

        <div className="action-row">
          <button className="button" type="submit">
            {saved ? "Saved" : "Save workspace"}
          </button>
          <button className="button secondary" type="button" onClick={handleReset}>
            Reset defaults
          </button>
        </div>
      </form>

      <section className="card stack">
        <div>
          <span className="eyebrow">Current snapshot</span>
          <h2>Your stored identity inside CareerCopilot</h2>
        </div>
        <div className="gap-list">
          <div className="gap-row">
            <span>Name</span>
            <strong>{profile.name}</strong>
          </div>
          <div className="gap-row">
            <span>Target role</span>
            <strong>{profile.targetRole}</strong>
          </div>
          <div className="gap-row">
            <span>Region</span>
            <strong>{profile.region}</strong>
          </div>
        </div>
        <p>{profile.careerGoal}</p>
      </section>
    </div>
  );
}

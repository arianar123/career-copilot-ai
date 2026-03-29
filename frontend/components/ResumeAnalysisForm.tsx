"use client";

import { useEffect, useState } from "react";
import {
  runAnalysis,
  uploadResume,
  type AnalysisResponse,
  type ResumeUploadResponse
} from "../lib/api";
import { demoJobDescription, demoResumeText } from "../lib/demoData";
import { AnalysisResults } from "./AnalysisResults";
import { useUserProfile } from "./UserProfileProvider";

export function ResumeAnalysisForm() {
  const { profile, hydrated } = useUserProfile();
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadedResume, setUploadedResume] = useState<ResumeUploadResponse | null>(null);
  const [targetRole, setTargetRole] = useState("Data Analyst Intern");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (hydrated) {
      setTargetRole(profile.targetRole);
    }
  }, [hydrated, profile.targetRole]);

  function loadDemoScenario() {
    setTargetRole(profile.targetRole || "Data Analyst Intern");
    setResumeText(demoResumeText);
    setJobDescription(demoJobDescription);
    setUploadedResume(null);
    setResumeFile(null);
    setError("");
  }

  async function handleResumeUpload() {
    if (!resumeFile) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploaded = await uploadResume(resumeFile, resumeText);
      setUploadedResume(uploaded);
      setResumeText(uploaded.extracted_text);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Something went wrong while extracting resume text."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const analysis = await runAnalysis({
        resume_text: resumeText,
        target_role: targetRole,
        job_description: jobDescription
      });
      setResult(analysis);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while running the analysis."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid">
      <form className="card stack" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">Resume analysis</span>
          <h2>Upload a resume or paste the text, then compare it to a target role.</h2>
        </div>

        <div className="action-row">
          <button className="button secondary" type="button" onClick={loadDemoScenario}>
            Load demo data
          </button>
        </div>

        <label className="field">
          <span>Target role</span>
          <input
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            placeholder="Software Engineer Intern"
            required
          />
        </label>

        <label className="field">
          <span>Resume file</span>
          <input
            accept=".pdf,.docx,.txt,.md,.rtf"
            type="file"
            onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
          />
        </label>

        <div className="action-row">
          <button
            className="button secondary"
            type="button"
            onClick={handleResumeUpload}
            disabled={!resumeFile || uploading}
          >
            {uploading ? "Extracting..." : "Extract resume text"}
          </button>
        </div>

        {uploadedResume ? (
          <div className="card">
            <span className="eyebrow">Uploaded resume</span>
            <p>
              Parsed <strong>{uploadedResume.file_name}</strong> with{" "}
              <strong>{uploadedResume.characters}</strong> characters extracted.
            </p>
          </div>
        ) : null}

        <label className="field">
          <span>Resume text</span>
          <textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste your resume text here, or upload a file and let the app fill this in..."
            required
          />
        </label>

        <label className="field">
          <span>Job description</span>
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job description here..."
            required
          />
        </label>

        <div className="action-row">
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Generate report"}
          </button>
        </div>

        {error ? <p>{error}</p> : null}

        <p className="helper-copy">
          Tip: use <strong>Load demo data</strong> for a quick portfolio walkthrough.
        </p>
      </form>

      {result ? (
        <AnalysisResults result={result} />
      ) : (
        <div className="card empty">
          Your score, skill gaps, and roadmap will appear here after the first analysis.
        </div>
      )}
    </div>
  );
}

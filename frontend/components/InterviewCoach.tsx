"use client";

import { useEffect, useState } from "react";

import {
  requestInterviewFeedback,
  startInterview,
  type InterviewFeedbackResponse,
  type InterviewQuestion
} from "../lib/api";
import { CopySummaryButton } from "./CopySummaryButton";
import { DownloadSummaryButton } from "./DownloadSummaryButton";
import { demoInterviewAnswer, demoResumeText } from "../lib/demoData";
import { useUserProfile } from "./UserProfileProvider";

function buildInterviewSummary(
  targetRole: string,
  question: string,
  feedback: InterviewFeedbackResponse
) {
  return [
    `CareerCopilot AI Interview Feedback`,
    `Target role: ${targetRole}`,
    `Question: ${question}`,
    ``,
    `Overall score: ${feedback.overall_score}`,
    `Confidence: ${feedback.confidence_score}`,
    `Clarity: ${feedback.clarity_score}`,
    `Technical depth: ${feedback.technical_score}`,
    ``,
    `Strengths:`,
    ...feedback.strengths.map((item) => `- ${item}`),
    ``,
    `Improvements:`,
    ...feedback.improvements.map((item) => `- ${item}`),
    ``,
    `Sample stronger answer:`,
    feedback.sample_better_answer
  ].join("\n");
}

export function InterviewCoach() {
  const { profile, hydrated } = useUserProfile();
  const [targetRole, setTargetRole] = useState("Data Analyst Intern");
  const [resumeText, setResumeText] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedbackResponse | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated) {
      setTargetRole(profile.targetRole);
    }
  }, [hydrated, profile.targetRole]);

  function loadDemoInterview() {
    setTargetRole(profile.targetRole || "Data Analyst Intern");
    setResumeText(demoResumeText);
    setAnswer(demoInterviewAnswer);
    setQuestions([]);
    setSelectedQuestion("");
    setFeedback(null);
    setError("");
  }

  async function handleStartInterview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingQuestions(true);
    setError("");
    setFeedback(null);

    try {
      const response = await startInterview({
        target_role: targetRole,
        resume_text: resumeText
      });
      setQuestions(response.questions);
      setSelectedQuestion(response.questions[0]?.question ?? "");
      setAnswer("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not start the interview."
      );
    } finally {
      setLoadingQuestions(false);
    }
  }

  async function handleGetFeedback() {
    if (!selectedQuestion || !answer.trim()) {
      setError("Choose a question and write an answer first.");
      return;
    }

    setLoadingFeedback(true);
    setError("");

    try {
      const response = await requestInterviewFeedback({
        target_role: targetRole,
        question: selectedQuestion,
        answer
      });
      setFeedback(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not generate feedback."
      );
    } finally {
      setLoadingFeedback(false);
    }
  }

  return (
    <div className="grid">
      <form className="card stack" onSubmit={handleStartInterview}>
        <div>
          <span className="eyebrow">Interview simulator</span>
          <h2>Generate tailored mock questions and get AI-style coaching.</h2>
        </div>

        <div className="action-row">
          <button className="button secondary" type="button" onClick={loadDemoInterview}>
            Load demo data
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
          <span>Resume text</span>
          <textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste your resume text so the interview questions feel tailored..."
            required
          />
        </label>

        <div className="action-row">
          <button className="button" type="submit" disabled={loadingQuestions}>
            {loadingQuestions ? "Generating..." : "Generate questions"}
          </button>
        </div>

        {error ? <p>{error}</p> : null}

        <p className="helper-copy">
          Tip: load the demo scenario, generate questions, then score the sample answer.
        </p>
      </form>

      {questions.length > 0 ? (
        <div className="grid two">
          <section className="card stack">
            <div>
              <span className="eyebrow">Question bank</span>
              <h3>Choose one prompt and answer it like a real interview.</h3>
            </div>
            <div className="question-list">
              {questions.map((question) => (
                <button
                  key={question.question}
                  className={`question-tile ${
                    selectedQuestion === question.question ? "active" : ""
                  }`}
                  type="button"
                  onClick={() => setSelectedQuestion(question.question)}
                >
                  <strong>{question.focus_area}</strong>
                  <span>{question.question}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="card stack">
            <div>
              <span className="eyebrow">Your answer</span>
              <h3>{selectedQuestion}</h3>
            </div>
            <label className="field">
              <span>Answer draft</span>
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write the answer you would give in an actual interview..."
              />
            </label>
            <div className="action-row">
              <button
                className="button"
                type="button"
                onClick={handleGetFeedback}
                disabled={loadingFeedback}
              >
                {loadingFeedback ? "Coaching..." : "Get feedback"}
              </button>
            </div>
          </section>

          {feedback ? (
            <>
              <section className="card stack">
                <div>
                  <span className="eyebrow">Score breakdown</span>
                  <h3>How your answer lands</h3>
                </div>
                <div className="score-grid">
                  <div className="score-panel">
                    <span>Overall</span>
                    <strong>{feedback.overall_score}</strong>
                  </div>
                  <div className="score-panel">
                    <span>Confidence</span>
                    <strong>{feedback.confidence_score}</strong>
                  </div>
                  <div className="score-panel">
                    <span>Clarity</span>
                    <strong>{feedback.clarity_score}</strong>
                  </div>
                  <div className="score-panel">
                    <span>Technical</span>
                    <strong>{feedback.technical_score}</strong>
                  </div>
                </div>
              </section>

              <section className="card stack">
                <div>
                  <span className="eyebrow">Coach notes</span>
                  <h3>Strengths and improvements</h3>
                </div>
                <strong>What worked</strong>
                <ul>
                  {feedback.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <strong>What to improve</strong>
                <ul>
                  {feedback.improvements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="card stack">
                <div>
                  <span className="eyebrow">Stronger example</span>
                  <h3>A tighter version you can practice from</h3>
                </div>
                <p>{feedback.sample_better_answer}</p>
                <div className="action-row">
                  <CopySummaryButton
                    label="Copy coaching notes"
                    text={buildInterviewSummary(targetRole, selectedQuestion, feedback)}
                  />
                  <CopySummaryButton
                    label="Copy stronger answer"
                    text={feedback.sample_better_answer}
                  />
                  <DownloadSummaryButton
                    label="Download coaching notes"
                    filename="careercopilot-interview-feedback.txt"
                    text={buildInterviewSummary(targetRole, selectedQuestion, feedback)}
                  />
                </div>
              </section>
            </>
          ) : null}
        </div>
      ) : (
        <section className="card empty">
          Your mock interview questions and feedback will appear here after you start a session.
        </section>
      )}
    </div>
  );
}

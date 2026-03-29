"use client";

import Link from "next/link";

import type { AnalysisResponse } from "../lib/api";
import { CopySummaryButton } from "./CopySummaryButton";
import { DownloadSummaryButton } from "./DownloadSummaryButton";
import { MatchScoreCard } from "./MatchScoreCard";
import { RoadmapCard } from "./RoadmapCard";
import { SkillGapList } from "./SkillGapList";

function buildAnalysisSummary(result: AnalysisResponse) {
  return [
    `CareerCopilot AI Analysis`,
    `Match score: ${result.match_score}`,
    ``,
    `Top strengths:`,
    ...result.strengths.map((item) => `- ${item}`),
    ``,
    `Missing skills:`,
    ...result.missing_skills.map((item) => `- ${item}`),
    ``,
    `Resume weaknesses:`,
    ...result.weaknesses.map((item) => `- ${item}`),
    ``,
    `Suggested rewritten bullets:`,
    ...result.rewritten_bullets.map((item) => `- ${item}`),
    ``,
    `30-day roadmap:`,
    ...result.roadmap.thirty_days.map((item) => `- ${item}`),
    ``,
    `60-day roadmap:`,
    ...result.roadmap.sixty_days.map((item) => `- ${item}`),
    ``,
    `90-day roadmap:`,
    ...result.roadmap.ninety_days.map((item) => `- ${item}`)
  ].join("\n");
}

export function AnalysisResults({ result }: { result: AnalysisResponse }) {
  const summary = buildAnalysisSummary(result);

  return (
    <div className="grid two">
      <MatchScoreCard score={result.match_score} strengths={result.strengths} />
      <SkillGapList
        title="Missing skills"
        description="Focus here first to raise your match score."
        items={result.missing_skills}
      />
      <SkillGapList
        title="Resume weaknesses"
        description="These issues are holding your story back."
        items={result.weaknesses}
      />
      <SkillGapList
        title="Rewritten bullets"
        description="Use these as stronger, impact-oriented resume lines."
        items={result.rewritten_bullets}
      />
      <RoadmapCard roadmap={result.roadmap} />
      <section className="card stack">
        <div>
          <span className="eyebrow">Saved result</span>
          <h3>Open or export this report for later.</h3>
        </div>
        <div className="action-row">
          <Link className="button" href={`/analysis/${result.analysis_id}`}>
            Open analysis page
          </Link>
          <CopySummaryButton label="Copy report" text={summary} />
          <DownloadSummaryButton
            label="Download report"
            filename={`careercopilot-analysis-${result.analysis_id}.txt`}
            text={summary}
          />
        </div>
      </section>
    </div>
  );
}

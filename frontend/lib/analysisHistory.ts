import type { AnalysisResponse, AnalysisSummary } from "./api";

const STORAGE_PREFIX = "career-copilot-history";

function buildStorageKey(email: string) {
  return `${STORAGE_PREFIX}:${email.toLowerCase()}`;
}

export function loadAnalysisHistory(email: string): AnalysisSummary[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(buildStorageKey(email));
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as AnalysisSummary[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAnalysisToHistory(
  email: string,
  summary: AnalysisSummary
): AnalysisSummary[] {
  const nextHistory = [
    summary,
    ...loadAnalysisHistory(email).filter(
      (item) => item.analysis_id !== summary.analysis_id
    )
  ].slice(0, 12);

  window.localStorage.setItem(
    buildStorageKey(email),
    JSON.stringify(nextHistory)
  );

  return nextHistory;
}

export function clearAnalysisHistory(email: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(buildStorageKey(email));
}

export function buildAnalysisSummaryRecord(
  analysis: AnalysisResponse,
  targetRole: string
): AnalysisSummary {
  return {
    analysis_id: analysis.analysis_id,
    target_role: targetRole,
    match_score: analysis.match_score,
    missing_skills: analysis.missing_skills,
    created_at: new Date().toISOString()
  };
}

export type AnalysisResponse = {
  analysis_id: string;
  match_score: number;
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  rewritten_bullets: string[];
  roadmap: {
    thirty_days: string[];
    sixty_days: string[];
    ninety_days: string[];
  };
};

export type ResumeUploadResponse = {
  file_name: string;
  extracted_text: string;
  characters: string;
};

export type AnalysisSummary = {
  analysis_id: string;
  target_role: string;
  match_score: number;
  missing_skills: string[];
  created_at: string;
};

export type InterviewQuestion = {
  question: string;
  focus_area: string;
};

export type InterviewStartResponse = {
  session_id: string;
  questions: InterviewQuestion[];
};

export type InterviewFeedbackResponse = {
  overall_score: number;
  confidence_score: number;
  clarity_score: number;
  technical_score: number;
  strengths: string[];
  improvements: string[];
  sample_better_answer: string;
};

export type MarketResponse = {
  target_role: string;
  region: string;
  demand_level: string;
  salary_range: string;
  top_skills: string[];
  hiring_signals: string[];
  recommended_focus: string[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const DEMO_MODE = (process.env.NEXT_PUBLIC_DEMO_MODE ?? "true").toLowerCase() !== "false";
const API_PLACEHOLDER =
  !API_BASE_URL || API_BASE_URL.includes("your-") || API_BASE_URL.includes("localhost");

const mockAnalysis: AnalysisResponse = {
  analysis_id: "demo-analysis-001",
  match_score: 78,
  missing_skills: ["SQL optimization", "Power BI", "A/B testing"],
  strengths: ["Python", "data cleaning", "project ownership"],
  weaknesses: [
    "Resume bullets are descriptive instead of impact-oriented",
    "Technical tools are not grouped clearly by category",
    "Experience section lacks quantified results"
  ],
  rewritten_bullets: [
    "Built a Python workflow that cleaned and transformed 50,000+ records, cutting manual reporting time by 40%.",
    "Created a dashboard-ready analytics dataset with SQL and spreadsheet automation to support faster weekly business reviews."
  ],
  roadmap: {
    thirty_days: [
      "Rewrite your resume around measurable outcomes for the target role.",
      "Complete one SQL practice project with joins, aggregations, and query tuning.",
      "Publish an improved LinkedIn summary aligned to the role."
    ],
    sixty_days: [
      "Build a portfolio project using the top missing skills from the report.",
      "Apply to targeted internships and track outcomes in a dashboard.",
      "Practice behavioral and technical interview questions weekly."
    ],
    ninety_days: [
      "Ship a polished project demo with metrics and screenshots.",
      "Ask for mock interviews from a mentor or classmate.",
      "Refine applications based on feedback and rerun stronger role matches."
    ]
  }
};

const mockAnalyses: AnalysisSummary[] = [
  {
    analysis_id: "demo-analysis-001",
    target_role: "Data Analyst Intern",
    match_score: 78,
    missing_skills: ["SQL optimization", "Power BI", "A/B testing"],
    created_at: "2026-03-28T12:00:00.000Z"
  },
  {
    analysis_id: "demo-analysis-002",
    target_role: "Software Engineer Intern",
    match_score: 82,
    missing_skills: ["Testing", "API design", "Deployment"],
    created_at: "2026-03-27T16:00:00.000Z"
  }
];

const mockInterviewQuestions: InterviewStartResponse = {
  session_id: "demo-session-001",
  questions: [
    {
      question: "Tell me about yourself and why this role fits your goals.",
      focus_area: "storytelling"
    },
    {
      question: "Describe a project where you used technical skills to solve a real problem.",
      focus_area: "technical experience"
    },
    {
      question: "Tell me about a challenge and how you handled it.",
      focus_area: "behavioral"
    }
  ]
};

const mockInterviewFeedback: InterviewFeedbackResponse = {
  overall_score: 76,
  confidence_score: 73,
  clarity_score: 79,
  technical_score: 77,
  strengths: [
    "Your answer is role-focused and easy to follow.",
    "You show ownership over the work you describe.",
    "The example connects your skills back to employer value."
  ],
  improvements: [
    "Add one measurable result to strengthen credibility.",
    "Open with your strongest example more quickly.",
    "End with a tighter link between your experience and the role."
  ],
  sample_better_answer:
    "I’m interested in this role because it combines analysis, communication, and practical problem-solving. In a recent project, I used Python and SQL to clean data, automate reporting, and present findings clearly to my team. That experience showed me that I enjoy turning messy information into useful decisions, which is why this opportunity stands out to me."
};

function buildMockMarketSnapshot(payload: {
  target_role: string;
  region: string;
}): MarketResponse {
  return {
    target_role: payload.target_role,
    region: payload.region,
    demand_level: "High",
    salary_range: "$22-$35/hr internships, $65k-$92k entry level",
    top_skills: ["Python", "SQL", "Tableau", "Excel", "A/B testing"],
    hiring_signals: [
      "Employers increasingly expect portfolio evidence, not just coursework.",
      "Dashboarding and communication show up beside technical requirements.",
      "Roles reward candidates who can connect analysis to business decisions."
    ],
    recommended_focus: [
      "Build one polished project with screenshots and measurable results.",
      "Strengthen SQL joins, aggregations, and reporting workflows.",
      "Practice explaining technical work in recruiter-friendly language."
    ]
  };
}

function shouldUseMock() {
  return DEMO_MODE;
}

async function safeFetchJson<T>(
  url: string,
  init: RequestInit,
  fallback: T
): Promise<T> {
  if (shouldUseMock()) {
    return fallback;
  }

  if (API_PLACEHOLDER) {
    throw new Error("CareerCopilot API is not configured yet.");
  }

  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      let detail = "Request failed.";
      try {
        const payload = (await response.json()) as { detail?: string };
        detail = payload.detail || detail;
      } catch {}
      throw new Error(detail);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("CareerCopilot could not reach the API.");
  }
}

export async function runAnalysis(payload: {
  resume_text: string;
  target_role: string;
  job_description: string;
}) {
  const fallback = {
    ...mockAnalysis,
    analysis_id: `demo-analysis-${Date.now()}`
  };
  return safeFetchJson(`${API_BASE_URL}/analysis/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }, fallback);
}

export async function getAnalysis(analysisId: string) {
  return safeFetchJson(`${API_BASE_URL}/analysis/${analysisId}`, {
    cache: "no-store"
  }, {
    ...mockAnalysis,
    analysis_id: analysisId
  });
}

export async function listRecentAnalyses() {
  return safeFetchJson(`${API_BASE_URL}/analysis`, {
    cache: "no-store"
  }, mockAnalyses);
}

export async function startInterview(payload: {
  target_role: string;
  resume_text: string;
}) {
  return safeFetchJson(`${API_BASE_URL}/interview/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }, mockInterviewQuestions);
}

export async function requestInterviewFeedback(payload: {
  target_role: string;
  question: string;
  answer: string;
}) {
  return safeFetchJson(`${API_BASE_URL}/interview/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }, mockInterviewFeedback);
}

export async function getMarketSnapshot(payload: {
  target_role: string;
  region: string;
}) {
  return safeFetchJson(`${API_BASE_URL}/market/snapshot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }, buildMockMarketSnapshot(payload));
}

export async function uploadResume(file: File, fallbackText = "") {
  const formData = new FormData();
  formData.append("file", file);
  if (fallbackText.trim()) {
    formData.append("fallback_text", fallbackText);
  }

  return safeFetchJson(`${API_BASE_URL}/resume/upload`, {
    method: "POST",
    body: formData
  }, {
    file_name: file.name || "demo-resume.txt",
    extracted_text: fallbackText || "Demo resume text loaded locally.",
    characters: String((fallbackText || "Demo resume text loaded locally.").length)
  });
}

from pydantic import BaseModel, Field
from datetime import datetime


class AnalysisRequest(BaseModel):
    resume_text: str = Field(min_length=50)
    target_role: str = Field(min_length=2)
    job_description: str = Field(min_length=50)


class Roadmap(BaseModel):
    thirty_days: list[str]
    sixty_days: list[str]
    ninety_days: list[str]


class AnalysisResponse(BaseModel):
    analysis_id: str
    match_score: int
    missing_skills: list[str]
    strengths: list[str]
    weaknesses: list[str]
    rewritten_bullets: list[str]
    roadmap: Roadmap


class AnalysisSummary(BaseModel):
    analysis_id: str
    target_role: str
    match_score: int
    missing_skills: list[str]
    created_at: datetime

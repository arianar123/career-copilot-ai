from pydantic import BaseModel, Field


class InterviewStartRequest(BaseModel):
    target_role: str = Field(min_length=2)
    resume_text: str = Field(min_length=50)


class InterviewQuestion(BaseModel):
    question: str
    focus_area: str


class InterviewStartResponse(BaseModel):
    session_id: str
    questions: list[InterviewQuestion]


class InterviewFeedbackRequest(BaseModel):
    target_role: str = Field(min_length=2)
    question: str = Field(min_length=5)
    answer: str = Field(min_length=10)


class InterviewFeedbackResponse(BaseModel):
    overall_score: int
    confidence_score: int
    clarity_score: int
    technical_score: int
    strengths: list[str]
    improvements: list[str]
    sample_better_answer: str

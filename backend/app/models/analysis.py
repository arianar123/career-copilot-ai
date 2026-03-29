from datetime import datetime

from sqlalchemy import DateTime, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from ..db.database import Base


class AnalysisRecord(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(primary_key=True, index=True)
    target_role: Mapped[str] = mapped_column(Text)
    resume_text: Mapped[str] = mapped_column(Text)
    job_description: Mapped[str] = mapped_column(Text)
    match_score: Mapped[int] = mapped_column(Integer)
    missing_skills_json: Mapped[str] = mapped_column(Text)
    strengths_json: Mapped[str] = mapped_column(Text)
    weaknesses_json: Mapped[str] = mapped_column(Text)
    rewritten_bullets_json: Mapped[str] = mapped_column(Text)
    roadmap_json: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

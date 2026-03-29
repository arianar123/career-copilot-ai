import json
import uuid

from sqlalchemy import desc
from sqlalchemy.orm import Session

from ..models.analysis import AnalysisRecord
from ..schemas.analysis import (
    AnalysisRequest,
    AnalysisResponse,
    AnalysisSummary,
    Roadmap,
)


def create_analysis(
    db: Session, payload: AnalysisRequest, response: AnalysisResponse
) -> AnalysisResponse:
    record = AnalysisRecord(
        id=response.analysis_id or str(uuid.uuid4()),
        target_role=payload.target_role,
        resume_text=payload.resume_text,
        job_description=payload.job_description,
        match_score=response.match_score,
        missing_skills_json=json.dumps(response.missing_skills),
        strengths_json=json.dumps(response.strengths),
        weaknesses_json=json.dumps(response.weaknesses),
        rewritten_bullets_json=json.dumps(response.rewritten_bullets),
        roadmap_json=json.dumps(response.roadmap.model_dump()),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return hydrate_analysis(record)


def get_analysis_by_id(db: Session, analysis_id: str) -> AnalysisRecord | None:
    return db.get(AnalysisRecord, analysis_id)


def list_recent_analyses(db: Session, limit: int = 10) -> list[AnalysisSummary]:
    records = (
        db.query(AnalysisRecord)
        .order_by(desc(AnalysisRecord.created_at))
        .limit(limit)
        .all()
    )
    return [summarize_analysis(record) for record in records]


def hydrate_analysis(record: AnalysisRecord) -> AnalysisResponse:
    return AnalysisResponse(
        analysis_id=record.id,
        match_score=record.match_score,
        missing_skills=json.loads(record.missing_skills_json),
        strengths=json.loads(record.strengths_json),
        weaknesses=json.loads(record.weaknesses_json),
        rewritten_bullets=json.loads(record.rewritten_bullets_json),
        roadmap=Roadmap(**json.loads(record.roadmap_json)),
    )


def summarize_analysis(record: AnalysisRecord) -> AnalysisSummary:
    return AnalysisSummary(
        analysis_id=record.id,
        target_role=record.target_role,
        match_score=record.match_score,
        missing_skills=json.loads(record.missing_skills_json),
        created_at=record.created_at,
    )

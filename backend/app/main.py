import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db.database import Base, engine
from .models.analysis import AnalysisRecord
from .routes.analysis import router as analysis_router
from .routes.interview import router as interview_router
from .routes.market import router as market_router
from .routes.resume import router as resume_router

app = FastAPI(
    title="CareerCopilot AI API",
    description="Starter API for resume analysis and roadmap generation.",
    version="0.1.0",
)


def _parse_cors_origins() -> list[str]:
    raw_origins = os.getenv("CORS_ORIGINS")
    if not raw_origins:
        return [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3100",
            "http://127.0.0.1:3100",
        ]

    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_cors_origins(),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router)
app.include_router(analysis_router)
app.include_router(interview_router)
app.include_router(market_router)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}

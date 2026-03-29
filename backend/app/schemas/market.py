from pydantic import BaseModel, Field


class MarketRequest(BaseModel):
    target_role: str = Field(min_length=2)
    region: str = Field(min_length=2)


class MarketResponse(BaseModel):
    target_role: str
    region: str
    demand_level: str
    salary_range: str
    top_skills: list[str]
    hiring_signals: list[str]
    recommended_focus: list[str]

from ..schemas.market import MarketRequest, MarketResponse


def get_market_snapshot(payload: MarketRequest) -> MarketResponse:
    role = payload.target_role.lower()
    region = payload.region

    if "data" in role:
        return MarketResponse(
            target_role=payload.target_role,
            region=region,
            demand_level="High",
            salary_range="$22-$35/hr internships, $65k-$92k entry level",
            top_skills=["Python", "SQL", "Tableau", "Excel", "A/B testing"],
            hiring_signals=[
                "Analytics internships are often bundled with BI and dashboard expectations.",
                "Employers increasingly want project evidence, not just coursework.",
                "Communication and business storytelling appear alongside technical requirements."
            ],
            recommended_focus=[
                "Build one polished dashboard project with clear metrics and screenshots.",
                "Strengthen SQL joins, aggregations, and optimization basics.",
                "Practice translating findings into stakeholder-friendly recommendations."
            ],
        )

    if "software" in role or "engineer" in role:
        return MarketResponse(
            target_role=payload.target_role,
            region=region,
            demand_level="High",
            salary_range="$28-$45/hr internships, $78k-$118k entry level",
            top_skills=["TypeScript", "React", "APIs", "System design basics", "Testing"],
            hiring_signals=[
                "Full-stack internship roles often expect frontend depth plus backend familiarity.",
                "Projects with deployment links stand out more than unfinished repositories.",
                "Teams increasingly value debugging, testing, and communication alongside coding."
            ],
            recommended_focus=[
                "Ship one deployed full-stack app with authentication or persistent state.",
                "Practice explaining architecture decisions during interviews.",
                "Add tests and deployment docs to make projects look production-ready."
            ],
        )

    return MarketResponse(
        target_role=payload.target_role,
        region=region,
        demand_level="Moderate to High",
        salary_range="$20-$32/hr internships, $60k-$88k entry level",
        top_skills=["Communication", "Excel", "Project ownership", "Data literacy", "Adaptability"],
        hiring_signals=[
            "Hybrid roles increasingly combine technical fluency with business context.",
            "Candidates with visible project outcomes are easier for recruiters to trust.",
            "Clear positioning matters when role expectations are broad."
        ],
        recommended_focus=[
            "Tailor your resume to one role family instead of applying too broadly.",
            "Build one flagship project that directly matches your target job titles.",
            "Use quantified bullets to show outcomes instead of task lists."
        ],
    )

"""
Final AI evaluation output schema.
hike_score 0-100, verdict, serious_feedback, genz_feedback, risk_flags.
"""

from enum import Enum
from typing import List

from pydantic import BaseModel, Field

from .reviews import EmployeeSelfReview, ManagerReview


class EvaluateRequest(BaseModel):
    employee: EmployeeSelfReview
    manager: ManagerReview


class RiskFlag(str, Enum):
    EGO = "ego"
    UNDERPERFORMANCE = "underperformance"
    MISMATCH = "mismatch"
    BURNOUT = "burnout"
    NONE = "none"


class FinalEvaluation(BaseModel):
    hike_score: int = Field(ge=0, le=100, description="0-100")
    verdict: str = Field(description="Short verdict phrase")
    serious_feedback: str = Field(
        description="Professional feedback for HR conversations"
    )
    genz_feedback: str = Field(
        description="Fun, Gen-Z style feedback (playful but safe)"
    )
    risk_flags: List[str] = Field(
        default_factory=list,
        description="One or more of: ego, underperformance, mismatch, burnout",
    )

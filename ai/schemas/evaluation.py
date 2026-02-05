"""
Extended evaluation schema.
hike_score, verdict, serious/genz/roast feedback, reality check, growth roadmap,
confidence vs reality, bias detection, risk flags.
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
    OVERRATER = "overrater"
    UNDERRATER = "underrater"
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
    roast_feedback: str = Field(
        default="",
        description="Light roast, HR-safe sarcastic feedback"
    )
    reality_check: str = Field(
        default="",
        description="AI calls out delusion politely"
    )
    growth_roadmap: str = Field(
        default="",
        description="Skills to level up for next review cycle"
    )
    confidence_score: int = Field(
        default=0, ge=0, le=100,
        description="Self-confidence score derived from employee self-review"
    )
    reality_score: int = Field(
        default=0, ge=0, le=100,
        description="Reality score derived from manager review"
    )
    bias_alert: str = Field(
        default="",
        description="Over-rating or under-rating alert"
    )
    risk_flags: List[str] = Field(
        default_factory=list,
        description="ego, underperformance, mismatch, burnout, overrater, underrater",
    )

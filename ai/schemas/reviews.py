"""
Review schemas for Employee self-review and Manager review.
Quantitative (1-5 or 1-10), qualitative text, soft/hard skills, culture signals.
"""

from pydantic import BaseModel, Field


class SoftSkillsInput(BaseModel):
    communication: int = Field(ge=1, le=5, description="1-5")
    teamwork: int = Field(ge=1, le=5, description="1-5")
    leadership: int = Field(ge=1, le=5, description="1-5")
    adaptability: int = Field(ge=1, le=5, description="1-5")
    problem_solving: int = Field(ge=1, le=5, description="1-5")


class HardSkillsInput(BaseModel):
    technical_competence: int = Field(ge=1, le=5, description="1-5")
    delivery_quality: int = Field(ge=1, le=5, description="1-5")
    productivity: int = Field(ge=1, le=5, description="1-5")
    initiative: int = Field(ge=1, le=5, description="1-5")


class CultureAttitudeInput(BaseModel):
    collaboration: int = Field(ge=1, le=5, description="1-5")
    receptiveness_to_feedback: int = Field(ge=1, le=5, description="1-5")
    work_ethic: int = Field(ge=1, le=5, description="1-5")
    attitude: int = Field(ge=1, le=5, description="1-5")


class EmployeeSelfReview(BaseModel):
    employee_id: str
    employee_name: str
    role: str = ""
    period: str = ""

    soft_skills: SoftSkillsInput
    hard_skills: HardSkillsInput
    culture_attitude: CultureAttitudeInput

    self_summary: str = Field(
        default="",
        description="Qualitative self-assessment (2-4 sentences)",
    )
    key_achievements: str = Field(
        default="",
        description="Key accomplishments this period",
    )
    areas_to_improve: str = Field(
        default="",
        description="Areas they want to work on",
    )


class ManagerReview(BaseModel):
    manager_id: str
    manager_name: str
    employee_id: str
    employee_name: str
    role: str = ""
    period: str = ""

    soft_skills: SoftSkillsInput
    hard_skills: HardSkillsInput
    culture_attitude: CultureAttitudeInput

    manager_summary: str = Field(
        default="",
        description="Manager qualitative assessment",
    )
    strengths: str = Field(default="", description="Notable strengths")
    improvement_areas: str = Field(default="", description="Areas to improve")

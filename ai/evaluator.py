"""
AI Logic: merge employee + manager reviews, handle mismatches, normalize bias.
"""

import json
from typing import Any

from .prompts.evaluation import (
    SYSTEM_PROMPT,
    EVALUATION_PROMPT_TEMPLATE,
)
from .inference import run_evaluation_prompt
from .schemas import EmployeeSelfReview, ManagerReview, FinalEvaluation


def _compute_mismatch_penalty(emp: EmployeeSelfReview, mgr: ManagerReview) -> float:
    """Large delta between self and manager ratings adds penalty."""
    emp_avg = (
        sum(emp.soft_skills.model_dump().values())
        + sum(emp.hard_skills.model_dump().values())
        + sum(emp.culture_attitude.model_dump().values())
    ) / 12
    mgr_avg = (
        sum(mgr.soft_skills.model_dump().values())
        + sum(mgr.hard_skills.model_dump().values())
        + sum(mgr.culture_attitude.model_dump().values())
    ) / 12
    delta = abs(emp_avg - mgr_avg)
    if delta > 2.0:
        return 0.9
    if delta > 1.0:
        return 0.95
    return 1.0


def _normalize_output(data: dict[str, Any]) -> dict[str, Any]:
    """Ensure output fits FinalEvaluation schema."""
    hike = data.get("hike_score", 50)
    if not isinstance(hike, int):
        hike = int(float(hike)) if hike else 50
    hike = max(0, min(100, hike))

    verdict = str(data.get("verdict", "Manual review recommended")).strip()
    serious = str(data.get("serious_feedback", "")).strip() or "No feedback generated."
    genz = str(data.get("genz_feedback", "")).strip() or "Check with your manager."

    risk = data.get("risk_flags", [])
    if isinstance(risk, str):
        risk = [r.strip() for r in risk.split(",")] if risk else []
    allowed = {"ego", "underperformance", "mismatch", "burnout"}
    risk = [r for r in risk if str(r).lower() in allowed]

    return {
        "hike_score": hike,
        "verdict": verdict,
        "serious_feedback": serious,
        "genz_feedback": genz,
        "risk_flags": risk,
    }


def evaluate(
    employee_review: EmployeeSelfReview,
    manager_review: ManagerReview,
    use_llm: bool = True,
) -> FinalEvaluation:
    """
    Merge reviews and generate evaluation.
    use_llm=False: rule-based fallback (no model required).
    """
    emp_json = employee_review.model_dump_json(indent=0)
    mgr_json = manager_review.model_dump_json(indent=0)
    user_prompt = EVALUATION_PROMPT_TEMPLATE.format(
        employee_review_json=emp_json,
        manager_review_json=mgr_json,
    )

    if use_llm:
        raw = run_evaluation_prompt(SYSTEM_PROMPT, user_prompt)
    else:
        raw = _rule_based_eval(employee_review, manager_review)

    normalized = _normalize_output(raw)
    return FinalEvaluation(**normalized)


def _rule_based_eval(
    emp: EmployeeSelfReview,
    mgr: ManagerReview,
) -> dict[str, Any]:
    """Rule-based fallback when LLM is disabled."""
    emp_scores = (
        list(emp.soft_skills.model_dump().values())
        + list(emp.hard_skills.model_dump().values())
        + list(emp.culture_attitude.model_dump().values())
    )
    mgr_scores = (
        list(mgr.soft_skills.model_dump().values())
        + list(mgr.hard_skills.model_dump().values())
        + list(mgr.culture_attitude.model_dump().values())
    )
    emp_avg = sum(emp_scores) / len(emp_scores)
    mgr_avg = sum(mgr_scores) / len(mgr_scores)

    # Weight manager 60%, employee 40%
    blended = 0.6 * mgr_avg + 0.4 * emp_avg
    hike = int((blended / 5.0) * 100)
    hike = max(0, min(100, hike))

    delta = abs(emp_avg - mgr_avg)
    risk_flags = []
    if delta > 1.5:
        risk_flags.append("mismatch")
    if mgr_avg < 2.5:
        risk_flags.append("underperformance")
    if emp_avg > 4.5 and mgr_avg < 3.5:
        risk_flags.append("ego")

    if hike >= 85:
        verdict = "Absolute W, hike worthy"
        genz = "Slaying. You passed the vibe check and then some. No cap, give them the raise."
    elif hike >= 75:
        verdict = "Deserves a hike, no cap"
        genz = "Solid work. Main character energy. Boss sees it."
    elif hike >= 60:
        verdict = "Promotion loading"
        genz = "Room to grow but you are on the right track. Character development arc in progress."
    elif hike >= 50:
        verdict = "Needs character development arc"
        genz = "It is giving mid. Some tweaks needed but the potential is there."
    else:
        verdict = "Worked hard but vibes were off"
        genz = "Align expectations with your manager. Time for a real talk, no cap."

    serious = (
        f"Manager average: {mgr_avg:.1f}/5. Employee self: {emp_avg:.1f}/5. "
        f"Blended score: {blended:.1f}/5. "
        + ("Significant rating gap; alignment conversation recommended." if delta > 1.5 else "")
    )

    return {
        "hike_score": hike,
        "verdict": verdict,
        "serious_feedback": serious,
        "genz_feedback": genz,
        "risk_flags": risk_flags,
    }

"""
AI Logic: merge employee + manager reviews, handle mismatches, normalize bias,
generate roast, reality check, growth roadmap, confidence vs reality.
"""

import random
from typing import Any

from .prompts.evaluation import (
    SYSTEM_PROMPT,
    EVALUATION_PROMPT_TEMPLATE,
)
from .inference import run_evaluation_prompt
from .schemas import EmployeeSelfReview, ManagerReview, FinalEvaluation


def _avg_scores(review: EmployeeSelfReview | ManagerReview) -> float:
    vals = (
        list(review.soft_skills.model_dump().values())
        + list(review.hard_skills.model_dump().values())
        + list(review.culture_attitude.model_dump().values())
    )
    return sum(vals) / len(vals)


def _normalize_output(data: dict[str, Any]) -> dict[str, Any]:
    """Ensure output fits extended FinalEvaluation schema."""

    def _int(v: Any, default: int = 50) -> int:
        try:
            return max(0, min(100, int(float(v))))
        except (TypeError, ValueError):
            return default

    def _str(v: Any, default: str = "") -> str:
        return str(v).strip() if v else default

    hike = _int(data.get("hike_score"), 50)
    verdict = _str(data.get("verdict"), "Manual review recommended")
    serious = _str(data.get("serious_feedback"), "No feedback generated.")
    genz = _str(data.get("genz_feedback"), "Check with your manager.")
    roast = _str(data.get("roast_feedback"))
    reality = _str(data.get("reality_check"))
    roadmap = _str(data.get("growth_roadmap"))
    conf = _int(data.get("confidence_score"), 0)
    real = _int(data.get("reality_score"), 0)
    bias = _str(data.get("bias_alert"))

    risk = data.get("risk_flags", [])
    if isinstance(risk, str):
        risk = [r.strip() for r in risk.split(",")] if risk else []
    allowed = {"ego", "underperformance", "mismatch", "burnout", "overrater", "underrater"}
    risk = [r for r in risk if str(r).lower() in allowed]

    return {
        "hike_score": hike,
        "verdict": verdict,
        "serious_feedback": serious,
        "genz_feedback": genz,
        "roast_feedback": roast,
        "reality_check": reality,
        "growth_roadmap": roadmap,
        "confidence_score": conf,
        "reality_score": real,
        "bias_alert": bias,
        "risk_flags": risk,
    }


def evaluate(
    employee_review: EmployeeSelfReview,
    manager_review: ManagerReview,
    use_llm: bool = True,
) -> FinalEvaluation:
    """Merge reviews and generate full evaluation."""
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


# ---------------------------------------------------------------------------
# Roast, reality check, growth roadmap generators (rule-based)
# ---------------------------------------------------------------------------

ROASTS_HIGH = [
    "Honestly, the only thing that needs improvement is the WiFi when you are presenting.",
    "You are doing so well it is suspicious. Are you secretly an AI?",
    "At this point you should be reviewing your manager.",
]

ROASTS_MID = [
    "Not bad, not great. Like reheated pizza -- still okay, but we know it can be better.",
    "You are the human equivalent of 'it works on my machine.'",
    "Potential is there. Execution is... loading.",
]

ROASTS_LOW = [
    "Bro needs to cook harder. The kitchen is right there.",
    "Your performance is giving 'I will start on Monday' energy.",
    "It is giving bare minimum but make it fashion.",
]

REALITY_CHECK_OVERRATER = [
    "Your self-rating says 'CEO material,' manager says 'needs mentoring.' Let us talk about that gap.",
    "Main character syndrome detected. Your manager sees a supporting role right now.",
    "Confidence is great but the numbers tell a different story. Time for a calibration chat.",
]

REALITY_CHECK_UNDERRATER = [
    "You rated yourself lower than your manager did. You are doing better than you think.",
    "Imposter syndrome alert. Your manager sees more in you than you see in yourself.",
    "Stop underselling. Your work speaks louder than your self-doubt.",
]

REALITY_CHECK_ALIGNED = [
    "Self-awareness level: elite. Your ratings match your manager closely.",
    "You and your manager are on the same page. That is rare and valuable.",
]

GROWTH_TEMPLATES = {
    "communication": "Work on async communication and concise writing",
    "teamwork": "Collaborate more proactively across teams",
    "leadership": "Take ownership of a cross-functional initiative",
    "adaptability": "Practice context-switching and embrace ambiguity",
    "problem_solving": "Tackle more open-ended problems independently",
    "technical_competence": "Deep dive into one technical domain this quarter",
    "delivery_quality": "Focus on reducing bugs and improving code reviews",
    "productivity": "Optimize workflows and reduce context-switching",
    "initiative": "Propose and lead one improvement project",
    "collaboration": "Build stronger cross-team relationships",
    "receptiveness_to_feedback": "Actively seek feedback weekly and act on it",
    "work_ethic": "Improve consistency in delivery timelines",
    "attitude": "Bring more energy to team interactions",
}


def _rule_based_eval(
    emp: EmployeeSelfReview,
    mgr: ManagerReview,
) -> dict[str, Any]:
    """Full rule-based evaluation with all extended fields."""
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

    # Confidence = employee self-view, Reality = manager view
    confidence_score = int((emp_avg / 5.0) * 100)
    reality_score = int((mgr_avg / 5.0) * 100)

    # Weighted blend: manager 60%, employee 40%
    blended = 0.6 * mgr_avg + 0.4 * emp_avg
    hike = int((blended / 5.0) * 100)
    hike = max(0, min(100, hike))

    delta = emp_avg - mgr_avg
    abs_delta = abs(delta)

    # Risk flags
    risk_flags = []
    bias_alert = ""
    if abs_delta > 1.5:
        risk_flags.append("mismatch")
    if mgr_avg < 2.5:
        risk_flags.append("underperformance")
    if delta > 1.2:
        risk_flags.append("overrater")
        bias_alert = f"Employee rates {delta:.1f} points higher than manager on average. Possible self-overrating."
    elif delta < -1.2:
        risk_flags.append("underrater")
        bias_alert = f"Employee rates {abs(delta):.1f} points lower than manager. Possible imposter syndrome."
    if emp_avg > 4.5 and mgr_avg < 3.5:
        risk_flags.append("ego")

    # Verdict
    if hike >= 85:
        verdict = "Absolute W, hike worthy"
        genz = "You are slaying. Passed the vibe check and then some. No cap, give them the raise."
    elif hike >= 75:
        verdict = "Deserves a hike, no cap"
        genz = "Solid work. Main character energy. Boss sees it."
    elif hike >= 60:
        verdict = "Promotion loading..."
        genz = "Room to grow but you are on the right track. Character development arc in progress."
    elif hike >= 50:
        verdict = "Needs character development arc"
        genz = "It is giving mid. Some tweaks needed but the potential is there."
    else:
        verdict = "Bro needs to cook harder"
        genz = "Align expectations with your manager. Time for a real talk, no cap."

    serious = (
        f"Manager average: {mgr_avg:.1f}/5. Employee self: {emp_avg:.1f}/5. "
        f"Blended score: {blended:.1f}/5 ({hike}/100). "
    )
    if abs_delta > 1.5:
        serious += "Significant rating gap detected; alignment conversation recommended. "
    if mgr_avg < 2.5:
        serious += "Performance concerns noted by manager. "

    # Roast
    if hike >= 75:
        roast = random.choice(ROASTS_HIGH)
    elif hike >= 50:
        roast = random.choice(ROASTS_MID)
    else:
        roast = random.choice(ROASTS_LOW)

    # Reality check
    if delta > 1.2:
        reality_check = random.choice(REALITY_CHECK_OVERRATER)
    elif delta < -1.2:
        reality_check = random.choice(REALITY_CHECK_UNDERRATER)
    else:
        reality_check = random.choice(REALITY_CHECK_ALIGNED)

    # Growth roadmap: find lowest manager-rated skills
    all_mgr = {}
    all_mgr.update(mgr.soft_skills.model_dump())
    all_mgr.update(mgr.hard_skills.model_dump())
    all_mgr.update(mgr.culture_attitude.model_dump())
    sorted_skills = sorted(all_mgr.items(), key=lambda x: x[1])
    weak_skills = [s[0] for s in sorted_skills[:3]]
    roadmap_items = [GROWTH_TEMPLATES.get(s, f"Improve {s}") for s in weak_skills]
    growth_roadmap = "Level up plan: " + " | ".join(roadmap_items)

    return {
        "hike_score": hike,
        "verdict": verdict,
        "serious_feedback": serious.strip(),
        "genz_feedback": genz,
        "roast_feedback": roast,
        "reality_check": reality_check,
        "growth_roadmap": growth_roadmap,
        "confidence_score": confidence_score,
        "reality_score": reality_score,
        "bias_alert": bias_alert,
        "risk_flags": risk_flags,
    }

"""
FastAPI backend for GenZ-Manager.
Endpoints: /review/employee, /review/manager, /evaluate
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from .schemas import EmployeeSelfReview, EvaluateRequest, ManagerReview, FinalEvaluation
from .evaluator import evaluate


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    # Optional: unload model on shutdown


app = FastAPI(
    title="GenZ-Manager",
    description="Employee review & hike eligibility with Gen-Z flair",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/review/employee", response_model=dict)
def submit_employee_review(review: EmployeeSelfReview):
    """Store employee self-review (MVP: echo back; future: persist)."""
    return {"received": True, "employee_id": review.employee_id}


@app.post("/review/manager", response_model=dict)
def submit_manager_review(review: ManagerReview):
    """Store manager review (MVP: echo back; future: persist)."""
    return {"received": True, "employee_id": review.employee_id}


@app.post("/evaluate", response_model=FinalEvaluation)
def run_evaluate(
    req: EvaluateRequest,
    use_llm: bool = Query(True, description="Use LLM; False = rule-based only"),
):
    """
    Compare employee + manager reviews and generate evaluation.
    """
    try:
        result = evaluate(req.employee, req.manager, use_llm=use_llm)
    except Exception:
        result = evaluate(req.employee, req.manager, use_llm=False)
    return result

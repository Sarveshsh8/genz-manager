"use client";

import { useState } from "react";
import { EmployeeForm } from "@/components/EmployeeForm";
import { ManagerForm } from "@/components/ManagerForm";
import { HikeResult } from "@/components/HikeResult";
import { LoadingVerdict } from "@/components/LoadingVerdict";
import { api } from "@/lib/api";

export type Step = "employee" | "manager" | "result";

export default function Home() {
  const [step, setStep] = useState<Step>("employee");
  const [employeeData, setEmployeeData] = useState<Record<string, unknown> | null>(null);
  const [managerData, setManagerData] = useState<Record<string, unknown> | null>(null);
  const [evaluation, setEvaluation] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmployeeSubmit = (data: Record<string, unknown>) => {
    setEmployeeData(data);
    setStep("manager");
  };

  const handleManagerSubmit = async (data: Record<string, unknown>) => {
    setManagerData(data);
    setLoading(true);
    setError(null);
    try {
      const result = await api.evaluate(employeeData!, data);
      setEvaluation(result);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("employee");
    setEmployeeData(null);
    setManagerData(null);
    setEvaluation(null);
  };

  return (
    <main className="page">
      <header className="header">
        <h1>GenZ Manager</h1>
        <p className="tagline">
          Reviews, feedback, hike eligibility. Honest, slightly unhinged, lowkey useful.
        </p>
      </header>

      <nav className="stepper">
        <span className={step === "employee" ? "active" : step !== "employee" ? "done" : ""}>
          1. Self-review
        </span>
        <span className={step === "manager" ? "active" : step === "result" ? "done" : ""}>
          2. Manager review
        </span>
        <span className={step === "result" ? "active" : ""}>3. Verdict</span>
      </nav>

      <section className="content">
        {step === "employee" && (
          <EmployeeForm onSubmit={handleEmployeeSubmit} />
        )}
        {step === "manager" && (
          loading ? (
            <LoadingVerdict />
          ) : (
            <ManagerForm
              onSubmit={handleManagerSubmit}
              loading={loading}
              error={error}
              employeeName={employeeData?.employee_name as string}
            />
          )
        )}
        {step === "result" && evaluation && (
          <HikeResult data={evaluation} onReset={handleReset} />
        )}
      </section>

      <footer className="footer">
        <p>AI-generated feedback. Use as a convo starter, not a final decision. No cap.</p>
      </footer>
    </main>
  );
}

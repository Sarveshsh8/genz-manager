"use client";

import { useState } from "react";
import { EmployeeForm } from "@/components/EmployeeForm";
import { ManagerForm } from "@/components/ManagerForm";
import { PeerFeedback } from "@/components/PeerFeedback";
import { HikeResult } from "@/components/HikeResult";
import { LoadingVerdict } from "@/components/LoadingVerdict";
import { api } from "@/lib/api";

export type Step = "employee" | "manager" | "peer" | "loading" | "result";

const STEPS: { key: Step; label: string }[] = [
  { key: "employee", label: "Self-review" },
  { key: "manager", label: "Manager" },
  { key: "peer", label: "Peer" },
  { key: "result", label: "Verdict" },
];

export default function Home() {
  const [step, setStep] = useState<Step>("employee");
  const [employeeData, setEmployeeData] = useState<Record<string, unknown> | null>(null);
  const [managerData, setManagerData] = useState<Record<string, unknown> | null>(null);
  const [peerData, setPeerData] = useState<unknown[] | null>(null);
  const [evaluation, setEvaluation] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEmployeeSubmit = (data: Record<string, unknown>) => {
    setEmployeeData(data);
    setStep("manager");
  };

  const handleManagerSubmit = (data: Record<string, unknown>) => {
    setManagerData(data);
    setStep("peer");
  };

  const runEvaluation = async (peers: unknown[] | null) => {
    setPeerData(peers);
    setStep("loading");
    setError(null);
    try {
      const result = await api.evaluate(employeeData!, managerData!);
      setEvaluation(result);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Evaluation failed");
      setStep("peer");
    }
  };

  const handlePeerSubmit = (peers: { emoji: string; text: string }[]) => {
    runEvaluation(peers);
  };

  const handlePeerSkip = () => {
    runEvaluation(null);
  };

  const handleReset = () => {
    setStep("employee");
    setEmployeeData(null);
    setManagerData(null);
    setPeerData(null);
    setEvaluation(null);
    setError(null);
  };

  const getStepStatus = (key: Step) => {
    const order: Step[] = ["employee", "manager", "peer", "result"];
    const current = order.indexOf(step === "loading" ? "result" : step);
    const target = order.indexOf(key);
    if (target < current) return "done";
    if (target === current) return "active";
    return "";
  };

  return (
    <main className="page">
      <header className="header">
        <h1>GenZ Manager</h1>
        <p className="tagline">
          Performance reviews, but make them honest, fun, and AI-powered.
        </p>
      </header>

      <nav className="stepper">
        {STEPS.map((s) => (
          <span key={s.key} className={`step-pill ${getStepStatus(s.key)}`}>
            {s.label}
          </span>
        ))}
      </nav>

      <section className="content">
        {step === "employee" && (
          <EmployeeForm onSubmit={handleEmployeeSubmit} />
        )}

        {step === "manager" && (
          <ManagerForm
            onSubmit={handleManagerSubmit}
            loading={false}
            error={error}
            employeeName={employeeData?.employee_name as string}
          />
        )}

        {step === "peer" && (
          <PeerFeedback
            onSubmit={handlePeerSubmit}
            onSkip={handlePeerSkip}
            employeeName={employeeData?.employee_name as string}
          />
        )}

        {step === "loading" && <LoadingVerdict />}

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

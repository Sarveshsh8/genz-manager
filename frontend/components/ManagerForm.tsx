"use client";

import { useState } from "react";

const SKILL_LABELS: Record<string, string> = {
  communication: "Communication",
  teamwork: "Teamwork",
  leadership: "Leadership",
  adaptability: "Adaptability",
  problem_solving: "Problem solving",
  technical_competence: "Technical competence",
  delivery_quality: "Delivery quality",
  productivity: "Productivity",
  initiative: "Initiative",
  collaboration: "Collaboration",
  receptiveness_to_feedback: "Receptiveness to feedback",
  work_ethic: "Work ethic",
  attitude: "Attitude",
};

const defaultScores: Record<string, number> = {};
Object.keys(SKILL_LABELS).forEach((k) => {
  defaultScores[k] = 3;
});

export function ManagerForm({
  onSubmit,
  loading,
  error,
  employeeName,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
  loading: boolean;
  error: string | null;
  employeeName?: string;
}) {
  const [scores, setScores] = useState<Record<string, number>>(defaultScores);
  const [managerName, setManagerName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [summary, setSummary] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvement, setImprovement] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const soft = ["communication", "teamwork", "leadership", "adaptability", "problem_solving"];
    const hard = ["technical_competence", "delivery_quality", "productivity", "initiative"];
    const culture = ["collaboration", "receptiveness_to_feedback", "work_ethic", "attitude"];
    onSubmit({
      manager_id: managerId || "mgr-1",
      manager_name: managerName || "Manager",
      employee_id: "emp-1",
      employee_name: employeeName || "Employee",
      role: "",
      period: "",
      soft_skills: Object.fromEntries(soft.map((k) => [k, scores[k]])),
      hard_skills: Object.fromEntries(hard.map((k) => [k, scores[k]])),
      culture_attitude: Object.fromEntries(culture.map((k) => [k, scores[k]])),
      manager_summary: summary,
      strengths,
      improvement_areas: improvement,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Manager review</h2>
      <p className="form-hint">
        Reviewing {employeeName || "your report"}. Your ratings will be compared with their self-review. Be real.
      </p>

      <div className="field">
        <label>Your name (manager)</label>
        <input value={managerName} onChange={(e) => setManagerName(e.target.value)} placeholder="Jordan" />
      </div>
      <div className="field">
        <label>Manager ID</label>
        <input value={managerId} onChange={(e) => setManagerId(e.target.value)} placeholder="mgr-001" />
      </div>

      <fieldset className="skills">
        <legend>Rate them (1 = needs work, 5 = absolutely crushing it)</legend>
        {Object.entries(SKILL_LABELS).map(([key, label]) => (
          <div key={key} className="skill-row">
            <label>{label}</label>
            <select
              value={scores[key]}
              onChange={(e) => setScores((s) => ({ ...s, [key]: Number(e.target.value) }))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        ))}
      </fieldset>

      <div className="field">
        <label>Manager summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Overall take. Be constructive."
          rows={3}
        />
      </div>
      <div className="field">
        <label>Strengths</label>
        <textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} placeholder="Where do they shine?" rows={2} />
      </div>
      <div className="field">
        <label>Improvement areas</label>
        <textarea value={improvement} onChange={(e) => setImprovement(e.target.value)} placeholder="What could be better?" rows={2} />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Reading the room..." : "Get verdict"}
      </button>
    </form>
  );
}

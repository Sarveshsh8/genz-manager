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

export function EmployeeForm({
  onSubmit,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
}) {
  const [scores, setScores] = useState<Record<string, number>>(defaultScores);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [period, setPeriod] = useState("");
  const [selfSummary, setSelfSummary] = useState("");
  const [achievements, setAchievements] = useState("");
  const [improve, setImprove] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const soft = ["communication", "teamwork", "leadership", "adaptability", "problem_solving"];
    const hard = ["technical_competence", "delivery_quality", "productivity", "initiative"];
    const culture = ["collaboration", "receptiveness_to_feedback", "work_ethic", "attitude"];
    onSubmit({
      employee_id: id || "emp-1",
      employee_name: name || "Employee",
      role,
      period,
      soft_skills: Object.fromEntries(soft.map((k) => [k, scores[k]])),
      hard_skills: Object.fromEntries(hard.map((k) => [k, scores[k]])),
      culture_attitude: Object.fromEntries(culture.map((k) => [k, scores[k]])),
      self_summary: selfSummary,
      key_achievements: achievements,
      areas_to_improve: improve,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Self-review time</h2>
      <p className="form-hint">Rate yourself 1-5. Be honest, your manager is gonna rate you too. Main character energy only.</p>

      <div className="field">
        <label>Your name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex" />
      </div>
      <div className="field">
        <label>Employee ID</label>
        <input value={id} onChange={(e) => setId(e.target.value)} placeholder="emp-001" />
      </div>
      <div className="field">
        <label>Role</label>
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Software Engineer" />
      </div>
      <div className="field">
        <label>Review period</label>
        <input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="Q1 2025" />
      </div>

      <fieldset className="skills">
        <legend>Rate yourself (1 = struggling, 5 = slaying)</legend>
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
        <label>Self summary (2-4 sentences)</label>
        <textarea
          value={selfSummary}
          onChange={(e) => setSelfSummary(e.target.value)}
          placeholder="How would you rate your performance? No need to oversell or undersell."
          rows={3}
        />
      </div>
      <div className="field">
        <label>Key achievements</label>
        <textarea
          value={achievements}
          onChange={(e) => setAchievements(e.target.value)}
          placeholder="What did you actually deliver? Flex a little."
          rows={2}
        />
      </div>
      <div className="field">
        <label>Areas to improve</label>
        <textarea
          value={improve}
          onChange={(e) => setImprove(e.target.value)}
          placeholder="What do you want to work on? Self-awareness is slay."
          rows={2}
        />
      </div>

      <button type="submit" className="btn btn-primary">Next: Manager review</button>
    </form>
  );
}

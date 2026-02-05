"use client";

import { useState } from "react";

const EMOJI_SCALE = [
  { value: 1, emoji: "\uD83D\uDC80", label: "yikes" },
  { value: 2, emoji: "\uD83D\uDE2C", label: "eh" },
  { value: 3, emoji: "\uD83D\uDE10", label: "mid" },
  { value: 4, emoji: "\uD83D\uDD25", label: "fire" },
  { value: 5, emoji: "\uD83D\uDE80", label: "slay" },
];

const SKILLS = [
  { key: "communication", label: "Communication", group: "soft" },
  { key: "teamwork", label: "Teamwork", group: "soft" },
  { key: "leadership", label: "Leadership", group: "soft" },
  { key: "adaptability", label: "Adaptability", group: "soft" },
  { key: "problem_solving", label: "Problem solving", group: "soft" },
  { key: "technical_competence", label: "Technical skill", group: "hard" },
  { key: "delivery_quality", label: "Delivery quality", group: "hard" },
  { key: "productivity", label: "Productivity", group: "hard" },
  { key: "initiative", label: "Initiative", group: "hard" },
  { key: "collaboration", label: "Collaboration", group: "culture" },
  { key: "receptiveness_to_feedback", label: "Feedback reception", group: "culture" },
  { key: "work_ethic", label: "Work ethic", group: "culture" },
  { key: "attitude", label: "Attitude / vibes", group: "culture" },
];

const defaultScores: Record<string, number> = {};
SKILLS.forEach((s) => { defaultScores[s.key] = 3; });

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
  const [scores, setScores] = useState<Record<string, number>>({ ...defaultScores });
  const [managerName, setManagerName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [summary, setSummary] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvement, setImprovement] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const soft = SKILLS.filter((s) => s.group === "soft").map((s) => s.key);
    const hard = SKILLS.filter((s) => s.group === "hard").map((s) => s.key);
    const culture = SKILLS.filter((s) => s.group === "culture").map((s) => s.key);
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

  const groups = [
    { id: "soft", title: "SOFT SKILLS" },
    { id: "hard", title: "HARD SKILLS" },
    { id: "culture", title: "CULTURE & VIBES" },
  ];

  return (
    <form className="glass-card" onSubmit={handleSubmit}>
      <h2 className="form-title">Manager review</h2>
      <p className="form-subtitle">
        Reviewing <strong>{employeeName || "your report"}</strong>. Be honest.
        Your ratings will be compared with their self-review. No pressure.
      </p>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">Your name</label>
          <input className="field-input" value={managerName} onChange={(e) => setManagerName(e.target.value)} placeholder="Boss name" />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">Manager ID</label>
          <input className="field-input" value={managerId} onChange={(e) => setManagerId(e.target.value)} placeholder="mgr-001" />
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.id} className="emoji-section">
          <div className="emoji-section-title">{g.title}</div>
          {SKILLS.filter((s) => s.group === g.id).map((skill) => (
            <div key={skill.key} className="emoji-row">
              <span className="emoji-row-label">{skill.label}</span>
              <div className="emoji-btns">
                {EMOJI_SCALE.map((e) => (
                  <button
                    key={e.value}
                    type="button"
                    className={`emoji-btn ${scores[skill.key] === e.value ? "selected" : ""}`}
                    onClick={() => setScores((s) => ({ ...s, [skill.key]: e.value }))}
                    title={e.label}
                  >
                    {e.emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="field">
        <label className="field-label">Manager summary</label>
        <textarea className="field-input" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Overall take. Be constructive." rows={3} />
      </div>
      <div className="field">
        <label className="field-label">Strengths</label>
        <textarea className="field-input" value={strengths} onChange={(e) => setStrengths(e.target.value)} placeholder="Where do they shine?" rows={2} />
      </div>
      <div className="field">
        <label className="field-label">Improvement areas</label>
        <textarea className="field-input" value={improvement} onChange={(e) => setImprovement(e.target.value)} placeholder="What needs leveling up?" rows={2} />
      </div>

      {error && <p className="error-msg">{error}</p>}

      <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
        {loading ? "Reading the room..." : "Get the verdict"}
      </button>
    </form>
  );
}

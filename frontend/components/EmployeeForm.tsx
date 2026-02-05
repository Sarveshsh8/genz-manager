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

export function EmployeeForm({
  onSubmit,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
}) {
  const [scores, setScores] = useState<Record<string, number>>({ ...defaultScores });
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [period, setPeriod] = useState("");
  const [selfSummary, setSelfSummary] = useState("");
  const [achievements, setAchievements] = useState("");
  const [improve, setImprove] = useState("");
  const [vibeScore, setVibeScore] = useState(7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const soft = SKILLS.filter((s) => s.group === "soft").map((s) => s.key);
    const hard = SKILLS.filter((s) => s.group === "hard").map((s) => s.key);
    const culture = SKILLS.filter((s) => s.group === "culture").map((s) => s.key);
    onSubmit({
      employee_id: id || "emp-1",
      employee_name: name || "Anonymous",
      role,
      period,
      soft_skills: Object.fromEntries(soft.map((k) => [k, scores[k]])),
      hard_skills: Object.fromEntries(hard.map((k) => [k, scores[k]])),
      culture_attitude: Object.fromEntries(culture.map((k) => [k, scores[k]])),
      self_summary: selfSummary,
      key_achievements: achievements,
      areas_to_improve: improve,
      vibe_score: vibeScore,
    });
  };

  const groups = [
    { id: "soft", title: "SOFT SKILLS" },
    { id: "hard", title: "HARD SKILLS" },
    { id: "culture", title: "CULTURE & VIBES" },
  ];

  return (
    <form className="glass-card" onSubmit={handleSubmit}>
      <h2 className="form-title">Self-review time</h2>
      <p className="form-subtitle">
        Rate yourself honestly. Your manager is doing the same.
        Main character energy only -- no delusion allowed.
      </p>

      <div className="field">
        <label className="field-label">Your name</label>
        <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="What do they call you" />
      </div>
      <div className="field">
        <label className="field-label">Employee ID</label>
        <input className="field-input" value={id} onChange={(e) => setId(e.target.value)} placeholder="emp-001" />
      </div>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">Role</label>
          <input className="field-input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Your title" />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">Period</label>
          <input className="field-input" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="Q1 2026" />
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

      <div className="vibe-slider-wrap">
        <div className="vibe-label">
          <span>Overall vibe this period</span>
          <span className="vibe-value">{vibeScore}/10</span>
        </div>
        <input
          type="range"
          className="vibe-slider"
          min={1}
          max={10}
          value={vibeScore}
          onChange={(e) => setVibeScore(Number(e.target.value))}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
          <span>barely surviving</span>
          <span>absolutely slaying</span>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Self summary</label>
        <textarea className="field-input" value={selfSummary} onChange={(e) => setSelfSummary(e.target.value)} placeholder="How did this period go? Be real." rows={3} />
      </div>
      <div className="field">
        <label className="field-label">Key achievements</label>
        <textarea className="field-input" value={achievements} onChange={(e) => setAchievements(e.target.value)} placeholder="What did you actually deliver? Time to flex." rows={2} />
      </div>
      <div className="field">
        <label className="field-label">Areas to improve</label>
        <textarea className="field-input" value={improve} onChange={(e) => setImprove(e.target.value)} placeholder="What needs work? Self-awareness is the ultimate slay." rows={2} />
      </div>

      <button type="submit" className="btn btn-primary btn-full">
        Lock it in -- Next step
      </button>
    </form>
  );
}

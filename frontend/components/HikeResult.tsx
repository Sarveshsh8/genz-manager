"use client";

interface HikeResultProps {
  data: Record<string, unknown>;
  onReset: () => void;
}

const VERDICT_STYLES: Record<string, { bg: string; label: string }> = {
  high: { bg: "var(--accent)", label: "Hike worthy" },
  mid: { bg: "var(--warning)", label: "Character arc loading" },
  low: { bg: "var(--danger)", label: "Room to grow" },
};

export function HikeResult({ data, onReset }: HikeResultProps) {
  const hikeScore = (data.hike_score as number) ?? 0;
  const verdict = (data.verdict as string) ?? "";
  const serious = (data.serious_feedback as string) ?? "";
  const genz = (data.genz_feedback as string) ?? "";
  const riskFlags = (data.risk_flags as string[]) ?? [];

  const getScoreColor = () => {
    if (hikeScore >= 75) return "var(--accent)";
    if (hikeScore >= 50) return "var(--warning)";
    return "var(--danger)";
  };

  const getVerdictTier = () => {
    if (hikeScore >= 75) return "high";
    if (hikeScore >= 50) return "mid";
    return "low";
  };

  const tier = getVerdictTier();
  const style = VERDICT_STYLES[tier];

  return (
    <div className="result">
      <div className="result-header">
        <h2>Your verdict is in</h2>
        <div className="score-ring" style={{ ["--score-color" as string]: getScoreColor() }}>
          <span className="score-value">{hikeScore}</span>
          <span className="score-label">/ 100</span>
        </div>
      </div>

      <div
        className="verdict-badge"
        style={{ ["--verdict-bg" as string]: style.bg }}
      >
        <span className="verdict-badge-label">{style.label}</span>
      </div>

      <div className="verdict-card">
        <span className="verdict-text">{verdict}</span>
      </div>

      <div className="feedback-cards">
        <div className="feedback-card serious">
          <h3>For HR / 1:1 (the formal one)</h3>
          <p>{serious}</p>
        </div>
        <div className="feedback-card genz">
          <h3>Gen-Z translation</h3>
          <p>{genz}</p>
        </div>
      </div>

      {riskFlags.length > 0 && (
        <div className="risk-flags">
          <h3>Heads up (watch for these)</h3>
          <ul>
            {riskFlags.map((f) => (
              <li key={f} className="flag">{f}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="disclaimer">
        AI-generated. Use as a convo starter, not a final decision. Human review recommended.
      </p>

      <button className="btn btn-secondary" onClick={onReset}>
        Run it back
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";

interface HikeResultProps {
  data: Record<string, unknown>;
  onReset: () => void;
}

const FLAG_LABELS: Record<string, string> = {
  ego: "ego alert",
  mismatch: "rating mismatch",
  underperformance: "underperformance",
  burnout: "burnout risk",
  overrater: "self overrater",
  underrater: "self underrater",
};

export function HikeResult({ data, onReset }: HikeResultProps) {
  const hikeScore = (data.hike_score as number) ?? 0;
  const verdict = (data.verdict as string) ?? "";
  const serious = (data.serious_feedback as string) ?? "";
  const genz = (data.genz_feedback as string) ?? "";
  const roast = (data.roast_feedback as string) ?? "";
  const realityCheck = (data.reality_check as string) ?? "";
  const growthRoadmap = (data.growth_roadmap as string) ?? "";
  const riskFlags = (data.risk_flags as string[]) ?? [];
  const confidenceScore = (data.confidence_score as number) ?? 0;
  const realityScore = (data.reality_score as number) ?? 0;
  const biasAlert = (data.bias_alert as string) ?? "";

  const [roastMode, setRoastMode] = useState(false);

  const getScoreColor = () => {
    if (hikeScore >= 75) return "var(--neon-green)";
    if (hikeScore >= 50) return "var(--neon-yellow)";
    return "var(--danger)";
  };

  const getVerdictEmoji = () => {
    if (hikeScore >= 85) return "\u2705";
    if (hikeScore >= 70) return "\uD83D\uDE80";
    if (hikeScore >= 50) return "\u26A0\uFE0F";
    return "\uD83D\uDC80";
  };

  const getVerdictTier = () => {
    if (hikeScore >= 75) return "hike";
    if (hikeScore >= 50) return "mid";
    return "low";
  };

  return (
    <div className="glass-card" style={{ animation: "fadeUp 0.5s ease-out" }}>
      <div className="result-hero">
        <div
          className="score-circle"
          style={{
            ["--score-color" as string]: getScoreColor(),
            ["--score-pct" as string]: `${hikeScore}%`,
          }}
        >
          <div className="score-circle-inner">
            <span className="score-number" style={{ color: getScoreColor() }}>{hikeScore}</span>
            <span className="score-sub">/ 100</span>
          </div>
        </div>
      </div>

      <div className="verdict-banner">
        <div className="verdict-emoji">{getVerdictEmoji()}</div>
        <div className="verdict-text">{verdict}</div>
        <span className={`verdict-tag ${getVerdictTier()}`}>
          {getVerdictTier() === "hike" ? "Hike worthy" : getVerdictTier() === "mid" ? "Needs development" : "Not yet"}
        </span>
      </div>

      {/* Confidence vs Reality */}
      {(confidenceScore > 0 || realityScore > 0) && (
        <>
          <div className="conf-bar-wrap">
            <div className="conf-bar-label">
              <span>Self-confidence</span>
              <span>{confidenceScore}%</span>
            </div>
            <div className="conf-bar">
              <div className="conf-bar-fill" style={{ width: `${confidenceScore}%` }} />
            </div>
          </div>
          <div className="conf-bar-wrap" style={{ animationDelay: "0.7s" }}>
            <div className="conf-bar-label">
              <span>Reality (manager view)</span>
              <span>{realityScore}%</span>
            </div>
            <div className="conf-bar">
              <div className="conf-bar-fill reality" style={{ width: `${realityScore}%` }} />
            </div>
          </div>
        </>
      )}

      {biasAlert && (
        <div className="meme-card reality-card" style={{ margin: "1rem 0" }}>
          <div className="meme-card-header">
            <span className="meme-card-icon">{"\uD83D\uDEA8"}</span>
            <span className="meme-card-label">Bias alert</span>
          </div>
          <p>{biasAlert}</p>
        </div>
      )}

      {/* Roast toggle */}
      <div className="toggle-row" style={{ marginBottom: "0.5rem" }}>
        <span className="toggle-label">{roastMode ? "Roast mode ON" : "Roast mode (HR-safe)"}</span>
        <button
          type="button"
          className={`toggle ${roastMode ? "on" : ""}`}
          onClick={() => setRoastMode(!roastMode)}
        />
      </div>

      {/* Feedback meme cards */}
      <div className="meme-cards">
        <div className="meme-card serious-card">
          <div className="meme-card-header">
            <span className="meme-card-icon">{"\uD83D\uDCBC"}</span>
            <span className="meme-card-label">For HR / 1:1</span>
          </div>
          <p>{serious}</p>
        </div>

        <div className="meme-card genz-card">
          <div className="meme-card-header">
            <span className="meme-card-icon">{"\uD83D\uDD25"}</span>
            <span className="meme-card-label">Gen-Z translation</span>
          </div>
          <p>{genz}</p>
        </div>

        {roastMode && roast && (
          <div className="meme-card roast-card">
            <div className="meme-card-header">
              <span className="meme-card-icon">{"\uD83C\uDF36\uFE0F"}</span>
              <span className="meme-card-label">Light roast (HR-safe)</span>
            </div>
            <p>{roast}</p>
          </div>
        )}

        {realityCheck && (
          <div className="meme-card reality-card">
            <div className="meme-card-header">
              <span className="meme-card-icon">{"\uD83D\uDE0C"}</span>
              <span className="meme-card-label">Reality check</span>
            </div>
            <p>{realityCheck}</p>
          </div>
        )}

        {growthRoadmap && (
          <div className="meme-card roadmap-card">
            <div className="meme-card-header">
              <span className="meme-card-icon">{"\uD83D\uDDFA\uFE0F"}</span>
              <span className="meme-card-label">Growth roadmap</span>
            </div>
            <p>{growthRoadmap}</p>
          </div>
        )}
      </div>

      {/* Risk flags */}
      {riskFlags.length > 0 && (
        <div>
          <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.5rem" }}>Heads up</div>
          <div className="flags">
            {riskFlags.map((f) => (
              <span key={f} className={`flag-chip ${f.toLowerCase()}`}>
                {FLAG_LABELS[f.toLowerCase()] || f}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="disclaimer">
        AI-generated. This is a conversation starter, not a final HR decision. Human review always recommended.
      </p>

      <button className="btn btn-secondary btn-full" onClick={onReset} style={{ marginTop: "1rem" }}>
        Run it back
      </button>
    </div>
  );
}

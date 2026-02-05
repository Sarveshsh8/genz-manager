"use client";

import { useState } from "react";

const REACTION_EMOJIS = [
  "\uD83D\uDD25",
  "\uD83D\uDE80",
  "\uD83D\uDCAF",
  "\uD83D\uDE2C",
  "\uD83D\uDC80",
  "\uD83D\uDE0C",
];

interface PeerEntry {
  emoji: string;
  text: string;
}

export function PeerFeedback({
  onSubmit,
  onSkip,
  employeeName,
}: {
  onSubmit: (peers: PeerEntry[]) => void;
  onSkip: () => void;
  employeeName?: string;
}) {
  const [entries, setEntries] = useState<PeerEntry[]>([
    { emoji: "", text: "" },
  ]);

  const updateEntry = (idx: number, field: "emoji" | "text", value: string) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e))
    );
  };

  const addEntry = () => {
    if (entries.length < 5) {
      setEntries((prev) => [...prev, { emoji: "", text: "" }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filled = entries.filter((e) => e.emoji || e.text.trim());
    onSubmit(filled.length > 0 ? filled : []);
  };

  return (
    <form className="glass-card" onSubmit={handleSubmit}>
      <h2 className="form-title">Peer feedback</h2>
      <p className="form-subtitle">
        Anonymous feedback for <strong>{employeeName || "this person"}</strong>.
        Pick a reaction emoji and drop a quick thought. Keep it real but respectful.
      </p>

      {entries.map((entry, idx) => (
        <div key={idx} className="peer-card">
          <div className="peer-emoji-row">
            {REACTION_EMOJIS.map((em) => (
              <button
                key={em}
                type="button"
                className={`peer-emoji-btn ${entry.emoji === em ? "selected" : ""}`}
                onClick={() => updateEntry(idx, "emoji", em)}
              >
                {em}
              </button>
            ))}
          </div>
          <textarea
            className="field-input"
            value={entry.text}
            onChange={(e) => updateEntry(idx, "text", e.target.value)}
            placeholder="Quick anonymous feedback (optional)"
            rows={2}
          />
        </div>
      ))}

      {entries.length < 5 && (
        <button type="button" className="btn btn-ghost" onClick={addEntry} style={{ marginBottom: "1rem" }}>
          + Add another peer
        </button>
      )}

      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button type="button" className="btn btn-ghost" onClick={onSkip} style={{ flex: 1 }}>
          Skip this
        </button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          Submit feedback
        </button>
      </div>
    </form>
  );
}

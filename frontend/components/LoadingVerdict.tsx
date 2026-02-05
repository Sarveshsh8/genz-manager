"use client";

import { useState, useEffect } from "react";

const PHRASES = [
  "Consulting the algorithm...",
  "Vibes are being analyzed...",
  "Generating your character arc...",
  "Cross-referencing the delusion...",
  "The AI is reading the room...",
  "Calculating hike worthiness...",
  "Running reality check protocol...",
  "Almost done, no cap...",
];

export function LoadingVerdict() {
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setPhrase(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
    const interval = setInterval(() => {
      setIdx((prev) => {
        const next = (prev + 1) % PHRASES.length;
        setPhrase(PHRASES[next]);
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card">
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p className="loading-text">{phrase}</p>
        <p className="loading-sub">Comparing self-review vs manager review...</p>
      </div>
    </div>
  );
}

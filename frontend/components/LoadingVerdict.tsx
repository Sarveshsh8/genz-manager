"use client";

import { useState, useEffect } from "react";

const LOADING_PHRASES = [
  "Consulting the oracle...",
  "Reading between the lines...",
  "Doing the math (it is not math)...",
  "Vibes are being analyzed...",
  "Almost there, no cap...",
  "Generating your character arc...",
];

export function LoadingVerdict() {
  const [phrase, setPhrase] = useState(LOADING_PHRASES[0]);
  useEffect(() => {
    setPhrase(LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)]);
  }, []);

  return (
    <div className="result">
      <div className="loading-verdict">
        <p className="loading-phrase">{phrase}</p>
        <div className="loading-dots">
          <span />
          <span />
          <span />
        </div>
        <p className="loading-sub">Comparing self-review vs manager review...</p>
      </div>
    </div>
  );
}

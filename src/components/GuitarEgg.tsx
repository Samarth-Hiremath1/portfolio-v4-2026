"use client";

import { useRef, useState } from "react";

/**
 * The guitar easter egg. A small line-art guitar in the footer that,
 * when clicked, actually strums — an E-major arpeggio synthesized in
 * Web Audio. No sound files, no libraries. For the ones who click things.
 */
const STRUM_HZ = [82.41, 123.47, 164.81, 207.65, 246.94, 329.63]; // E2 B2 E3 G#3 B3 E4

export default function GuitarEgg() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [strumming, setStrumming] = useState(false);

  const strum = () => {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!ctxRef.current) ctxRef.current = new Ctx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    STRUM_HZ.forEach((freq, i) => {
      const t = now + i * 0.045; // strings hit in sequence, like a real strum
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "triangle";
      osc.frequency.value = freq;
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2400, t);
      filter.frequency.exponentialRampToValueAtTime(600, t + 1.3);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.6);
    });

    setStrumming(true);
    window.setTimeout(() => setStrumming(false), 550);
  };

  return (
    <button
      onClick={strum}
      aria-label="Strum the guitar"
      title="（ STRUM ）"
      className={`group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-horizon/50 hover:text-horizon ${
        strumming ? "strumming" : ""
      }`}
    >
      {/* line-art guitar, matching the HUD's stroke language */}
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {/* body */}
        <path d="M8.6 12.9c-1.5-.3-3.1.2-4.2 1.3a4.6 4.6 0 0 0 0 6.5 4.6 4.6 0 0 0 6.5 0c1.1-1.1 1.6-2.7 1.3-4.2" />
        {/* sound hole */}
        <circle cx="8.4" cy="16.7" r="1.3" />
        {/* neck */}
        <path d="M11.2 13.9 19.6 5.5" />
        {/* headstock */}
        <path d="m19.6 5.5 1.6-.4 1-1-2.2-2.2-1 1-.4 1.6-1.1 1.1 1 1z" />
      </svg>
    </button>
  );
}

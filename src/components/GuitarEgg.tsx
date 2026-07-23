"use client";

import { useRef, useState } from "react";

/**
 * The guitar easter egg. A small line-art guitar in the footer that,
 * when clicked, plucks out a short synthesized riff — a simplified,
 * evocative homage to "Love Yourself" (Justin Bieber), whose intro is
 * one of the more famous fingerpicked acoustic hooks around. Not a
 * note-perfect transcription, just a nod. All Web Audio, no samples.
 */
type Note = { freq: number; t: number; dur: number; vel: number };

// D major register: D4 F#4 A4 D5 G4 B4 — a fingerpicked bass/treble
// alternation shaped like the song's groove, not a literal tab.
const RIFF: Note[] = [
  { freq: 293.66, t: 0.0, dur: 0.5, vel: 1 }, // D4 — bass
  { freq: 369.99, t: 0.15, dur: 0.2, vel: 0.7 }, // F#4
  { freq: 440.0, t: 0.3, dur: 0.2, vel: 0.75 }, // A4
  { freq: 587.33, t: 0.45, dur: 0.3, vel: 0.9 }, // D5 — the hook
  { freq: 293.66, t: 0.65, dur: 0.4, vel: 0.95 }, // D4 — bass
  { freq: 369.99, t: 0.8, dur: 0.2, vel: 0.65 }, // F#4
  { freq: 440.0, t: 0.95, dur: 0.2, vel: 0.7 }, // A4
  { freq: 369.99, t: 1.1, dur: 0.3, vel: 0.65 }, // F#4
  { freq: 293.66, t: 1.35, dur: 0.4, vel: 0.9 }, // D4 — bass
  { freq: 392.0, t: 1.5, dur: 0.2, vel: 0.7 }, // G4
  { freq: 493.88, t: 1.65, dur: 0.2, vel: 0.75 }, // B4
  { freq: 587.33, t: 1.8, dur: 0.3, vel: 0.9 }, // D5
  { freq: 493.88, t: 1.95, dur: 0.2, vel: 0.65 }, // B4
  { freq: 440.0, t: 2.15, dur: 0.25, vel: 0.7 }, // A4 — resolving down
  { freq: 293.66, t: 2.4, dur: 0.7, vel: 1 }, // D4 — final resolve
];

export default function GuitarEgg() {
  const ctxRef = useRef<AudioContext | null>(null);
  const activeNodes = useRef<AudioScheduledSourceNode[]>([]);
  const [strumming, setStrumming] = useState(false);

  const pluck = (ctx: AudioContext, t: number, note: Note) => {
    // two slightly detuned oscillators for a fuller steel-string body,
    // through a lowpass that darkens fast — a plucked-string envelope
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, t);
    filter.frequency.exponentialRampToValueAtTime(700, t + note.dur * 2.2);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.22 * note.vel, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + note.dur * 2.4);
    gain.connect(filter).connect(ctx.destination);

    [1, 1.006].forEach((detune) => {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = note.freq * detune;
      osc.connect(gain);
      osc.start(t);
      osc.stop(t + note.dur * 2.5);
      activeNodes.current.push(osc);
    });
  };

  const strum = () => {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!ctxRef.current) ctxRef.current = new Ctx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    // re-press mid-riff: cut what's ringing and start clean
    activeNodes.current.forEach((n) => {
      try {
        n.stop();
      } catch {}
    });
    activeNodes.current = [];

    const now = ctx.currentTime;
    RIFF.forEach((note) => pluck(ctx, now + note.t, note));

    setStrumming(true);
    window.setTimeout(() => setStrumming(false), 3200);
  };

  return (
    <button
      onClick={strum}
      aria-label="Play a riff on the guitar"
      title="（ PLAY ）"
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

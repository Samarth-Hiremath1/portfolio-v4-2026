"use client";

import { useRef } from "react";

/**
 * Shared card treatment: lift + border glow on hover, with a
 * cursor-tracking ember spotlight (via --mx / --my CSS vars).
 */
export default function GlowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`glow-card ${className}`}
    >
      {children}
    </div>
  );
}

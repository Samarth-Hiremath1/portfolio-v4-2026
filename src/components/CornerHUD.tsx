"use client";

import { useEffect, useState } from "react";

/**
 * Fixed corner metadata — the quiet HUD layer that gives the page
 * a sense of place. USC coordinates left, scroll telemetry right.
 */
export default function CornerHUD() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed bottom-5 left-6 z-40 hidden flex-col gap-0.5 lg:flex">
        <span className="font-mono text-[9px] tracking-[0.25em] text-muted/70">
          37.7749_N / 122.4194_W
        </span>
        <span className="font-mono text-[9px] tracking-[0.25em] text-muted/40">
          SAN_FRANCISCO_BAY_AREA
        </span>
      </div>
      <div className="pointer-events-none fixed bottom-5 right-6 z-40 hidden flex-col items-end gap-0.5 lg:flex">
        <span className="font-mono text-[9px] tracking-[0.25em] text-horizon/70">
          SCROLL_{String(pct).padStart(3, "0")}%
        </span>
        <span className="font-mono text-[9px] tracking-[0.25em] text-muted/40">
          PORTFOLIO_V4 / 2026
        </span>
      </div>
    </>
  );
}

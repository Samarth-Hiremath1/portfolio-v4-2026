"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrambleTextPlugin);
}

/**
 * Mono label that "decodes" into place when scrolled into view —
 * the nudot signature move for metadata text.
 */
export default function ScrambleLabel({
  text,
  className = "mono-label",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(el, {
        duration: 1.2,
        scrambleText: {
          text,
          chars: "01#_/<>",
          speed: 0.5,
        },
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    return () => mm.revert();
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}

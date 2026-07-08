"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { about } from "@/lib/content";

/**
 * The face card — just the portrait in a glowing frame.
 * Reads /public/profile.jpg; falls back to the placeholder if it's
 * missing. Used small in the hero, full-size in About.
 */
export default function IdBadge({ className = "" }: { className?: string }) {
  const imgRef = useRef<HTMLImageElement>(null);

  // the 404 can fire before React hydrates (this img is above the fold,
  // not lazy), so onError alone can miss it — re-check on mount
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0 && !img.dataset.fb) {
      img.dataset.fb = "1";
      img.src = "/portrait-placeholder.svg";
    }
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-void-2/90 shadow-[0_0_40px_-8px_rgba(194,65,12,0.4)] ${className}`}
      style={{ aspectRatio: "3 / 4" }}
    >
      {/* bevel glow edge */}
      <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl border border-horizon/25" />
      <div className="pointer-events-none absolute -inset-px z-10 rounded-2xl bg-gradient-to-br from-furnace/20 via-transparent to-horizon/10" />

      <img
        ref={imgRef}
        src="/profile.jpg"
        alt={about.badge.photoAlt}
        className="h-full w-full object-cover"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.dataset.fb) return;
          img.dataset.fb = "1";
          img.src = "/portrait-placeholder.svg";
        }}
      />
    </div>
  );
}

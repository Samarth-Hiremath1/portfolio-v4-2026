/* eslint-disable @next/next/no-img-element */
import { about } from "@/lib/content";

/**
 * Astronaut access-card style ID badge.
 * Used small in the hero, and full-size in the About slot.
 * Sized by its container — keep the aspect ratio consistent in both places.
 */
export default function IdBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-void-2/90 shadow-[0_0_40px_-8px_rgba(194,65,12,0.4)] backdrop-blur-sm ${className}`}
      style={{ aspectRatio: "3 / 4" }}
    >
      {/* bevel glow edge */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-horizon/25" />
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-furnace/20 via-transparent to-horizon/10" />

      {/* lanyard slot */}
      <div className="absolute left-1/2 top-[4%] h-[3.5%] w-[22%] -translate-x-1/2 rounded-full bg-void border border-white/10" />

      <div className="flex h-full flex-col p-[7%] pt-[12%]">
        {/* photo — swap /portrait-placeholder.svg in /public for a real photo */}
        <div className="relative w-full flex-1 overflow-hidden rounded-lg border border-white/5">
          <img
            src="/portrait-placeholder.svg"
            alt={about.badge.photoAlt}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="pt-[6%]">
          <p className="font-mono text-[0.55em] uppercase tracking-[0.3em] text-horizon/80">
            {about.badge.idLabel}
          </p>
          <p className="mt-[2%] font-display text-[0.95em] font-bold leading-tight text-ink">
            {about.badge.line1}
          </p>
          <p className="text-[0.6em] text-muted">{about.badge.line2}</p>
        </div>

        {/* barcode strip */}
        <div className="mt-[5%] flex h-[6%] items-stretch gap-[2px] opacity-50">
          {[3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3].map(
            (w, i) => (
              <div
                key={i}
                className="bg-ink/70"
                style={{ width: `${w * 2}px` }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

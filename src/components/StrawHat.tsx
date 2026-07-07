/**
 * Luffy's straw hat — side view, wavy wide brim, crimson band,
 * sketchy straw strokes. Drawn to match the classic anime look.
 * ScarMark below is the companion piece: the under-eye scar,
 * brush-stroke style, for carving into a letterform.
 */
export default function StrawHat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 100" aria-hidden className={className}>
      {/* brim — wide, gently waving, tips swept */}
      <path
        d="M4 70 Q42 52 52 50 Q80 42 108 50 Q120 53 156 66 Q140 82 106 87 Q80 91 52 87 Q18 82 4 70 Z"
        fill="#e8c25c"
        stroke="#2a1e0a"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* crown dome */}
      <path
        d="M52 58 Q50 14 82 12 Q116 14 112 56 Q82 66 52 58 Z"
        fill="#f0cf6e"
        stroke="#2a1e0a"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* left shadow wedge on the crown */}
      <path
        d="M53 57 Q51 20 70 13 Q59 26 58 56 Z"
        fill="#9c7c3c"
        opacity="0.55"
      />
      {/* the band */}
      <path
        d="M51 57 Q82 68 113 54 L113 39 Q82 53 51 42 Z"
        fill="#a52a1f"
        stroke="#2a1e0a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* straw texture — short sketch strokes */}
      <g stroke="#2a1e0a" strokeWidth="1.6" strokeLinecap="round" opacity="0.5">
        <path d="M72 22 l8 -4" />
        <path d="M90 26 l7 4" />
        <path d="M80 34 l7 -2" />
        <path d="M62 30 l6 -4" />
        <path d="M100 34 l6 -3" />
        <path d="M28 72 l10 -4" />
        <path d="M46 80 l9 -2" />
        <path d="M76 84 l9 -1" />
        <path d="M104 80 l10 -3" />
        <path d="M126 72 l10 -3" />
        <path d="M16 68 l8 -2" />
      </g>
    </svg>
  );
}

/**
 * Luffy's scar — a gentle downward-bowing slash crossed by two short
 * stitches, tapered like a brush stroke.
 */
export function ScarMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 44" aria-hidden className={className}>
      <g stroke="#0a0807" strokeLinecap="round" fill="none">
        <path d="M6 19 Q60 33 114 17" strokeWidth="6.5" />
        <path d="M39 6 Q36 22 33 38" strokeWidth="4.5" />
        <path d="M84 5 Q82 21 80 36" strokeWidth="4.5" />
      </g>
    </svg>
  );
}

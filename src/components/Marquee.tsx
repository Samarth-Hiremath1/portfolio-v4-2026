/**
 * Infinite text band — pure CSS animation, duplicated content
 * for a seamless loop. One per page is plenty.
 */
const ITEMS = [
  "BUILD",
  "SHIP",
  "SCALE",
  "REPEAT",
  "0 → 1",
  "SAMARTH_HIREMATH",
];

export default function Marquee() {
  const strip = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="marquee-track flex shrink-0 items-center"
    >
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="display-head whitespace-nowrap px-6 text-2xl text-ink/80 md:text-3xl">
            {item}
          </span>
          <span className="text-horizon">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex overflow-hidden border-y border-white/5 bg-void-2 py-5">
      {strip(false)}
      {strip(true)}
    </div>
  );
}

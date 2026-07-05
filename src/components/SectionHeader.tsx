import ScrambleLabel from "@/components/ScrambleLabel";

/**
 * Shared section header: technical-drawing plus-marks, a decoding
 * mono eyebrow on a hairline, then the heavy display title.
 */
export default function SectionHeader({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <span aria-hidden className="font-mono text-sm text-horizon/70">
          +
        </span>
        <ScrambleLabel text={eyebrow} />
        <span className="h-px flex-1 bg-white/10" />
        <span aria-hidden className="font-mono text-sm text-horizon/70">
          +
        </span>
      </div>
      <h2 className="display-head mt-6 max-w-3xl text-3xl md:text-4xl lg:text-5xl">
        {title}
      </h2>
    </div>
  );
}

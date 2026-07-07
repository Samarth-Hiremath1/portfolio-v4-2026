import Magnetic from "@/components/Magnetic";
import ScrambleLabel from "@/components/ScrambleLabel";
import GuitarEgg from "@/components/GuitarEgg";
import ContactRing from "@/components/three/ContactRing";
import { site } from "@/lib/content";

/**
 * Deliberately quiet after the journey above — a calm landing.
 */
export default function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-void px-6 pb-12 pt-36 md:px-10 lg:pt-48">
      {/* ember ring in slow orbit — the hero's quiet echo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px] opacity-60">
        <ContactRing />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="flex items-center gap-4">
          <span aria-hidden className="font-mono text-sm text-horizon/70">
            +
          </span>
          <ScrambleLabel text="TRANSMISSION" />
          <span aria-hidden className="font-mono text-sm text-horizon/70">
            +
          </span>
        </div>
        <h2 className="display-head mt-8 text-3xl md:text-5xl">
          Let&apos;s build what&apos;s&nbsp;next
        </h2>
        <Magnetic strength={0.2} className="mt-10 inline-block">
          <a
            href={`mailto:${site.email}`}
            className="group relative text-lg text-ink transition-colors hover:text-horizon md:text-2xl"
          >
            {site.email}
            <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-horizon transition-all duration-500 group-hover:w-full" />
          </a>
        </Magnetic>

        <div className="mt-12 flex items-center gap-2">
          {site.socials.map((social) => (
            <Magnetic key={social.label} strength={0.3}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-7 py-3 text-[15px] text-muted transition-colors hover:border-horizon/50 hover:text-horizon"
              >
                {social.label}
              </a>
            </Magnetic>
          ))}
          <Magnetic strength={0.3}>
            <GuitarEgg />
          </Magnetic>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-28 flex max-w-6xl justify-center border-t border-white/5 pt-8 text-xs text-muted/70">
        <p>© 2026 {site.name}</p>
      </div>
    </footer>
  );
}

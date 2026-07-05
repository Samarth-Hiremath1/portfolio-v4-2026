"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { quote } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrambleTextPlugin);
}

/**
 * The display-face pause between trajectory (past) and work (what he
 * creates). Words rise out of a blur as you scroll through; then
 * "create it." decodes and ignites — the site's scramble language
 * landing its most important line.
 */
export default function QuoteMoment() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // words surface from the void: blurred + low, sharpening as they rise
      gsap.fromTo(
        el.querySelectorAll(".q-word"),
        { opacity: 0.08, yPercent: 26, filter: "blur(7px)" },
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          stagger: 0.07,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "center 45%",
            scrub: true,
          },
        }
      );

      // "create it." decodes, then ignites
      const hl = el.querySelector<HTMLElement>(".q-hl");
      if (hl) {
        gsap.timeline({
          scrollTrigger: { trigger: el, start: "center 58%" },
        })
          .to(hl, {
            duration: 1.1,
            scrambleText: { text: quote.highlight, chars: "01#_/<>", speed: 0.4 },
            ease: "none",
          })
          .fromTo(
            hl,
            { textShadow: "0 0 0px rgba(255,142,60,0)" },
            {
              textShadow: "0 0 32px rgba(255,142,60,0.55)",
              duration: 0.9,
              ease: "power2.out",
              yoyo: true,
              repeat: 1,
              repeatDelay: 0.4,
            },
            "-=0.2"
          );
      }

      gsap.fromTo(
        el.querySelector(".q-attr"),
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: el, start: "center 55%" },
        }
      );
    });

    return () => mm.revert();
  }, []);

  const plain = quote.text.slice(0, quote.text.length - quote.highlight.length);
  const words = plain.trim().split(" ");

  return (
    <section
      ref={ref}
      className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-void px-6 py-28 md:px-10"
    >
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[640px] -translate-x-1/2 rounded-full bg-furnace/[0.07] blur-[130px]" />
      <figure className="mx-auto max-w-5xl text-center">
        <blockquote className="display-head text-[clamp(1.9rem,5.5vw,4.6rem)] leading-[1.04] text-ink">
          {words.map((w, i) => (
            <span key={i} className="q-word inline-block">
              {w}&nbsp;
            </span>
          ))}
          <span className="q-word q-hl inline-block text-horizon">
            {quote.highlight}
          </span>
        </blockquote>
        <figcaption className="q-attr mono-label mt-8 block">
          — {quote.attribution}
        </figcaption>
      </figure>
    </section>
  );
}

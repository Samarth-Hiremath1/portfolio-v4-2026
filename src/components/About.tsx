"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import IdBadge from "@/components/IdBadge";
import ScrambleLabel from "@/components/ScrambleLabel";
import { about } from "@/lib/content";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    // Desktop: the hero badge travels down and docks into the About slot —
    // one continuous scrubbed motion, then a crisp swap to the resident card.
    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        noPref: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { isDesktop, noPref } = ctx.conditions as {
          isDesktop: boolean;
          noPref: boolean;
        };

        if (noPref) {
          // text reveal
          gsap.from(section.querySelectorAll(".about-reveal"), {
            opacity: 0,
            y: 32,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: section, start: "top 65%" },
          });
        }

        if (!(isDesktop && noPref)) return;

        const badge = document.getElementById("hero-badge");
        const slot = document.getElementById("about-badge-slot");
        if (!badge || !slot) return;

        let dx = 0;
        let dy = 0;
        let sc = 1;
        const compute = () => {
          gsap.set(badge, { x: 0, y: 0, scale: 1 });
          const b = badge.getBoundingClientRect();
          const s = slot.getBoundingClientRect();
          // same-instant viewport rects: delta is scroll-independent
          dx = s.left - b.left;
          dy = s.top - b.top;
          sc = s.width / b.width;
        };
        compute();
        ScrollTrigger.addEventListener("refreshInit", compute);

        const travel = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 12%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        travel.to(
          badge,
          {
            x: () => dx,
            y: () => dy,
            scale: () => sc,
            transformOrigin: "top left",
            ease: "none",
          },
          0
        );

        // once docked, swap the (scaled) traveler for the crisp resident card
        const swap = ScrollTrigger.create({
          trigger: section,
          start: "top 14%",
          onEnter: () => document.body.classList.add("badge-swapped"),
          onLeaveBack: () => document.body.classList.remove("badge-swapped"),
        });

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", compute);
          swap.kill();
          travel.kill();
          document.body.classList.remove("badge-swapped");
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-gradient-to-b from-void to-void-2 px-6 py-32 md:px-10 lg:py-44"
    >
      {/* faint accretion warmth */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-furnace/10 blur-[140px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[320px_1fr] lg:gap-24">
        <div id="about-badge-slot" className="mx-auto w-64 max-w-full lg:w-full">
          <div className="slot-card">
            <IdBadge className="text-xl" />
          </div>
        </div>

        <div>
          <div className="about-reveal flex items-center gap-4">
            <span aria-hidden className="font-mono text-sm text-horizon/70">
              +
            </span>
            <ScrambleLabel text="PROFILE" />
            <span className="h-px w-24 bg-white/10" />
          </div>
          <h2 className="about-reveal display-head mt-6 text-3xl md:text-4xl lg:text-5xl">
            The systems layer of&nbsp;intelligence
          </h2>
          <p className="about-reveal mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            {about.paragraphs[0]}
          </p>
          <div className="about-reveal mt-8 space-y-2 text-base md:text-lg">
            <p>
              <span className="mr-3 font-mono text-xs uppercase tracking-[0.25em] text-horizon">
                Next
              </span>
              <span className="text-ink/90">
                research engineering at a frontier lab.
              </span>
            </p>
            <p>
              <span className="mr-3 font-mono text-xs uppercase tracking-[0.25em] text-horizon">
                Eventually
              </span>
              <span className="text-ink/90">founding what comes after.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

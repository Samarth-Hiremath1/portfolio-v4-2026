"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import GlowCard from "@/components/GlowCard";
import SectionHeader from "@/components/SectionHeader";
import { experience } from "@/lib/content";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const cometRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // beam fill + comet track the scroll through the log
      const scrubTriggerConfig = {
        trigger: list,
        start: "top 60%",
        end: "bottom 55%",
        scrub: 0.6,
        invalidateOnRefresh: true,
      };
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: "top", ease: "none", scrollTrigger: scrubTriggerConfig }
      );
      gsap.fromTo(
        cometRef.current,
        { y: 0 },
        {
          y: () => list.offsetHeight,
          ease: "none",
          scrollTrigger: scrubTriggerConfig,
        }
      );

      // waypoints ignite as the comet passes
      const triggers: ScrollTrigger[] = [];
      list.querySelectorAll<HTMLElement>(".waypoint").forEach((el) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 62%",
            onEnter: () => el.classList.add("is-lit"),
            onLeaveBack: () => el.classList.remove("is-lit"),
          })
        );
      });
      return () => triggers.forEach((t) => t.kill());
    });

    // reduced motion: everything lit, no comet
    mm.add("(prefers-reduced-motion: reduce)", () => {
      list
        .querySelectorAll<HTMLElement>(".waypoint")
        .forEach((el) => el.classList.add("is-lit"));
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative bg-void-2 px-6 py-32 md:px-10 lg:py-44"
    >
      <div className="pointer-events-none absolute -right-52 top-10 h-[520px] w-[520px] rounded-full bg-furnace/[0.08] blur-[150px]" />

      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="TRAJECTORY" title="Professional Experience" />

        <div className="relative mt-20">
          {/* the beam */}
          <div className="absolute left-[5px] top-0 h-full w-px bg-white/[0.07] md:left-[7px]">
            <div
              ref={fillRef}
              className="h-full w-full origin-top bg-gradient-to-b from-furnace via-horizon to-whitehot"
              style={{ transform: "scaleY(0)" }}
            />
          </div>
          {/* the comet */}
          <div
            ref={cometRef}
            className="comet absolute left-[5px] top-0 z-10 h-3 w-3 -translate-x-1/2 rounded-full md:left-[7px]"
            style={{ marginLeft: "0.5px" }}
          />

          <ol ref={listRef} className="space-y-14 md:space-y-16">
            {experience.map((job) => (
              <li key={job.company} className="waypoint relative pl-10 md:pl-16">
                {/* waypoint node on the beam */}
                <span className="waypoint-node absolute left-[5px] top-9 h-[11px] w-[11px] -translate-x-1/2 rounded-full md:left-[7px]" />
                <div className="waypoint-card">
                  <GlowCard className="p-6 md:p-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h3 className="text-xl font-semibold md:text-2xl">
                        {job.company}
                      </h3>
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-horizon/90">
                        {job.dates}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-ink/80 md:text-base">
                      {job.role}
                    </p>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-[15px]">
                      {job.description}
                    </p>
                  </GlowCard>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

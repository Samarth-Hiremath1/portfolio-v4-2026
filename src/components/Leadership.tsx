"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import GlowCard from "@/components/GlowCard";
import SectionHeader from "@/components/SectionHeader";
import ScrambleLabel from "@/components/ScrambleLabel";
import { leadership } from "@/lib/content";

const LeadershipBelt = dynamic(
  () => import("@/components/three/LeadershipBelt"),
  { ssr: false }
);

/**
 * Full docking-bay section: each record is a big image + story row
 * that glides in from alternating sides and locks into the station.
 */
export default function Leadership() {
  const sectionRef = useRef<HTMLElement>(null);
  const beltWrapRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0.5);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const st = beltWrapRef.current
      ? ScrollTrigger.create({
          trigger: beltWrapRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            progress.current = self.progress;
          },
        })
      : null;

    return () => {
      window.removeEventListener("pointermove", onMove);
      st?.kill();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      section.querySelectorAll<HTMLElement>(".dock-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            x: i % 2 === 0 ? -90 : 90,
            opacity: 0,
            rotate: i % 2 === 0 ? -1 : 1,
          },
          {
            x: 0,
            opacity: 1,
            rotate: 0,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: { trigger: card, start: "top 75%" },
            onComplete: () => card.classList.add("docked"),
          }
        );
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      section
        .querySelectorAll<HTMLElement>(".dock-card")
        .forEach((c) => c.classList.add("docked"));
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="leadership"
      className="relative bg-void-3/60 px-6 py-32 md:px-10 lg:py-44"
    >
      <div className="pointer-events-none absolute left-1/3 top-0 h-[420px] w-[420px] rounded-full bg-furnace/[0.09] blur-[130px]" />

      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader eyebrow="BEYOND_THE_CODE" title="Leadership" />
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          Building things is half the story. The other half is building the
          teams and communities that build them.
        </p>
      </div>

      {/* the motion belt — full-bleed filmstrip riding the scroll */}
      <div
        ref={beltWrapRef}
        className="pointer-events-none mt-16 h-[38vh] min-h-[280px] w-full md:h-[46vh]"
      >
        {mounted && (
          <LeadershipBelt
            images={leadership.map((l) => l.beltImage ?? l.image)}
            progress={progress}
            pointer={pointer}
            reduced={reduced}
          />
        )}
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="mt-20 space-y-20 lg:space-y-28">
          {leadership.map((item, i) => (
            <article
              key={item.org}
              className="dock-card group grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
            >
              {/* big picture — swap the placeholder in /public/leadership */}
              <GlowCard
                className={`overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <img
                  src={item.image}
                  alt={`${item.org} — ${item.role}`}
                  className="aspect-[16/10] w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // real photos may be .png/.jpg/.jpeg/.webp; fall back to the .svg placeholder
                    const img = e.currentTarget;
                    if (img.dataset.fb) return;
                    img.dataset.fb = "1";
                    img.src = item.image.replace(/\.(png|jpe?g|webp)$/i, ".svg");
                  }}
                />
              </GlowCard>

              <div className="relative">
                <span className="dock-label absolute right-0 top-1 font-mono text-[11px] uppercase tracking-[0.3em] text-horizon opacity-0 transition-opacity duration-700 group-[.docked]:opacity-80">
                  ● Docked
                </span>
                <ScrambleLabel
                  text={item.dates.replace(/\s/g, "")}
                  className="font-mono text-[12px] uppercase tracking-[0.25em] text-horizon/90"
                />
                <h3 className="display-head mt-4 text-2xl md:text-3xl">
                  {item.org}
                </h3>
                <p className="mt-2 text-sm font-medium text-ink/80 md:text-base">
                  {item.role}
                </p>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted md:text-[15px]">
                  {item.description}
                </p>

                {/* telemetry row */}
                <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/5 pt-6">
                  {item.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="display-head text-2xl text-ink md:text-3xl">
                        {stat.value}
                      </p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import IdBadge from "@/components/IdBadge";
import ScrambleLabel from "@/components/ScrambleLabel";
import { site } from "@/lib/content";

const BlackHoleScene = dynamic(() => import("./BlackHoleScene"), {
  ssr: false,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        section.querySelectorAll(".hero-line-inner"),
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.1,
          delay: 0.1,
        }
      );
      gsap.fromTo(
        section.querySelectorAll(".hero-fade"),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.9,
        }
      );

      // idle float on the badge (inner wrapper — outer is owned by the About scrub)
      gsap.to(".badge-float", {
        y: -9,
        duration: 3.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // hero recedes as you leave it
      gsap.to(section.querySelector(".hero-stage"), {
        opacity: 0.2,
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[100svh]"
    >
      {/* pointer-events-none: the stage may overhang the next section while scrolling out */}
      <div className="hero-stage pointer-events-none absolute inset-0">
        {/* Gargantua — fills the frame; composed low so the name owns the top */}
        <div
          className={`absolute inset-0 z-0 transition-opacity duration-[1500ms] ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          {mounted && (
            <BlackHoleScene
              pointer={pointer}
              isMobile={isMobile}
              reduced={reduced}
              onReady={() => setReady(true)}
            />
          )}
        </div>

        {/* name block — above the scene, never occluded */}
        <div className="pointer-events-none absolute inset-x-0 top-[13%] z-10 flex flex-col items-center px-5 md:top-[14%]">
          <h1 className="text-center">
            <span className="block overflow-hidden">
              <span className="hero-line-inner display-head block text-[clamp(2.9rem,11.5vw,10.5rem)] text-ink">
                {site.firstName}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-inner display-head block text-[clamp(2.9rem,11.5vw,10.5rem)] text-ink">
                {site.lastName}
              </span>
            </span>
          </h1>

          {/* metadata rail — mono facts on a hairline */}
          <div className="hero-fade mt-7 flex w-full max-w-5xl items-end justify-between gap-4 border-b border-white/10 pb-3">
            <ScrambleLabel text="AI/ML_ENGINEER" />
            <span className="hidden md:inline">
              <ScrambleLabel text={site.heroCenterLabel} />
            </span>
            <ScrambleLabel text="USC_MSCS_2027" />
          </div>
        </div>

        {/* parenthetical tagline, nudot-style */}
        <p className="hero-fade absolute bottom-16 left-1/2 z-10 w-full -translate-x-1/2 px-4 text-center font-mono text-[10px] uppercase tracking-[0.32em] text-muted md:bottom-[8%] md:text-[11px]">
          {site.heroTagline}
        </p>

        {/* blend the disk glow into the next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-32 bg-gradient-to-b from-transparent to-void" />

        {/* scroll cue */}
        <div className="hero-fade absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
          <div className="h-9 w-px overflow-hidden">
            <div className="scroll-cue-line h-full w-full bg-gradient-to-b from-horizon/80 to-transparent" />
          </div>
        </div>
      </div>

      {/* ID badge — the small planet in the frame. Lives OUTSIDE the
          hero-stage (which fades on scroll) and outside any overflow
          clipping, so it stays visible the whole way to its About slot. */}
      <div
        id="hero-badge"
        className="hero-fade absolute bottom-[26%] left-[7%] z-20 w-24 md:bottom-[22%] md:w-32"
      >
        <div className="badge-float">
          <IdBadge className="text-[11px] md:text-[13px]" />
        </div>
      </div>
    </section>
  );
}

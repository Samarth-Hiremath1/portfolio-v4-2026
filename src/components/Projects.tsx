"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import Magnetic from "@/components/Magnetic";
import GlowCard from "@/components/GlowCard";
import SectionHeader from "@/components/SectionHeader";
import ScrambleLabel from "@/components/ScrambleLabel";
import { featuredProjects, archiveProjects, type Project } from "@/lib/content";

/**
 * Screenshot img with graceful degradation: real assets are .png; if one
 * isn't uploaded yet, fall back to the project's .svg placeholder.
 */
function Shot({
  src,
  fallback,
  alt,
  className,
}: {
  src: string;
  fallback: string;
  alt: string;
  className: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.dataset.fb) return;
        img.dataset.fb = "1";
        img.src = fallback;
      }}
    />
  );
}

// works for .png, .jpg/.jpeg, .webp — whatever real asset extension is used
const svgTwin = (src: string) => src.replace(/\.(png|jpe?g|webp)$/i, ".svg");

/**
 * Click-through image carousel for multi-shot projects: one big image,
 * < > arrows, and a mono counter. Every shot renders full size.
 */
function Carousel({
  images,
  fallback,
  name,
}: {
  images: string[];
  fallback: string;
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (delta: number) =>
    setIndex((prev) => (prev + delta + count) % count);

  return (
    <div className="group/carousel relative">
      {/* key remounts the img so the fallback state resets per slide */}
      <Shot
        key={images[index]}
        src={images[index]}
        fallback={fallback}
        alt={`${name} — screenshot ${index + 1} of ${count}`}
        className="aspect-[4/3] w-full object-cover"
      />

      <button
        onClick={() => go(-1)}
        aria-label="Previous screenshot"
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-void/70 font-mono text-base text-ink/80 backdrop-blur-sm transition-colors hover:border-horizon/60 hover:text-horizon"
      >
        {"<"}
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next screenshot"
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-void/70 font-mono text-base text-ink/80 backdrop-blur-sm transition-colors hover:border-horizon/60 hover:text-horizon"
      >
        {">"}
      </button>

      <span className="absolute bottom-3 right-4 rounded-full bg-void/70 px-3 py-1 font-mono text-[14px] tracking-[0.25em] text-ink/80 backdrop-blur-sm">
        {index + 1}_/_{count}
      </span>
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  if (!project.github && !project.demo) return null;
  return (
    <div className="mt-8 flex gap-4">
      {project.github && (
        <Magnetic strength={0.25}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-ink transition-colors hover:border-horizon/60 hover:text-horizon"
          >
            GitHub <span aria-hidden>↗</span>
          </a>
        </Magnetic>
      )}
      {project.demo && (
        <Magnetic strength={0.25}>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-horizon px-5 py-2.5 text-sm font-medium text-void transition-opacity hover:opacity-85"
          >
            Demo <span aria-hidden>↗</span>
          </a>
        </Magnetic>
      )}
    </div>
  );
}

export default function Projects() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        track.classList.add("is-horizontal");
        const getDistance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + getDistance(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          track.classList.remove("is-horizontal");
          gsap.set(track, { clearProps: "x" });
        };
      }
    );

    // mobile / reduced motion: simple vertical reveals
    mm.add(
      "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      () => {
        const panels = track.querySelectorAll(".proj-panel");
        panels.forEach((panel) => {
          gsap.from(panel, {
            opacity: 0,
            y: 48,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 78%" },
          });
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="projects" className="relative bg-void">
      {/* z-70: panels/images ride above the film grain (z-60), while the
          section's void background stays below it so grain still textures
          the space around the content */}
      <div ref={pinRef} className="relative z-[70] overflow-hidden">
        <div ref={trackRef} className="proj-track px-6 pt-32 pb-8 md:px-10 lg:py-0">
          {/* intro panel — rides inside the horizontal scroll, trionn-style */}
          <div className="proj-panel flex items-center lg:h-screen lg:w-[42vw] lg:shrink-0 lg:pl-[4vw] lg:pr-[6vw]">
            <div className="w-full">
              <SectionHeader eyebrow="SELECTED_WORK" title="Systems that ship" />
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted">
                Four systems, built end to end — kernel to cluster to product.
              </p>
              <p className="mt-10 hidden font-mono text-[14px] uppercase tracking-[0.32em] text-horizon/70 lg:block">
                （ SCROLL → ）
              </p>
            </div>
          </div>

          {featuredProjects.map((project, i) => (
            <article
              key={project.slug}
              className="proj-panel flex items-center lg:h-screen lg:w-[85vw] lg:shrink-0 lg:px-[6vw]"
            >
              <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div>
                  <p className="font-mono text-[15px] tracking-[0.3em] text-horizon/80">
                    {String(i + 1).padStart(2, "0")} / {String(featuredProjects.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-5 text-2xl font-semibold leading-tight md:text-4xl">
                    {project.name}
                  </h3>
                  <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink/90 md:text-base">
                    {project.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1 font-mono text-[14px] uppercase tracking-[0.12em] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ProjectLinks project={project} />
                </div>
                <GlowCard className="overflow-hidden">
                  {project.images && project.images.length > 1 ? (
                    <Carousel
                      images={project.images}
                      fallback={project.image}
                      name={project.name}
                    />
                  ) : (
                    <Shot
                      src={project.images?.[0] ?? project.image}
                      fallback={svgTwin(project.images?.[0] ?? project.image)}
                      alt={`${project.name} preview`}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  )}
                </GlowCard>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* archive — the quieter shelf. z-70 keeps text crisp over the grain */}
      <div className="relative z-[70] px-6 pb-32 pt-10 md:px-10 lg:pb-44 lg:pt-24">
        <div className="mx-auto max-w-6xl">
          <ScrambleLabel text="MORE_EXPERIMENTS" />
          <div className="mt-8 border-t border-white/5">
            {archiveProjects.map((project) => {
              const Row = project.github ? "a" : "div";
              return (
                <Row
                  key={project.slug}
                  {...(project.github
                    ? {
                        href: project.github,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {})}
                  className="group grid grid-cols-1 gap-2 border-b border-white/5 py-7 md:grid-cols-[minmax(0,260px)_1fr_20px] md:items-baseline md:gap-8"
                >
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="text-lg font-medium transition-colors group-hover:text-horizon md:text-xl">
                      {project.name}
                    </h3>
                    {project.status && (
                      <span className="whitespace-nowrap rounded-full border border-horizon/40 px-3 py-0.5 font-mono text-[14px] uppercase tracking-[0.2em] text-horizon">
                        {project.status}
                      </span>
                    )}
                  </div>
                  <p className="text-[15px] leading-relaxed text-ink/90 md:ml-auto md:max-w-[360px] md:text-right">
                    {project.description}
                  </p>
                  <span
                    aria-hidden
                    className={`hidden text-muted transition-all group-hover:translate-x-1 group-hover:text-horizon md:block md:justify-self-end ${
                      project.github ? "" : "invisible"
                    }`}
                  >
                    →
                  </span>
                </Row>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

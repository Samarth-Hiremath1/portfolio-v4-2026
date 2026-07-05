"use client";

import { useEffect, useRef } from "react";

/**
 * Film-grain overlay — pre-baked noise frames cycled on a canvas,
 * screen-blended over the whole site (same recipe nudot uses).
 * Desktop-only; respects reduced motion.
 *
 * The grain "yields" to dense-content sections: while the viewport
 * center is inside one of CALM_SECTIONS it eases down to a whisper
 * so cards and text read crisp, then swells back between sections.
 */
const OPACITY = 0.05;
const CALM_OPACITY = 0.016;
const CALM_SECTIONS = ["experience", "projects"];
const FRAMES = 8;
const FPS = 24;

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.innerWidth <= 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = 0;
    let frameIdx = 0;
    let frames: HTMLCanvasElement[] = [];
    let currentOpacity = OPACITY;
    let targetOpacity = OPACITY;

    const updateTarget = () => {
      const mid = window.innerHeight * 0.5;
      const calm = CALM_SECTIONS.some((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top < mid && r.bottom > mid;
      });
      targetOpacity = calm ? CALM_OPACITY : OPACITY;
    };

    const bake = () => {
      // half-resolution grain, scaled up — cheaper and softer
      const w = Math.ceil(window.innerWidth / 2);
      const h = Math.ceil(window.innerHeight / 2);
      canvas.width = w;
      canvas.height = h;
      frames = Array.from({ length: FRAMES }, () => {
        const f = document.createElement("canvas");
        f.width = w;
        f.height = h;
        const fctx = f.getContext("2d")!;
        const img = fctx.createImageData(w, h);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = Math.random() < 0.5 ? 0 : 255 * Math.random();
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = 255;
        }
        fctx.putImageData(img, 0, 0);
        return f;
      });
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      currentOpacity += (targetOpacity - currentOpacity) * 0.06;
      canvas.style.opacity = currentOpacity.toFixed(3);
      if (t - last < 1000 / FPS) return;
      last = t;
      frameIdx = (frameIdx + 1) % FRAMES;
      ctx.drawImage(frames[frameIdx], 0, 0);
    };

    bake();
    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    raf = requestAnimationFrame(loop);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(bake, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateTarget);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] hidden h-screen w-screen mix-blend-screen md:block"
      style={{ opacity: OPACITY }}
    />
  );
}

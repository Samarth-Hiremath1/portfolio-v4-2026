"use client";

import { useEffect, useRef } from "react";

/**
 * Film-grain overlay — pre-baked noise frames cycled on a canvas,
 * screen-blended over the whole site (same recipe nudot uses).
 * Desktop-only; respects reduced motion.
 *
 * Sits at z-60: above section backgrounds (so grain is visible
 * everywhere), but below the nav/HUD and below the "lifted" content
 * layers (z-70) in the Experience and Projects sections — so cards
 * and images there read crisp while grain still textures the space
 * around them.
 */
const OPACITY = 0.05;
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
      if (t - last < 1000 / FPS) return;
      last = t;
      frameIdx = (frameIdx + 1) % FRAMES;
      ctx.drawImage(frames[frameIdx], 0, 0);
    };

    bake();
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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] hidden h-screen w-screen mix-blend-screen md:block"
      style={{ opacity: OPACITY }}
    />
  );
}

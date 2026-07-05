"use client";

import { useEffect, useRef } from "react";

/**
 * Comet cursor trail — ember particles that lag behind the pointer
 * and burn out, echoing the Flight Log's comet. Fine-pointer desktop
 * only; respects reduced motion. Native cursor stays untouched.
 */
type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
};

const MAX_SPARKS = 90;

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const sparks: Spark[] = [];
    let lastX = -1;
    let lastY = -1;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const onMove = (e: PointerEvent) => {
      const dx = lastX < 0 ? 0 : e.clientX - lastX;
      const dy = lastY < 0 ? 0 : e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      const speed = Math.min(Math.hypot(dx, dy), 40);
      // faster movement sheds more sparks
      const n = Math.min(1 + Math.floor(speed / 7), 4);
      for (let i = 0; i < n; i++) {
        if (sparks.length >= MAX_SPARKS) sparks.shift();
        sparks.push({
          x: e.clientX + (Math.random() - 0.5) * 4,
          y: e.clientY + (Math.random() - 0.5) * 4,
          vx: -dx * 0.04 + (Math.random() - 0.5) * 0.5,
          vy: -dy * 0.04 + (Math.random() - 0.5) * 0.5 - 0.15,
          life: 1,
          size: 1.2 + Math.random() * 1.8 + speed * 0.04,
        });
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= 0.028;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx;
        s.y += s.vy;
        const r = s.size * s.life;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3);
        // white-hot core cooling to ember, like the disk's temperature ramp
        g.addColorStop(0, `rgba(255, 233, 201, ${0.5 * s.life})`);
        g.addColorStop(0.4, `rgba(255, 142, 60, ${0.28 * s.life})`);
        g.addColorStop(1, "rgba(194, 65, 12, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[85] hidden md:block"
    />
  );
}

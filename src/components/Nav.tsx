"use client";

import { useEffect, useState } from "react";
import Magnetic from "@/components/Magnetic";
import { scrollToSection } from "@/lib/lenis-store";

const LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between px-6 py-5 md:px-10">
        <Magnetic>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="display-head text-sm text-ink"
            aria-label="Back to top"
          >
            S—H
          </button>
        </Magnetic>
        <div className="flex items-center gap-1 rounded-full border border-white/5 bg-void/60 px-2 py-1 backdrop-blur-md">
          {LINKS.map((link) => (
            <Magnetic key={link.id} strength={0.25}>
              <button
                onClick={() => scrollToSection(`#${link.id}`)}
                className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 md:px-4 md:text-[11px] ${
                  active === link.id
                    ? "text-horizon"
                    : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </button>
            </Magnetic>
          ))}
        </div>
      </nav>
    </header>
  );
}

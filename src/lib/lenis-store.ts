import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function scrollToSection(selector: string) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(selector, { duration: 1.4 });
  } else {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
  }
}

import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion: skip animations
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Immediately reveal everything without animation
      el.classList.add("revealed");
      el.querySelectorAll(".reveal").forEach((child) => child.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reveal the section itself
            entry.target.classList.add("revealed");
            // Reveal children with .reveal class
            entry.target.querySelectorAll(".reveal").forEach((child) => {
              child.classList.add("revealed");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Section scrubber — a fixed vertical index (desktop only) that tracks which
 * home section is in view and scrolls to it on click. Buttons keep it keyboard
 * accessible; smooth scroll defers to the reduced-motion preference.
 */
const SECTIONS = [
  "about",
  "projects",
  "certificates",
  "experience",
  "contact",
] as const;

export function SectionScrubber() {
  const t = useTranslations("nav");
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed end-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
    >
      {SECTIONS.map((id, i) => {
        const on = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => go(id)}
            aria-current={on ? "true" : undefined}
            className="group flex items-center justify-end gap-3"
          >
            <span
              className={`annotation transition-opacity duration-200 ${
                on
                  ? "text-accent-fg opacity-100"
                  : "opacity-0 group-hover:opacity-60 group-focus-visible:opacity-100"
              }`}
            >
              {String(i + 1).padStart(2, "0")} {t(id)}
            </span>
            <span
              className={`h-px transition-all duration-300 ${
                on
                  ? "w-8 bg-accent"
                  : "w-4 bg-fg-muted/40 group-hover:bg-fg-muted"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

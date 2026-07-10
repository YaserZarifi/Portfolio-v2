"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const SECTION_IDS = [
  "about",
  "projects",
  "certificates",
  "experience",
  "contact",
] as const;

/**
 * AutoCAD-style status bar, fixed to the viewport bottom: live cursor
 * coordinates, the active section (scroll-spied), a snap-grid overlay
 * toggle, and the current locale — the drafting metaphor made operable.
 */
export function StatusBar() {
  const t = useTranslations();
  const locale = useLocale();
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [section, setSection] = useState<string>("hero");
  const [grid, setGrid] = useState(false);
  const raf = useRef<number | null>(null);

  // Restore grid preference.
  useEffect(() => {
    setGrid(localStorage.getItem("cad-grid") === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("cad-grid", grid ? "1" : "0");
  }, [grid]);

  // Live cursor coordinates (rAF-throttled).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  // Active-section spy.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const sectionLabel =
    section === "hero"
      ? t("nav.home")
      : SECTION_IDS.includes(section as (typeof SECTION_IDS)[number])
        ? t(`nav.${section}`)
        : section;

  const pad = (n: number) => String(n).padStart(4, "0");

  return (
    <>
      {grid ? (
        <div
          aria-hidden
          className="grid-overlay pointer-events-none fixed inset-0 z-30 opacity-60"
        />
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 h-7 border-t border-line bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-6xl items-center gap-4 px-4 font-mono text-[11px] text-fg-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 bg-ok" />
            READY
          </span>
          <span className="tabular-nums">
            X {pad(coords.x)} &nbsp; Y {pad(coords.y)}
          </span>
          <span className="ms-auto hidden sm:inline">
            SEC: <span className="text-fg">{sectionLabel}</span>
          </span>
          <button
            type="button"
            onClick={() => setGrid((v) => !v)}
            aria-pressed={grid}
            className="cursor-pointer transition-colors hover:text-fg"
          >
            GRID {grid ? "▣" : "▢"}
          </button>
          <span className="uppercase text-fg">{locale}</span>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SoundToggle } from "@/components/ui/sound-toggle";

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
  const [section, setSection] = useState<string>("hero");
  const [grid, setGrid] = useState(false);
  const raf = useRef<number | null>(null);
  const coordRef = useRef<HTMLSpanElement>(null);

  // Restore grid preference.
  useEffect(() => {
    setGrid(localStorage.getItem("cad-grid") === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("cad-grid", grid ? "1" : "0");
  }, [grid]);

  // Live cursor coordinates (rAF-throttled, written straight to the DOM so
  // moving the pointer never re-renders the bar).
  useEffect(() => {
    const pad = (n: number) => String(Math.max(0, n)).padStart(4, "0");
    const onMove = (e: PointerEvent) => {
      if (raf.current) return;
      const cx = e.clientX;
      const cy = e.clientY;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        if (coordRef.current) {
          coordRef.current.textContent = `X ${pad(Math.round(cx))}  Y ${pad(Math.round(cy))}`;
        }
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
          <span ref={coordRef} className="tabular-nums">
            X 0000&nbsp;&nbsp;Y 0000
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
          <SoundToggle />
          <span className="uppercase text-fg">{locale}</span>
        </div>
      </div>
    </>
  );
}

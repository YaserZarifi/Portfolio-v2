"use client";

import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Plotter calibration intro — the first three seconds that win the room.
 * A title block draws itself, the pen "homes to origin", a plot counter
 * runs to 100, then the sheet lifts away to hand off to the live hero.
 *
 * Plays once per session (sessionStorage) and is skipped entirely under
 * reduced-motion — no flash, no delay. The counter is written straight to
 * the DOM per frame so only the exit triggers a React update.
 */

const DURATION = 1600;
const SHEET_EASE = [0.76, 0, 0.24, 1] as const;

export function Preloader() {
  const [phase, setPhase] = useState<"idle" | "run" | "exit" | "done">("idle");
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("cad-intro-seen");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setPhase("done");
      return;
    }
    setPhase("run");
    sessionStorage.setItem("cad-intro-seen", "1");

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPhase("exit");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === "idle" || phase === "done") return null;

  return (
    <m.div
      className="bg-drafting-grid fixed inset-0 z-[200] flex items-center justify-center bg-bg"
      initial={{ y: 0 }}
      animate={phase === "exit" ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.8, ease: SHEET_EASE }}
      onAnimationComplete={() => phase === "exit" && setPhase("done")}
      aria-hidden
    >
      <m.div
        className="w-full max-w-md px-8"
        animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Title block — draws its frame in. */}
        <svg viewBox="0 0 320 96" className="w-full text-line" aria-hidden>
          <m.rect
            x={1}
            y={1}
            width={318}
            height={94}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <m.line
            x1={1}
            y1={64}
            x2={319}
            y2={64}
            stroke="currentColor"
            strokeWidth={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
          />
          <m.line
            x1={210}
            y1={64}
            x2={210}
            y2={95}
            stroke="currentColor"
            strokeWidth={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.9, ease: "easeInOut" }}
          />
        </svg>

        <div className="-mt-[88px] mb-8 px-4">
          <p className="text-2xl font-semibold tracking-tight">Yaser Zarifi</p>
          <p className="annotation mt-8 flex justify-between">
            <span>SHEET 01 — PORTFOLIO</span>
            <span>A4</span>
          </p>
        </div>

        {/* Plot progress. */}
        <div className="h-px w-full bg-line">
          <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
        </div>
        <p className="annotation mt-3 flex justify-between text-accent-fg">
          <span>
            PLOTTING <span ref={pct}>000</span>%
          </span>
          <span className="text-fg-muted">● HOMING TO ORIGIN 0,0</span>
        </p>
      </m.div>
    </m.div>
  );
}

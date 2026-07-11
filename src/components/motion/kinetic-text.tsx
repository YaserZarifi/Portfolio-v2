"use client";

import { useEffect, useRef, type ElementType } from "react";

/**
 * KineticText — display type that is alive without a variable font.
 *
 * Two effects layered on nested spans so they never fight over `transform`:
 *  - Entrance: each glyph masks up + fades, staggered, when it scrolls into
 *    view (CSS transition on the OUTER span, toggled by IntersectionObserver).
 *  - Cursor wave: while the pointer is over the text, glyphs near it lift and
 *    swell with a Gaussian falloff (JS writes the INNER span transform in one
 *    rAF per move — a heading is a handful of glyphs, so this is cheap).
 *
 * Correctness guards:
 *  - Arabic/Persian script is NEVER split per glyph (that breaks letter
 *    joining); such text renders whole, still animating as one unit.
 *  - Reduced motion disables both effects — glyphs render static and visible.
 *
 * No new font is loaded; the "weight" feel comes from scale + lift, not a
 * variable axis.
 */

const ARABIC = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
const RANGE = 70; // px falloff radius of the cursor wave
const LIFT = 10; // px max glyph lift

export function KineticText({
  text,
  as: Tag = "span",
  className = "",
  stagger = 24,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  /** ms between glyph entrances */
  stagger?: number;
  /** ms before the first glyph enters */
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const whole = ARABIC.test(text);
  const glyphs = whole ? [text] : Array.from(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let cleanupIo: (() => void) | undefined;
    let cleanupWave: (() => void) | undefined;

    // Reveal on first intersection.
    if (reduce) {
      el.dataset.in = "true";
    } else {
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            el.dataset.in = "true";
            io.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      io.observe(el);
      cleanupIo = () => io.disconnect();
    }

    // Cursor wave — pointer-over only, so it costs nothing at rest.
    let raf = 0;
    let inners: HTMLElement[] = [];
    let centers: number[] = [];
    const measure = () => {
      inners = Array.from(
        el.querySelectorAll<HTMLElement>(".kinetic-inner"),
      );
      centers = inners.map((s) => {
        const r = s.getBoundingClientRect();
        return r.left + r.width / 2;
      });
    };

    let px = 0;
    const apply = () => {
      raf = 0;
      for (let i = 0; i < inners.length; i++) {
        const dx = (px - centers[i]) / RANGE;
        const infl = Math.exp(-dx * dx);
        inners[i].style.transform = `translateY(${(-LIFT * infl).toFixed(2)}px) scale(${(1 + 0.14 * infl).toFixed(3)})`;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      schedule();
    };
    const onEnter = () => measure();
    const onLeave = () => {
      px = -99999;
      schedule();
    };

    if (!reduce && !whole && window.matchMedia("(pointer: fine)").matches) {
      measure();
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);
      window.addEventListener("resize", measure);
      cleanupWave = () => {
        if (raf) cancelAnimationFrame(raf);
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("resize", measure);
      };
    }

    return () => {
      cleanupIo?.();
      cleanupWave?.();
    };
  }, [text, whole]);

  return (
    <Tag ref={ref} className={`kinetic ${className}`} data-in="false">
      {glyphs.map((g, i) =>
        g === " " ? (
          <span key={i}> </span>
        ) : (
          <span
            key={i}
            className="kinetic-char"
            style={{ transitionDelay: `${delay + i * stagger}ms` }}
          >
            <span className="kinetic-inner">{g}</span>
          </span>
        ),
      )}
    </Tag>
  );
}

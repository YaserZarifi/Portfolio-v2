"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/routing";

/**
 * Count-up number that runs once when scrolled into view, formatted in the
 * active locale (Persian digits included). Reduced motion shows the final
 * value immediately.
 */
export function CountUp({
  value,
  locale,
  duration = 1100,
  className = "",
}: {
  value: number;
  locale: Locale;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    useGrouping: false,
  });
  const [display, setDisplay] = useState(() => fmt.format(0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setDisplay(fmt.format(value));
      return;
    }

    let raf = 0;
    let startTs = 0;
    const run = () => {
      const step = (now: number) => {
        if (!startTs) startTs = now;
        const p = Math.min(1, (now - startTs) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setDisplay(fmt.format(Math.round(eased * value)));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, locale]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

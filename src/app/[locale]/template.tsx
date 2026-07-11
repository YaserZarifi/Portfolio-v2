"use client";

import { m, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { sound } from "@/lib/sound";

/**
 * Route change as a plotter-carriage sheet swap: a drafting panel covers the
 * viewport, then a servo whoosh fires and the carriage slides off in the
 * reading direction — accent hairline at its trailing edge, a mono readout
 * riding along — revealing the new sheet, which itself clips up into place.
 *
 * Direction-aware (RTL slides the other way). Reduced motion collapses the
 * whole thing to a quiet fade. Exits are handled by the next mount, since App
 * Router templates remount per navigation.
 */

const GATE = [0.76, 0, 0.24, 1] as const;

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [rtl, setRtl] = useState(false);

  useEffect(() => {
    setRtl(document.dir === "rtl");
    sound.whoosh();
  }, []);

  if (reduce) {
    return (
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </m.div>
    );
  }

  const off = rtl ? "-102%" : "102%";

  return (
    <>
      {/* New sheet clips up into place beneath the carriage. */}
      <m.div
        initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
        animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>

      {/* Plotter carriage — covers, then slides off in the reading direction. */}
      <m.div
        aria-hidden
        className="bg-drafting-grid pointer-events-none fixed inset-0 z-70 flex items-center justify-center bg-bg"
        style={{ borderInlineStart: "2px solid var(--accent)" }}
        initial={{ x: 0 }}
        animate={{ x: off }}
        transition={{ duration: 0.7, ease: GATE }}
      >
        <span className="annotation flex items-center gap-2 text-accent-fg">
          <span className="inline-block h-1.5 w-1.5 bg-accent" />
          PLOTTING SHEET
        </span>
      </m.div>
    </>
  );
}

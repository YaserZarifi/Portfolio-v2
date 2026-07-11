"use client";

import { m, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Reading-progress readout for a case study, styled as a plotter gauge in the
 * sticky meta rail: a live "PLOTTING NN%" counter over a hairline fill. Driven
 * by page scroll; the counter is written straight to the DOM per frame so only
 * the fill (a transform) touches React.
 */
export function PlotGauge({ label }: { label: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const pct = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return scaleX.on("change", (v) => {
      if (pct.current) {
        pct.current.textContent = String(Math.round(v * 100)).padStart(3, "0");
      }
    });
  }, [scaleX]);

  const opacity = useTransform(scaleX, [0, 0.02], [0.4, 1]);

  return (
    <div className="hidden lg:block" aria-hidden>
      <div className="annotation mb-2 flex justify-between text-accent-fg">
        <span>{label}</span>
        <m.span style={mounted ? { opacity } : undefined}>
          <span ref={pct}>000</span>%
        </m.span>
      </div>
      <div className="h-px w-full bg-line">
        <m.div
          style={{ scaleX }}
          className="h-full origin-left bg-accent rtl:origin-right"
        />
      </div>
    </div>
  );
}

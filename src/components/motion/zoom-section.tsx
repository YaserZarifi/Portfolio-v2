"use client";

import { useRef } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { ReactNode } from "react";

/**
 * CAD-viewport zoom: each section behaves like the next sheet in a drawing
 * set. Entering, it zooms from slightly out (scale 0.94, faded) to true
 * scale; leaving, the viewport pushes gently past it (1.03). Spring-smoothed
 * so it reads as one continuous camera, transform/opacity only (zero CLS).
 */
export function ZoomSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.5,
  });
  const scale = useTransform(smooth, [0, 0.3, 0.75, 1], [0.94, 1, 1, 1.03]);
  const opacity = useTransform(smooth, [0, 0.25, 0.8, 1], [0.25, 1, 1, 0.6]);

  return (
    <div ref={ref} className={className}>
      <m.div style={reduce ? undefined : { scale, opacity }}>{children}</m.div>
    </div>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * Magnetic wrapper — the child eases toward the pointer while hovered and
 * springs back on leave. Mouse-only (touch/pen keep it still) and fully
 * disabled under reduced motion. Wrap a button/link; it stays inline-block.
 */
export function Magnetic({
  children,
  strength = 0.4,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 200, damping: 15, mass: 0.4 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  if (reduce) return <span className={className}>{children}</span>;

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy, display: "inline-block" }}
      className={className}
    >
      {children}
    </m.span>
  );
}

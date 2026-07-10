"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Global motion policy: honor the OS reduce-motion setting, and load the
 * animation runtime lazily (strict mode bans full `motion.*` components so
 * the heavyweight bundle can never sneak back in — use `m.*`).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

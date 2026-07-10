"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

/** Route-change transition: quiet fade-up, exits handled by the next mount. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}

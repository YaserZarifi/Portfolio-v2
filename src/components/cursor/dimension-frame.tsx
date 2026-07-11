"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Dimension-line hover — on hover, engineering measurement annotations draw
 * themselves around the element (extension lines, arrow-tipped dimensions,
 * a live px readout). The detail that proves a real drafter built this.
 *
 * The width/height are measured live via ResizeObserver, so the numbers are
 * true to what's on screen. Fine-pointer only; overlay is aria-hidden and
 * never intercepts pointer events. Draw-in is CSS, so reduced-motion users
 * simply get the static annotation.
 */
export function DimensionFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`dim-frame relative h-full ${className}`}
      data-active={active ? "on" : "off"}
      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(true)}
      onPointerLeave={() => setActive(false)}
    >
      {children}

      {/* Top width dimension. */}
      <div className="dim-h" aria-hidden>
        <span className="dim-tick" />
        <span className="dim-line" />
        <span className="dim-label">{size.w}</span>
        <span className="dim-line" />
        <span className="dim-tick" />
      </div>

      {/* End-side height dimension. */}
      <div className="dim-v" aria-hidden>
        <span className="dim-tick" />
        <span className="dim-line" />
        <span className="dim-label">{size.h}</span>
        <span className="dim-line" />
        <span className="dim-tick" />
      </div>
    </div>
  );
}

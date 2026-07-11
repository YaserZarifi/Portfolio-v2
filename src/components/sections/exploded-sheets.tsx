"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Exploded Axonometric — the signature scroll scene.
 *
 * A tall sticky section: as you scroll, five CAD "layers" separate out of a
 * collapsed stack into an exploded axonometric drawing — site, network,
 * structure, data, interface (the drafting-to-software throughline). A legend
 * on the side lights each layer in sequence as its plate lifts.
 *
 * All motion is GPU transform (translateZ + opacity) linked to one spring-
 * smoothed scroll value — no layout, no canvas. Under reduced motion the
 * plates render in their final exploded pose with no scroll linkage.
 */

type Layer = { code: string; label: string; motif: ReactNode };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  vectorEffect: "non-scaling-stroke" as const,
};

const LAYERS: Layer[] = [
  {
    code: "L1",
    label: "SITE",
    motif: (
      <>
        <path d="M14 78 C34 66 44 70 60 58 S86 40 92 22" {...stroke} />
        <path d="M8 66 C30 54 44 58 62 46 S84 30 96 14" {...stroke} opacity={0.5} />
        <circle cx={60} cy={58} r={2.5} fill="var(--accent)" stroke="none" />
      </>
    ),
  },
  {
    code: "L2",
    label: "NETWORK",
    motif: (
      <>
        <path d="M12 20 H88 M12 50 H88 M12 80 H88 M30 12 V88 M62 12 V88" {...stroke} opacity={0.7} />
        {[
          [30, 20],
          [62, 50],
          [30, 80],
          [88, 50],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2.5} fill="var(--accent)" stroke="none" />
        ))}
      </>
    ),
  },
  {
    code: "L3",
    label: "STRUCTURE",
    motif: (
      <>
        {[22, 44, 66, 88].map((x) => (
          <line key={x} x1={x} y1={12} x2={x} y2={88} {...stroke} opacity={0.6} />
        ))}
        {[24, 50, 76].map((y) => (
          <line key={y} x1={12} y1={y} x2={92} y2={y} {...stroke} opacity={0.35} />
        ))}
      </>
    ),
  },
  {
    code: "L4",
    label: "DATA",
    motif: (
      <>
        <polyline
          points="12,74 28,58 44,64 60,40 76,48 92,24"
          {...stroke}
          stroke="var(--accent)"
        />
        {[
          [28, 58],
          [60, 40],
          [92, 24],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2} fill="var(--accent)" stroke="none" />
        ))}
        <line x1={12} y1={86} x2={92} y2={86} {...stroke} opacity={0.4} />
      </>
    ),
  },
  {
    code: "L5",
    label: "INTERFACE",
    motif: (
      <>
        <rect x={12} y={14} width={76} height={16} {...stroke} opacity={0.7} />
        <rect x={12} y={38} width={44} height={48} {...stroke} opacity={0.5} />
        <rect x={62} y={38} width={26} height={22} {...stroke} stroke="var(--accent)" />
        <rect x={62} y={66} width={26} height={20} {...stroke} opacity={0.5} />
      </>
    ),
  },
];

const N = LAYERS.length;
const GROUP_TRANSFORM = "rotateX(58deg) rotateZ(-42deg)";
const SEP = 116; // px separation between plates when fully exploded

function Plate({
  progress,
  i,
  layer,
  reduce,
  sep,
}: {
  progress: MotionValue<number>;
  i: number;
  layer: Layer;
  reduce: boolean;
  sep: number;
}) {
  const finalZ = (i - (N - 1) / 2) * sep;
  // Plates lift in sequence across the middle of the scroll.
  const a = 0.12 + (i / N) * 0.5;
  const z = useTransform(progress, [a, a + 0.28], [0, finalZ]);
  const op = useTransform(
    progress,
    [a - 0.05, a + 0.15],
    [i === 0 ? 1 : 0.12, 1],
  );

  return (
    <m.div
      className="absolute grid place-items-center text-line"
      style={{
        width: "min(62vw, 340px)",
        height: "min(62vw, 340px)",
        transformStyle: "preserve-3d",
        z: reduce ? finalZ : z,
        opacity: reduce ? 1 : op,
      }}
    >
      {/* Plate frame */}
      <div className="absolute inset-0 border border-line bg-bg/70 backdrop-blur-[1px]" />
      <div className="bg-drafting-grid absolute inset-0 opacity-60" />
      {/* Corner datum ticks */}
      {[
        "left-0 top-0",
        "right-0 top-0",
        "left-0 bottom-0",
        "right-0 bottom-0",
      ].map((c) => (
        <span
          key={c}
          className={`absolute ${c} h-2 w-2 border-accent`}
          style={{
            borderTopWidth: c.includes("top") ? 1 : 0,
            borderBottomWidth: c.includes("bottom") ? 1 : 0,
            borderLeftWidth: c.includes("left") ? 1 : 0,
            borderRightWidth: c.includes("right") ? 1 : 0,
          }}
        />
      ))}
      <svg viewBox="0 0 100 100" className="relative h-3/4 w-3/4">
        {layer.motif}
      </svg>
      <span className="annotation absolute bottom-2 left-2 !text-[10px] text-accent-fg">
        {layer.code}
      </span>
    </m.div>
  );
}

function LegendRow({
  progress,
  i,
  layer,
  reduce,
}: {
  progress: MotionValue<number>;
  i: number;
  layer: Layer;
  reduce: boolean;
}) {
  const a = 0.12 + (i / N) * 0.5;
  const lit = useTransform(progress, [a, a + 0.12], [0.3, 1]);
  return (
    <m.li
      className="flex items-center gap-3"
      style={{ opacity: reduce ? 1 : lit }}
    >
      <span className="h-px w-6 bg-accent" />
      <span className="annotation !text-accent-fg">{layer.code}</span>
      <span className="annotation">{layer.label}</span>
    </m.li>
  );
}

export function ExplodedSheets() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  // Compact layout on phones: smaller separation, shorter scroll, scaled rig
  // so the stack and caption never collide. Starts false to match SSR.
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const sep = compact ? 82 : SEP;
  const groupTransform = compact
    ? `${GROUP_TRANSFORM} scale(0.82)`
    : GROUP_TRANSFORM;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.4,
  });

  return (
    <section
      ref={ref}
      className="relative border-b border-line"
      style={{ height: reduce ? "auto" : compact ? "240vh" : "320vh" }}
      aria-label="Exploded axonometric — from site to system"
    >
      <div
        className="sticky top-0 flex min-h-[100dvh] items-center justify-center overflow-hidden"
        style={{ perspective: compact ? "900px" : "1200px" }}
      >
        {/* Legend */}
        <ul className="absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
          <li className="annotation mb-2 text-fg-muted">
            SHEET 02 — LAYERS
          </li>
          {LAYERS.map((layer, i) => (
            <LegendRow
              key={layer.code}
              progress={progress}
              i={i}
              layer={layer}
              reduce={reduce}
            />
          ))}
        </ul>

        {/* Caption — corner on desktop, centered footer on phones. */}
        <div className="pointer-events-none absolute inset-x-6 bottom-6 text-center sm:inset-x-auto sm:bottom-10 sm:right-6 sm:max-w-xs sm:text-right">
          <p className="text-lg font-semibold tracking-tight sm:text-xl">
            From site to system.
          </p>
          <p className="annotation mt-2">
            THE SAME DISCIPLINE — DRAFTED, THEN SHIPPED
          </p>
        </div>

        {/* The exploded stack */}
        <div
          className="relative grid place-items-center"
          style={{
            transformStyle: "preserve-3d",
            transform: groupTransform,
          }}
        >
          {LAYERS.map((layer, i) => (
            <Plate
              key={layer.code}
              sep={sep}
              progress={progress}
              i={i}
              layer={layer}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

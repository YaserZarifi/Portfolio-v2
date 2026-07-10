"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  m,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Before/after scanline reveal — the same "scan" gesture as the ASCII
 * portrait, generalised for case studies (photo ↔ drawing, context ↔ plan).
 * Drag the handle or move the cursor across; the divider follows.
 */
export function ScanCompare({
  beforeSrc,
  afterSrc,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  width,
  height,
  alt = "",
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  width: number;
  height: number;
  alt?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const split = useMotionValue(50);
  const smooth = useSpring(split, { stiffness: 240, damping: 30, mass: 0.3 });
  const clipRight = useTransform(smooth, (v) => 100 - v);
  const afterClip = useMotionTemplate`inset(0 ${clipRight}% 0 0)`;
  const handleLeft = useMotionTemplate`${smooth}%`;

  const setFromClientX = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    split.set(Math.min(100, Math.max(0, pct)));
  };

  return (
    <figure className="my-10">
      <div
        ref={ref}
        role="img"
        aria-label={alt}
        className="relative select-none overflow-hidden border border-line"
        style={{ aspectRatio: `${width} / ${height}` }}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse" && !dragging.current)
            setFromClientX(e.clientX);
          else if (dragging.current) setFromClientX(e.clientX);
        }}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerUp={(e) => {
          dragging.current = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      >
        {/* Before layer (full). */}
        <Image
          src={beforeSrc}
          alt=""
          width={width}
          height={height}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {/* After layer, clipped at the divider. */}
        <m.div style={{ clipPath: afterClip }} className="absolute inset-0">
          <Image
            src={afterSrc}
            alt=""
            width={width}
            height={height}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </m.div>

        <span className="annotation absolute bottom-3 start-3 bg-bg/70 px-2 py-1">
          {beforeLabel}
        </span>
        <span className="annotation absolute bottom-3 end-3 bg-bg/70 px-2 py-1">
          {afterLabel}
        </span>

        {/* Divider + handle. */}
        <m.div
          style={{ left: handleLeft }}
          className="absolute inset-y-0 w-px -translate-x-1/2 cursor-ew-resize bg-accent shadow-[0_0_12px_var(--accent)]"
        >
          <span className="absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-accent bg-bg font-mono text-xs text-accent">
            ↔
          </span>
        </m.div>
      </div>
    </figure>
  );
}

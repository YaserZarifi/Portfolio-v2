"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import type { Profile } from "@/lib/content/schemas";
import { Button } from "@/components/ui/button";
import { useDirectionalX } from "@/components/motion/use-directional-x";

/**
 * Signature moment — "The Site Plan Assembles".
 * Grid lines draw in like a technical drawing, the name settles from
 * blueprint outline to solid ink, annotations slide in from the reading
 * side, and the whole sheet deconstructs subtly as you scroll past it.
 */

const GRID_LINES = [
  { x1: 0, y1: 30, x2: 100, y2: 30 },
  { x1: 0, y1: 72, x2: 100, y2: 72 },
  { x1: 22, y1: 0, x2: 22, y2: 100 },
  { x1: 78, y1: 0, x2: 78, y2: 100 },
];

function DrawnGrid({ animate }: { animate: boolean }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full text-line"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {GRID_LINES.map((line, i) => (
        <m.line
          key={i}
          {...line}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={animate ? { pathLength: 0, opacity: 0 } : false}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 1.1, ease: "easeInOut", delay: i * 0.12 },
            opacity: { duration: 0.2, delay: i * 0.12 },
          }}
        />
      ))}
      {/* Plot marker at the grid intersection — the site under study. */}
      <m.circle
        cx={22}
        cy={30}
        r={1.4}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        initial={animate ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformOrigin: "22% 30%" }}
      />
    </svg>
  );
}

export function Hero({ profile }: { profile: Profile }) {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();
  const dx = useDirectionalX();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const sheetOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const animate = !reduce;

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-line">
      <div className="bg-drafting-grid absolute inset-0" aria-hidden />
      <m.div
        style={animate ? { y: gridY } : undefined}
        className="absolute inset-0"
      >
        <DrawnGrid animate={animate} />
      </m.div>

      <m.div
        style={animate ? { opacity: sheetOpacity } : undefined}
        className="relative mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl flex-col justify-center px-6 py-24"
      >
        <m.p
          initial={animate ? { opacity: 0, x: dx(-24) } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 26 }}
          className="annotation mb-6 text-accent"
        >
          {t("kicker")}
        </m.p>

        <m.div style={animate ? { y: titleY } : undefined}>
          <h1 className="relative max-w-3xl text-balance text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            {/* Blueprint outline that the solid title settles over. */}
            <m.span
              aria-hidden
              initial={animate ? { opacity: 0.9 } : false}
              animate={{ opacity: 0 }}
              transition={{ delay: 1.1, duration: 0.9, ease: "easeOut" }}
              className="absolute inset-0 select-none text-transparent"
              style={{ WebkitTextStroke: "1px var(--fg-muted)" }}
            >
              {t("title")}
            </m.span>
            <m.span
              initial={animate ? { opacity: 0, y: 14 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.0,
                type: "spring",
                stiffness: 200,
                damping: 26,
              }}
              className="inline-block"
            >
              {t("title")}
            </m.span>
          </h1>

          <m.p
            initial={animate ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.5,
              type: "spring",
              stiffness: 240,
              damping: 26,
            }}
            className="mt-4 text-2xl text-fg-muted"
          >
            {t("subtitle")}
          </m.p>
        </m.div>

        <m.div
          initial={animate ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, type: "spring", stiffness: 240, damping: 26 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Button as="a" href="#projects">
            {t("viewWork")}
          </Button>
          <Button as="a" variant="outline" href={profile.cvUrl} download>
            {t("downloadCv")}
          </Button>
        </m.div>

        <m.p
          initial={animate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.6 }}
          className="annotation mt-16"
        >
          {profile.location} — N 35.6892° / E 51.3890°
        </m.p>
      </m.div>
    </section>
  );
}

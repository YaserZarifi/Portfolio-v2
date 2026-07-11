"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { Profile } from "@/lib/content/schemas";
import { Button } from "@/components/ui/button";
import { BlueprintSurface } from "@/components/motion/blueprint-surface";
import { KineticText } from "@/components/motion/kinetic-text";
import { Magnetic } from "@/components/motion/magnetic";
import { useDirectionalX } from "@/components/motion/use-directional-x";

/**
 * Cinematic opening — "The Site Plan Assembles".
 * Letterbox bars retract like a film gate, the camera settles onto the
 * sheet, grid lines draw in, the name resolves from blueprint outline to
 * ink. On scroll, spring-smoothed deconstruction: the map footage and grid
 * drift apart in parallax while the title recedes.
 *
 * Contrast rule: the video NEVER sits naked behind text — a bottom-up scrim
 * from --bg guarantees the text zone reads at full contrast.
 */

const GRID_LINES = [
  { x1: 0, y1: 30, x2: 100, y2: 30 },
  { x1: 0, y1: 72, x2: 100, y2: 72 },
  { x1: 22, y1: 0, x2: 22, y2: 100 },
  { x1: 78, y1: 0, x2: 78, y2: 100 },
];

const GATE_EASE = [0.76, 0, 0.24, 1] as const;

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
            pathLength: { duration: 1.1, ease: "easeInOut", delay: 0.9 + i * 0.12 },
            opacity: { duration: 0.2, delay: 0.9 + i * 0.12 },
          }}
        />
      ))}
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
        transition={{ delay: 1.8, type: "spring", stiffness: 300, damping: 20 }}
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
  // Spring-smoothed progress = the "camera on a dolly" feel while scrolling.
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    mass: 0.5,
  });
  const titleY = useTransform(progress, [0, 1], [0, 150]);
  const titleScale = useTransform(progress, [0, 1], [1, 0.93]);
  const gridScale = useTransform(progress, [0, 1], [1, 1.16]);
  const surfaceScale = useTransform(progress, [0, 1], [1.04, 1.18]);
  const surfaceY = useTransform(progress, [0, 1], [0, 70]);
  const sheetOpacity = useTransform(progress, [0, 0.75], [1, 0]);

  const animate = !reduce;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-line"
    >
      {/* CSS drafting grid — the fallback base that shows if WebGL is absent. */}
      <div className="bg-drafting-grid absolute inset-0" aria-hidden />

      {/* GPU blueprint surface — one shader replaces the old video + canvas
          grid: living two-scale grid, pointer plotter-light, grain, vignette.
          Parallax-drifted on scroll. */}
      <m.div
        style={animate ? { y: surfaceY, scale: surfaceScale } : undefined}
        className="absolute inset-0"
        aria-hidden
      >
        <BlueprintSurface />
      </m.div>

      {/* Contrast scrim: bg-colored, strongest where the text lives. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-transparent"
      />

      <m.div
        style={animate ? { scale: gridScale } : undefined}
        className="absolute inset-0"
      >
        <DrawnGrid animate={animate} />
      </m.div>

      {/* Film-gate letterbox bars — open once, then get out of the way. */}
      {animate ? (
        <>
          <m.div
            aria-hidden
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ delay: 0.25, duration: 1.0, ease: GATE_EASE }}
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[16vh] origin-top bg-black"
          />
          <m.div
            aria-hidden
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ delay: 0.25, duration: 1.0, ease: GATE_EASE }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[16vh] origin-bottom bg-black"
          />
        </>
      ) : null}

      <m.div
        style={animate ? { opacity: sheetOpacity } : undefined}
        className="relative mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl flex-col justify-center px-6 py-24"
      >
        {/* Camera settle: the whole composition eases from a slight zoom. */}
        <m.div
          initial={animate ? { scale: 1.045, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.35, duration: 1.1, ease: GATE_EASE }}
        >
          <m.p
            initial={animate ? { opacity: 0, x: dx(-28) } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 1.0,
              type: "spring",
              stiffness: 260,
              damping: 26,
            }}
            className="annotation mb-6 text-accent-fg"
          >
            {t("kicker")}
          </m.p>

          <m.div style={animate ? { y: titleY, scale: titleScale } : undefined}>
            <KineticText
              as="h1"
              text={t("title")}
              delay={animate ? 1200 : 0}
              stagger={46}
              className="max-w-3xl text-balance text-5xl font-semibold leading-tight tracking-tight sm:text-7xl"
            />

            <m.p
              initial={animate ? { opacity: 0, y: 16 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 2.0,
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
            transition={{
              delay: 2.2,
              type: "spring",
              stiffness: 240,
              damping: 26,
            }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Magnetic>
              <Button as="a" href="#projects">
                {t("viewWork")}
              </Button>
            </Magnetic>
            <Magnetic>
              <Button as="a" variant="outline" href={profile.cvUrl} download>
                {t("downloadCv")}
              </Button>
            </Magnetic>
          </m.div>

          <m.p
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.6 }}
            className="annotation mt-16"
          >
            {profile.location} — N 35.6892° / E 51.3890°
          </m.p>
        </m.div>
      </m.div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { Project } from "@/lib/content/loaders";
import { KineticText } from "@/components/motion/kinetic-text";

/**
 * Full-bleed case-study hero — the cover reads as a blueprint (desaturated +
 * scanlines, drifting in parallax) behind an overlaid title block. The title
 * animates in per-glyph; a bottom-up scrim guarantees contrast.
 */
export function CaseStudyHero({
  project,
  sheetRef,
  categoryLabel,
  yearLabel,
}: {
  project: Project;
  sheetRef: string;
  categoryLabel: string;
  yearLabel: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const y = useTransform(progress, [0, 1], [0, 140]);
  const scale = useTransform(progress, [0, 1], [1.06, 1.18]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden border-b border-line"
    >
      <div className="bg-drafting-grid absolute inset-0" aria-hidden />

      {project.cover ? (
        <m.div
          aria-hidden
          className="absolute inset-x-0 -bottom-[140px] top-0"
          style={reduce ? undefined : { y, scale }}
        >
          <Image
            src={project.cover.url}
            width={project.cover.width}
            height={project.cover.height}
            alt=""
            priority
            className="h-full w-full object-cover grayscale"
          />
          <div className="scanlines absolute inset-0 bg-accent/10" />
        </m.div>
      ) : null}

      {/* Contrast scrims. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20"
      />

      <div className="relative mx-auto flex min-h-[56vh] max-w-6xl flex-col justify-end px-6 pb-12 pt-20 sm:min-h-[62vh]">
        <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-1">
          <span className="annotation text-accent-fg">{sheetRef}</span>
          <span className="annotation">{categoryLabel}</span>
          <span className="annotation">{yearLabel}</span>
        </div>
        <KineticText
          as="h1"
          text={project.title}
          stagger={34}
          className="max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
        />
        <p className="mt-5 max-w-2xl text-lg text-fg-muted sm:text-xl">
          {project.summary}
        </p>
      </div>
    </section>
  );
}

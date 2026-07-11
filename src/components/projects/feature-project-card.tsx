import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/loaders";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { DimensionFrame } from "@/components/cursor/dimension-frame";

/**
 * Feature "sheet" for the home showcase — the editorial, large-format sibling
 * of the compact ProjectCard used on the index. The cover reads as a blueprint
 * (desaturated + scanlines + accent tint) at rest and resolves to full colour
 * on hover, while an "Open drawing" carriage bar sweeps up from the base.
 */
export function FeatureProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const t = useTranslations("project");
  const tp = useTranslations("projects");
  const locale = useLocale() as Locale;
  const ref = `PRJ-${String(index + 1).padStart(3, "0")}`;
  const num = String(index + 1).padStart(2, "0");

  return (
    <DimensionFrame>
      <Card className="h-full">
        <Link
          href={`/projects/${project.slug}`}
          className="group/card flex h-full flex-col focus-visible:outline-offset-4"
        >
          {/* Cover — blueprint at rest, full colour on hover. */}
          <div className="relative overflow-hidden border-b border-line">
            {project.cover ? (
              <Image
                src={project.cover.url}
                width={project.cover.width}
                height={project.cover.height}
                alt={project.coverAlt ?? project.title}
                className="aspect-[16/10] w-full object-cover grayscale transition-all duration-700 ease-out group-hover/card:scale-[1.04] group-hover/card:grayscale-0"
              />
            ) : (
              <div className="bg-drafting-grid flex aspect-[16/10] items-end p-4">
                <span className="annotation">{ref}</span>
              </div>
            )}
            {/* Blueprint tint + scanlines, cleared on hover. */}
            <div
              aria-hidden
              className="scanlines pointer-events-none absolute inset-0 bg-accent/10 opacity-100 transition-opacity duration-700 group-hover/card:opacity-0"
            />
            {/* Big index watermark. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-5 end-2 font-mono text-[6.5rem] font-semibold leading-none text-fg/10"
            >
              {num}
            </span>
            <span className="annotation absolute start-4 top-4 bg-bg/70 px-2 py-1 text-accent-fg backdrop-blur-sm">
              {tp("featuredLabel")}
            </span>
            {/* Open-drawing carriage — sweeps up on hover. */}
            <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-accent px-4 py-2.5 transition-transform duration-300 ease-out group-hover/card:translate-y-0">
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-white">
                {tp("open")}
              </span>
              <ArrowUpRight
                size={15}
                strokeWidth={2}
                aria-hidden
                className="text-white rtl:-scale-x-100"
              />
            </div>
          </div>

          {/* Body. */}
          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <div className="mb-3 flex items-center justify-between">
              <span className="annotation text-accent-fg">{ref}</span>
              <span className="annotation">
                {t(`categoryNames.${project.category}`)} —{" "}
                {formatNumber(locale, project.year)}
              </span>
            </div>
            <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">
              {project.title}
            </h3>
            <p className="mt-3 flex-1 text-fg-muted">{project.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.slice(0, 5).map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
          </div>
        </Link>
      </Card>
    </DimensionFrame>
  );
}

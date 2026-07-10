import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/loaders";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/navigation";
import { formatNumber } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const t = useTranslations("project");
  const locale = useLocale() as Locale;
  const ref = `PRJ-${String(index + 1).padStart(3, "0")}`;

  return (
    <Card className="flex h-full flex-col">
      <Link
        href={`/projects/${project.slug}`}
        className="flex h-full flex-col focus-visible:outline-offset-4"
      >
        {project.cover ? (
          <div className="border-b border-line">
            <Image
              src={project.cover.url}
              width={project.cover.width}
              height={project.cover.height}
              alt={project.coverAlt ?? project.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        ) : (
          <div className="bg-drafting-grid flex aspect-[16/10] items-end border-b border-line p-4">
            <span className="annotation">{ref}</span>
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="annotation text-accent">{ref}</span>
            <span className="annotation">
              {t(`categoryNames.${project.category}`)} —{" "}
              {formatNumber(locale, project.year)}
            </span>
          </div>
          <h3 className="text-xl font-medium">
            {project.title}
            <ArrowUpRight
              size={16}
              strokeWidth={1.5}
              aria-hidden
              className="ms-1 inline-block text-fg-muted transition-colors group-hover:text-accent rtl:-scale-x-100"
            />
          </h3>
          <p className="mt-2 flex-1 text-sm text-fg-muted">
            {project.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
        </div>
      </Link>
    </Card>
  );
}

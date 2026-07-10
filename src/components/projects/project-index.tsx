"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Project } from "@/lib/content/loaders";
import type { ProjectCategory } from "@/lib/content/schemas";
import { ProjectCard } from "@/components/projects/project-card";

type Filter = "all" | ProjectCategory;

const FILTERS: { value: Filter; key: string }[] = [
  { value: "all", key: "filterAll" },
  { value: "code", key: "filterCode" },
  { value: "architecture", key: "filterArchitecture" },
  { value: "hybrid", key: "filterHybrid" },
];

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <div
        role="group"
        aria-label={t("indexTitle")}
        className="mb-10 flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`h-11 cursor-pointer border px-4 font-mono text-sm uppercase tracking-widest transition-colors ${
              filter === f.value
                ? "border-accent text-accent"
                : "border-line text-fg-muted hover:text-fg"
            }`}
          >
            {t(f.key)}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="border border-line p-10 text-center text-fg-muted">
          {t("empty")}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {visible.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

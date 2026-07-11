import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, MoveLeft } from "lucide-react";
import { use } from "react";
import { routing, type Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/navigation";
import {
  getProject,
  getProjectSlugs,
  getProjects,
  type Project,
} from "@/lib/content/loaders";
import { formatNumber } from "@/lib/format";
import { Tag } from "@/components/ui/tag";
import { MdxContent } from "@/components/mdx/mdx-content";
import { PrintButton } from "@/components/project/print-button";
import { CaseStudyHero } from "@/components/project/case-study-hero";
import { PlotGauge } from "@/components/project/plot-gauge";
import { ProjectNav } from "@/components/project/project-nav";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const project = getProject(slug, locale as Locale);
    return {
      title: project.title,
      description: project.seoDescription ?? project.summary,
    };
  } catch {
    return {};
  }
}

function loadProject(slug: string, locale: Locale): Project | null {
  try {
    return getProject(slug, locale);
  } catch {
    return null;
  }
}

const projectRef = (i: number) => `PRJ-${String(i + 1).padStart(3, "0")}`;

export default function ProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = use(params);
  if (!routing.locales.includes(locale)) notFound();
  setRequestLocale(locale);
  const t = useTranslations("project");

  const project = loadProject(slug, locale);
  if (!project) notFound();

  // Ordered set → prev/next neighbours (clamped at the ends).
  const all = getProjects(locale);
  const idx = all.findIndex((p) => p.slug === slug);
  const toNeighbor = (p: Project | undefined, i: number) =>
    p ? { slug: p.slug, title: p.title, ref: projectRef(i) } : null;
  const prev = toNeighbor(all[idx - 1], idx - 1);
  const next = toNeighbor(all[idx + 1], idx + 1);

  const categoryName = t(`categoryNames.${project.category}`);
  const yearText = formatNumber(locale, project.year);

  return (
    <main id="content">
      {/* Print-only drawing-sheet title block. */}
      <div className="mx-auto mb-6 hidden max-w-3xl items-center justify-between border-b border-black px-6 pb-2 font-mono text-xs print:flex">
        <span>
          YASER ZARIFI — {t("category").toUpperCase()}: {categoryName}
        </span>
        <span>{yearText}</span>
      </div>

      <CaseStudyHero
        project={project}
        sheetRef={`${t("sheet")} ${projectRef(idx < 0 ? 0 : idx)}`}
        categoryLabel={`${t("category")} — ${categoryName}`}
        yearLabel={`${t("year")} — ${yearText}`}
      />

      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-10 px-6 py-14 lg:grid-cols-[15rem_1fr]">
        {/* Sticky title block / spec rail. */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center justify-between print:hidden">
            <Link
              href="/projects"
              className="annotation inline-flex items-center gap-2 transition-colors hover:text-fg"
            >
              <MoveLeft
                size={14}
                strokeWidth={1.5}
                aria-hidden
                className="rtl:-scale-x-100"
              />
              {t("back")}
            </Link>
          </div>

          <dl className="mt-8 space-y-5 border-t border-line pt-6">
            <div>
              <dt className="annotation">{t("category")}</dt>
              <dd className="mt-1 text-sm">{categoryName}</dd>
            </div>
            <div>
              <dt className="annotation">{t("year")}</dt>
              <dd className="mt-1 text-sm">{yearText}</dd>
            </div>
            <div>
              <dt className="annotation mb-2">{t("stack")}</dt>
              <dd className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </dd>
            </div>
          </dl>

          {(project.links.live || project.links.repo) && (
            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
              {project.links.live ? (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-sm uppercase tracking-widest text-accent-fg hover:underline"
                >
                  {t("live")}
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden
                    className="rtl:-scale-x-100"
                  />
                </a>
              ) : null}
              {project.links.repo ? (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-sm uppercase tracking-widest text-accent-fg hover:underline"
                >
                  {t("repo")}
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.5}
                    aria-hidden
                    className="rtl:-scale-x-100"
                  />
                </a>
              ) : null}
            </div>
          )}

          <div className="mt-6 border-t border-line pt-6 print:hidden">
            <PlotGauge label={t("overview")} />
            <div className="mt-6">
              <PrintButton />
            </div>
          </div>
        </aside>

        <article className="min-w-0">
          <MdxContent source={project.body} />
        </article>
      </div>

      <div className="print:hidden">
        <ProjectNav
          prev={prev}
          next={next}
          prevLabel={t("prev")}
          nextLabel={t("next")}
          moreLabel={t("moreWork")}
        />
      </div>
    </main>
  );
}

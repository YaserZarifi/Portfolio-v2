import type { Metadata } from "next";
import Image from "next/image";
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
  type Project,
} from "@/lib/content/loaders";
import { formatNumber } from "@/lib/format";
import { Tag } from "@/components/ui/tag";
import { MdxContent } from "@/components/mdx/mdx-content";
import { Parallax } from "@/components/motion/parallax";

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

  return (
    <main id="content" className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/projects"
        className="annotation inline-flex items-center gap-2 transition-colors hover:text-fg"
      >
        <MoveLeft size={14} strokeWidth={1.5} aria-hidden className="rtl:-scale-x-100" />
        {t("back")}
      </Link>

      <header className="mt-8 border-b border-line pb-8">
        <div className="mb-4 flex flex-wrap gap-x-8 gap-y-2">
          <span className="annotation">
            {t("category")} — {t(`categoryNames.${project.category}`)}
          </span>
          <span className="annotation">
            {t("year")} — {formatNumber(locale, project.year)}
          </span>
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-fg-muted">{project.summary}</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="annotation me-2">{t("stack")}</span>
          {project.stack.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>

        {(project.links.live || project.links.repo) && (
          <div className="mt-6 flex flex-wrap gap-6">
            {project.links.live ? (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-sm uppercase tracking-widest text-accent hover:underline"
              >
                {t("live")}
                <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden className="rtl:-scale-x-100" />
              </a>
            ) : null}
            {project.links.repo ? (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-sm uppercase tracking-widest text-accent hover:underline"
              >
                {t("repo")}
                <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden className="rtl:-scale-x-100" />
              </a>
            ) : null}
          </div>
        )}
      </header>

      {project.cover ? (
        <Parallax className="mt-10 border border-line">
          <Image
            src={project.cover.url}
            width={project.cover.width}
            height={project.cover.height}
            alt={project.coverAlt ?? project.title}
            priority
            className="w-full"
          />
        </Parallax>
      ) : null}

      <article className="mt-6">
        <MdxContent source={project.body} />
      </article>
    </main>
  );
}

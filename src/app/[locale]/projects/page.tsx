import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import type { Locale } from "@/lib/i18n/routing";
import { getProjects } from "@/lib/content/loaders";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectIndex } from "@/components/projects/project-index";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return { title: t("indexTitle") };
}

export default function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("projects");
  const projects = getProjects(locale);

  return (
    <main id="content" className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading
        index={t("index")}
        label={t("label")}
        title={t("indexTitle")}
        description={t("indexDescription")}
      />
      <ProjectIndex projects={projects} />
    </main>
  );
}

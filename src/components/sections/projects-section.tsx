import { useTranslations } from "next-intl";
import type { Project } from "@/lib/content/loaders";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/projects/project-card";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");

  return (
    <section id="projects" className="scroll-mt-14 border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          index={t("index")}
          label={t("label")}
          title={t("title")}
          description={t("description")}
        />
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
        <div className="mt-10">
          <Button as={Link} variant="outline" href="/projects">
            {t("viewAll")}
          </Button>
        </div>
      </div>
    </section>
  );
}

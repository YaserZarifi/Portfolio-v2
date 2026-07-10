import { useTranslations } from "next-intl";
import type { Project } from "@/lib/content/loaders";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");

  return (
    <section id="projects" className="scroll-mt-14 border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <SectionHeading
            index={t("index")}
            label={t("label")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>
        <Stagger className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <StaggerItem key={project.slug}>
              <ProjectCard project={project} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal delay={0.1} className="mt-10">
          <Button as={Link} variant="outline" href="/projects">
            {t("viewAll")}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

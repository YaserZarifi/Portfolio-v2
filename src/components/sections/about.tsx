import { useTranslations } from "next-intl";
import type { Profile } from "@/lib/content/schemas";
import type { ResolvedSkillGroup } from "@/lib/content/loaders";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { Reveal } from "@/components/motion/reveal";

export function About({
  profile,
  skills,
}: {
  profile: Profile;
  skills: ResolvedSkillGroup[];
}) {
  const t = useTranslations("about");

  return (
    <section id="about" className="scroll-mt-14 border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <SectionHeading
            index={t("index")}
            label={t("label")}
            title={t("title")}
          />
        </Reveal>
        <Reveal delay={0.08} className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            {profile.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-fg-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <div>
            <p className="annotation mb-6">{t("skillsLabel")}</p>
            <div className="flex flex-col gap-6">
              {skills.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-sm font-medium">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

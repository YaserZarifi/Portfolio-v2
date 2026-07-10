import { useLocale, useTranslations } from "next-intl";
import type {
  ResolvedEducation,
  ResolvedExperience,
} from "@/lib/content/loaders";
import type { Profile } from "@/lib/content/schemas";
import type { Locale } from "@/lib/i18n/routing";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

function Period({
  locale,
  start,
  end,
  presentLabel,
}: {
  locale: Locale;
  start: string;
  end: string | null;
  presentLabel: string;
}) {
  return (
    <span className="annotation whitespace-nowrap">
      {formatDate(locale, start)} — {end ? formatDate(locale, end) : presentLabel}
    </span>
  );
}

export function TimelineSection({
  experience,
  education,
  profile,
}: {
  experience: ResolvedExperience[];
  education: ResolvedEducation[];
  profile: Profile;
}) {
  const t = useTranslations("experience");
  const locale = useLocale() as Locale;

  return (
    <section id="experience" className="scroll-mt-14 border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <SectionHeading
            index={t("index")}
            label={t("label")}
            title={t("title")}
          />
        </Reveal>
        <Reveal delay={0.08} className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="annotation mb-6">{t("work")}</p>
            <ol className="border-s border-line">
              {experience.map((item) => (
                <li
                  key={`${item.org}-${item.start}`}
                  className="relative mb-10 ps-6 last:mb-0"
                >
                  <span
                    aria-hidden
                    className="absolute -start-[3px] top-2 h-[5px] w-[5px] bg-accent"
                  />
                  <Period
                    locale={locale}
                    start={item.start}
                    end={item.end}
                    presentLabel={t("present")}
                  />
                  <h3 className="mt-1 font-medium">{item.role}</h3>
                  <p className="text-sm text-fg-muted">{item.org}</p>
                  <p className="mt-2 text-sm text-fg-muted">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="annotation mb-6">{t("education")}</p>
            <ol className="border-s border-line">
              {education.map((item) => (
                <li
                  key={`${item.institution}-${item.start}`}
                  className="relative mb-10 ps-6 last:mb-0"
                >
                  <span
                    aria-hidden
                    className="absolute -start-[3px] top-2 h-[5px] w-[5px] bg-fg-muted"
                  />
                  <Period
                    locale={locale}
                    start={item.start}
                    end={item.end}
                    presentLabel={t("present")}
                  />
                  <h3 className="mt-1 font-medium">{item.degree}</h3>
                  <p className="text-sm text-fg-muted">{item.institution}</p>
                  {item.note ? (
                    <p className="mt-2 text-sm text-fg-muted">{item.note}</p>
                  ) : null}
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <Button as="a" variant="outline" href={profile.cvUrl} download>
                {t("downloadCv")}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

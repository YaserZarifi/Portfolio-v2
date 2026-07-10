import { useTranslations } from "next-intl";
import type { Profile } from "@/lib/content/schemas";
import { Button } from "@/components/ui/button";

export function Hero({ profile }: { profile: Profile }) {
  const t = useTranslations("hero");

  return (
    <section className="bg-drafting-grid border-b border-line">
      <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl flex-col justify-center px-6 py-24">
        <p className="annotation mb-6 text-accent">{t("kicker")}</p>
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-2xl text-fg-muted">{t("subtitle")}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button as="a" href="#projects">
            {t("viewWork")}
          </Button>
          <Button as="a" variant="outline" href={profile.cvUrl} download>
            {t("downloadCv")}
          </Button>
        </div>
        <p className="annotation mt-16">
          {profile.location} — N 35.6892° / E 51.3890°
        </p>
      </div>
    </section>
  );
}

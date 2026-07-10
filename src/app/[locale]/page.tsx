import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("hero");

  return (
    <main className="bg-drafting-grid">
      <section className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl flex-col justify-center px-6 py-24">
        <p className="annotation mb-6 text-accent">{t("kicker")}</p>
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-2xl text-fg-muted">{t("subtitle")}</p>
      </section>
    </main>
  );
}

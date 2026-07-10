import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("hero");

  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col px-6">
      <header className="flex items-center justify-between border-b border-line py-4">
        <span className="font-mono text-sm text-fg-muted">YZ — 35.6892° N</span>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <section className="flex flex-1 flex-col justify-center py-24">
        <p className="mb-6 font-mono text-sm tracking-widest text-accent">
          {t("kicker")}
        </p>
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-tight">
          {t("title")}
        </h1>
        <p className="mt-4 text-2xl text-fg-muted">{t("subtitle")}</p>
      </section>

      <footer className="border-t border-line py-4">
        <p className="font-mono text-xs text-fg-muted">{t("scaffold")}</p>
      </footer>
    </main>
  );
}

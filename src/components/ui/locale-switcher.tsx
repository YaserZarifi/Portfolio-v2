"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const other = locale === "en" ? "fa" : "en";

  return (
    <Link
      href={pathname}
      locale={other}
      lang={other}
      // The label is in the OTHER script than the current page, so it can't
      // rely on the page font: lead with Vazirmatn (Persian) and fall back to
      // Plex Mono (Latin) so "فارسی" never hits the browser default face.
      style={{
        fontFamily:
          "var(--font-vazirmatn), var(--font-plex-mono), ui-monospace, monospace",
      }}
      className="inline-flex h-11 items-center border border-line px-4 text-sm text-fg-muted transition-colors hover:border-accent hover:text-fg"
    >
      {t("switchLocale")}
    </Link>
  );
}

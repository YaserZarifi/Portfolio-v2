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
      className="inline-flex h-11 items-center border border-line px-4 font-mono text-sm text-fg-muted transition-colors hover:border-accent hover:text-fg"
    >
      {t("switchLocale")}
    </Link>
  );
}

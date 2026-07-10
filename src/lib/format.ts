import type { Locale } from "@/lib/i18n/routing";

/**
 * "2023-01" → "Jan 2023" (en) / "دی ۱۴۰۱" (fa — Persian calendar + digits).
 * "2023" → "2023" / "۱۴۰۱–۰۲" equivalent year form.
 */
export function formatDate(locale: Locale, value: string): string {
  const [year, month] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, 15));
  const intlLocale = locale === "fa" ? "fa-IR" : "en-US";
  return new Intl.DateTimeFormat(intlLocale, {
    year: "numeric",
    ...(month ? { month: "short" } : {}),
  }).format(date);
}

/** Locale-correct digits for standalone numbers (years in prose, counts). */
export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    useGrouping: false,
  }).format(value);
}

"use client";

import { useLocale } from "next-intl";
import { isRtl } from "@/lib/i18n/routing";

/**
 * CSS logical properties flip layout in RTL, but Framer Motion x-offsets do
 * NOT. Every horizontal animation must multiply through this factor so
 * Persian pages animate inward from the correct side.
 */
export function useDirectionalX(): (x: number) => number {
  const locale = useLocale();
  const factor = isRtl(locale) ? -1 : 1;
  return (x: number) => x * factor;
}

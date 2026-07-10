"use client";

import { Command } from "lucide-react";
import { useTranslations } from "next-intl";
import { openCommandPalette } from "./command-events";

/** Header affordance that opens the command palette (⌘K). */
export function CommandButton() {
  const t = useTranslations("command");
  return (
    <button
      type="button"
      onClick={openCommandPalette}
      aria-label={t("open")}
      className="hidden h-11 cursor-pointer items-center gap-2 border border-line px-3 font-mono text-xs text-fg-muted transition-colors hover:border-accent hover:text-fg sm:inline-flex"
    >
      <Command size={14} strokeWidth={1.5} aria-hidden />
      <span className="tracking-widest">K</span>
    </button>
  );
}

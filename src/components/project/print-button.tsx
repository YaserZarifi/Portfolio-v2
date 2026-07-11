"use client";

import { Printer } from "lucide-react";
import { useTranslations } from "next-intl";

/** Triggers the browser print dialog → the print stylesheet renders a sheet. */
export function PrintButton() {
  const t = useTranslations("project");
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-9 cursor-pointer items-center gap-2 border border-line px-3 font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:border-accent hover:text-accent-fg print:hidden"
    >
      <Printer size={14} strokeWidth={1.5} aria-hidden />
      {t("print")}
    </button>
  );
}

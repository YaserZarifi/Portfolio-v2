"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

const NAV_ITEMS = [
  { key: "about", hash: "#about" },
  { key: "projects", hash: "#projects" },
  { key: "certificates", hash: "#certificates" },
  { key: "experience", hash: "#experience" },
  { key: "contact", hash: "#contact" },
] as const;

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center border border-line text-fg-muted transition-colors hover:border-accent hover:text-fg"
      >
        {open ? (
          <X size={18} strokeWidth={1.5} />
        ) : (
          <Menu size={18} strokeWidth={1.5} />
        )}
      </button>
      {open ? (
        <nav
          aria-label="Main"
          className="absolute inset-x-0 top-14 border-b border-line bg-bg"
        >
          <ul className="mx-auto max-w-6xl px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={`/${item.hash}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3 text-fg-muted transition-colors last:border-0 hover:text-fg"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

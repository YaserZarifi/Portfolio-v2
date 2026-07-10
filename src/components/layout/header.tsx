import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_ITEMS = [
  { key: "about", hash: "#about" },
  { key: "projects", hash: "#projects" },
  { key: "certificates", hash: "#certificates" },
  { key: "experience", hash: "#experience" },
  { key: "contact", hash: "#contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-semibold tracking-tight">YASER ZARIFI</span>
          <span className="annotation hidden sm:inline">35.6892° N</span>
        </Link>

        {/* Full mobile menu lands with the section pages in Phase 4. */}
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/${item.hash}`}
              className="text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

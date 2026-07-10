import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandButton } from "@/components/command/command-button";

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
      <a
        href="#content"
        className="absolute start-2 top-2 -translate-y-20 bg-accent px-4 py-2 text-white transition-transform focus:translate-y-0"
      >
        {t("skipToContent")}
      </a>
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
              className="relative text-sm text-fg-muted transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-fg hover:after:scale-x-100 motion-reduce:after:transition-none"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CommandButton />
          <LocaleSwitcher />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

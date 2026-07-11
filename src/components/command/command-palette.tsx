"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  FileDown,
  Frame,
  Github,
  Languages,
  Linkedin,
  MoonStar,
  Navigation,
} from "lucide-react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { toggleWireframe } from "@/components/dev/wireframe-controller";
import { COMMAND_EVENT } from "./command-events";

type Cmd = {
  id: string;
  label: string;
  group: string;
  icon: React.ReactNode;
  run: () => void;
};

const SECTIONS = ["about", "projects", "certificates", "experience", "contact"];

export function CommandPalette({
  cvUrl,
  social,
}: {
  cvUrl: string;
  social: Record<string, string>;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const goSection = useCallback(
    (id: string) => {
      close();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.location.href = `/${locale}#${id}`;
    },
    [close, locale],
  );

  const commands = useMemo<Cmd[]>(() => {
    const nav: Cmd[] = SECTIONS.map((id) => ({
      id: `nav-${id}`,
      label: t(`nav.${id}`),
      group: t("command.navigate"),
      icon: <Navigation size={15} strokeWidth={1.5} />,
      run: () => goSection(id),
    }));

    const actions: Cmd[] = [
      {
        id: "projects-index",
        label: t("projects.viewAll"),
        group: t("command.navigate"),
        icon: <ArrowRight size={15} strokeWidth={1.5} />,
        run: () => {
          close();
          router.push("/projects");
        },
      },
      {
        id: "theme",
        label: t("nav.switchTheme"),
        group: t("command.actions"),
        icon: <MoonStar size={15} strokeWidth={1.5} />,
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          close();
        },
      },
      {
        id: "locale",
        label: t("command.switchLanguage"),
        group: t("command.actions"),
        icon: <Languages size={15} strokeWidth={1.5} />,
        run: () => {
          close();
          router.replace(pathname, { locale: locale === "en" ? "fa" : "en" });
        },
      },
      {
        id: "cv",
        label: t("hero.downloadCv"),
        group: t("command.actions"),
        icon: <FileDown size={15} strokeWidth={1.5} />,
        run: () => {
          close();
          window.open(cvUrl, "_blank");
        },
      },
      {
        id: "wireframe",
        label: t("command.wireframe"),
        group: t("command.actions"),
        icon: <Frame size={15} strokeWidth={1.5} />,
        run: () => {
          close();
          toggleWireframe();
        },
      },
    ];

    const links: Cmd[] = [];
    if (social.github)
      links.push({
        id: "github",
        label: "GitHub",
        group: t("command.links"),
        icon: <Github size={15} strokeWidth={1.5} />,
        run: () => {
          close();
          window.open(social.github, "_blank");
        },
      });
    if (social.linkedin)
      links.push({
        id: "linkedin",
        label: "LinkedIn",
        group: t("command.links"),
        icon: <Linkedin size={15} strokeWidth={1.5} />,
        run: () => {
          close();
          window.open(social.linkedin, "_blank");
        },
      });

    return [...nav, ...actions, ...links];
  }, [
    t,
    goSection,
    close,
    router,
    pathname,
    locale,
    resolvedTheme,
    setTheme,
    cvUrl,
    social,
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  // Open on Ctrl/Cmd+K or custom event; toggle with the key.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(COMMAND_EVENT, onEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(COMMAND_EVENT, onEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={close}
        >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={t("command.title")}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onListKey}
            className="w-full max-w-lg border border-line bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span className="annotation">⌘K</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder={t("command.placeholder")}
                className="h-12 flex-1 bg-transparent text-fg outline-none placeholder:text-fg-muted/60"
              />
            </div>
            <ul className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-fg-muted">
                  {t("command.empty")}
                </li>
              ) : (
                filtered.map((cmd, i) => {
                  const prev = filtered[i - 1];
                  const showGroup = !prev || prev.group !== cmd.group;
                  const isActive = i === active;
                  return (
                    <li key={cmd.id}>
                      {showGroup ? (
                        <p className="annotation px-4 pb-1 pt-3">{cmd.group}</p>
                      ) : null}
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onClick={() => cmd.run()}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm transition-colors ${
                          isActive
                            ? "bg-accent-soft text-fg"
                            : "text-fg-muted hover:text-fg"
                        }`}
                      >
                        <span
                          className={isActive ? "text-accent-fg" : "text-fg-muted"}
                        >
                          {cmd.icon}
                        </span>
                        {cmd.label}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

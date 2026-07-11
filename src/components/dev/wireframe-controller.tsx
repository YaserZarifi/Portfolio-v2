"use client";

import { useEffect, useState } from "react";

/**
 * Wireframe mode — an easter-egg "dev view" that strips the site to its
 * schematic: every element outlined, media dimmed to placeholders, landmarks
 * labelled. Toggle with Shift+W, the command palette, or the banner's exit;
 * Esc also leaves. Persisted per browser.
 *
 * This component owns the `wireframe` class on <html> and renders the banner;
 * anything can request a toggle by dispatching WIREFRAME_EVENT.
 */
export const WIREFRAME_EVENT = "portfolio:wireframe";

export function toggleWireframe() {
  window.dispatchEvent(new CustomEvent(WIREFRAME_EVENT));
}

export function WireframeController() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(localStorage.getItem("cad-wireframe") === "1");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("wireframe", on);
    localStorage.setItem("cad-wireframe", on ? "1" : "0");
  }, [on]);

  useEffect(() => {
    const onEvent = () => setOn((v) => !v);
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);
      if (typing) return;
      if (e.shiftKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        setOn((v) => !v);
      } else if (e.key === "Escape") {
        setOn((v) => (v ? false : v));
      }
    };
    window.addEventListener(WIREFRAME_EVENT, onEvent);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(WIREFRAME_EVENT, onEvent);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!on) return null;

  return (
    <div className="fixed inset-x-0 top-16 z-[120] flex justify-center px-4 print:hidden">
      <div className="flex items-center gap-3 border border-accent bg-bg/90 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-accent-fg backdrop-blur-sm">
        <span className="inline-block h-1.5 w-1.5 animate-pulse bg-accent" />
        Wireframe mode
        <button
          type="button"
          onClick={() => setOn(false)}
          className="cursor-pointer text-fg-muted underline-offset-2 hover:text-fg hover:underline"
        >
          Shift+W / Esc to exit
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";

/**
 * CAD crosshair cursor — the page treated as a drafting instrument.
 *
 * Full-viewport hairlines + a pick-box track the pointer with zero lag
 * (precision beats smoothing for a crosshair); a live coordinate readout
 * plots at the tip; and when the pick-box nears anything interactive a
 * selection marquee snaps around it and the whole rig tints accent.
 *
 * Fine-pointer only (touch keeps its native cursor untouched). All motion
 * lives in CSS so `prefers-reduced-motion` can neutralise it centrally.
 * Position is written straight to the DOM in one rAF loop — no React
 * re-render fires on pointer move.
 */

const SNAP_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, [data-cursor-snap]';

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const vLine = useRef<HTMLDivElement>(null);
  const hLine = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const marquee = useRef<HTMLDivElement>(null);

  // Enable only where there's a precise pointer to replace.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const html = document.documentElement;
    html.classList.add("has-cad-cursor");
    return () => html.classList.remove("has-cad-cursor");
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let snapEl: Element | null = null;
    let wasSnapping = false;
    let frame = 0;
    let scheduled = false;

    // Event-driven: one frame is scheduled per pointer move / scroll, never a
    // perpetual loop — the crosshair costs nothing while the pointer is still.
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      frame = requestAnimationFrame(render);
    };

    const render = () => {
      scheduled = false;
      vLine.current!.style.transform = `translate3d(${x}px,0,0)`;
      hLine.current!.style.transform = `translate3d(0,${y}px,0)`;
      box.current!.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;

      const lbl = label.current!;
      lbl.style.transform = `translate3d(${x + 16}px,${y + 16}px,0)`;
      lbl.textContent = `X ${pad(x)}  Y ${pad(y)}`;

      const mq = marquee.current!;
      if (snapEl) {
        const r = snapEl.getBoundingClientRect();
        mq.style.opacity = "1";
        mq.style.transform = `translate3d(${r.left - 4}px,${r.top - 4}px,0)`;
        mq.style.width = `${r.width + 8}px`;
        mq.style.height = `${r.height + 8}px`;
      } else {
        mq.style.opacity = "0";
      }
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      snapEl =
        e.target instanceof Element ? e.target.closest(SNAP_SELECTOR) : null;
      const snapping = Boolean(snapEl);
      if (snapping && !wasSnapping) sound.tick(); // locked on
      wasSnapping = snapping;
      root.current!.dataset.snap = snapping ? "on" : "off";
      root.current!.dataset.visible = "true";
      schedule();
    };
    // While snapped, the marquee must track the target as the page scrolls.
    const onScroll = () => {
      if (snapEl) schedule();
    };
    const onLeave = () => {
      root.current!.dataset.visible = "false";
    };
    const onDown = () => {
      root.current!.dataset.press = "on";
      sound.press();
    };
    const onUp = () => (root.current!.dataset.press = "off");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    schedule(); // initial paint at rest position

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={root} className="cad-cursor" data-visible="false" aria-hidden>
      <div ref={vLine} className="cad-cursor__v" />
      <div ref={hLine} className="cad-cursor__h" />
      <div ref={marquee} className="cad-cursor__marquee" />
      <div ref={box} className="cad-cursor__box" />
      <div ref={label} className="cad-cursor__label" />
    </div>
  );
}

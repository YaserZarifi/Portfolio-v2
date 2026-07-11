"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Plotter pen-trail — an accent ink line that follows the cursor and fades,
 * drawn on a full-viewport canvas. The whole site is a drafting instrument, so
 * the pointer leaves a plotted stroke.
 *
 * Cheap and safe: mouse pointers only (touch/pen skip it), disabled under
 * reduced motion, DPR-capped, and the rAF loop parks ~1.5s after the last move
 * once the trail has fully faded. Sits below the CAD crosshair (z-95 < z-100).
 */
export function PenTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!(fine && !reduce)) return;
    // Pure decoration — mount at idle so it never competes with hydration/LCP.
    const ric =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({ didTimeout: false } as IdleDeadline), 400));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => setEnabled(true), { timeout: 2000 });
    return () => cancel(id as number);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const readAccent = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#2563eb";
    let accent = readAccent();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let lastX = 0;
    let lastY = 0;
    let hasLast = false;
    let px = 0;
    let py = 0;
    let pending = false;
    let idle = 0;
    let raf = 0;

    const loop = () => {
      // Erode existing ink so the trail fades regardless of background.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.09)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      if (pending) {
        if (hasLast) {
          ctx.strokeStyle = accent;
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        lastX = px;
        lastY = py;
        hasLast = true;
        pending = false;
        idle = 0;
      } else {
        idle++;
      }

      // Keep fading for ~1.5s after the last move, then park.
      if (idle < 90 && document.visibilityState === "visible") {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
        hasLast = false;
        ctx.clearRect(0, 0, w, h);
      }
    };
    const wake = () => {
      if (!raf && document.visibilityState === "visible") {
        raf = requestAnimationFrame(loop);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      pending = true;
      wake();
    };
    const onTheme = () => {
      accent = readAccent();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    const themeObs = new MutationObserver(onTheme);
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      themeObs.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[95] h-screen w-screen"
    />
  );
}

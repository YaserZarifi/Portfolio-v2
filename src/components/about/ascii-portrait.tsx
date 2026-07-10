"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * "The architect becomes the drawing."
 * The portrait photo sits over a live ASCII rendering of itself (luminance-
 * mapped IBM Plex Mono glyphs on a canvas). A scanline follows the cursor:
 * photo on one side, glyphs on the other. Without a pointer (touch devices,
 * or before first hover) the scanline sweeps on its own.
 */

const RAMP = " .:-=+*#%@█";
const COLS = 96;

function drawAscii(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const styles = getComputedStyle(document.documentElement);
  const bg = styles.getPropertyValue("--bg").trim() || "#0a0a0b";
  const fg = styles.getPropertyValue("--fg").trim() || "#fafafa";
  const accent = styles.getPropertyValue("--accent").trim() || "#2563eb";
  const mono =
    getComputedStyle(document.body).getPropertyValue("--font-plex-mono").trim() ||
    "monospace";
  // On paper (light) theme, dark pixels get the dense glyphs — classic
  // print ASCII. On ink (dark) theme, bright pixels do.
  const lightTheme = document.documentElement.classList.contains("light");

  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (w === 0 || h === 0) return;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cellW = w / COLS;
  const cellH = cellW * 1.85;
  const rows = Math.ceil(h / cellH);

  // Sample the image at glyph resolution with a cover-fit crop.
  const off = document.createElement("canvas");
  off.width = COLS;
  off.height = rows;
  const octx = off.getContext("2d");
  if (!octx) return;
  const scale = Math.max(COLS / img.width, rows / img.height);
  const sw = COLS / scale;
  const sh = rows / scale;
  octx.drawImage(
    img,
    (img.width - sw) / 2,
    (img.height - sh) / 2,
    sw,
    sh,
    0,
    0,
    COLS,
    rows,
  );
  const data = octx.getImageData(0, 0, COLS, rows).data;

  ctx.font = `${cellH}px ${mono}`;
  ctx.textBaseline = "top";

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < COLS; col++) {
      const i = (row * COLS + col) * 4;
      let lum =
        (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      if (lightTheme) lum = 1 - lum;
      const char = RAMP[Math.round(lum * (RAMP.length - 1))];
      if (char === " ") continue;
      // Brightest cells get the blueprint-blue accent — sparse, deliberate.
      ctx.fillStyle = lum > 0.94 ? accent : fg;
      ctx.globalAlpha = 0.3 + 0.7 * lum;
      ctx.fillText(char, col * cellW, row * cellH);
    }
  }
  ctx.globalAlpha = 1;
}

export function AsciiPortrait({ alt }: { alt: string }) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const sweepRef = useRef<ReturnType<typeof animate> | null>(null);

  // Scanline position, % from the left. Photo shows on the glyph-free side.
  const split = useMotionValue(50);
  const smooth = useSpring(split, { stiffness: 140, damping: 26, mass: 0.4 });
  const clipRight = useTransform(smooth, (v) => 100 - v);
  const photoClip = useMotionTemplate`inset(0 ${clipRight}% 0 0)`;
  const linePos = useMotionTemplate`${smooth}%`;

  useEffect(() => {
    const img = new Image();
    img.src = "/images/portrait.jpg";
    img.onload = () => {
      imgRef.current = img;
      if (canvasRef.current) drawAscii(canvasRef.current, img);
    };

    const redraw = () => {
      if (canvasRef.current && imgRef.current)
        drawAscii(canvasRef.current, imgRef.current);
    };
    const resize = new ResizeObserver(redraw);
    if (containerRef.current) resize.observe(containerRef.current);
    // Re-render glyph colors when the theme class flips.
    const theme = new MutationObserver(redraw);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      resize.disconnect();
      theme.disconnect();
    };
  }, []);

  // Ambient sweep until (and between) pointer interactions.
  const startSweep = () => {
    if (reduce) return;
    sweepRef.current?.stop();
    sweepRef.current = animate(split, [split.get(), 88, 12], {
      duration: 9,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    });
  };

  useEffect(() => {
    if (reduce) {
      split.set(55);
      return;
    }
    startSweep();
    return () => sweepRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className="group relative aspect-[4/5] cursor-crosshair select-none overflow-hidden border border-line bg-bg"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        sweepRef.current?.stop();
        const rect = e.currentTarget.getBoundingClientRect();
        split.set(((e.clientX - rect.left) / rect.width) * 100);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") startSweep();
      }}
    >
      {/* Glyph layer — always fully rendered underneath. */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Photo layer — clipped at the scanline. */}
      <m.div style={{ clipPath: photoClip }} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/portrait.jpg"
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </m.div>

      {/* The scanline itself. */}
      <m.div
        aria-hidden
        style={{ left: linePos }}
        className="absolute inset-y-0 w-px -translate-x-1/2 bg-accent shadow-[0_0_12px_var(--accent)]"
      />
    </div>
  );
}

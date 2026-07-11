"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Blueprint Surface — the hero's GPU ambient layer.
 *
 * A single full-screen fragment shader that renders the drafting table as a
 * living blueprint: a two-scale grid that breathes, a plotter "light" that
 * follows the pointer and traces accent across the sheet, fine film grain, a
 * vignette, and a whisper of chromatic split on the major lines. It replaces
 * the old video + canvas-2D reactive grid in the hero — one GPU pass instead
 * of a video decode plus a JS dot loop, so it is a NET performance win while
 * looking far richer.
 *
 * Engineered to stay cheap and safe:
 *  - Raw WebGL1 / GLSL ES 1.00, no extensions, no libraries, zero new deps.
 *    Falls through to `null` when WebGL is unavailable (the hero keeps its CSS
 *    drafting grid + animated SVG grid, so it never looks bare).
 *  - The rAF loop runs ONLY while the hero is on screen (IntersectionObserver)
 *    and the tab is visible; it parks ~1.2s after the pointer stops moving.
 *    Every resize / theme flip / re-entry forces a one-shot repaint so a
 *    parked surface never shows a blank or stale buffer.
 *  - Reduced-motion renders a single static frame and never starts the loop.
 *  - DPR capped, one full-screen triangle, colours read from the live theme
 *    tokens and refreshed when the light/dark class flips.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;      // drawing-buffer size (px)
uniform float uTime;     // seconds
uniform vec2  uPointer;  // pointer, y-up px in buffer space
uniform float uActive;   // 0..1 pointer presence (smoothed)
uniform vec3  uBg;
uniform vec3  uFg;
uniform vec3  uAccent;
uniform float uReduce;   // 1.0 = reduced motion (no drift / grain)

// Cheap hash for grain.
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

// Anti-aliased grid intensity. coord & scale in px; w = half line width (px).
// Manual AA (no fwidth / derivatives extension needed).
float grid(vec2 coord, float scale, float w) {
  vec2 c = coord / scale;
  vec2 d = min(fract(c), 1.0 - fract(c)) * scale; // px distance to nearest line
  float dist = min(d.x, d.y);
  return 1.0 - smoothstep(0.0, w, dist);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5 * uRes) / uRes.y; // centered, aspect-correct

  // Slow parallax breathing of the sheet (stilled under reduced motion).
  float drift = uReduce > 0.5 ? 0.0 : 1.0;
  vec2 sheet = frag + drift * vec2(
    sin(uTime * 0.06) * 12.0,
    cos(uTime * 0.05) * 10.0
  );

  // Pointer light: a soft flashlight over the blueprint.
  float pd = distance(frag, uPointer);
  float radius = 240.0;
  float glow = exp(-pd / radius) * uActive;

  // Two grid scales. Major lines split slightly (chromatic) near the light.
  float fine = grid(sheet, 42.0, 1.0);
  float ca = glow * 3.0; // chromatic offset in px, only where the light is
  float majR = grid(sheet + vec2(ca, 0.0), 210.0, 1.4);
  float majG = grid(sheet, 210.0, 1.4);
  float majB = grid(sheet - vec2(ca, 0.0), 210.0, 1.4);
  float major = majG;

  // Base compose: ink sheet, faint fine grid, firmer major grid.
  vec3 col = uBg;
  col = mix(col, mix(uBg, uFg, 0.11), fine * 0.55);
  col = mix(col, mix(uBg, uFg, 0.20), major);

  // Chromatic fringe on the majors, kept subtle and light-gated.
  vec3 fringe = vec3(majR, majG, majB) - major;
  col += fringe * uAccent * 0.5;

  // Plotter light: brighten grid toward accent + a faint accent haze.
  float lit = glow * (0.25 + fine * 0.9 + major * 1.2);
  col = mix(col, uAccent, clamp(lit, 0.0, 0.85));
  col += uAccent * glow * 0.05;

  // Film grain — animated, very low amplitude, off under reduced motion.
  float grain = (hash(frag + uTime * 60.0) - 0.5) * (uReduce > 0.5 ? 0.0 : 0.05);
  col += grain;

  // Vignette to seat the composition.
  float vig = 1.0 - dot(uv, uv) * 0.35;
  col *= clamp(vig, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full || "000000", 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function BlueprintSurface({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  // Defer WebGL setup (shader compile + first draws) to idle so it never
  // competes with hydration/LCP. The CSS grid fallback covers the gap.
  useEffect(() => {
    const ric =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({ didTimeout: false } as IdleDeadline), 200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => setReady(true), { timeout: 1500 });
    return () => cancel(id as number);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = canvas.current;
    if (!el) return;

    const gl = (el.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    }) ||
      el.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return; // no WebGL → hero keeps its CSS + SVG grid fallback

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // --- compile ---
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // Full-screen triangle.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      pointer: gl.getUniformLocation(prog, "uPointer"),
      active: gl.getUniformLocation(prog, "uActive"),
      bg: gl.getUniformLocation(prog, "uBg"),
      fg: gl.getUniformLocation(prog, "uFg"),
      accent: gl.getUniformLocation(prog, "uAccent"),
      reduce: gl.getUniformLocation(prog, "uReduce"),
    };
    gl.uniform1f(u.reduce, reduce ? 1 : 0);

    // Cap DPR lower on phones — the fill-rate saved matters more than the
    // extra crispness on a small, dense screen.
    const dprCap = window.matchMedia("(max-width: 768px)").matches ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    let w = 0;
    let h = 0;

    // --- theme colours (uniforms only) ---
    const readTheme = () => {
      const css = getComputedStyle(document.documentElement);
      gl.uniform3fv(u.bg, hexToRgb(css.getPropertyValue("--bg") || "#0a0a0b"));
      gl.uniform3fv(u.fg, hexToRgb(css.getPropertyValue("--fg") || "#fafafa"));
      gl.uniform3fv(
        u.accent,
        hexToRgb(css.getPropertyValue("--accent") || "#2563eb"),
      );
    };

    // --- sizing (buffer + viewport + uRes) ---
    let rectLeft = 0;
    let rectTop = 0;
    const resize = () => {
      const r = el.getBoundingClientRect();
      rectLeft = r.left;
      rectTop = r.top;
      w = Math.max(1, Math.floor(r.width * dpr));
      h = Math.max(1, Math.floor(r.height * dpr));
      el.width = w;
      el.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(u.res, w, h);
    };
    const measure = () => {
      const r = el.getBoundingClientRect();
      rectLeft = r.left;
      rectTop = r.top;
    };

    // --- pointer (buffer space, y-up), smoothed toward the target ---
    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    let tActive = 0;
    let active = 0;
    let lastMove = 0;

    // --- render ---
    const start = performance.now();
    let raf = 0;
    let onScreen = true;

    // One-shot paint — used for the first frame, resizes, theme flips and
    // re-entry so a parked surface is always current.
    const paint = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(u.time, t);
      gl.uniform2f(u.pointer, px, py);
      gl.uniform1f(u.active, active);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = () => {
      // Ease pointer + presence for a fluid "servo" feel.
      px += (tx - px) * 0.12;
      py += (ty - py) * 0.12;
      active += (tActive - active) * 0.08;
      paint();

      const now = performance.now();
      const settled =
        now - lastMove > 1200 &&
        Math.abs(tx - px) < 0.5 &&
        Math.abs(ty - py) < 0.5 &&
        Math.abs(tActive - active) < 0.01;
      if (
        !reduce &&
        onScreen &&
        document.visibilityState === "visible" &&
        !settled
      ) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    };
    const wake = () => {
      if (
        !raf &&
        !reduce &&
        onScreen &&
        document.visibilityState === "visible"
      ) {
        raf = requestAnimationFrame(frame);
      }
    };

    // --- initial paint (correct size + colours from the first frame) ---
    readTheme();
    resize();
    tx = px = w * 0.5;
    ty = py = h * 0.55;
    paint();

    // --- observers & listeners ---
    const themeObs = new MutationObserver(() => {
      readTheme();
      paint(); // repaint immediately even if the loop is parked
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const ro = new ResizeObserver(() => {
      resize();
      paint(); // never leave a resized buffer un-drawn
    });
    ro.observe(el);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) {
          measure();
          paint();
          wake();
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(el);

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX - rectLeft) * dpr;
      ty = h - (e.clientY - rectTop) * dpr; // flip to y-up
      tActive = 1;
      lastMove = performance.now();
      wake();
    };
    const onLeave = () => {
      tActive = 0;
      lastMove = performance.now();
      wake();
    };
    let scrollScheduled = false;
    const onScroll = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        scrollScheduled = false;
        measure();
      });
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        paint();
        wake();
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisible);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, [ready]);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

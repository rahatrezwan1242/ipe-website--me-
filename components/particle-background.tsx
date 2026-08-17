"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

/**
 * Ambient gear & mechanism field: silhouette gears of varying size drift
 * slowly across the viewport, each spinning at its own rate (alternating
 * direction so nearby gears read as if meshing), linked center-to-center by
 * faint dotted lines into a loose zigzag network — evokes production
 * machinery rather than generic decoration.
 *
 * Perf guards: gear count scales with viewport area (halved on coarse
 * pointers) and is capped low since each gear is a heavier draw than a
 * plain dot (teeth loop + pitch circle + spokes + bore). Network-edge
 * selection is an O(n^2 log n) sort but n is capped small, so it's trivial
 * per frame. FPS capped ~60. Under prefers-reduced-motion the scene renders
 * once and the rAF loop never starts (true stillness, not just zero
 * velocity), so it costs nothing once painted; a theme toggle still
 * repaints it once via the effect below.
 */
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const { theme } = useTheme();
  // The homepage supplies its own bespoke background (see components/home/hero.tsx)
  // that this field would clash with, so it doesn't render there at all.
  const hidden = pathname === "/";
  // Curriculum and calculator are quieter reading/working pages — keep the field nearly still.
  const speedScale = pathname === "/curriculum" || pathname === "/calculator" ? 0.12 : 1;
  const speedRef = useRef(speedScale);
  const themeRef = useRef(theme);
  const onThemeChangeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    speedRef.current = speedScale;
  }, [speedScale]);

  useEffect(() => {
    themeRef.current = theme;
    // Existing gears' colors are fixed at spawn time and would otherwise
    // stay the old theme's hue until they next drift off-screen and
    // respawn — which never happens for a reduced-motion user, since
    // velocity is 0. Force a recolor + repaint instead.
    onThemeChangeRef.current?.();
  }, [theme]);

  useEffect(() => {
    if (hidden) return;
    const el = canvasRef.current;
    if (!el) return;
    const c2d = el.getContext("2d");
    if (!c2d) return;
    const canvas: HTMLCanvasElement = el;
    const ctx: CanvasRenderingContext2D = c2d;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let gears: Gear[] = [];
    let raf = 0;
    let last = 0;
    const frameMs = 1000 / 60;
    // Wide enough that most gears on screen find a neighbor to connect to, rather than
    // only occasionally drifting close enough — reads as a deliberate connected network.
    const BELT_DIST = 480;
    // Capping each gear's links to 2 turns the connections into loose chains of a
    // few gears (a zigzag path) instead of every nearby pair lighting up at once,
    // which reads as a messy full mesh rather than a deliberate network.
    const MAX_LINKS_PER_GEAR = 2;

    function sizeAndSeed() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = w * h;
      const densityDivisor = coarse ? 170000 : 105000;
      const target = Math.min(12, Math.max(5, Math.floor(area / densityDivisor)));
      gears = Array.from({ length: target }, (_, i) => spawnGear(w, h, false, reduced, themeRef.current, i));
    }

    function drawGear(g: Gear) {
      // Light backgrounds swallow thin translucent strokes that glow crisply on dark navy —
      // bump weight/opacity in light mode only so the linework reads with equal confidence.
      const isLight = themeRef.current === "light";
      const toothLen = g.radius * 0.22;
      const toothWidth = ((Math.PI * 2) / g.teeth) * 0.5;
      const alpha = Math.min(1, g.life) * (isLight ? 0.8 : 0.55);

      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.rotation);
      ctx.strokeStyle = g.color;
      ctx.fillStyle = g.color;
      ctx.lineWidth = isLight ? 1.4 : 1;
      ctx.globalAlpha = alpha;

      // base circle
      ctx.beginPath();
      ctx.arc(0, 0, g.radius, 0, Math.PI * 2);
      ctx.stroke();

      // teeth
      for (let i = 0; i < g.teeth; i++) {
        const a = (i / g.teeth) * Math.PI * 2;
        const a0 = a - toothWidth / 2;
        const a1 = a + toothWidth / 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a0) * g.radius, Math.sin(a0) * g.radius);
        ctx.lineTo(Math.cos(a0) * (g.radius + toothLen), Math.sin(a0) * (g.radius + toothLen));
        ctx.lineTo(Math.cos(a1) * (g.radius + toothLen), Math.sin(a1) * (g.radius + toothLen));
        ctx.lineTo(Math.cos(a1) * g.radius, Math.sin(a1) * g.radius);
        ctx.stroke();
      }

      // dashed pitch circle
      ctx.globalAlpha = alpha * 0.6;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, g.radius * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // spokes
      ctx.globalAlpha = alpha * 0.5;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * g.radius * 0.22, Math.sin(a) * g.radius * 0.22);
        ctx.lineTo(Math.cos(a) * g.radius * 0.62, Math.sin(a) * g.radius * 0.62);
        ctx.stroke();
      }

      // center bore
      ctx.globalAlpha = alpha * 0.85;
      ctx.beginPath();
      ctx.arc(0, 0, g.radius * 0.16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      if (g.label) {
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle = g.color;
        ctx.font = "10px ui-monospace, monospace";
        ctx.fillText(g.label, g.x + g.radius + toothLen + 6, g.y + 3);
      }
      ctx.globalAlpha = 1;
    }

    // Picks which gear pairs to connect: nearest pairs first, skipping any pair
    // where either gear already has MAX_LINKS_PER_GEAR links. That degree cap is
    // what turns the result into short zigzag chains of a few gears rather than
    // a dense web connecting everything within range.
    function pickNetworkEdges(): [Gear, Gear][] {
      const candidates: { i: number; j: number; dist: number }[] = [];
      for (let i = 0; i < gears.length; i++) {
        for (let j = i + 1; j < gears.length; j++) {
          const a = gears[i];
          const b = gears[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < BELT_DIST) candidates.push({ i, j, dist });
        }
      }
      candidates.sort((e1, e2) => e1.dist - e2.dist);

      const degree = new Array(gears.length).fill(0);
      const edges: [Gear, Gear][] = [];
      for (const e of candidates) {
        if (degree[e.i] >= MAX_LINKS_PER_GEAR || degree[e.j] >= MAX_LINKS_PER_GEAR) continue;
        degree[e.i]++;
        degree[e.j]++;
        edges.push([gears[e.i], gears[e.j]]);
      }
      return edges;
    }

    function drawBelts() {
      const p = palette(themeRef.current);
      const isLight = themeRef.current === "light";
      ctx.lineWidth = isLight ? 2 : 1.6;
      ctx.lineCap = "round";
      // A near-zero dash with a round cap draws as a string of dots rather than
      // short dashes.
      ctx.setLineDash([0.5, 8]);
      for (const [a, b] of pickNetworkEdges()) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Floor so connections stay legible near the far edge of range instead of fading to
        // near-invisible right before disappearing.
        const proximity = Math.max(0.55, 1 - dist / BELT_DIST);
        const alpha = proximity * (isLight ? 0.75 : 0.6) * Math.min(1, a.life) * Math.min(1, b.life);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = p.belt;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.lineCap = "butt";
      ctx.globalAlpha = 1;
    }

    // Gears spawn/drift independently with no awareness of each other, so left unchecked
    // they can visually overlap. Nudge overlapping pairs apart each frame — same O(n^2)
    // scale as the belt-distance check above, trivial at this gear count.
    function resolveOverlaps() {
      for (let i = 0; i < gears.length; i++) {
        for (let j = i + 1; j < gears.length; j++) {
          const a = gears[i];
          const b = gears[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          // radius * 1.22 matches the tooth tips drawGear() draws out to (toothLen
          // = radius * 0.22) — using bare radius here let teeth visually overlap
          // even when the pitch circles themselves cleared each other.
          const minDist = a.radius * 1.22 + b.radius * 1.22 + 10;
          if (dist >= minDist) continue;
          const push = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          a.x -= nx * push;
          a.y -= ny * push;
          b.x += nx * push;
          b.y += ny * push;
        }
      }
    }

    function renderFrame() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      drawBelts();
      for (const g of gears) drawGear(g);
    }

    function onThemeChange() {
      const p = palette(themeRef.current);
      for (const g of gears) g.color = p.gears[Math.floor(Math.random() * p.gears.length)];
      renderFrame();
    }
    onThemeChangeRef.current = onThemeChange;

    function tick(ts: number) {
      raf = requestAnimationFrame(tick);
      if (ts - last < frameMs) return;
      last = ts;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const scale = speedRef.current;

      for (const g of gears) {
        g.rotation += g.rotationSpeed * scale;
        g.x += g.vx * scale * 4;
        g.y += g.vy * scale * 4;
        if (g.life < 1) g.life = Math.min(1, g.life + 0.012);
        if (g.x > w + g.radius * 3 || g.y < -g.radius * 3 || g.y > h + g.radius * 3) {
          Object.assign(g, spawnGear(w, h, true, reduced, themeRef.current, Math.floor(Math.random() * 1000)));
        }
      }

      resolveOverlaps();
      renderFrame();
    }

    sizeAndSeed();
    // A couple of passes so an initially-clustered spawn (fully random positions) settles
    // apart even for prefers-reduced-motion users, whose scene renders once and never ticks.
    resolveOverlaps();
    resolveOverlaps();
    renderFrame();
    if (!reduced) raf = requestAnimationFrame(tick);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        sizeAndSeed();
        renderFrame();
      }, 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      onThemeChangeRef.current = null;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}

type Palette = { gears: string[]; belt: string };

const DARK_PALETTE: Palette = {
  gears: ["#3d7dbf", "#c98fa0", "#8f6ba8"],
  belt: "rgba(138,144,171,0.5)",
};

const LIGHT_PALETTE: Palette = {
  gears: ["#2f6aa8", "#a8496b", "#6d4c85"],
  belt: "rgba(20,22,31,0.4)",
};

function palette(theme: string): Palette {
  return theme === "light" ? LIGHT_PALETTE : DARK_PALETTE;
}

const LABELS = ["Ø86", "Ø120", "M8", "Ø14", "R6", "0.75m", "24T", "Ø42"];

type Gear = {
  x: number;
  y: number;
  radius: number;
  teeth: number;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  color: string;
  label?: string;
  life: number;
};

function spawnGear(
  w: number,
  h: number,
  fromEdge: boolean,
  reduced: boolean,
  theme: string,
  seed: number,
): Gear {
  const p = palette(theme);
  const radius = 22 + Math.random() * 46;
  const teeth = 8 + Math.floor(Math.random() * 8);
  const dir = seed % 2 === 0 ? 1 : -1;
  return {
    x: fromEdge ? -radius * 3 : Math.random() * w,
    y: 40 + Math.random() * (h - 80),
    radius,
    teeth,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: reduced ? 0 : dir * (0.0025 + Math.random() * 0.004),
    vx: reduced ? 0 : 0.1 + Math.random() * 0.16,
    vy: reduced ? 0 : (Math.random() - 0.5) * 0.05,
    color: p.gears[Math.floor(Math.random() * p.gears.length)],
    label: Math.random() < 0.3 ? LABELS[Math.floor(Math.random() * LABELS.length)] : undefined,
    life: fromEdge ? 0 : 1,
  };
}

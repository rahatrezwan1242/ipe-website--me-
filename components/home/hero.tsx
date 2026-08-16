"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { HOME } from "@/lib/home-palette";
import { Typewriter } from "./typewriter";

const NOISE_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Fixed (non-random) scatter points so server/client markup match exactly.
const SCATTER_POINTS = [
  [4, 92], [12, 84], [8, 70], [20, 78], [26, 62], [18, 55], [34, 58],
  [40, 46], [30, 40], [46, 38], [52, 30], [44, 24], [58, 26], [64, 16],
  [56, 12], [70, 10], [76, 4], [68, 20],
];

// Fixed heights so server/client markup match exactly.
const HISTOGRAM_BARS = [18, 34, 52, 74, 96, 68, 44, 26, 14];

const PARAGRAPH = `A shared space for the Department of Industrial & Production Engineering — memories, milestones, and the people who made them.
This is our story, and it's still being written.`;

export function Hero() {
  const [typedDone, setTypedDone] = useState(false);

  return (
    <section
      id="hero"
      className="relative flex h-screen shrink-0 snap-start items-center overflow-hidden"
      style={{ background: HOME.bgBase }}
    >
      {/* Noise grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: NOISE_BG }}
      />
      {/* Statistical dot grid */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, color-mix(in oklab, ${HOME.accentTeal} 8%, transparent) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Top-right decorative bell curve */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-16 hidden sm:block"
        width="600"
        height="360"
        viewBox="0 0 600 360"
        fill="none"
      >
        <path
          d="M0,320 C 140,320 220,20 300,20 C 380,20 460,320 600,320"
          stroke={HOME.accentTeal}
          strokeOpacity={0.08}
          strokeWidth={2}
        />
      </svg>
      {/* Bottom-left decorative scatter + regression line */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -left-6 hidden sm:block"
        width="320"
        height="260"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <line
          x1="2"
          y1="94"
          x2="80"
          y2="6"
          stroke={HOME.accentWarm}
          strokeOpacity={0.1}
          strokeWidth={0.6}
        />
        {SCATTER_POINTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.1} fill={HOME.accentWarm} fillOpacity={0.1} />
        ))}
      </svg>

      {/* Small histogram, bottom-left — extends the statistical-diagram
          language of the bell curve / scatter-regression motifs above. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-70 hidden lg:block"
        width="90"
        height="40"
        viewBox="0 0 90 40"
      >
        {HISTOGRAM_BARS.map((v, i) => (
          <rect
            key={i}
            x={i * 10}
            y={40 - (v / 100) * 40}
            width={6}
            height={(v / 100) * 40}
            fill={HOME.accentWarm}
            fillOpacity={0.08}
          />
        ))}
      </svg>

      <div className="relative z-10 w-full px-[8%] sm:px-[15%]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-4" style={{ background: HOME.accentWarm }} />
          <p
            className="text-xs uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-figtree)", color: HOME.textMuted }}
          >
            IUT · Department of Industrial &amp; Production Engineering
          </p>
        </motion.div>

        <h1 className="leading-[0.95]" style={{ fontFamily: "var(--font-cormorant)" }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="block font-semibold"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: HOME.textSecondary }}
          >
            Welcome to
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="block font-bold"
            style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)", color: HOME.textPrimary }}
          >
            IUT IPE
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-7 max-w-120 whitespace-pre-line text-base leading-[1.7] font-light"
          style={{ fontFamily: "var(--font-figtree)", color: HOME.textSecondary }}
        >
          <Typewriter text={PARAGRAPH} speed={30} startDelay={650} onDone={() => setTypedDone(true)} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: typedDone ? 1 : 0, y: typedDone ? 0 : 10 }}
          transition={{ duration: 0.4 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#memories"
            className="rounded-sm px-7 py-3 text-sm font-medium transition-[filter,transform] hover:-translate-y-px hover:brightness-[1.15]"
            style={{ fontFamily: "var(--font-figtree)", background: HOME.accentTeal, color: HOME.textPrimary }}
          >
            Explore Memories
          </a>
          <Link
            href="/curriculum"
            className="rounded-sm border px-7 py-3 text-sm font-medium transition-opacity"
            style={{
              fontFamily: "var(--font-figtree)",
              borderColor: `color-mix(in oklab, ${HOME.accentWarm} 60%, transparent)`,
              color: HOME.accentWarmText,
            }}
          >
            Explore Curriculum
          </Link>
          <Link
            href="/calculator"
            className="rounded-sm border px-7 py-3 text-sm font-medium transition-opacity"
            style={{
              fontFamily: "var(--font-figtree)",
              borderColor: `color-mix(in oklab, ${HOME.accentPurple} 60%, transparent)`,
              color: HOME.accentPurpleText,
            }}
          >
            CGPA Calculator
          </Link>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5"
      >
        <span className="h-10 w-px" style={{ background: HOME.textMuted }} />
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1L6 6L11 1" stroke={HOME.textMuted} strokeWidth={1.4} strokeLinecap="round" />
        </svg>
      </motion.div>
    </section>
  );
}

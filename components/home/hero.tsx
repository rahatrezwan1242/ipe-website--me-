"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { HOME } from "@/lib/home-palette";
import { useTheme } from "@/components/theme-provider";
import { Typewriter } from "./typewriter";

const PARAGRAPH = `A shared space for IPE 25 — memories, milestones, and the people who made them.
This is our story, and it's still being written.`;

export function Hero() {
  const [typedDone, setTypedDone] = useState(false);
  const { theme } = useTheme();

  return (
    <section id="hero" className="relative flex h-dvh shrink-0 snap-start items-center overflow-hidden" style={{ background: HOME.bgBase }}>
      {/* Both theme variants stay mounted and crossfade via opacity — swapping
          `src` outright can't be transitioned and pops instantly on toggle. */}
      <Image
        src="/homepage-hero-bg.webp"
        alt="" fill priority={theme === "dark"} sizes="100vw"
        className="object-cover transition-opacity duration-500 ease-out"
        style={{ opacity: theme === "dark" ? 1 : 0 }}
      />
      <Image
        src="/homepage-hero-bg-light.webp"
        alt="" fill priority={theme === "light"} sizes="100vw"
        className="object-cover transition-opacity duration-500 ease-out"
        style={{ opacity: theme === "light" ? 0.85 : 0 }}
      />
      {/* Dark scrim, heaviest where the headline/paragraph/buttons sit (left side),
          fading out by the right so the image's own detail (robot arm, chart, gauge) stays vivid. */}
      <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(100deg, color-mix(in oklab, ${HOME.bgBase} 94%, transparent) 0%, color-mix(in oklab, ${HOME.bgBase} 86%, transparent) 25%, color-mix(in oklab, ${HOME.bgBase} 55%, transparent) 48%, color-mix(in oklab, ${HOME.bgBase} 15%, transparent) 70%, color-mix(in oklab, ${HOME.bgBase} 5%, transparent) 100%)` }} />

      <div className="relative z-10 w-full px-[8%] sm:px-[15%]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 flex items-center gap-3">
          <span className="h-px w-4" style={{ background: HOME.accentWarm }} />
          <p className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-figtree)", color: HOME.textMuted }}>
            IPE 25 · Industrial &amp; Production Engineering, IUT
          </p>
        </motion.div>

        <h1 className="leading-[0.95]" style={{ fontFamily: "var(--font-cormorant)" }}>
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="block font-semibold" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: HOME.textSecondary }}>
            Welcome to
          </motion.span>
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="block font-bold" style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)", color: HOME.textPrimary }}>
            IPE 25
          </motion.span>
        </h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-7 max-w-120 whitespace-pre-line text-base leading-[1.7] font-light" style={{ fontFamily: "var(--font-figtree)", color: HOME.textSecondary }}>
          <Typewriter text={PARAGRAPH} speed={30} startDelay={650} onDone={() => setTypedDone(true)} />
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: typedDone ? 1 : 0, y: typedDone ? 0 : 10 }} transition={{ duration: 0.4 }} className="mt-10 flex flex-wrap items-center gap-4">
          {/* Light mode: accentTeal reads muddy against a filled button, so this gets its own
              darker navy rather than changing --home-accent-teal (shared with Timeline/
              Representatives/Memories). Text flips light to stay readable; dark mode untouched. */}
          <a href="#memories" className="rounded-sm px-7 py-3 text-sm font-medium transition-[filter,transform] hover:-translate-y-px hover:brightness-[1.15]" style={{ fontFamily: "var(--font-figtree)", background: theme === "light" ? "#0B2340" : HOME.accentTeal, color: theme === "light" ? "#eae7f2" : HOME.textPrimary }}>
            Explore Memories
          </a>
          <Link href="/curriculum" className="rounded-sm border px-7 py-3 text-sm font-medium transition-opacity" style={{ fontFamily: "var(--font-figtree)", borderColor: `color-mix(in oklab, ${HOME.accentWarm} 60%, transparent)`, color: HOME.accentWarmText }}>
            Explore Curriculum
          </Link>
          <Link href="/calculator" className="rounded-sm border px-7 py-3 text-sm font-medium transition-opacity" style={{ fontFamily: "var(--font-figtree)", borderColor: `color-mix(in oklab, ${HOME.accentPurple} 60%, transparent)`, color: HOME.accentPurpleText }}>
            CGPA Calculator
          </Link>
        </motion.div>
      </div>

      <motion.div aria-hidden animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5">
        <span className="h-10 w-px" style={{ background: HOME.textMuted }} />
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1L6 6L11 1" stroke={HOME.textMuted} strokeWidth={1.4} strokeLinecap="round" />
        </svg>
      </motion.div>
    </section>
  );
}

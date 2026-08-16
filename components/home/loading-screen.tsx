"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { HOME } from "@/lib/home-palette";

const SESSION_KEY = "home-loading-seen";
const AUTO_DELAY = 1800;
const EXIT_DURATION = 0.8;
const GATE_EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Full-viewport intro: two panels ("gates") in the page's own background
 * color part down the middle to reveal the hero already sitting beneath
 * them — not a separate loading state that fades into the page, the gates
 * opening *is* the reveal. Shows once per browser session (sessionStorage).
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      return;
    }
    const t = setTimeout(finish, AUTO_DELAY);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setExiting(true);
    setTimeout(() => setVisible(false), EXIT_DURATION * 1000);
  }

  if (!visible) return null;

  return (
    <div
      onClick={finish}
      aria-hidden
      // z-105: HomeNavbar is also z-100 and mounts after this in the DOM, so
      // an equal z-index would let it win the stacking tie and poke through
      // the gates — unlike the old version, this one no longer keeps page
      // content at opacity:0 underneath, so stacking order alone must hide it.
      className="fixed inset-0 z-105 cursor-pointer overflow-hidden"
    >
      <motion.div
        initial={false}
        animate={{ x: exiting ? "-100%" : "0%" }}
        transition={{ duration: EXIT_DURATION, ease: GATE_EASE }}
        className="absolute inset-y-0 left-0 flex w-1/2 justify-end"
        style={{ background: HOME.bgBase }}
      >
        <div
          className="h-full w-px"
          style={{
            background: `linear-gradient(to bottom, transparent, color-mix(in oklab, ${HOME.accentTeal} 50%, transparent), transparent)`,
          }}
        />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ x: exiting ? "100%" : "0%" }}
        transition={{ duration: EXIT_DURATION, ease: GATE_EASE }}
        className="absolute inset-y-0 right-0 flex w-1/2 justify-start"
        style={{ background: HOME.bgBase }}
      >
        <div
          className="h-full w-px"
          style={{
            background: `linear-gradient(to bottom, transparent, color-mix(in oklab, ${HOME.accentWarm} 50%, transparent), transparent)`,
          }}
        />
      </motion.div>

      <motion.div
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4"
      >
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-xs uppercase tracking-[0.3em]"
          style={{ fontFamily: "var(--font-figtree)", color: HOME.textMuted }}
        >
          IUT · Dept. of Industrial &amp; Production Engineering
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="text-5xl font-bold tracking-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-cormorant)", color: HOME.textPrimary }}
        >
          IUT IPE
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 160 }}
          transition={{ duration: 1.1, delay: 0.5, ease: "easeInOut" }}
          className="mt-2 h-px"
          style={{ background: HOME.accentPurple }}
        />
      </motion.div>
    </div>
  );
}

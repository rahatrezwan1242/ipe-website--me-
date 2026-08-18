"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { HOME } from "@/lib/home-palette";

const SESSION_KEY = "home-loading-seen";
const HOLD_DELAY = 1700;
const EXIT_DURATION = 0.55;
const FOCUS_EASE = [0.16, 1, 0.3, 1] as const;
const RULE_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Full-viewport "focus pull" intro, ported from the Claude Design canvas
 * "IPE Intro - 3h Final": the crest and IPE wordmark rack into focus from a
 * blur, a rule draws under them, the subtitle tracks in, then the whole
 * panel defocuses away to reveal the hero already sitting beneath it.
 * Colors come from HOME (the site's actual dusk palette) rather than the
 * mockup's placeholder gold/cream. Shows once per browser session.
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      return;
    }
    if (prefersReducedMotion) {
      finish();
      return;
    }
    const t = setTimeout(finish, HOLD_DELAY);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  function finish() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setExiting(true);
    setTimeout(() => setVisible(false), prefersReducedMotion ? 0 : EXIT_DURATION * 1000);
  }

  if (!visible) return null;

  return (
    <motion.div
      onClick={finish}
      aria-hidden
      animate={exiting ? { opacity: 0, filter: "blur(14px)", scale: 1.04 } : { opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : EXIT_DURATION, ease: "easeOut" }}
      // z-105: HomeNavbar is also z-100 and mounts after this in the DOM, so an equal
      // z-index would let it win the stacking tie and poke through — stacking order
      // alone must hide it since content underneath is never kept at opacity:0.
      className="fixed inset-0 z-105 flex cursor-pointer flex-col items-center justify-center gap-7.5"
      style={{ background: HOME.bgBase }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(52% 58% at 50% 46%, color-mix(in oklab, ${HOME.accentWarm} 16%, transparent), transparent 70%)` }}
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, filter: "blur(18px)", scale: 1.1 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.06, ease: FOCUS_EASE }}
        className="relative h-18 w-18 sm:h-20.5 sm:w-20.5"
      >
        <Image src="/ipe-logo.png" alt="IUT IPE crest" fill priority sizes="82px" className="object-contain" />
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, filter: "blur(18px)", scale: 1.1 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.62, delay: prefersReducedMotion ? 0 : 0.14, ease: FOCUS_EASE }}
        className="font-light leading-none"
        style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(60px, 9vw, 132px)", letterSpacing: "0.14em", textIndent: "0.14em", color: HOME.textPrimary }}
      >
        IPE 25
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { width: 0 }}
        animate={{ width: 380 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: prefersReducedMotion ? 0 : 0.5, ease: RULE_EASE }}
        className="h-px max-w-[70vw]"
        style={{ background: `color-mix(in oklab, ${HOME.accentWarm} 70%, transparent)` }}
      />

      <motion.p
        initial={prefersReducedMotion ? false : { opacity: 0, letterSpacing: "0.62em" }}
        animate={{ opacity: 1, letterSpacing: "0.34em" }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: prefersReducedMotion ? 0 : 0.66, ease: "easeOut" }}
        className="m-0 text-center text-[13px] uppercase"
        style={{ fontFamily: "var(--font-figtree)", color: HOME.textMuted }}
      >
        Industrial &amp; Production Engineering
      </motion.p>
    </motion.div>
  );
}

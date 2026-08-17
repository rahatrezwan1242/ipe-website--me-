"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { HOME } from "@/lib/home-palette";
import { Typewriter } from "./typewriter";

const SESSION_KEY = "home-loading-seen";
const AUTO_DELAY = 2600;
const EXIT_DURATION = 0.8;
const BOOT_TEXT = "booting IUT · IPE environment...";

/**
 * Full-viewport intro styled as a terminal boot line: a monospace prompt
 * types itself out, a blue "OK" confirms once it lands (reusing the site's
 * existing blue = success/valid semantic — see CLAUDE.md palette notes),
 * then the official crest (public/ipe-logo.png) fades in beneath it. Holds
 * briefly, then the whole panel fades away to reveal the hero already
 * sitting beneath it. Shows once per browser session (sessionStorage).
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [booted, setBooted] = useState(false);

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
    <motion.div
      onClick={finish}
      aria-hidden
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: EXIT_DURATION }}
      // z-105: HomeNavbar is also z-100 and mounts after this in the DOM, so an equal
      // z-index would let it win the stacking tie and poke through — stacking order
      // alone must hide it since content underneath is never kept at opacity:0.
      className="fixed inset-0 z-105 flex cursor-pointer flex-col items-center justify-center gap-6"
      style={{ background: HOME.bgBase, fontFamily: "var(--font-jetbrains)" }}
    >
      <p className="text-sm tracking-wide sm:text-base">
        <span style={{ color: HOME.textMuted }}>&gt;&nbsp;</span>
        <span style={{ color: HOME.textSecondary }}><Typewriter text={BOOT_TEXT} speed={22} onDone={() => setBooted(true)} /></span>
        {booted && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.15 }} className="ml-2 font-semibold" style={{ color: HOME.accentTeal }}>
            OK
          </motion.span>
        )}
      </p>

      {booted && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}>
          <Image src="/ipe-logo.png" alt="IUT IPE crest" width={640} height={640} priority className="h-24 w-24 object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)] sm:h-32 sm:w-32" />
        </motion.div>
      )}
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { HOME } from "@/lib/home-palette";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#memories", label: "Memories" },
  { href: "#timeline", label: "Timeline" },
  { href: "#representatives", label: "Representatives" },
];

export function HomeNavbar() {
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > window.innerHeight - 56);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="top"
      className="fixed inset-x-0 top-0 z-100 backdrop-blur-xl transition-colors duration-300"
      style={{
        background: pastHero ? `color-mix(in oklab, ${HOME.bgBase} 98%, transparent)` : `color-mix(in oklab, ${HOME.bgBase} 90%, transparent)`,
        borderBottom: `1px solid color-mix(in oklab, ${HOME.border} 50%, transparent)`,
      }}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <Image src="/iut-logo.png" alt="IUT logo" width={36} height={36} priority className="h-9 w-9 rounded-lg border object-contain" style={{ borderColor: `color-mix(in oklab, ${HOME.border} 60%, transparent)` }} />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-tight" style={{ fontFamily: "var(--font-cormorant)", color: HOME.textPrimary }}>IUT · IPE</p>
            <p className="font-mono text-[8px] uppercase tracking-[.22em]" style={{ color: HOME.textMuted }}>Industrial &amp; Production Engineering</p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-xs font-medium transition-colors"
              style={{ fontFamily: "var(--font-figtree)", color: HOME.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = HOME.textPrimary;
                e.currentTarget.style.background = `color-mix(in oklab, ${HOME.border} 25%, transparent)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = HOME.textSecondary;
                e.currentTarget.style.background = "transparent";
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/curriculum"
            className="hidden items-center rounded-full border px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80 sm:inline-flex"
            style={{ fontFamily: "var(--font-figtree)", borderColor: `color-mix(in oklab, ${HOME.accentWarm} 60%, transparent)`, background: `color-mix(in oklab, ${HOME.accentWarm} 8%, transparent)`, color: HOME.accentWarm }}
          >
            Curriculum
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border md:hidden"
            style={{ borderColor: `color-mix(in oklab, ${HOME.border} 60%, transparent)`, color: HOME.textPrimary }}
            onClick={() => setOpen((v) => !v)}
            aria-label="menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t md:hidden" style={{ borderColor: `color-mix(in oklab, ${HOME.border} 50%, transparent)` }}>
            <div className="mx-auto max-w-7xl px-5 py-3">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm" style={{ color: HOME.textSecondary }}>
                  {l.label}
                </a>
              ))}
              <Link href="/curriculum" onClick={() => setOpen(false)} className="mt-1 block rounded-lg px-3 py-3 text-sm font-semibold" style={{ color: HOME.accentWarm }}>
                Curriculum
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

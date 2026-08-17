import Link from "next/link";

import { HOME } from "@/lib/home-palette";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/calculator", label: "Calculator" },
];

export function HomeFooter() {
  return (
    <footer className="px-6 py-12 sm:px-10" style={{ background: HOME.bgBase }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p style={{ fontFamily: "var(--font-cormorant)", fontWeight: 700, fontSize: 28, color: HOME.textPrimary }}>IUT IPE</p>
            <p className="mt-1 text-xs" style={{ fontFamily: "var(--font-figtree)", color: HOME.textMuted }}>
              Department of Industrial &amp; Production Engineering
            </p>
          </div>

          <nav className="flex items-center gap-6">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} className="text-[13px] transition-colors" style={{ fontFamily: "var(--font-figtree)", color: HOME.textSecondary }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 text-xs" style={{ borderTop: `1px solid ${HOME.border}`, fontFamily: "var(--font-figtree)", color: HOME.textMuted }}>
          <p>© {new Date().getFullYear()} IUT IPE</p>
        </div>
      </div>
    </footer>
  );
}

import { Link2, Mail, Phone } from "lucide-react";

import { HOME } from "@/lib/home-palette";

// Add real names/roles/contacts here once available.
const REPS: { name: string; role: string }[] = [];

export function Representatives() {
  return (
    <section id="representatives" className="px-6 py-24 sm:px-10" style={{ background: HOME.bgSurface }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-figtree)", color: HOME.textMuted }}>— Connect</p>
          <h2 className="mt-2" style={{ fontFamily: "var(--font-dm-serif)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: HOME.textPrimary }}>Class Representatives</h2>
          <p className="mt-2 text-sm" style={{ fontFamily: "var(--font-figtree)", color: HOME.textSecondary }}>
            {REPS.length > 0 ? "Reach out to the people who represent us." : "Coming soon."}
          </p>
        </div>

        {REPS.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {REPS.map((rep, i) => (
              <div key={i} className="w-70 rounded-lg border px-6 py-8 text-center" style={{ background: HOME.bgCard, borderColor: HOME.border }}>
                <div className="mx-auto grid h-18 w-18 place-items-center rounded-full" style={{ background: `color-mix(in oklab, ${HOME.accentTeal} 20%, transparent)`, border: `2px solid color-mix(in oklab, ${HOME.accentTeal} 40%, transparent)` }}>
                  <span style={{ fontFamily: "var(--font-dm-serif)", fontSize: 22, color: HOME.textPrimary }}>
                    {rep.name === "[Name]" ? "?" : rep.name.charAt(0)}
                  </span>
                </div>
                <p className="mt-4" style={{ fontFamily: "var(--font-dm-serif)", fontSize: 20, color: HOME.textPrimary }}>{rep.name}</p>
                <p className="mt-1 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-figtree)", color: HOME.accentWarm }}>{rep.role}</p>
                <div className="mt-5 flex items-center justify-center gap-4">
                  {[Link2, Phone, Mail].map((Icon, idx) => (
                    <span key={idx} aria-disabled title="Contact info coming soon" className="cursor-not-allowed" style={{ color: HOME.textMuted, opacity: 0.6 }}>
                      <Icon className="h-4 w-4" />
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

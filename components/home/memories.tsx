"use client";

import { useMemo, useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { HOME } from "@/lib/home-palette";
import { MEMORY_FILES } from "@/data/batch";

function parseMemoryFilename(filename: string) {
  const base = filename.replace(/\.[^.]+$/, "");
  const parts = base.split("_");
  const year = parts.at(-1) ?? "";
  const month = parts.at(-2) ?? "01";
  const occasion = parts.slice(0, -2).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const monthName = new Date(`${year}-${month}-01`).toLocaleString("default", { month: "long" });
  return { occasion, date: `${monthName} ${year}`, year };
}

const MEMORIES = MEMORY_FILES.map((f) => ({ file: f, ...parseMemoryFilename(f) }));

export function Memories() {
  const [year, setYear] = useState<string>("All");
  const scrollerRef = useRef<HTMLDivElement>(null);

  const years = useMemo(() => ["All", ...Array.from(new Set(MEMORIES.map((m) => m.year))).sort()], []);
  const filtered = useMemo(() => (year === "All" ? MEMORIES : MEMORIES.filter((m) => m.year === year)), [year]);

  function scrollBy(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  }

  return (
    <section id="memories" className="flex h-screen shrink-0 snap-start flex-col justify-center px-6 sm:px-10" style={{ background: HOME.bgSurface }}>
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-figtree)", color: HOME.textMuted }}>— Our Journey</p>
            <h2 className="mt-2 font-normal" style={{ fontFamily: "var(--font-dm-serif)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: HOME.textPrimary }}>Memories</h2>
            <p className="mt-2 text-sm" style={{ fontFamily: "var(--font-figtree)", color: HOME.textSecondary }}>
              {MEMORIES.length > 0 ? "Hover over a photo to see the occasion." : "Photos coming soon."}
            </p>
          </div>

          {MEMORIES.length > 0 && (
            <div className="flex items-center gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className="rounded-full border px-3 py-1 text-xs transition-colors"
                  style={{
                    fontFamily: "var(--font-jetbrains)",
                    background: y === year ? HOME.accentTeal : "transparent",
                    borderColor: y === year ? HOME.accentTeal : HOME.border,
                    color: y === year ? HOME.textPrimary : HOME.textMuted,
                  }}
                  onMouseEnter={(e) => {
                    if (y === year) return;
                    e.currentTarget.style.borderColor = HOME.accentTeal;
                    e.currentTarget.style.color = HOME.textSecondary;
                  }}
                  onMouseLeave={(e) => {
                    if (y === year) return;
                    e.currentTarget.style.borderColor = HOME.border;
                    e.currentTarget.style.color = HOME.textMuted;
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>

        {MEMORIES.length > 0 && (
          <div className="relative mt-10">
            <button type="button" aria-label="Scroll left" onClick={() => scrollBy(-1)} className="absolute top-1/2 -left-4 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border transition-colors sm:grid" style={{ background: HOME.bgCard, borderColor: HOME.border, color: HOME.textSecondary }}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Scroll right" onClick={() => scrollBy(1)} className="absolute top-1/2 -right-4 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border transition-colors sm:grid" style={{ background: HOME.bgCard, borderColor: HOME.border, color: HOME.textSecondary }}>
              <ChevronRight className="h-4 w-4" />
            </button>

            <div ref={scrollerRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
              {filtered.map((m) => (
                <div key={m.file} className={cn("relative flex shrink-0 flex-col items-center justify-center gap-3 overflow-hidden rounded-md border", "h-45 w-65 sm:h-60 sm:w-85")} style={{ background: HOME.bgSurface, borderColor: HOME.border }}>
                  <Camera className="h-6 w-6" strokeWidth={1.5} style={{ color: HOME.textMuted }} />
                  <div className="text-center">
                    <p style={{ fontFamily: "var(--font-dm-serif)", fontSize: 20, color: HOME.textPrimary }}>{m.occasion}</p>
                    <p className="mt-1 text-[13px]" style={{ fontFamily: "var(--font-figtree)", color: HOME.textSecondary }}>{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

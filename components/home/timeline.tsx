"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

import { cn } from "@/lib/utils";
import { HOME } from "@/lib/home-palette";
import { TIMELINE_EVENTS, type TimelineEvent as Event } from "@/data/batch";

const EVENTS = TIMELINE_EVENTS;

const SPINE_GRADIENT = `repeating-linear-gradient(to bottom, ${HOME.accentTeal} 0px, ${HOME.accentTeal} 8px, transparent 8px, transparent 16px)`;

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function PhotoCell({ label }: { label: string }) {
  return (
    <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-sm border" style={{ background: HOME.bgSurface, borderColor: HOME.border }}>
      <div className="flex flex-col items-center gap-1.5">
        <Camera className="h-6 w-6" strokeWidth={1.5} style={{ color: HOME.textMuted }} />
        <span className="text-[10px]" style={{ fontFamily: "var(--font-figtree)", color: HOME.textMuted }}>{label}</span>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <div className="overflow-hidden rounded-md border" style={{ borderColor: HOME.border }}>
      <div className="px-5 py-3.5 text-center" style={{ background: `color-mix(in oklab, ${HOME.accentTeal} 18%, transparent)`, borderBottom: `1px solid ${HOME.border}` }}>
        <span style={{ fontFamily: "var(--font-dm-serif)", fontSize: 22, color: HOME.textPrimary, letterSpacing: "0.01em" }}>{event.title}</span>
        {event.description && (
          <p className="mt-1.5 text-sm font-light" style={{ fontFamily: "var(--font-figtree)", color: HOME.textSecondary }}>{event.description}</p>
        )}
      </div>
      {event.photos && (
        <div className="grid gap-3 p-4" style={{ background: HOME.bgCard, gridTemplateColumns: event.photos.length === 1 ? "1fr" : "1fr 1fr" }}>
          {event.photos.map((label, i) => <PhotoCell key={i} label={label} />)}
        </div>
      )}
    </div>
  );
}

function DateLabel({ date, align }: { date: string; align: "left" | "right" }) {
  return (
    <span
      className={cn("hidden text-xs md:inline-block", align === "left" ? "text-left" : "text-right")}
      style={{ fontFamily: "var(--font-jetbrains)", fontWeight: 500, letterSpacing: "0.04em", color: HOME.textSecondary, opacity: 0.85 }}
    >
      {date}
    </span>
  );
}

function Node() {
  return (
    <div className="relative grid h-7 w-7 shrink-0 place-items-center">
      <span className="absolute inset-0 rounded-full" style={{ border: `1.5px dashed ${HOME.accentTeal}`, opacity: 0.6 }} />
      <span className="h-3 w-3 rounded-full" style={{ background: HOME.accentTeal, border: `2px solid ${HOME.bgBase}` }} />
    </div>
  );
}

function TimelineEvent({ event, index }: { event: Event; index: number }) {
  const isLeft = index % 2 === 0; // 1-indexed odd -> left
  const { ref, inView } = useInView<HTMLDivElement>();

  const reveal = cn(
    "transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
    inView ? "opacity-100 translate-x-0" : "opacity-0",
    !inView && (isLeft ? "-translate-x-8" : "translate-x-8"),
  );

  return (
    <div ref={ref} className="mb-14 md:mb-18">
      {/* Mobile: single column, spine on the left */}
      <div className="flex gap-4 md:hidden">
        <div className="flex flex-col items-center pt-1"><Node /></div>
        <div className={cn("min-w-0 flex-1", reveal)}>
          <span className="mb-1.5 block text-xs" style={{ fontFamily: "var(--font-jetbrains)", color: HOME.textSecondary, opacity: 0.85 }}>{event.date}</span>
          <EventCard event={event} />
        </div>
      </div>

      {/* Desktop: alternating left/right, node centered */}
      <div className="hidden grid-cols-[1fr_56px_1fr] items-start md:grid">
        {isLeft ? (
          <div className={cn("justify-self-end", reveal)} style={{ width: "100%", maxWidth: 520 }}>
            <EventCard event={event} />
          </div>
        ) : (
          <div className="flex justify-end pt-3"><DateLabel date={event.date} align="right" /></div>
        )}

        <div className="flex flex-col items-center pt-1"><Node /></div>

        {isLeft ? (
          <div className="flex justify-start pt-3"><DateLabel date={event.date} align="left" /></div>
        ) : (
          <div className={cn("justify-self-start", reveal)} style={{ width: "100%", maxWidth: 520 }}>
            <EventCard event={event} />
          </div>
        )}
      </div>
    </div>
  );
}

export function Timeline() {
  return (
    <section id="timeline" className="px-6 py-24 sm:px-10" style={{ background: HOME.bgBase }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-figtree)", color: HOME.textMuted }}>— Milestones</p>
          <h2 className="mt-2" style={{ fontFamily: "var(--font-dm-serif)", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: HOME.textPrimary }}>Our Timeline</h2>
          <p className="mt-2 text-sm" style={{ fontFamily: "var(--font-figtree)", color: HOME.textSecondary }}>
            {EVENTS.length > 0 ? "Key events from our journey so far." : "Timeline coming soon."}
          </p>
        </div>

        {EVENTS.length > 0 && (
          <div className="relative">
            <div aria-hidden className="absolute top-0 bottom-0 hidden w-0.5 -translate-x-1/2 md:left-1/2 md:block" style={{ background: SPINE_GRADIENT }} />
            <div aria-hidden className="absolute top-0 bottom-0 left-3.25 w-0.5 md:hidden" style={{ background: SPINE_GRADIENT }} />
            {EVENTS.map((event, i) => <TimelineEvent key={event.title} event={event} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}

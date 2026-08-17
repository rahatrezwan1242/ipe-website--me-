"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Braces, ChevronDown, Download, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { curriculum } from "@/lib/curriculum";

function downloadJson() {
  const blob = new Blob([JSON.stringify(curriculum, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "IPE-curriculum.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function DownloadCurriculum() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border border-foreground/30 bg-foreground/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-background transition-colors sm:gap-1.5 sm:rounded-md sm:px-3 sm:py-1.5 sm:text-xs sm:normal-case sm:tracking-normal",
          "hover:bg-foreground hover:text-background",
        )}
      >
        <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="hidden sm:inline">Download curriculum</span>
        <span className="sm:hidden">Download</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform sm:h-3.5 sm:w-3.5", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute right-0 z-30 mt-1.5 w-64 overflow-hidden rounded-md border border-border bg-popover/95 p-1 text-sm shadow-xl backdrop-blur"
          >
            <a href="/curriculum/print" target="_blank" rel="noopener noreferrer" role="menuitem" onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-sm px-3 py-2 transition-colors hover:bg-muted/60">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-course-lab" />
              <span className="flex-1">
                <span className="block font-medium text-foreground">Print / Save as PDF</span>
                <span className="block text-[11px] text-muted-foreground">Opens a print-ready summary of all 8 semesters</span>
              </span>
            </a>
            <button type="button" role="menuitem" onClick={() => { downloadJson(); setOpen(false); }} className="flex w-full items-start gap-3 rounded-sm px-3 py-2 text-left transition-colors hover:bg-muted/60">
              <Braces className="mt-0.5 h-4 w-4 shrink-0 text-course-major" />
              <span className="flex-1">
                <span className="block font-medium text-foreground">Download as JSON</span>
                <span className="block text-[11px] text-muted-foreground">Structured data for analysis or import</span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

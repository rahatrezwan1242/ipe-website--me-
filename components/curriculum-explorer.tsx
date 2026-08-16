"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { CollapseStackProvider } from "./collapse-stack";
import { CurriculumTree } from "./curriculum-tree";
import { CurriculumBreakdown } from "./curriculum-breakdown";

const VIEWS = [
  { key: "tree", label: "By year" },
  { key: "breakdown", label: "By category" },
] as const;

type ViewKey = (typeof VIEWS)[number]["key"];

export function CurriculumExplorer() {
  const [view, setView] = useState<ViewKey>("tree");

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 p-1">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition",
              view === v.key
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      <CollapseStackProvider>
        {view === "tree" ? <CurriculumTree /> : <CurriculumBreakdown />}
      </CollapseStackProvider>
    </div>
  );
}

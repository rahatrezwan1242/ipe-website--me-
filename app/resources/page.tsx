import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, FileSpreadsheet, Gauge, GraduationCap, LineChart, type LucideIcon, Wrench } from "lucide-react";

type ResourceItem = {
  n: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
  href: string | null;
  cta: string;
};

const items: ResourceItem[] = [
  { n: "01", title: "Study systems", desc: "Notes, formula sheets, past questions and semester‑wise study guides.", Icon: BookOpen, href: null, cta: "Coming soon" },
  { n: "02", title: "Data & analytics", desc: "Excel, Python, SQL, statistics and visualization resources for IPE students.", Icon: LineChart, href: "https://pandas.pydata.org/", cta: "Open analytics library" },
  { n: "03", title: "Operations toolkit", desc: "OR models, optimization, forecasting, inventory and production planning references.", Icon: Gauge, href: "https://ocw.mit.edu/courses/15-053-optimization-methods-fall-2013/", cta: "Open operations library" },
  { n: "04", title: "Engineering tools", desc: "CAD, simulation, quality and manufacturing software learning paths.", Icon: Wrench, href: "https://www.autodesk.com/education/", cta: "Open tools library" },
  { n: "05", title: "Templates", desc: "CV, report, presentation, project documentation and research templates.", Icon: FileSpreadsheet, href: "https://www.canva.com/templates/", cta: "Open templates" },
  { n: "06", title: "Career & projects", desc: "Internship preparation, project ideas, research directions and portfolio guidance.", Icon: GraduationCap, href: "https://www.linkedin.com/learning/", cta: "Open career resources" },
];

export default function Resources(){
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5"/> Back home</Link>

      <div className="mt-12 max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[.28em] text-accent">IPE toolkit</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight text-foreground">Resources that<br/><span className="text-muted-foreground">actually help.</span></h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">A structured library for the things you repeatedly need throughout an IPE degree.</p>
      </div>

      <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ n, title, desc, Icon, href, cta }) => {
          const cardClass = "group rounded-2xl border border-border bg-card p-6 transition";
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-accent"/>
                <span className="font-mono text-[9px] text-muted-foreground/50">{n}</span>
              </div>
              <h2 className="mt-10 font-semibold text-foreground">{title}</h2>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{desc}</p>
              <div className={`mt-6 inline-flex items-center gap-1 text-xs font-semibold ${href ? "text-accent" : "text-muted-foreground/60"}`}>
                {cta} {href && <ArrowUpRight className="ml-1 inline h-3.5 w-3.5"/>}
              </div>
            </>
          );

          if (!href) {
            return (
              <div key={n} className={`${cardClass} cursor-not-allowed opacity-60`} aria-disabled="true">
                {inner}
              </div>
            );
          }

          return (
            <Link key={n} href={href} target="_blank" rel="noopener noreferrer" className={`${cardClass} hover:-translate-y-1 hover:border-accent/30`}>
              {inner}
            </Link>
          );
        })}
      </div>
    </main>
  );
}

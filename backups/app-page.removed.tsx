import Link from "next/link";
import { ArrowUpRight, BarChart3, BookOpen, Factory, GraduationCap, Layers3, Users, Wrench, CalendarDays } from "lucide-react";

const stats = [
  ["08", "Semesters"], ["165+", "Credit hours"], ["07", "Core domains"], ["34", "Batch"],
];

const features = [
  { icon: BookOpen, title: "Study systems", text: "Notes, formula sheets, past questions and semester‑wise study guides.", href: "/resources", cta: "Coming soon" },
  { icon: BarChart3, title: "Data & analytics", text: "Excel, Python, SQL, statistics and visualization resources for IPE students.", href: "https://pandas.pydata.org/", cta: "Open analytics library" },
  { icon: Layers3, title: "Operations toolkit", text: "OR models, optimization, forecasting, inventory and production planning references.", href: "https://ocw.mit.edu/courses/15-053-optimization-methods-fall-2013/", cta: "Open operations library" },
  { icon: Wrench, title: "Engineering tools", text: "CAD, simulation, quality and manufacturing software learning paths.", href: "https://www.autodesk.com/education/", cta: "Open tools library" },
  { icon: CalendarDays, title: "Templates", text: "CV, report, presentation, project documentation and research templates.", href: "https://www.canva.com/templates/", cta: "Open templates" },
  { icon: GraduationCap, title: "Career & projects", text: "Internship preparation, project ideas, research directions and portfolio guidance.", href: "https://www.linkedin.com/learning/", cta: "Open career resources" },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[11px] uppercase tracking-[.22em] text-[#d9a441]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d9a441] shadow-[0_0_12px_#d9a441]" />
            IUT · Industrial & Production Engineering
          </div>
          <p className="mb-4 font-mono text-xs tracking-[.28em] text-white/40">B.Sc. ENGINEERING · BATCH 34</p>
          <h1 className="max-w-4xl text-6xl font-semibold leading-[.92] tracking-[-.055em] text-white sm:text-7xl lg:text-[7.5rem]">
            Design the
            <span className="block text-[#d9a441]">system.</span>
            Improve the world.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
            A digital home for IPE at the Islamic University of Technology — combining academics, people, projects, tools and the moments that make a batch.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/curriculum" className="group inline-flex items-center gap-2 rounded-full bg-[#d9a441] px-5 py-3 text-sm font-semibold text-[#0a0b0e] transition hover:gap-3 hover:bg-[#e8bd5d]">
              Explore IPE <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/calculator" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/4 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/8">
              Open GPA Studio
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-130">
          <div className="absolute -inset-10 rounded-full bg-[#d9a441]/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-[#101319]/90 p-4 shadow-2xl">
            <div className="rounded-[1.4rem] border border-white/10 bg-[#0b0d11] p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[.25em] text-white/35">Department profile</p>
                  <p className="mt-1 text-xl font-semibold">Industrial & Production Engineering</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#d9a441]/30 bg-[#d9a441]/10 text-[#d9a441]">
                  <Factory className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {[
                  ["Manufacturing", "Systems"],
                  ["Operations", "Analytics"],
                  ["Quality", "Optimization"],
                  ["Supply Chain", "Human Factors"],
                ].map(([a,b]) => (
                  <div key={a} className="rounded-xl border border-white/8 bg-white/2.5 p-4">
                    <p className="text-sm font-medium">{a}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#d9a441]/70">{b}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-[#d9a441]/15 bg-[#d9a441]/4.5 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/45">Systems thinking</span>
                  <span className="font-mono text-[#d9a441]">∞</span>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[82%] rounded-full bg-[#d9a441]" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/10 bg-[#15181e] px-4 py-3 shadow-xl">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/35">IUT</p>
            <p className="text-sm font-semibold">Engineering for impact</p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/1.8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/8 sm:grid-cols-4">
          {stats.map(([value,label]) => <div key={label} className="px-5 py-7 sm:px-8"><p className="text-3xl font-semibold tracking-tight text-white">{value}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-[.18em] text-white/35">{label}</p></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.28em] text-[#d9a441]">IPE Toolkit</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Resources that actually help.</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">A structured library of notes, tools and references you repeatedly need throughout an IPE degree at IUT.</p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/40">Browse curated categories — study systems, analytics, operations, engineering tools, templates and career guidance.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {features.map(({icon:Icon,title,text,href,cta},i) => <Link key={title} href={href} className="group relative overflow-hidden rounded-2xl border border-white/9 bg-[#101319] p-7 transition hover:-translate-y-1 hover:border-[#d9a441]/35">
            <span className="absolute right-6 top-6 font-mono text-[10px] text-white/15">0{i+1}</span>
            <div className="mb-10 grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/3.5 text-[#d9a441]"><Icon className="h-5 w-5" /></div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/40">{text}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#d9a441]">{cta} <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
          </Link>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="overflow-hidden rounded-4xl border border-white/9 bg-[#101319]">
          <div className="grid lg:grid-cols-[1fr_1.3fr]">
            <div className="p-8 sm:p-12">
              <p className="font-mono text-[10px] uppercase tracking-[.28em] text-[#d9a441]">What makes IPE different?</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">People, process, technology.</h2>
              <p className="mt-5 text-sm leading-7 text-white/40">IPE sits at the intersection of engineering, management and data. This site is designed around that same intersection.</p>
            </div>
            <div className="grid grid-cols-2 border-t border-white/8 lg:border-l lg:border-t-0">
              {[
                [Layers3,"Systems","See the whole system, not one machine."],
                [Wrench,"Engineering","Turn constraints into better processes."],
                [Users,"People","Design work around humans."],
                [GraduationCap,"Learning","Build skills beyond the syllabus."],
              ].map(([Icon,title,text]) => <div key={String(title)} className="border-b border-white/8 p-7 last:border-b-0 even:border-l lg:nth-[3]:border-b-0"><Icon className="h-5 w-5 text-[#d9a441]" /><p className="mt-8 font-semibold text-white">{String(title)}</p><p className="mt-2 text-xs leading-5 text-white/35">{String(text)}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="ai" className="border-t border-white/8 bg-[#0b0d11]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-20 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div><p className="font-mono text-[10px] uppercase tracking-[.28em] text-[#d9a441]">Coming together</p><h2 className="mt-3 text-3xl font-semibold text-white">Your IPE dashboard, not just a website.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">Add announcements, batch directory, faculty profiles, project showcase, events, notices and an AI academic assistant as the department grows.</p></div>
          <Link href="/about" className="shrink-0 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white hover:bg-white/5">See the vision <ArrowUpRight className="ml-1 inline h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}

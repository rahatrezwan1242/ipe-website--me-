import Link from "next/link";
import { ArrowLeft, BookOpen, Factory, FlaskConical, GitBranch } from "lucide-react";
import { DownloadCurriculum } from "@/components/download-curriculum";
import { CurriculumExplorer } from "@/components/curriculum-explorer";

export default function CurriculumPage() {
 return <main className="curriculum-accent mx-auto w-full max-w-7xl px-5 py-16 lg:px-8">
  <div className="mb-10 flex items-center justify-between gap-4">
    <Link href="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5"/> Back home</Link>
    <DownloadCurriculum />
  </div>
  <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
   <div className="lg:sticky lg:top-28 lg:h-fit">
    <p className="font-mono text-[10px] uppercase tracking-[.28em] text-course-theory">The IPE roadmap</p>
    <h1 className="mt-3 text-5xl font-semibold tracking-tight text-foreground">Four years.<br/><span className="text-muted-foreground">One system.</span></h1>
    <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">Explore the academic journey from engineering fundamentals to operations, analytics, manufacturing and the final industrial project.</p>
    <div className="mt-8 grid grid-cols-2 gap-2">
      <div className="rounded-xl border border-border bg-foreground/2.5 p-4">
      <Factory className="h-4 w-4 text-course-major"/><p className="mt-5 text-xs text-muted-foreground">Manufacturing</p></div>
      <div className="rounded-xl border border-border bg-foreground/2.5 p-4"><GitBranch className="h-4 w-4 text-course-theory"/><p className="mt-5 text-xs text-muted-foreground">Operations</p></div>
      <div className="rounded-xl border border-border bg-foreground/2.5 p-4"><FlaskConical className="h-4 w-4 text-course-major"/><p className="mt-5 text-xs text-muted-foreground">Optimization</p></div>
      <div className="rounded-xl border border-border bg-foreground/2.5 p-4"><BookOpen className="h-4 w-4 text-course-theory"/><p className="mt-5 text-xs text-muted-foreground">Analytics</p></div>
    </div>
   </div>
   <CurriculumExplorer />
  </div>
 </main>
}

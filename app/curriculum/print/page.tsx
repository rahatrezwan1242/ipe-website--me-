"use client";

import Link from "next/link";
import { curriculum } from "@/lib/curriculum";

const TOTAL_CREDITS = curriculum.semesters.reduce((sum, s) => sum + s.total_credits, 0);

export default function CurriculumPrintPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-white px-6 py-10 text-black print:max-w-none print:p-0">
      <div className="print:hidden mb-6 flex items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <Link href="/curriculum" className="text-sm text-neutral-500 hover:text-black">&larr; Back to curriculum</Link>
        <button type="button" onClick={() => window.print()} className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800">
          Print / Save as PDF
        </button>
      </div>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider text-neutral-500">Islamic University of Technology</p>
        <h1 className="mt-1 text-2xl font-semibold">{curriculum.program}</h1>
        <p className="mt-1 text-sm text-neutral-600">
          8 semesters &middot; {TOTAL_CREDITS.toFixed(2)} total credit hours &middot; {curriculum.optional_credits.toFixed(0)} elective credits
        </p>
        <p className="mt-3 text-xs leading-relaxed text-neutral-500">
          Unofficial, student-compiled summary based on the department&apos;s program structure. Course offerings and credit hours can be
          revised &mdash; verify against the current official syllabus for your admission year before making academic decisions.
        </p>
      </header>

      {curriculum.semesters.map((sem, i) => (
        <section key={sem.name} className="mb-8 break-inside-avoid-page">
          <h2 className="mb-2 flex items-baseline justify-between border-b-2 border-black pb-1 text-base font-semibold">
            <span>Semester {i + 1} &mdash; {sem.name}</span>
            <span className="text-sm font-normal text-neutral-600">{sem.total_credits.toFixed(2)} credits</span>
          </h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-neutral-500">
                <th className="w-24 border-b border-neutral-300 py-1 pr-2">Code</th>
                <th className="border-b border-neutral-300 py-1 pr-2">Course title</th>
                <th className="w-20 border-b border-neutral-300 py-1 pr-2">Type</th>
                <th className="w-16 border-b border-neutral-300 py-1 text-right">Credits</th>
              </tr>
            </thead>
            <tbody>
              {sem.courses.map((c) => (
                <tr key={c.code} className="align-top">
                  <td className="border-b border-neutral-100 py-1 pr-2 font-mono text-[11px]">{c.code}</td>
                  <td className="border-b border-neutral-100 py-1 pr-2">{c.title}</td>
                  <td className="border-b border-neutral-100 py-1 pr-2 text-neutral-600">{c.course_type ?? "—"}</td>
                  <td className="border-b border-neutral-100 py-1 text-right">{c.credits.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <footer className="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
        IUT &middot; Industrial &amp; Production Engineering. Generated from the curriculum data used by this site&apos;s GPA calculator.
      </footer>
    </main>
  );
}

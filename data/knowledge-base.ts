import { curriculum } from "@/lib/curriculum";
import { TIMELINE_EVENTS, CLASS_REPS } from "@/data/batch";

/**
 * Grounding source for the IPE 25 assistant (components/department-assistant.tsx,
 * app/api/assistant/route.ts). It answers about two things: IPE 25 itself (`about`,
 * `timeline`, `representatives`) and department reference facts that are still useful
 * to the batch (`faculty`, `courses`, `notices`, `labs`, `admission`, `contact`).
 *
 * `courses` is derived from data/contents.json (the curriculum source of truth — see
 * lib/curriculum.ts); `timeline`/`representatives` are derived from data/batch.ts (the
 * same arrays the homepage's Timeline/Representatives sections render) — neither is
 * hand-entered here, so this file never holds a second, driftable copy of that data.
 * Everything else here IS hand-entered department data — replace the PLACEHOLDER
 * entries with real information before this feature goes live.
 *
 * Every hand-entered record carries `isPlaceholder: true` so the system prompt (and,
 * if useful later, the UI) can tell placeholder data from the real thing at a glance.
 * `timeline`/`representatives` aren't individually flagged since they're real-or-empty,
 * not placeholder text — an empty array just means that content hasn't been added yet.
 */

export interface FacultyMember {
  name: string;
  designation: string;
  email?: string;
  researchAreas?: string[];
  isPlaceholder: true;
}

export interface Notice {
  title: string;
  date: string;
  summary: string;
  isPlaceholder: true;
}

export interface Lab {
  name: string;
  description: string;
  location?: string;
  isPlaceholder: true;
}

export interface AdmissionInfo {
  overview: string;
  eligibility: string[];
  applicationWindow?: string;
  isPlaceholder: true;
}

export interface ContactInfo {
  departmentEmail: string;
  departmentPhone: string;
  officeLocation: string;
  officeHours: string;
  isPlaceholder: true;
}

export interface AboutInfo {
  summary: string;
  headOfDepartment?: string;
  isPlaceholder: true;
}

export interface KBCourse {
  code: string;
  title: string;
  credits: number;
  semester: string;
}

export interface KBTimelineEvent {
  date: string;
  title: string;
  description?: string;
}

export interface KBRepresentative {
  name: string;
  role: string;
}

export interface KnowledgeBase {
  about: AboutInfo;
  timeline: KBTimelineEvent[];
  representatives: KBRepresentative[];
  faculty: FacultyMember[];
  courses: KBCourse[];
  notices: Notice[];
  labs: Lab[];
  admission: AdmissionInfo;
  contact: ContactInfo;
}

function coursesFromCurriculum(): KBCourse[] {
  const out: KBCourse[] = [];
  for (const semester of curriculum.semesters) {
    for (const course of semester.courses) {
      out.push({
        code: course.code,
        title: course.title,
        credits: course.credits,
        semester: semester.name,
      });
    }
  }
  return out;
}

export const KB: KnowledgeBase = {
  about: {
    summary: "PLACEHOLDER — a short paragraph about IPE 25: how the batch came together and what this site is for.",
    headOfDepartment: "PLACEHOLDER — Dr. Jane Doe",
    isPlaceholder: true,
  },
  timeline: TIMELINE_EVENTS.map(({ date, title, description }) => ({ date, title, description })),
  representatives: CLASS_REPS,
  faculty: [
    {
      name: "PLACEHOLDER — Dr. Jane Doe",
      designation: "Professor & Head of Department",
      email: "placeholder@iut-dhaka.edu",
      researchAreas: ["Operations Research", "Supply Chain Management"],
      isPlaceholder: true,
    },
    {
      name: "PLACEHOLDER — Dr. John Smith",
      designation: "Associate Professor",
      email: "placeholder2@iut-dhaka.edu",
      researchAreas: ["Manufacturing Systems", "Quality Engineering"],
      isPlaceholder: true,
    },
  ],
  courses: coursesFromCurriculum(),
  notices: [
    {
      title: "PLACEHOLDER — Sample notice title",
      date: "2026-01-01",
      summary: "PLACEHOLDER — replace with a real department notice before launch.",
      isPlaceholder: true,
    },
  ],
  labs: [
    {
      name: "PLACEHOLDER — Manufacturing Lab",
      description: "PLACEHOLDER — describe real equipment and capabilities here.",
      location: "PLACEHOLDER — building/room",
      isPlaceholder: true,
    },
    {
      name: "PLACEHOLDER — CAD/CAM Lab",
      description: "PLACEHOLDER — describe real equipment and capabilities here.",
      location: "PLACEHOLDER — building/room",
      isPlaceholder: true,
    },
  ],
  admission: {
    overview: "PLACEHOLDER — replace with real admission process summary.",
    eligibility: ["PLACEHOLDER — eligibility criterion 1", "PLACEHOLDER — eligibility criterion 2"],
    applicationWindow: "PLACEHOLDER — e.g. applications open March–April",
    isPlaceholder: true,
  },
  contact: {
    departmentEmail: "placeholder-ipe@iut-dhaka.edu",
    departmentPhone: "PLACEHOLDER — +880-XXXX-XXXXXX",
    officeLocation: "PLACEHOLDER — building/floor/room",
    officeHours: "PLACEHOLDER — e.g. Sun–Thu, 9am–5pm",
    isPlaceholder: true,
  },
};

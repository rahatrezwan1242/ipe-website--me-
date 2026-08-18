/**
 * Single source of truth for IPE 25's own content — consumed by the homepage
 * (Timeline/Representatives/Memories) and by the batch assistant's knowledge
 * base (data/knowledge-base.ts), so real data only needs to be added once.
 */

export type TimelineEvent = {
  date: string;
  title: string;
  photos: string[] | null; // occasion labels for placeholder photo cells; null = no photos
  description?: string;
};

export type ClassRep = { name: string; role: string };

// Add real events here (same shape) once the batch's timeline is ready.
export const TIMELINE_EVENTS: TimelineEvent[] = [];

// Add real names/roles/contacts here once available.
export const CLASS_REPS: ClassRep[] = [];

// Photos live in public/memories/ as `occasion_words_MM_YYYY.ext` — add
// filenames here (same naming scheme) once real photos are available.
export const MEMORY_FILES: string[] = [];

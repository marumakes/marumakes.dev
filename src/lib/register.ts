/**
 * The register's vocabulary.
 *
 * Projects are instruments, numbered as plates in roman; notes are numbered
 * in arabic. Keeping the two sequences in different numerals is what stops
 * them reading as one list.
 */

const ROMAN_UNITS: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** Plate numbers only, so single digits are all this ever sees. */
export function roman(value: number): string {
  let remaining = value;
  let out = "";

  ROMAN_UNITS.forEach(([size, numeral]) => {
    while (remaining >= size) {
      out += numeral;
      remaining -= size;
    }
  });

  return out;
}

export type Condition = "in-service" | "complete" | "reference";

/** How a project's state is written on its index. */
const CONDITIONS: Record<Condition, string> = {
  "in-service": "In service",
  complete: "Complete",
  reference: "Reference",
};

export function conditionLabel(condition: Condition): string {
  return CONDITIONS[condition];
}

/**
 * "Mar 2026". Both dated fields on the site render through here - a note's
 * `filed` and a project's `firstLight` - so the two read as one vocabulary.
 *
 * Named for its output rather than for either field: it was `filedLabel` while
 * the notes were the only thing dated, and calling that on a project's first
 * light read as though the project had been filed.
 */
export function monthYear(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** UTC throughout: a date stored as a bare month must not shift under a
    timezone and report the month before. */
export function yearOf(date: Date): string {
  return String(date.getUTCFullYear());
}

/** Below this a piece is short enough that a rounded figure would overstate it. */
const ROUNDING_FLOOR = 250;
const ROUNDING_STEP = 100;

/**
 * Length is measured from what actually got written, not authored by hand -
 * a number kept in frontmatter drifts the moment a draft is edited. Short
 * drafts report their true count rather than being rounded up into looking
 * finished.
 */
export function wordCount(markdown: string): number {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`|-]/g, " ");

  return prose.split(/\s+/).filter(Boolean).length;
}

export function lengthLabel(words: number): string {
  if (words < ROUNDING_FLOOR) {
    return `${words} words`;
  }

  const rounded = Math.round(words / ROUNDING_STEP) * ROUNDING_STEP;
  return `~${rounded.toLocaleString("en-GB")} words`;
}

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Each project is one markdown file in src/content/projects/.
// The `loader` tells Astro where to find them; the `schema` is a Zod schema
// that every file's frontmatter must match - get a field wrong and `npm run dev`
// will fail loudly at build time instead of silently rendering `undefined`.
//
// The register presents each project as an instrument, so several fields carry
// the workshop's vocabulary: `stack` is its Movement, `mounting` is what it runs
// on, `finish` is how it is dressed. Every one of them has to be literally true
// - see design/DESIGN.md §6.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    // The 2-3 line blurb that appears in the register entry.
    tagline: z.string(),
    // Read as "Movement" - the parts it is built from.
    stack: z.array(z.string()),
    // Infrastructure it runs on, and how it is dressed. Not every project
    // has either: a local script has nothing to mount.
    mounting: z.string().optional(),
    finish: z.string().optional(),
    // The year it was first useful to someone - the astronomical term for an
    // instrument's first use, which maps exactly onto "first shipped".
    firstLight: z.number(),
    // Its constellation name, engraved on the plate caption.
    designation: z.string(),
    condition: z.enum(["in-service", "complete", "reference"]),
    // Optional: a couple of projects don't have a screenshot captured yet.
    screenshot: z.string().optional(),
    screenshotAlt: z.string().optional(),
    // Most projects link out to their GitHub README for depth.
    repoUrl: z.string().url().optional(),
    // A project can also (or instead) link to a live, deployed site.
    liveUrl: z.string().url().optional(),
    // true only for Parchment People: its "depth" is an on-site case
    // study page (src/pages/projects/[slug].astro) instead of a repo link,
    // since its source isn't public.
    caseStudy: z.boolean().default(false),
    // Position in the register, and so the plate number: order 1 is Plate I.
    order: z.number(),
  }),
});

// The D&D/creative side - homebrew classes, monsters, and articles.
// Same pattern as `projects`: one file per entry, validated against a schema.
const creative = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/creative" }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(["class", "monster", "article"]),
    summary: z.string(),
    // When it was written. Shown as "Mar 2026", and gives the fore-edge its
    // year - so the number orders the notes and the date says when.
    filed: z.coerce.date(),
    // The note's number. No. 1 is the first one written, so the stack sorts
    // by this descending and opens on the newest.
    order: z.number(),
  }),
});

export const collections = { projects, creative };

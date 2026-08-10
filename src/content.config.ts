import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each project is one markdown file in src/content/projects/.
// The `loader` tells Astro where to find them; the `schema` is a Zod schema
// that every file's frontmatter must match — get a field wrong and `npm run dev`
// will fail loudly at build time instead of silently rendering `undefined`.
const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		// The 2-3 line blurb that appears on the card itself.
		tagline: z.string(),
		stack: z.array(z.string()),
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
		// Controls display order on the homepage grid.
		order: z.number(),
	}),
});

// The D&D/creative side — homebrew classes, monsters, and articles.
// Same pattern as `projects`: one file per entry, validated against a schema.
const creative = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/creative' }),
	schema: z.object({
		title: z.string(),
		kind: z.enum(['class', 'monster', 'article']),
		summary: z.string(),
		order: z.number(),
	}),
});

export const collections = { projects, creative };

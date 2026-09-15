# marumakes

My personal site, at [marumakes.dev](https://marumakes.dev): a register of projects (with case studies), field notes from the table, and other writing.

## Contents

- **The Register** — an index of projects, each with a spec sheet; a few get a full case study page
- **The Notebook** — field notes, mostly about running and playing D&D

## Tech Stack

- Astro 7
- MDX (`@astrojs/mdx`)
- Hand-rolled CSS, no framework
- Content collections for projects and notes
- Deployed on Vercel

## Development

```bash
git clone git@github.com:marumakes/marumakes.dev.git
cd marumakes.dev
npm install
npm run dev
```

| Command | Action |
| :--- | :--- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |

## License

MIT

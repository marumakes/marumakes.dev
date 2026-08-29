// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // The deployed origin. Every absolute URL the site emits - the canonical
  // link, og:url - is resolved against it, so a page can state where it lives
  // rather than guessing from the request.
  site: 'https://marumakes.dev',
  integrations: [mdx()]
});
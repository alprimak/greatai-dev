// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://greatai.dev',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://getsnackingsd.com',

  // Fully static. Nothing opts out of prerendering yet; the contact form's
  // endpoint will be the first route to set `prerender = false`.
  output: 'static',

  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],

  // No `env.schema` yet: v1 is fully static with a mailto CTA, so there are no
  // secrets to declare. The Resend/Turnstile schema returns with the form.
});

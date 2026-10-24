// @ts-check
import { defineConfig, envField } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://getsnackingsd.com',

  // Static by default. Only /api/lead opts out via `export const prerender = false`.
  output: 'static',

  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],

  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      LEAD_TO_EMAIL: envField.string({ context: 'server', access: 'secret' }),
      LEAD_FROM_EMAIL: envField.string({ context: 'server', access: 'secret' }),
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret' }),

      // Defaults to Cloudflare's "always passes" test sitekey so a fresh clone
      // builds and the form works locally with no setup. Production overrides it.
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        default: '1x00000000000000000000AA',
      }),
    },
  },
});

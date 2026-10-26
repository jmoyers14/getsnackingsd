# Get Snacking SD

Marketing site for Get Snacking SD — vending machine placement across North County
San Diego. The site's job is converting property managers and business owners into
machine requests.

**Status: pre-launch scaffold.** The toolchain is set up and builds clean. There is
no real content, styling, or lead form yet — `src/pages/index.astro` is still the
Astro placeholder. See [Roadmap](#roadmap).

## Stack

| | |
|---|---|
| Framework | [Astro 7](https://docs.astro.build) — static by default |
| Styling | Tailwind 4 (CSS-first, no `tailwind.config.js`) |
| Type | Outfit (self-hosted variable woff2 via Fontsource) |
| Host | Cloudflare Workers + static assets |
| Adapter | `@astrojs/cloudflare` v14 |
| Forms | Turnstile (spam) → KV (durable) → Resend (email) |

Every page is prerendered to HTML at build time. Only `/api/lead` will opt out, via
`export const prerender = false`.

## Prerequisites

- **Node 24.21.0** — pinned in `.node-version`. Astro 7 hard-refuses anything below
  22.23.4, so this is not optional.
- **Bun 1.3.5** — pinned via the `packageManager` field.

With [fnm](https://github.com/Schniz/fnm):

```sh
fnm use          # picks up .node-version
bun install
```

Bun is the package manager; Astro still builds on Node. Node is required even
though installs go through Bun.

If `node -v` doesn't say `v24.21.0`, nothing below will run. Add
`fnm env --use-on-cd | source` to your `config.fish` to switch automatically.

## Local development

```sh
bun run dev      # http://localhost:4321
```

| Command | What it does |
|---|---|
| `bun run dev` | Dev server with HMR, running on real `workerd`. Reads `.dev.vars`. |
| `bun run preview` | Builds, then serves the **production** Worker locally. |
| `bun run typecheck` | Regenerates Worker types, then runs `astro check`. |
| `bun run build` | Production build into `dist/`. |

### Two things that will trip you up

**`@emnapi/runtime` is a deliberate devDependency.** Neither Bun nor yarn 1
auto-installs peer dependencies the way npm does, and `@astrojs/check` reaches it
through `@napi-rs/wasm-runtime`. Without it, `astro check` fails to import and
reports the package as "not installed" — the real `ERR_MODULE_NOT_FOUND` is
swallowed. Don't prune it.

**The dev and preview servers are daemons.** Ctrl-C does not stop them.

```sh
npx astro dev stop       # also: status, logs
npx astro preview stop
```

### `wrangler dev` is not part of the workflow

As of `@astrojs/cloudflare` v13+, `astro dev` runs the real `workerd` runtime through
the Cloudflare Vite plugin and reads `.dev.vars` directly. You do not need
`wrangler dev` to exercise API routes. Older tutorials say otherwise; they predate
the change.

## Environment variables

Declared as a typed schema in `astro.config.mjs` (`astro:env`), so a missing secret
is a clear error rather than a silent `undefined`.

| Variable | Type | Purpose |
|---|---|---|
| `RESEND_API_KEY` | secret | Resend API auth |
| `LEAD_TO_EMAIL` | secret | Where lead notifications are sent |
| `LEAD_FROM_EMAIL` | secret | Sender — must be a Resend-verified domain |
| `TURNSTILE_SECRET_KEY` | secret | Turnstile server-side validation |
| `PUBLIC_TURNSTILE_SITE_KEY` | public | Client widget key |

**Locally:** put them in `.dev.vars` (gitignored). `PUBLIC_TURNSTILE_SITE_KEY`
defaults to Cloudflare's always-passes test key (`1x00000000000000000000AA`), so a
fresh clone builds and the form works with no setup.

**In production:** `npx wrangler secret put <KEY>` for each secret. Public vars go in
the Workers dashboard or `wrangler.jsonc`.

> Not yet created — `.dev.vars.example` lands with the lead form.

## Branding

Cream `#fffdf5` with black text and rules, taken from the business card. Those two
colors are the entire palette — there is deliberately no third accent. The primary
CTA earns attention through contrast, not hue.

Every color, font, and type-scale value lives in one `@theme` block in
`src/styles/global.css`. No component hardcodes a color.

**On the display face:** the card uses **Hero** (Fontfabric). Hero is not on Google
Fonts, and while it's free for commercial use, Fontfabric licenses webfont embedding
separately with pageview and domain conditions — so self-hosting it has not been
cleared. **Outfit** stands in: same geometric lineage, uniform stroke, near-circular
bowls. If Fontfabric confirms web use, change `--font-display` and nothing else.

## Project structure

```
astro.config.mjs    site URL, static output, adapter, astro:env schema
wrangler.jsonc      Cloudflare deploy INPUT — see note below
.node-version       24.21.0, matched to the Workers Builds image
src/
  pages/            file-based routes
  styles/global.css Tailwind import + @theme brand tokens
public/             served verbatim at the site root
```

### Don't hand-edit `main` or `assets` in `wrangler.jsonc`

The adapter owns them. `main` points at `@astrojs/cloudflare/entrypoints/server` —
a module inside `node_modules`, not a file in this repo. At build time the adapter
generates the **real** deploy config at `dist/client/wrangler.json`, rewriting
`assets.directory` to `.` relative to itself.

So `dist/` looks like this:

- `dist/client/` — static assets uploaded to Workers Assets
- `dist/server/` — the Worker bundle, **only populated once a route sets
  `prerender = false`**. It is empty today, and that is correct.

## Deployment

Git-based deploys run through **Workers Builds** (Workers dashboard → connect repo).
Not Cloudflare Pages — `@astrojs/cloudflare` v14 dropped Pages support entirely.

> Not yet connected. When setting it up:
>
> - Build command **must** be `bun run build`. The default assumes npm, which would
>   install against a `bun.lock` and resolve a different dependency tree than you
>   tested locally.
> - Deploy command is `npx wrangler deploy`.
> - Node and Bun versions come from `.node-version` and `packageManager`
>   automatically. Node `24.21.0` is preinstalled in the build image. The image
>   ships Bun 1.4.3 while we pin 1.3.5, so Bun is fetched — harmless, but it's
>   why the install step isn't instant.

## Roadmap

Tracked on Shuffleboard, project *Get Snacking SD — Marketing Site*.

**v1 (deployable):** scaffold ✅ → brand tokens + Layout + SEO → landing page →
contact form → `POST /api/lead` → ship.

**Phase 2 (after launch):** location pages, dedicated `/request-a-machine`, blog,
QR code redirects (`/m/:id`).

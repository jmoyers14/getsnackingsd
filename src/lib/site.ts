/**
 * Single source of truth for business identity.
 *
 * Nav, footer, and the LocalBusiness JSON-LD all read from here, so these
 * values can never drift out of sync with each other.
 *
 * TODO(jeremy): replace every PLACEHOLDER before launch. The phone and email
 * are also emitted into structured data, so wrong values here get indexed.
 */

export const site = {
  name: 'Get Snacking SD',
  /** Used in <title> as "Page — Tagline" on the home page only. */
  tagline: 'Vending machines for North County San Diego',
  description:
    'Free vending machine placement for offices, apartments, gyms, and 24-hour facilities across North County San Diego. We install, stock, and service the machine at no cost to you.',
  url: 'https://getsnackingsd.com',

  /** PLACEHOLDER — real number needed before launch. */
  phone: '+1-760-555-0100',
  /** PLACEHOLDER — real inbox needed before launch. */
  email: 'hello@getsnackingsd.com',

  /**
   * Service-area business: no storefront customers visit. `areaServed` carries
   * the geography instead of a street address.
   */
  areaServed: [
    'Carlsbad',
    'Oceanside',
    'Vista',
    'San Marcos',
    'Encinitas',
    'Escondido',
    'Del Mar',
    'Solana Beach',
  ],
  region: 'North County San Diego',

  /** Primary conversion target. One page in v1, so this is an in-page anchor. */
  ctaHref: '/#contact',
  ctaLabel: 'Request a machine',
} as const;

/**
 * Header nav. Empty in v1 — there is one page, and a nav bar listing a single
 * link is noise. Phase 2 adds Locations and Blog here.
 */
export const navLinks: ReadonlyArray<{ href: string; label: string }> = [];

/** Digits-only form for tel: hrefs. */
export const phoneHref = `tel:${site.phone.replace(/[^+\d]/g, '')}`;

/** Human-readable form for display. */
export const phoneDisplay = site.phone
  .replace(/^\+1-/, '')
  .replace(/^(\d{3})-(\d{3})-(\d{4})$/, '($1) $2-$3');

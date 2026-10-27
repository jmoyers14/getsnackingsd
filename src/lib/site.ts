/**
 * Single source of truth for business identity.
 *
 * Nav, footer, and the LocalBusiness JSON-LD all read from here, so these
 * values can never drift out of sync with each other.
 *
 * Phone and email are taken from the business card and are emitted into the
 * LocalBusiness JSON-LD, so changes here propagate to what Google indexes.
 */

export const site = {
  name: 'Get Snacking SD',
  /** The descriptor that sits under the wordmark on the card, tracked out. */
  descriptor: 'Vending Supply',
  /** Used in <title> as "Page — Tagline" on the home page only. */
  tagline: 'Vending machines for North County San Diego',
  description:
    'Free vending machine placement for offices, apartments, gyms, and 24-hour facilities across North County San Diego. We install, stock, and service the machine at no cost to you.',
  url: 'https://getsnackingsd.com',

  phone: '+1-805-284-8298',
  email: 'Getsnackingsd@gmail.com',

  /**
   * Service-area business: no storefront customers visit. `areaServed` carries
   * the geography instead of a street address.
   */
  areaServed: [
    'Carlsbad',
    'Vista',
    'San Marcos',
    'Escondido',
    'Poway',
  ],
  region: 'North County San Diego',

  /**
   * Primary conversion target.
   *
   * INTERIM: points at email because the in-page form was removed. Card 4
   * builds the real form — switch this back to '/#contact' then, and the
   * header button starts scrolling to it instead of opening a mail client.
   */
  ctaHref: 'mailto:Getsnackingsd@gmail.com?subject=Vending%20machine%20enquiry',
  ctaLabel: 'Contact us',
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

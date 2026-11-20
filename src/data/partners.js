/**
 * Club partners shown on /{lang}/partners/.
 *
 * Add one entry per signed partner. Put the logo in public/img/partners/
 * (SVG preferred, otherwise a PNG with a transparent background) and
 * reference it by its public path. Logos sit on a white tile in both themes.
 *
 *   {
 *     name: 'Example S.A.',            // used as the logo's alt text
 *     tier: 'gold',                    // one of PARTNER_TIERS below
 *     logo: '/img/partners/example.svg',
 *     url: 'https://www.example.lu',   // optional; opens in a new tab
 *   }
 *
 * While the list is empty, the page shows "Your logo here" placeholder
 * tiles for the Launch Partners 2027 instead.
 */
export const PARTNER_TIERS = ['title', 'gold', 'silver', 'bronze', 'supporter', 'event', 'in-kind'];

export const partners = [];

/** Placeholder tiles shown while no partner has signed yet. */
export const LAUNCH_PARTNER_SLOTS = 5;

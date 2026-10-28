// Localized copy and a public Google Maps link. No API or credentials are used;
// ratings, review counts and review text are read on Google itself.
const GOOGLE_URL =
  'https://www.google.com/maps?cid=8630232517449509494';

const SECTION = {
  en: {
    eyebrow: 'Reviews',
    title: 'What our visitors say.',
    lead: 'Read visitors’ reviews of Skydive Luxembourg directly on Google.',
    cta: 'Read our reviews on Google',
  },
  fr: {
    eyebrow: 'Avis',
    title: 'Ce qu’en disent nos visiteurs.',
    lead: 'Lisez les avis des visiteurs sur Skydive Luxembourg directement sur Google.',
    cta: 'Lire nos avis sur Google',
  },
  de: {
    eyebrow: 'Bewertungen',
    title: 'Was unsere Gäste sagen.',
    lead: 'Lies die Bewertungen unserer Gäste zu Skydive Luxembourg direkt auf Google.',
    cta: 'Unsere Google-Bewertungen lesen',
  },
};

// Keep the page-facing API while returning only local text and the public link.
export async function getGoogleReviews(lang = 'en') {
  const locale = typeof lang === 'string' ? lang.trim().toLowerCase() : 'en';
  return { ...(Object.hasOwn(SECTION, locale) ? SECTION[locale] : SECTION.en), url: GOOGLE_URL };
}

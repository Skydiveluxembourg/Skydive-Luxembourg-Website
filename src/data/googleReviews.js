/* =========================================================================
   Skydive Luxembourg - Google rating (social proof)
   -------------------------------------------------------------------------
   Live aggregate rating + a few real reviews, fetched from Google at BUILD
   TIME and baked into the static HTML. No client-side script, no browser
   network call — so the strict CSP (script-src 'self' / connect-src 'self')
   stays untouched and the visitor's browser never talks to Google.

   HOW IT REFRESHES
     `getGoogleReviews()` calls the Google Places API (New) Place Details
     endpoint during `astro build`. A scheduled Netlify rebuild
     (.github/workflows/refresh-google-reviews.yml) re-runs the build
     periodically so the numbers stay current on their own.

   REQUIRED ENV (Netlify build environment; NEVER PUBLIC_-prefixed, never
   committed — see docs/google-reviews-auto-update.md):
     GOOGLE_PLACES_API_KEY   Places API (New) key
     GOOGLE_PLACE_ID         the dropzone's Google Place ID (store forever;
                             Place IDs are exempt from the cache limit)
     GOOGLE_PLACES_LANGUAGE  optional, defaults to 'en'

   UNAVAILABLE DATA
     Missing configuration or an unsuccessful import returns a null rating
     and count, no cards, and a Google link. Never substitute an old or made-up
     rating. One request is shared across locales; failures are not retried.

   Attribution and storage must follow the current Google Maps Platform
   terms and Places policies. Do not commit fetched review text to the repo.
   Google returns at most five relevance-selected reviews; userRatingCount
   is the total number of ratings, not the number of returned review cards.

   Localisation: en / fr / de copy is provided; `lu` falls back to `en`.
   Review text is fetched once in GOOGLE_PLACES_LANGUAGE (default en) and
   shown across all locales.
   ========================================================================= */

// Fallback outbound link when the live googleMapsUri isn't available.
const GOOGLE_URL =
  'https://www.google.com/maps/search/?api=1&query=Skydive%20Luxembourg%20Noertrange';

const SECTION = {
  en: {
    eyebrow: 'Reviews',
    title: 'Rated by real jumpers.',
    lead: 'Don’t just take our word for it — here’s how visitors rate their day at the dropzone.',
    countLabel: 'Google reviews',
    cta: 'Read our reviews on Google',
    starsLabel: 'Rated {n} out of 5',
    reviewsLabel: 'Selected reviews',
    selectionNotice: 'Up to five reviews selected by Google for relevance.',
    attribution: 'Reviews from Google',
    reviewCta: 'View on Google',
  },
  fr: {
    eyebrow: 'Avis',
    title: 'Noté par de vrais parachutistes.',
    lead: 'Ne nous croyez pas sur parole — voici la note que les visiteurs donnent à leur journée sur la DZ.',
    countLabel: 'avis Google',
    cta: 'Lire nos avis sur Google',
    starsLabel: 'Noté {n} sur 5',
    reviewsLabel: 'Avis sélectionnés',
    selectionNotice: 'Jusqu’à cinq avis sélectionnés par Google selon leur pertinence.',
    attribution: 'Avis depuis Google',
    reviewCta: 'Voir sur Google',
  },
  de: {
    eyebrow: 'Bewertungen',
    title: 'Von echten Springern bewertet.',
    lead: 'Verlass dich nicht nur auf unser Wort — so bewerten Besucher ihren Tag auf der Dropzone.',
    countLabel: 'Google-Bewertungen',
    cta: 'Unsere Google-Bewertungen lesen',
    starsLabel: 'Bewertet mit {n} von 5',
    reviewsLabel: 'Ausgewählte Bewertungen',
    selectionNotice: 'Bis zu fünf von Google nach Relevanz ausgewählte Bewertungen.',
    attribution: 'Bewertungen von Google',
    reviewCta: 'Auf Google ansehen',
  },
};

// Read a build-time secret from either Astro/Vite's server env or Node's
// process.env — whichever Netlify populated. Never PUBLIC_-prefixed, so it
// stays server-side and is dropped from the client bundle.
function env(name) {
  const viteVal =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env[name]
      : undefined;
  return viteVal ?? (typeof process !== 'undefined' ? process.env?.[name] : undefined);
}

const FIELD_MASK = 'id,displayName,formattedAddress,rating,userRatingCount,googleMapsUri,reviews';
const string = (value) => typeof value === 'string' ? value.trim() : '';
const validRating = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 5;
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function httpsUrl(value) {
  if (typeof value !== 'string' || value.length > 4096) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

function textLanguage(value) {
  const language = string(value);
  if (language.length > 63 || !/^[a-z]{2,8}(?:-[a-z0-9]{1,8})*$/i.test(language)) return null;
  try { return Intl.getCanonicalLocales(language)[0] ?? null; } catch { return null; }
}

function mapReview(review) {
  if (!object(review) || !validRating(review.rating)) return null;
  const author = string(review.authorAttribution?.displayName);
  const translated = string(review.text?.text);
  const text = translated || string(review.originalText?.text);
  const reviewUrl = httpsUrl(review.googleMapsUri);
  // A card needs text, author attribution, a real rating and its source link. Invalid
  // individual cards must never invalidate the independently verified total.
  if (!author || !text || !reviewUrl) return null;
  const authorUrl = httpsUrl(review.authorAttribution?.uri);
  return {
    author,
    authorUrl,
    photo: httpsUrl(review.authorAttribution?.photoUri),
    rating: review.rating,
    relativeTime: string(review.relativePublishTimeDescription),
    text,
    textLanguage: textLanguage(translated ? review.text?.languageCode : review.originalText?.languageCode),
    reviewUrl,
  };
}

// Only recognized enum values from Google RPC ErrorInfo are safe to log.
// Never print error.message, arbitrary reasons, metadata, request headers or URL.
const SAFE_ERROR_REASONS = new Set([
  'API_KEY_INVALID', 'API_KEY_EXPIRED', 'API_KEY_NOT_FOUND',
  'API_KEY_SERVICE_BLOCKED', 'API_KEY_HTTP_REFERRER_BLOCKED',
  'API_KEY_IP_ADDRESS_BLOCKED', 'API_KEY_ANDROID_APP_BLOCKED',
  'API_KEY_IOS_APP_BLOCKED', 'SERVICE_DISABLED', 'BILLING_DISABLED',
  'CONSUMER_INVALID', 'RATE_LIMIT_EXCEEDED', 'QUOTA_EXCEEDED',
  'RESOURCE_EXHAUSTED', 'ACCESS_TOKEN_EXPIRED', 'ACCESS_TOKEN_SCOPE_INSUFFICIENT',
]);
function googleErrorReason(data) {
  const details = data?.error?.details;
  if (!Array.isArray(details)) return null;
  return details.find((detail) => detail?.['@type'] === 'type.googleapis.com/google.rpc.ErrorInfo' &&
    detail.domain === 'googleapis.com' && SAFE_ERROR_REASONS.has(detail.reason))?.reason ?? null;
}

function httpAdvice(status) {
  if (status === 401) return 'Check GOOGLE_PLACES_API_KEY and its authentication settings.';
  if (status === 403) return 'Check Places API (New) enablement, billing and API-key restrictions.';
  if (status === 404) return 'Check GOOGLE_PLACE_ID identifies the intended listing.';
  if (status === 429) return 'Check the Google Places quota and billing limits before rebuilding.';
  if (status >= 500) return 'Google Places is unavailable; try a later build.';
  return 'Check the Google Places configuration and selected response fields.';
}

/**
 * A fresh loader is useful for isolated tests. Each loader memoizes its single
 * import (including failure), so concurrent locale renders do not multiply API
 * calls. The deadline covers both fetching and reading the response body.
 */
export function createGoogleReviewsLoader({
  readEnv = env, fetchImpl = globalThis.fetch, logger = console,
  timeoutMs = 10000, now = Date.now,
} = {}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new TypeError('timeoutMs must be positive.');
  const warn = (message) => logger?.warn?.(`[google-reviews] ${message} Aggregate and review cards omitted; Google link retained.`);
  const unavailable = (reason, extra = {}) => ({
    rating: null, count: null, url: GOOGLE_URL, reviews: [],
    source: { status: 'unavailable', reason, ...extra },
  });

  async function fetchPlace() {
    let key, placeId, language;
    try {
      key = string(readEnv('GOOGLE_PLACES_API_KEY'));
      placeId = string(readEnv('GOOGLE_PLACE_ID'));
      language = string(readEnv('GOOGLE_PLACES_LANGUAGE')) || 'en';
    } catch {
      warn('Could not read the Google Places build configuration. Check the build environment.');
      return unavailable('configuration-error');
    }
    const missingEnv = [
      ...(!key ? ['GOOGLE_PLACES_API_KEY'] : []),
      ...(!placeId ? ['GOOGLE_PLACE_ID'] : []),
    ];
    if (missingEnv.length) {
      warn(`Missing build environment variable${missingEnv.length > 1 ? 's' : ''}: ${missingEnv.join(', ')}.`);
      return unavailable('missing-configuration', { missingEnv });
    }

    const controller = new AbortController();
    const timeout = new Error('Google Places deadline exceeded');
    let timer;
    try {
      const operation = async () => {
        const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`);
        url.searchParams.set('languageCode', language);
        url.searchParams.set('regionCode', 'LU');
        const response = await fetchImpl(url.href, {
          headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELD_MASK },
          signal: controller.signal,
          redirect: 'error', cache: 'no-store',
        });
        let data;
        try { data = await response.json(); }
        catch { return { kind: response.ok ? 'invalid-json' : 'http-error', status: response.status }; }
        if (!response.ok) return { kind: 'http-error', status: response.status, reason: googleErrorReason(data) };
        return { kind: 'data', data };
      };
      const deadline = new Promise((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(timeout); }, timeoutMs);
      });
      const result = await Promise.race([operation(), deadline]);
      if (controller.signal.aborted) throw timeout;
      if (result.kind === 'http-error') {
        warn(`Google Places HTTP ${result.status}${result.reason ? ` (${result.reason})` : ''}. ${httpAdvice(result.status)}`);
        return unavailable('http-error', { httpStatus: result.status, googleErrorReason: result.reason ?? null });
      }
      if (result.kind === 'invalid-json') {
        warn('Google Places returned invalid JSON. Check the provider response on a later build.');
        return unavailable('invalid-json');
      }
      const data = result.data;
      if (!object(data) || string(data.id) !== placeId) {
        warn('Google Places returned a different or missing listing ID. Verify GOOGLE_PLACE_ID before publishing ratings.');
        return unavailable('place-mismatch');
      }
      if (!validRating(data.rating) || !Number.isSafeInteger(data.userRatingCount) || data.userRatingCount < 0) {
        warn('Google Places did not return a valid rating and total rating count. Check the selected listing and response fields.');
        return unavailable('invalid-aggregate');
      }
      const candidates = Array.isArray(data.reviews) ? data.reviews : [];
      const mapped = candidates.map(mapReview);
      const reviews = mapped.filter(Boolean).slice(0, 5);
      const rejectedReviews = mapped.filter((review) => review === null).length;
      if (rejectedReviews || data.reviews != null && !Array.isArray(data.reviews)) {
        logger?.warn?.('[google-reviews] Invalid individual review data ignored; the valid aggregate was retained.');
      }
      logger?.info?.(`[google-reviews] Imported ${data.userRatingCount} total ratings and ${reviews.length} review card(s) from the configured listing.`);
      return {
        rating: data.rating, count: data.userRatingCount,
        url: httpsUrl(data.googleMapsUri) ?? GOOGLE_URL, reviews,
        source: {
          status: 'live', fetchedAt: new Date(now()).toISOString(),
          listing: { id: placeId, displayName: string(data.displayName?.text) || null, formattedAddress: string(data.formattedAddress) || null },
          reviewCount: reviews.length, rejectedReviews,
        },
      };
    } catch (error) {
      if (error === timeout || controller.signal.aborted) {
        warn(`Google Places exceeded the ${timeoutMs} ms build deadline. Check network availability or try a later build.`);
        return unavailable('timeout');
      }
      warn('Google Places request failed. Check build-network access and try a later build.');
      return unavailable('network-error');
    } finally { clearTimeout(timer); }
  }

  let placePromise;
  return async (lang = 'en') => {
    const locale = string(lang).toLowerCase();
    const section = Object.hasOwn(SECTION, locale) ? SECTION[locale] : SECTION.en;
    placePromise ??= fetchPlace();
    return { ...section, ...await placePromise };
  };
}

// One shared request across every page and locale in this build.
export const getGoogleReviews = createGoogleReviewsLoader();

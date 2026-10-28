import test from 'node:test';
import assert from 'node:assert/strict';
import { createGoogleReviewsLoader } from '../src/data/googleReviews.js';

const key = 'test-only-secret-key-DO-NOT-LOG';
const placeId = 'test-place-id';
const clock = Date.parse('2026-10-28T14:00:00Z');
const values = { GOOGLE_PLACES_API_KEY: key, GOOGLE_PLACE_ID: placeId, GOOGLE_PLACES_LANGUAGE: 'en' };
const review = (overrides = {}) => ({
  authorAttribution: { displayName: 'A jumper', uri: 'https://www.google.com/maps/contrib/123', photoUri: 'https://lh3.googleusercontent.com/avatar' },
  text: { text: 'A real review from the API.' },
  rating: 4, relativePublishTimeDescription: 'A month ago',
  googleMapsUri: 'https://www.google.com/maps/reviews/example', ...overrides,
});
const payload = (overrides = {}) => ({
  id: placeId, displayName: { text: 'Skydive Luxembourg' }, formattedAddress: 'Noertrange, Luxembourg',
  rating: 4.7, userRatingCount: 123, googleMapsUri: 'https://maps.google.com/?cid=123',
  reviews: Array.from({ length: 5 }, (_, index) => review({ text: { text: `Review ${index + 1}` } })),
  ...overrides,
});

function fixture({ environment = values, fetchImpl, timeoutMs = 1000 } = {}) {
  const calls = [], warnings = [], info = [];
  const loader = createGoogleReviewsLoader({
    readEnv: (name) => environment[name],
    fetchImpl: async (...args) => { calls.push(args); return fetchImpl ? fetchImpl(...args) : Response.json(payload()); },
    logger: { warn: (message) => warnings.push(message), info: (message) => info.push(message) },
    timeoutMs, now: () => clock,
  });
  return { loader, calls, warnings, info };
}

function unavailable(result, reason) {
  assert.equal(result.rating, null);
  assert.equal(result.count, null);
  assert.deepEqual(result.reviews, []);
  assert.match(result.url, /^https:\/\/www\.google\.com\/maps\//);
  assert.equal(result.source.status, 'unavailable');
  assert.equal(result.source.reason, reason);
}

test('imports five selected cards independently of 123 total ratings, with verified listing metadata', async () => {
  const f = fixture();
  const result = await f.loader('en');
  assert.equal(result.rating, 4.7);
  assert.equal(result.count, 123);
  assert.equal(result.reviews.length, 5);
  assert.equal(result.reviewsLabel, 'Selected reviews');
  assert.equal(result.selectionNotice, 'Up to five reviews selected by Google for relevance.');
  assert.equal(result.source.status, 'live');
  assert.equal(result.source.fetchedAt, '2026-10-28T14:00:00.000Z');
  assert.deepEqual(result.source.listing, { id: placeId, displayName: 'Skydive Luxembourg', formattedAddress: 'Noertrange, Luxembourg' });
  assert.equal(f.warnings.length, 0);
  assert.equal(f.calls.length, 1);
  const [url, options] = f.calls[0];
  assert.equal(new URL(url).pathname, '/v1/places/' + placeId);
  assert.equal(new URL(url).searchParams.get('regionCode'), 'LU');
  assert.equal(options.headers['X-Goog-Api-Key'], key);
  assert.equal(options.headers['X-Goog-FieldMask'], 'id,displayName,formattedAddress,rating,userRatingCount,googleMapsUri,reviews');
  assert.equal(options.redirect, 'error');
  assert.equal(options.cache, 'no-store');
  assert.ok(!url.includes(key));
});

test('one promise is shared across concurrent and later locale calls, without changing review language', async () => {
  const f = fixture({ environment: { GOOGLE_PLACES_API_KEY: `  ${key}  `, GOOGLE_PLACE_ID: ` ${placeId}\n`, GOOGLE_PLACES_LANGUAGE: ' fr ' } });
  const [en, fr, de] = await Promise.all([f.loader('en'), f.loader(' fr '), f.loader('de')]);
  assert.equal(f.calls.length, 1);
  assert.equal(new URL(f.calls[0][0]).searchParams.get('languageCode'), 'fr');
  assert.equal(f.calls[0][1].headers['X-Goog-Api-Key'], key);
  assert.equal(en.eyebrow, 'Reviews'); assert.equal(fr.eyebrow, 'Avis'); assert.equal(de.eyebrow, 'Bewertungen');
  assert.equal(fr.reviewsLabel, 'Avis sélectionnés');
  assert.equal(de.reviewsLabel, 'Ausgewählte Bewertungen');
  assert.match(fr.selectionNotice, /cinq avis sélectionnés par Google/);
  assert.match(de.selectionNotice, /fünf von Google nach Relevanz/);
  assert.deepEqual(en.reviews, fr.reviews);
  assert.equal((await f.loader('lu')).eyebrow, 'Reviews');
  assert.equal((await f.loader('__proto__')).eyebrow, 'Reviews');
  assert.equal(f.calls.length, 1);
});

test('missing variables are named precisely and do not issue a request or fabricate an aggregate', async () => {
  for (const missing of [['GOOGLE_PLACES_API_KEY'], ['GOOGLE_PLACE_ID'], ['GOOGLE_PLACES_API_KEY', 'GOOGLE_PLACE_ID']]) {
    const environment = { ...values };
    for (const name of missing) environment[name] = ' \n ';
    const f = fixture({ environment });
    const result = await f.loader();
    unavailable(result, 'missing-configuration');
    assert.deepEqual(result.source.missingEnv, missing);
    assert.equal(f.calls.length, 0);
    assert.equal(f.warnings.length, 1);
    for (const name of missing) assert.ok(f.warnings[0].includes(name));
    for (const name of ['GOOGLE_PLACES_API_KEY', 'GOOGLE_PLACE_ID'].filter((name) => !missing.includes(name))) assert.ok(!f.warnings[0].includes(name));
    assert.ok(!f.warnings[0].includes(key));
    await f.loader('fr'); assert.equal(f.warnings.length, 1);
  }
});

test('missing or blank optional API language defaults to English', async () => {
  for (const language of [undefined, '', '  ']) {
    const f = fixture({ environment: { ...values, GOOGLE_PLACES_LANGUAGE: language } });
    assert.equal((await f.loader()).source.status, 'live');
    assert.equal(new URL(f.calls[0][0]).searchParams.get('languageCode'), 'en');
  }
});

test('HTTP failures are memoized and log only safe status/reason with actionable guidance', async () => {
  for (const status of [401, 403, 404, 429, 500, 503]) {
    const f = fixture({ fetchImpl: async () => Response.json({ error: {
      message: `Provider echoed ${key}`, status: 'PERMISSION_DENIED',
      details: [{ '@type': 'type.googleapis.com/google.rpc.ErrorInfo', domain: 'googleapis.com', reason: 'API_KEY_SERVICE_BLOCKED', metadata: { apiKey: key } }],
    } }, { status }) });
    const result = await f.loader();
    unavailable(result, 'http-error');
    assert.equal(result.source.httpStatus, status);
    assert.equal(result.source.googleErrorReason, 'API_KEY_SERVICE_BLOCKED');
    assert.match(f.warnings[0], new RegExp(`HTTP ${status}`));
    assert.match(f.warnings[0], /API_KEY_SERVICE_BLOCKED/);
    assert.ok(!JSON.stringify({ warnings: f.warnings, result }).includes(key));
    assert.ok(!f.warnings[0].includes('Provider echoed'));
    await f.loader('de'); assert.equal(f.calls.length, 1);
  }
});

test('generic permission errors and unsafe error reasons never invent a cause or expose response text', async () => {
  for (const body of [
    { error: { code: 403, status: 'PERMISSION_DENIED', message: 'The caller does not have permission: ' + key } },
    { error: { details: [{ '@type': 'type.googleapis.com/google.rpc.ErrorInfo', domain: 'googleapis.com', reason: key }] } },
    { error: { details: [{ '@type': 'type.googleapis.com/google.rpc.ErrorInfo', domain: key, reason: 'API_KEY_INVALID' }] } },
  ]) {
    const f = fixture({ fetchImpl: async () => Response.json(body, { status: 403 }) });
    const result = await f.loader();
    assert.equal(result.source.googleErrorReason, null);
    assert.match(f.warnings[0], /HTTP 403/);
    assert.match(f.warnings[0], /enablement, billing and API-key restrictions/);
    assert.ok(!JSON.stringify({ result, warnings: f.warnings }).includes(key));
    assert.ok(!f.warnings[0].includes('API_KEY_INVALID'));
  }
  const f = fixture({ fetchImpl: async () => new Response(key, { status: 502 }) });
  unavailable(await f.loader(), 'http-error');
  assert.ok(!f.warnings[0].includes(key));
});

test('deadline covers a stalled request and a stalled response body, with no retries', async () => {
  for (const fetchImpl of [
    async () => new Promise(() => {}),
    async () => ({ ok: true, status: 200, json: async () => new Promise(() => {}) }),
  ]) {
    const f = fixture({ fetchImpl, timeoutMs: 10 });
    const result = await f.loader();
    unavailable(result, 'timeout');
    assert.match(f.warnings[0], /10 ms build deadline/);
    assert.equal(f.calls[0][1].signal.aborted, true);
    await f.loader('de'); assert.equal(f.calls.length, 1);
  }
});

test('network/configuration failures and invalid JSON remain nonsecret and do not fail the build', async () => {
  const network = fixture({ fetchImpl: async () => { throw new Error('Request failed with credential ' + key); } });
  unavailable(await network.loader(), 'network-error');
  assert.ok(!network.warnings[0].includes(key));
  const invalid = fixture({ fetchImpl: async () => new Response('{bad-json:' + key, { status: 200 }) });
  unavailable(await invalid.loader(), 'invalid-json');
  assert.ok(!invalid.warnings[0].includes(key));
  const warnings = [];
  const configuration = createGoogleReviewsLoader({ readEnv: () => { throw new Error(key); }, logger: { warn: (message) => warnings.push(message) } });
  unavailable(await configuration(), 'configuration-error');
  assert.ok(!warnings[0].includes(key));
});

test('aggregate requires a finite numeric rating0..5 and a nonnegative safe integer count', async () => {
  const aggregates = [
    { rating: undefined }, { rating: null }, { rating: '4.5' }, { rating: NaN }, { rating: Infinity }, { rating: -0.1 }, { rating: 5.1 },
    { userRatingCount: undefined }, { userRatingCount: null }, { userRatingCount: '123' }, { userRatingCount: -1 },
    { userRatingCount: 1.5 }, { userRatingCount: NaN }, { userRatingCount: Infinity }, { userRatingCount: Number.MAX_SAFE_INTEGER + 1 },
  ];
  for (const aggregate of aggregates) {
    const f = fixture({ fetchImpl: async () => ({ ok: true, status: 200, json: async () => payload(aggregate) }) });
    unavailable(await f.loader(), 'invalid-aggregate');
    assert.equal(f.calls.length, 1);
  }
  for (const rating of [0, 5]) {
    const f = fixture({ fetchImpl: async () => Response.json(payload({ rating, userRatingCount: 0, reviews: [] })) });
    const result = await f.loader(); assert.equal(result.rating, rating); assert.equal(result.count, 0);
  }
});

test('wrong or missing returned listing IDs cannot display ratings for another listing', async () => {
  for (const data of [payload({ id: 'different-place' }), payload({ id: undefined }), null, [], 'not a place']) {
    const f = fixture({ fetchImpl: async () => Response.json(data) });
    unavailable(await f.loader(), 'place-mismatch');
    assert.match(f.warnings[0], /Verify GOOGLE_PLACE_ID/);
  }
});

test('malformed individual reviews cannot discard the valid aggregate or invent five stars', async () => {
  const candidates = ['bad', null, 5, [], review({ rating: '5' }), review({ rating: undefined }), review({ rating: NaN }),
    review({ rating: -1 }), review({ rating: 6 }), review({ text: { text: 123 }, originalText: { text: false } }),
    review({ authorAttribution: { displayName: {} } }), review({ text: { text: '  ' } }),
    review({ rating: 3, text: { text: '  A real three-star review.  ' } }),
    review({ text: { text: {} }, originalText: { text: 'Original review text.' } }),
  ];
  const f = fixture({ fetchImpl: async () => ({ ok: true, status: 200, json: async () => payload({ reviews: candidates }) }) });
  const result = await f.loader();
  assert.equal(result.rating, 4.7); assert.equal(result.count, 123);
  assert.equal(result.reviews.length, 2);
  assert.equal(result.reviews[0].rating, 3);
  assert.equal(result.reviews[0].text, 'A real three-star review.');
  assert.equal(result.reviews[1].text, 'Original review text.');
  assert.equal(result.source.rejectedReviews, 12);
  assert.match(f.warnings[0], /valid aggregate was retained/);
});

test('optional fields are sanitized, HTTPS links only, and author profiles never become direct review links', async () => {
  const f = fixture({ fetchImpl: async () => Response.json(payload({ googleMapsUri: 'javascript:alert(1)', reviews: [
    review({ authorAttribution: { displayName: 'Real author', uri: 'https://www.google.com/maps/contrib/123', photoUri: 'data:image/svg+xml,bad' }, googleMapsUri: undefined, relativePublishTimeDescription: {} }),
    review({ authorAttribution: { displayName: 'Another author', uri: 'javascript:alert(1)', photoUri: 'http://example.com/photo' }, googleMapsUri: 'https://user:password@example.com/review' }),
    review({ googleMapsUri: 123, authorAttribution: { displayName: 'Third author', uri: {}, photoUri: [] } }),
    review({ authorAttribution: { displayName: 'Real author', uri: 'https://www.google.com/maps/contrib/123', photoUri: 'data:image/svg+xml,bad' }, relativePublishTimeDescription: {} }),
    review({ authorAttribution: { displayName: 'Another author', uri: 'javascript:alert(1)', photoUri: 'http://example.com/photo' } }),
    review({ authorAttribution: { displayName: 'Third author', uri: {}, photoUri: [] } }),
  ] })) });
  const result = await f.loader();
  assert.match(result.url, /^https:\/\/www\.google\.com\/maps\/search/);
  assert.equal(result.reviews.length, 3);
  assert.equal(result.source.rejectedReviews, 3);
  assert.equal(result.count, 123);
  assert.equal(result.reviews[0].authorUrl, 'https://www.google.com/maps/contrib/123');
  for (const item of result.reviews) { assert.equal(item.photo, null); assert.equal(item.reviewUrl, 'https://www.google.com/maps/reviews/example'); }
  assert.equal(result.reviews[0].relativeTime, '');
  assert.equal(result.reviews[1].authorUrl, null);
  assert.equal(result.reviews[2].authorUrl, null);
});

test('an absent/malformed reviews array retains a valid aggregate, and no more than five cards are rendered', async () => {
  for (const reviews of [undefined, null, 'malformed', {}, Array.from({ length: 7 }, () => review())]) {
    const f = fixture({ fetchImpl: async () => Response.json(payload({ reviews })) });
    const result = await f.loader();
    assert.equal(result.count, 123); assert.equal(result.rating, 4.7);
    assert.equal(result.reviews.length, Array.isArray(reviews) ? 5 : 0);
  }
});

test('review language follows the displayed text and accepts only bounded valid language tags', async () => {
  const f = fixture({ fetchImpl: async () => Response.json(payload({ reviews: [
    review({ text: { text: 'Translated text.', languageCode: 'en-gb' }, originalText: { text: 'Texte original.', languageCode: 'fr' } }),
    review({ text: { text: {} }, originalText: { text: 'Originaltext.', languageCode: 'de' } }),
    review({ text: { text: 'Unspecified language.', languageCode: 'en" onload="bad' } }),
    review({ text: { text: 'Invalid language.', languageCode: 'abcd-' + 'abcd-'.repeat(20) } }),
    review({ text: { text: 'Bad tag.', languageCode: {} } }),
  ] })) });
  const result = await f.loader();
  assert.deepEqual(result.reviews.map((item) => item.textLanguage), ['en-GB', 'de', null, null, null]);
  assert.equal(result.reviews[1].text, 'Originaltext.');
});

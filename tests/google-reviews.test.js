import test from 'node:test';
import assert from 'node:assert/strict';
import { getGoogleReviews } from '../src/data/googleReviews.js';

test('review links have localized copy and point to the same public club listing', async () => {
  const results = await Promise.all(['en', 'fr', 'de'].map(getGoogleReviews));
  assert.deepEqual(results.map(({ eyebrow }) => eyebrow), ['Reviews', 'Avis', 'Bewertungen']);
  assert.equal(new Set(results.map(({ cta }) => cta)).size, 3);
  assert.equal(new Set(results.map(({ url }) => url)).size, 1);
  for (const result of results) {
    assert.ok(result.title && result.lead && result.cta);
    const url = new URL(result.url);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'www.google.com');
    assert.match(url.pathname, /^\/maps/);
    assert.equal(url.username + url.password, '');
    for (const field of ['rating', 'count', 'reviews']) assert.equal(result[field], undefined);
  }
});

test('unsupported locales safely use English', async () => {
  const english = await getGoogleReviews('en');
  for (const locale of [undefined, 'lu', '__proto__', 'constructor']) {
    assert.deepEqual(await getGoogleReviews(locale), english);
  }
});

test('all locales work without making API requests even when legacy credentials exist', async (t) => {
  const oldKey = process.env.GOOGLE_PLACES_API_KEY;
  const oldPlace = process.env.GOOGLE_PLACE_ID;
  process.env.GOOGLE_PLACES_API_KEY = 'unused-test-only-key';
  process.env.GOOGLE_PLACE_ID = 'unused-test-only-place';
  t.after(() => {
    if (oldKey === undefined) delete process.env.GOOGLE_PLACES_API_KEY;
    else process.env.GOOGLE_PLACES_API_KEY = oldKey;
    if (oldPlace === undefined) delete process.env.GOOGLE_PLACE_ID;
    else process.env.GOOGLE_PLACE_ID = oldPlace;
  });
  const fetch = t.mock.method(globalThis, 'fetch', () => {
    throw new Error('The static review link must not fetch Google data.');
  });
  await Promise.all(['en', 'fr', 'de'].map(getGoogleReviews));
  assert.equal(fetch.mock.callCount(), 0);
});

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getGoogleReviews } from '../src/data/googleReviews.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const preload = new URL('../tests/fixtures/reject-google-places-fetch.mjs', import.meta.url).href;
// Legacy deployment variables must never re-enable API requests or reach HTML.
const env = { ...process.env, GOOGLE_PLACES_API_KEY: 'unused-build-test-key', GOOGLE_PLACE_ID: 'unused-build-test-place' };
await new Promise((accept, reject) => {
  const child = spawn(process.execPath, ['--import', preload, 'node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  child.stdout.on('data', (chunk) => { log += chunk; });
  child.stderr.on('data', (chunk) => { log += chunk; });
  child.on('error', reject);
  child.on('exit', (code) => code === 0 ? accept() : reject(new Error(`Production build failed:\n${log.slice(-6000)}`)));
});

for (const lang of ['en', 'fr', 'de']) {
  const data = await getGoogleReviews(lang);
  const encodedUrl = data.url.replaceAll('&', '&amp;');
  for (const page of [`${lang}/index.html`, `${lang}/tandem/index.html`]) {
    const html = await readFile(resolve(root, 'dist', page), 'utf8');
    const section = html.match(/<div\b[^>]*class="google-rating"[\s\S]*?<\/section>/)?.[0];
    assert.ok(section, `${page}: missing reviews link section`);
    assert.ok(section.includes(`href="${encodedUrl}"`), `${page}: incorrect Google listing link`);
    assert.ok(section.includes(data.cta), `${page}: missing localized button`);
    assert.match(section, /target="_blank"/);
    assert.match(section, /rel="[^"]*noopener[^"]*noreferrer[^"]*"/);
    assert.doesNotMatch(section, /google-rating__(stars|score|count)|class="review__text"|AggregateRating|4\.5|>69\s/);
    assert.doesNotMatch(html, /places\.googleapis\.com|unused-build-test-key|unused-build-test-place/);
    console.log(`${page}: localized Google link, no rating/count/cards, no API credentials.`);
  }
}
console.log('Production build passed with zero Places API requests.');

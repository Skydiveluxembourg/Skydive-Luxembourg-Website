import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), 'google-reviews-build-'));
const preload = new URL('../tests/fixtures/google-places-fetch.mjs', import.meta.url).href;
const pages = ['en', 'fr', 'de'].flatMap((lang) => [`${lang}/index.html`, `${lang}/tandem/index.html`]);
try {
  // Leave ordinary unavailable-data output in dist after the test. Synthetic
  // ratings/reviews are never a production data source or committed artifact.
  for (const scenario of ['success', 'missing']) {
    const callsPath = join(temporary, `${scenario}.txt`);
    const env = { ...process.env, GOOGLE_REVIEWS_TEST_SCENARIO: scenario, GOOGLE_REVIEWS_TEST_CALLS: callsPath,
      GOOGLE_PLACES_API_KEY: scenario === 'success' ? 'synthetic-test-key' : '', GOOGLE_PLACE_ID: scenario === 'success' ? 'test-skydive-place' : '', GOOGLE_PLACES_LANGUAGE: 'en' };
    const output = await new Promise((accept, reject) => {
      const child = spawn(process.execPath, ['--import', preload, 'node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
      let log = '';
      child.stdout.on('data', (chunk) => { log += chunk; }); child.stderr.on('data', (chunk) => { log += chunk; });
      child.on('error', reject); child.on('exit', (code) => code === 0 ? accept(log) : reject(new Error(`The ${scenario} production build failed:\n${log.slice(-6000)}`)));
    });
    const calls = await readFile(callsPath, 'utf8').catch(() => '');
    assert.equal(calls.split('\n').filter(Boolean).length, scenario === 'success' ? 1 : 0, `${scenario}: must share one Google request across every page/locale`);
    for (const page of pages) {
      const html = await readFile(resolve(root, 'dist', page), 'utf8');
      const section = html.match(/<div\b[^>]*class="google-rating"[\s\S]*?<\/section>/)?.[0];
      assert.ok(section, `${page}: missing rating section`);
      assert.match(section, /target="_blank"/, `${page}: missing Google link`);
      assert.doesNotMatch(html, /synthetic-test-key/, `${page}: API key leaked`);
      if (scenario === 'success') {
        assert.match(section, /data-google-reviews-status="available"/);
        assert.match(section, />4\.8<\/strong>/);
        assert.match(section, />123 /, `${page}: total must come from userRatingCount`);
        assert.equal((section.match(/class="review__text"/g) ?? []).length, 5, `${page}: five cards are distinct from 123 ratings`);
      } else {
        assert.match(section, /data-google-reviews-status="unavailable"/);
        assert.doesNotMatch(section, /google-rating__(stars|score|count)|class="review__text"|Synthetic fixture|>69 |4\.5/);
      }
    }
    if (scenario === 'missing') assert.match(output, /GOOGLE_PLACES_API_KEY[\s\S]*GOOGLE_PLACE_ID/);
    console.log(`Google reviews ${scenario}: production build and six EN/FR/DE Home/Tandem pages passed.`);
  }
} finally {
  // mkdtemp supplies the exact task-owned target; never remove a computed parent.
  await rm(temporary, { recursive: true, force: true });
}

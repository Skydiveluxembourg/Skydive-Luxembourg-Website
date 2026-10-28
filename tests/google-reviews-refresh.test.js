import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFileSync, existsSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { requestRefresh, validateBuildHook } from '../scripts/request-google-reviews-refresh.mjs';

// Synthetic ID only; tests never call Netlify.
const HOOK = 'https://api.netlify.com/build_hooks/0123456789abcdef01234567';

test('missing or unexpected hook destinations fail before a request is sent', async () => {
  for (const hook of ['', undefined, 'not-a-url', HOOK.replace('https:', 'http:'),
    HOOK.replace('api.netlify.com', 'api.netlify.com.example.org'),
    HOOK.replace('api.netlify.com', 'secret@api.netlify.com'), `${HOOK}?trigger_branch=other`,
    `${HOOK}#fragment`, `${HOOK}/`, HOOK.replace('build_hooks', 'api/v1/sites')]) {
    let called = false;
    await assert.rejects(requestRefresh({ hook, fetchImpl: async () => { called = true; } }), (error) => {
      assert.ok(!error.message.includes('0123456789abcdef01234567'));
      return true;
    });
    assert.equal(called, false);
  }
  assert.equal(validateBuildHook(` ${HOOK}\n`).href, HOOK);
});

test('request uses the main branch, bounded timeout and no redirect following', async () => {
  let cancelled = false;
  const result = await requestRefresh({ hook: HOOK, fetchImpl: async (url, options) => {
    assert.equal(url.searchParams.get('trigger_branch'), 'main');
    assert.equal(options.method, 'POST');
    assert.equal(options.redirect, 'manual');
    assert.equal(options.body, '{}');
    assert.ok(options.signal instanceof AbortSignal);
    return { status: 202, body: { cancel: async () => { cancelled = true; } }, text: () => { throw new Error('Must not read response payload'); } };
  } });
  assert.equal(cancelled, true);
  assert.match(result, /Rebuild requested/);
  assert.match(result, /not a completed Google reviews import/);
  assert.ok(!result.includes(HOOK));
});

test('redirects and failed responses are errors without leaking payloads', async () => {
  for (const status of [301, 302, 307, 400, 401, 404, 429, 500]) {
    await assert.rejects(requestRefresh({ hook: HOOK, fetchImpl: async () => ({
      status, text: () => { throw new Error(`Payload containing ${HOOK}`); },
    }) }), (error) => {
      assert.match(error.message, new RegExp(`HTTP ${status}`));
      assert.ok(!error.message.includes(HOOK));
      return true;
    });
  }
});

test('network and timeout errors do not leak the secret URL', async () => {
  for (const name of ['TypeError', 'TimeoutError']) {
    await assert.rejects(requestRefresh({ hook: HOOK, fetchImpl: async () => {
      const error = new Error(`Failed request to ${HOOK}`); error.name = name; throw error;
    } }), (error) => {
      assert.match(error.message, /outcome is unknown/);
      assert.ok(!error.message.includes(HOOK));
      return true;
    });
  }
});

test('CLI fails visibly for missing configuration and writes an honest summary', () => {
  const summary = join(tmpdir(), `skydive-review-request-${randomUUID()}.md`);
  try {
    const result = spawnSync(process.execPath, [fileURLToPath(new URL('../scripts/request-google-reviews-refresh.mjs', import.meta.url))], {
      env: { ...process.env, NODE_OPTIONS: '', NETLIFY_BUILD_HOOK: '', GITHUB_ACTIONS: 'true', GITHUB_REF: 'refs/heads/main', GITHUB_STEP_SUMMARY: summary },
      encoding: 'utf8', timeout: 5000,
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /NETLIFY_BUILD_HOOK is missing/);
    assert.match(readFileSync(summary, 'utf8'), /does not confirm a Google API response, completed import/);
  } finally {
    if (existsSync(summary)) unlinkSync(summary);
  }
});

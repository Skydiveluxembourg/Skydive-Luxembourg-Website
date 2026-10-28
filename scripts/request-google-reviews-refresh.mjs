import { appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const REQUEST_TIMEOUT_MS = 15000;

export function validateBuildHook(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('NETLIFY_BUILD_HOOK is missing. No rebuild was requested.');
  }
  let url;
  try { url = new URL(value.trim()); } catch { /* Report only a fixed message. */ }
  if (!url || url.origin !== 'https://api.netlify.com' || url.username || url.password ||
      !/^\/build_hooks\/[a-f0-9]+$/.test(url.pathname) || url.search || url.hash) {
    throw new Error('NETLIFY_BUILD_HOOK must be an unmodified HTTPS Netlify build-hook URL. No rebuild was requested.');
  }
  return url;
}

export async function requestRefresh({ hook, fetchImpl = globalThis.fetch } = {}) {
  const url = validateBuildHook(hook);
  // Explicitly choose the production branch, independently of the hook default.
  // The hook must still be checked against the correct project in Netlify.
  url.searchParams.set('trigger_branch', 'main');
  let response;
  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    // Network errors can contain the secret URL. Never print their details.
    throw new Error('The build-hook request failed or timed out. Its outcome is unknown; check Netlify before retrying.');
  }
  // The response may contain deployment metadata. Do not read or log it.
  try { await response.body?.cancel(); } catch { /* Discard the body. */ }
  if (!Number.isInteger(response.status) || response.status < 200 || response.status >= 300) {
    const status = Number.isInteger(response.status) ? ` (HTTP ${response.status})` : '';
    throw new Error(`Netlify did not accept the rebuild request${status}. Redirects are not followed. No completed import was verified.`);
  }
  return 'Rebuild requested. This is not a completed Google reviews import. Verify the Netlify build log and published website.';
}

async function main() {
  let result;
  let failed = false;
  try {
    if (process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_REF !== 'refs/heads/main') {
      throw new Error('Run the refresh workflow from main. No rebuild was requested.');
    }
    result = await requestRefresh({ hook: process.env.NETLIFY_BUILD_HOOK });
    console.log(result);
  } catch (error) {
    failed = true;
    result = error.message;
    console.error(`::error::${result}`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      await appendFile(process.env.GITHUB_STEP_SUMMARY, `## Google reviews refresh request\n\n${failed ? '**Request failed.** ' : '**Request accepted.** '}${result}\n\nA successful workflow only requests a rebuild; it does not confirm a Google API response, completed import, successful deploy, or live review count.\n`);
    } catch {
      failed = true;
      console.error('::error::The workflow summary could not be written.');
    }
  }
  if (failed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();

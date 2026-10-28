// Build-test guard only: the link-only feature must never call the Places API.
const originalFetch = globalThis.fetch;
let googleRequests = 0;
globalThis.fetch = async (input, options) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  if (url.hostname !== 'places.googleapis.com') return originalFetch(input, options);
  googleRequests++;
  throw new Error('The static Google reviews link must not call the Places API.');
};
process.on('beforeExit', () => {
  if (googleRequests > 0) {
    console.error(`Google reviews build check failed: ${googleRequests} unexpected Places API request(s).`);
    process.exitCode = 1;
  }
});

// Synthetic build-test data only. Never used by a normal/Netlify build.
import { appendFileSync } from 'node:fs';
const scenario = process.env.GOOGLE_REVIEWS_TEST_SCENARIO;
if (scenario) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, options) => {
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
    if (url.hostname !== 'places.googleapis.com') return originalFetch(input, options);
    appendFileSync(process.env.GOOGLE_REVIEWS_TEST_CALLS, 'request\n');
    if (scenario === 'missing') throw new Error('The missing-credentials build must not call Google.');
    return Response.json({
      id: 'test-skydive-place', displayName: { text: 'Synthetic test club' }, formattedAddress: 'Test address, Luxembourg',
      rating: 4.8, userRatingCount: 123, googleMapsUri: 'https://maps.google.com/?cid=123',
      reviews: [
        { rating: 5, text: { text: { invalid: true } } },
        ...Array.from({ length: 5 }, (_, index) => ({
          rating: 5, text: { text: `Synthetic fixture review ${index + 1}. Not a real Google review.`, languageCode: 'en' },
          authorAttribution: { displayName: `Test author ${index + 1}`, uri: `https://www.google.com/maps/contrib/${index + 1}` },
          googleMapsUri: `https://www.google.com/maps/reviews/${index + 1}`,
        })),
      ],
    });
  };
}

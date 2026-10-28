# Google reviews: public link only

The Home and Tandem pages link visitors to Skydive Luxembourg on Google Maps.
The link text is localized in English, French and German. Visitors read the
listing's current ratings and reviews on Google; the website does not copy
or display stars, numerical ratings, review counts, quote cards or author
photos.

The destination is the verified **Skydive Luxembourg** listing at **32 Op der
Louh, 9676 Noertrange Winseler**, whose website is `skydive.lu` (checked on
28 October 2026):

[Open Skydive Luxembourg on Google Maps](https://www.google.com/maps?cid=8630232517449509494)

## No API or automatic imports

This is an ordinary public link, requiring no API key or paid Places API.

The website makes no Google Places API requests during builds or page loads.
There is no review import, review cache, weekly review rebuild or review
refresh helper. No Google Cloud project, API credentials, billing account or
Netlify build hook is required for this feature. The existing closed Google
billing account should stay closed.

The previous `Refresh Google reviews` workflow and its requester have been
removed from source. The live GitHub workflow was also disabled on 28 October
2026 (`disabled_manually`), stopping scheduled review builds before this change
reaches the default branch. It should remain disabled. This workflow setting
does not require a website deployment.

Any previously configured Google review credentials or review-only build hook
are unused by this approach. An owner may remove obsolete configuration after
checking that no other feature uses it. Do not delete a shared hook or
credentials based only on this document.

## Maintaining the link

- Keep the localized labels clear that the destination is Google Maps.
- If the club's listing changes, update the public destination and check that
  it opens Skydive Luxembourg in Noertrange. The destination and localized copy
  live in `src/data/googleReviews.js`.
- Keep Home and Tandem consistent across all active languages.
- Do not reintroduce a remembered rating or count: it would become stale.

No API keys or external network calls are needed to build and test this
link-only feature locally. `.env.example` intentionally has no Google Places
settings.

Run `npm test` for the localized-link unit checks, a production build guarded
against Places API requests (even with legacy variables present), all six
EN/FR/DE Home and Tandem page checks, and the existing SEO tests.

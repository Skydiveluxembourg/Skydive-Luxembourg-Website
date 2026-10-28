# Google reviews: import, scheduled refresh and verification

The Home and Tandem review sections use a **build-time** Google Places API
(New) Place Details request. A successful import supplies the rating, total
review count and up to five reviews selected by Google's relevance order.
These are a snapshot from that build, not a live browser feed or necessarily
the newest reviews. The import is memoized across pages/locales in one build.

- Import: [`src/data/googleReviews.js`](../src/data/googleReviews.js)
- Review cards: [`src/components/sections/GoogleReviewCards.astro`](../src/components/sections/GoogleReviewCards.astro)
- Rating: [`src/components/sections/GoogleRating.astro`](../src/components/sections/GoogleRating.astro)
- Schedule: [`.github/workflows/refresh-google-reviews.yml`](../.github/workflows/refresh-google-reviews.yml)
- Hook requester: [`scripts/request-google-reviews-refresh.mjs`](../scripts/request-google-reviews-refresh.mjs)

The API key stays in the build environment. There is no browser review-API
request. Author portraits can still load from Google's image hosts according
to the site's image policy; do not describe this as zero third-party traffic.

## Confirmed investigation status — 28 October 2026

- GitHub reported the refresh workflow as `disabled_inactivity`. Its last
  scheduled run was on 7 September 2026. That run reached the hook request;
  its success does not prove the Google import or Netlify deploy succeeded.
- The workflow has now been re-enabled. This alone does not repair Google's
  API permissions or verify that another scheduled run has completed.
- The repository secret named `NETLIFY_BUILD_HOOK` exists. GitHub exposes its
  name/update date, **not its value**; this inspection cannot establish which
  Netlify project it targets.
- A public production build log from 25 October showed Places API HTTP 403
  `PERMISSION_DENIED`. Credentials were nonempty at that request. The precise
  Google project, billing or key-restriction cause is not yet verified.
- Netlify environment-variable access was unavailable to this investigation.
  Production configuration and the hook's project must be checked by an owner.

These code changes improve failure handling and visibility. They do not prove
that production imports are repaired; merging/deploying and checking a real
import remain separate steps.

## Owner configuration checks

### Google Cloud and the listing

1. Open the Google Cloud project belonging to the build's API key. Verify that
   **Places API (New)** is enabled, billing is active, and quotas permit the
   request. An HTTP 403 alone does not identify which setting is wrong.
2. Restrict the key to the required API. Review application restrictions
   against the actual server-side Netlify build request. A browser-referrer
   restriction is for browser use; do not assume it permits a build runner.
   See Google's [API security guidance](https://developers.google.com/maps/api-security-best-practices).
3. Confirm the listing is **Skydive Luxembourg, Noertrange** using Google's
   [Place ID guide](https://developers.google.com/maps/documentation/places/web-service/place-id).
   Use that listing's exact Place ID. Do not substitute a Google Maps URL.

### Netlify build environment

In the Netlify project serving `skydive.lu`, configure the following variables
for the **Builds** scope and the **production** context. Check preview contexts
separately; a value present only in a preview does not configure production.

| Variable | Value |
| --- | --- |
| `GOOGLE_PLACES_API_KEY` | API key from the verified Google Cloud project; mark secret |
| `GOOGLE_PLACE_ID` | Verified listing's Place ID |
| `GOOGLE_PLACES_LANGUAGE` | Optional response language; defaults to `en` |

Never use a `PUBLIC_` prefix, commit a real `.env`, print keys in logs or embed
credentials in a client bundle. `.env.example` contains empty placeholders
for local development only. The current importer returns no numeric rating,
count or review cards when an import is unavailable; it keeps a link to
Google. It does not silently reuse the old 4.5 / 69 aggregate.

### Netlify hook and GitHub schedule

1. In the **same Netlify project**, open Project configuration → Developer
   settings → Continuous deployment → Build hooks. Confirm the connected
   repository and production branch `main`, and that builds are active.
2. Check/create a dedicated refresh hook for `main`. Store its unmodified base
   URL in the GitHub Actions repository secret `NETLIFY_BUILD_HOOK`. Treat the
   entire URL as a secret. GitHub cannot reveal an existing secret to compare;
   an owner can replace it with the verified hook if necessary.
3. Confirm **Refresh Google reviews** is enabled in GitHub Actions. The new
   schedule requests a rebuild on Mondays at **06:17 UTC**. Manual runs must
   use `main`. The requester also specifies `trigger_branch=main`, but that
   cannot correct a hook belonging to the wrong Netlify project.

The requester accepts only HTTPS `api.netlify.com/build_hooks/...` URLs,
rejects credentials/query strings/fragments in the supplied secret, does not
follow redirects, and imposes a 15-second request timeout. Missing/invalid
secrets, HTTP failures and network failures fail the workflow. It does not
log the hook URL or response payload, and does not retry automatically: a
network timeout can happen after Netlify accepted a request.

A successful Actions summary says **Rebuild requested**, explicitly not a
completed Google reviews import. Netlify still has to build and publish.
See [Netlify build hooks](https://docs.netlify.com/build/configure-builds/build-hooks/).

GitHub can delay/drop scheduled runs and disables public-repository schedules
after 60 days without repository activity. Check Actions periodically and
re-enable when needed; a weekly schedule is not a monitoring guarantee.
See [GitHub scheduled workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

## Verify the whole chain

After an authorized refresh/deploy:

1. Confirm the Actions job requested the rebuild, rather than stopping at
   configuration validation or an HTTP error.
2. Find the corresponding Netlify build for the verified project and `main`.
   Confirm that build completed and was published to the production domain.
3. Inspect the import's `[google-reviews]` log lines. An HTTP error, timeout,
   missing configuration or rejected listing/aggregate means the import was
   unavailable even if the overall static-site build succeeded. Diagnostic
   messages contain only safe status/reason details, not Google response bodies.
4. Check Home and Tandem on the published domain. Compare the displayed
   aggregate with the verified Google listing. An unavailable state should
   show the Google link without a stale numerical rating or invented reviews.

`getGoogleReviews()` also returns `source` metadata for diagnostics:
`status: 'live'` includes `fetchedAt`, verified listing fields, `reviewCount`
and `rejectedReviews`; `status: 'unavailable'` includes a reason such as
`missing-configuration`, `http-error`, `timeout` or `place-mismatch`. Use the
status to distinguish a completed import from a completed site build.

Local requester checks make no network calls:

```sh
node --test tests/google-reviews-refresh.test.js
```

## Google usage, attribution and storage

The old guide's blanket **30-day review cache permission was incorrect**.
Google prohibits storing/caching Places content except stated exceptions;
Place IDs may be retained. The service-specific 30-day exception concerns
latitude/longitude, not review text. Weekly rebuilds do not establish
permission to retain reviews in static HTML, CDN copies or old deploys.
Review this storage architecture against the account's applicable agreement
before enabling production imports; EEA billing accounts have separate terms.
Sources: [Places policies](https://developers.google.com/maps/documentation/places/web-service/policies),
[service terms](https://cloud.google.com/maps-platform/terms/maps-service-terms),
[EEA service terms](https://cloud.google.com/terms/maps-platform/eea/maps-service-terms).

Display Google Maps branding using the official logo where possible (text is
allowed when space is limited). Preserve author attribution and direct source
links; explain relevance ordering/filtering. Identify translated review text
where appropriate. Check the current [attribution requirements](https://developers.google.com/maps/documentation/places/web-service/policies#google_maps_attribution_requirements)
and the site's public terms/privacy disclosures; a plain “Reviews from Google”
label alone is not a complete compliance check. Never commit real API responses,
review text or author photos into source, tests or documentation. Regression
tests use explicitly synthetic fixtures instead of copied Google content.

The API returns at most five reviews, ordered by relevance; it is not an
all-reviews export. See the [Place resource reference](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#Place).
Do not describe these cards as “recent” unless that is actually established.

## Billing

Places API requires a billing-enabled Google Cloud project. Requesting review
bodies uses the **Place Details Enterprise + Atmosphere** SKU. Pricing and
monthly usage caps are SKU/account dependent; check the current
[pricing list](https://developers.google.com/maps/billing-and-pricing/pricing)
and [usage/billing guide](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing/).
A weekly cadence is a small request volume, not a promise of free service.
Production, manual and preview builds may all count toward usage.

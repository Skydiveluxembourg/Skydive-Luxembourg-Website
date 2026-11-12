/**
 * emailNotice.js - addresses from the mail@skydive.lu outage (November 2026).
 *
 * mail@skydive.lu was out of service for 15 days, so visitors were asked to
 * write to the fallback address in the meantime. The mailbox works again and
 * the site-wide banner has been removed. These values are used by the club
 * news article in clubNews.js that tells the story.
 */

export const AFFECTED_EMAIL = 'mail@skydive.lu';
export const FALLBACK_EMAIL = 'mail@cerclepara.lu';

// The single news article covering the outage and the fix. The earlier
// announcement at /<lang>/news/2026-11-10-email-problems/ was merged into it
// and is redirected here in netlify.toml.
export const EMAIL_OUTAGE_POST_ID = '2026-11-12-email-outage-resolved';

/**
 * emailNotice.js - TEMPORARY notice about the club mailbox (November 2026).
 *
 * mail@skydive.lu is having problems, so the site asks visitors to write to
 * the fallback address instead. Used by the site-wide NoticeBanner and by the
 * matching club news article in clubNews.js.
 *
 * Once mail@skydive.lu works again, set SHOW_EMAIL_NOTICE to false to take
 * the banner down on every page. The news article stays as a dated record.
 */

// Master switch - flip to false to hide the banner on every page.
export const SHOW_EMAIL_NOTICE = true;

export const AFFECTED_EMAIL = 'mail@skydive.lu';
export const FALLBACK_EMAIL = 'mail@cerclepara.lu';

// The club news article the banner links to.
export const EMAIL_NOTICE_POST_ID = '2026-11-10-email-problems';

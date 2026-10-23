/** Add the static host's trailing slash to locale page links, before any query/hash. */
export function pageHref(href) {
  if (typeof href !== 'string' || !/^\/(en|fr|de|lu)(?=\/|[?#]|$)/.test(href)) {
    return href;
  }

  const suffixIndex = href.search(/[?#]/);
  const path = suffixIndex === -1 ? href : href.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : href.slice(suffixIndex);

  // Files (including downloads) keep their exact paths.
  if (path.endsWith('/') || /\/[^/]*\.[^/]+$/.test(path)) return href;
  return `${path}/${suffix}`;
}

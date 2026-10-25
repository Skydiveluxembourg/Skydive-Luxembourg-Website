import { pageHref } from './urls.js';

// Describe the same hierarchy visitors use in the menu and article back links.
export function buildBreadcrumbSchema({ canonicalUrl, title, lang, siteUrl }) {
  const path = new URL(canonicalUrl).pathname;
  const homePath = `/${lang}/`;
  if (path === homePath) return undefined;

  const labels = {
    en: { home: 'Home', news: 'Club news' },
    fr: { home: 'Accueil', news: 'Actualités du club' },
    de: { home: 'Startseite', news: 'Neuigkeiten aus dem Verein' },
  };
  const copy = labels[lang] ?? labels.en;
  const items = [{ name: copy.home, item: new URL(homePath, siteUrl).href }];
  if (path.startsWith(`/${lang}/news/`) && path !== `/${lang}/news/`) {
    items.push({ name: copy.news, item: new URL(`/${lang}/news/`, siteUrl).href });
  }
  items.push({ name: title.split(' | ')[0], item: canonicalUrl });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, ...item,
    })),
  };
}

export function newsArticleSchema({ post, headline, description, lang, siteUrl, image }) {
  const canonicalUrl = new URL(pageHref(`/${lang}/news/${post.id}/`), siteUrl).href;
  const dates = (post.updates ?? [post]).map((item) => item.date).filter(Boolean).sort();
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    url: canonicalUrl,
    headline,
    description,
    inLanguage: lang,
    mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` },
    isPartOf: { '@id': new URL(`/${lang}/news/#webpage`, siteUrl).href },
    author: {
      '@type': 'SportsOrganization',
      '@id': `${siteUrl}/#organization`,
      name: 'Skydive Luxembourg a.s.b.l.',
      url: siteUrl,
    },
    publisher: { '@id': `${siteUrl}/#organization` },
    ...(image && { image: {
      '@type': 'ImageObject', url: image.url, width: image.width, height: image.height,
      caption: image.alt,
    } }),
    // A report/event date is not evidence of its first publication on this site.
    ...(dates.length && { temporalCoverage: dates[0] === dates.at(-1) ? dates[0] : `${dates[0]}/${dates.at(-1)}` }),
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    ...(post.modifiedAt && { dateModified: post.modifiedAt }),
  };
}

// Prevent future editorial text from terminating a JSON-LD script element.
export const serializeSchema = (schema) => JSON.stringify(schema).replace(/</g, '\\u003c');

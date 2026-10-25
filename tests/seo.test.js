import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serializeSchema } from '../src/utils/seo.js';

const origin = 'https://skydive.lu';
const locales = ['en', 'fr', 'de'];
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
assert.ok(existsSync(dist), 'Build the site before running the dist SEO tests.');

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function decode(text) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  return text.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (_, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()];
    return String.fromCodePoint(parseInt(entity.slice(entity[1].toLowerCase() === 'x' ? 2 : 1), entity[1].toLowerCase() === 'x' ? 16 : 10));
  });
}

const plainText = (html) => decode(html.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

function attributes(source) {
  return Object.fromEntries([...source.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=\x60<>]+)))?/g)]
    .map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? '')]));
}

const tags = (html, name) => [...html.matchAll(new RegExp('<' + name + '\\b([^>]*)>', 'gi'))].map((match) => attributes(match[1]));
const hasType = (node, type) => [node['@type']].flat().includes(type);

function schemaNodes(value) {
  if (Array.isArray(value)) return value.flatMap(schemaNodes);
  if (!value || typeof value !== 'object') return [];
  return [value, ...Object.values(value).flatMap(schemaNodes)];
}

function localFile(value) {
  const url = new URL(value, origin);
  assert.equal(url.origin, origin, 'Unexpected external URL: ' + value);
  const pathname = decodeURIComponent(url.pathname);
  const path = resolve(dist, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
  assert.ok(!relative(dist, path).startsWith('..' + sep), 'URL escaped dist: ' + value);
  assert.ok(existsSync(path), 'Missing built target: ' + value);
  return path;
}

const pages = walk(dist).filter((path) => path.endsWith('.html')).sort().map((path) => {
  const html = readFileSync(path, 'utf8');
  const links = tags(html, 'link');
  const meta = tags(html, 'meta');
  const pathname = '/' + relative(dist, path).split(sep).join('/').replace(/index\.html$/, '');
  const robots = meta.filter((item) => item.name?.toLowerCase() === 'robots').map((item) => item.content).join(', ');
  return {
    path, pathname, html, links, meta, robots,
    indexable: !/\bnoindex\b/i.test(robots),
    canonical: links.find((item) => item.rel?.split(/\s+/).includes('canonical'))?.href,
    alternates: links.filter((item) => item.hreflang),
    h1: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => plainText(match[1])),
    title: [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((match) => plainText(match[1])),
    schemas: [],
  };
});
const indexable = pages.filter((page) => page.indexable);
const byCanonical = new Map(indexable.map((page) => [page.canonical, page]));
const isArticle = (page) => /^\/(en|fr|de)\/news\/[^/]+\/$/.test(page.pathname);

function metadata(page, key) {
  const matches = page.meta.filter((item) => item.name === key || item.property === key);
  assert.equal(matches.length, 1, page.pathname + ': expected one ' + key);
  assert.ok(matches[0].content?.trim(), page.pathname + ': empty ' + key);
  return matches[0].content;
}

function absolute(value, label) {
  let url;
  assert.doesNotThrow(() => { url = new URL(value); }, label + ': URL must be absolute');
  assert.equal(url.origin, origin, label + ': unexpected canonical origin');
  assert.equal(url.protocol, 'https:', label + ': HTTPS required');
  return url;
}

// Inspect the file bytes rather than trusting the dimensions printed in HTML.
const dimensionsCache = new Map();
function imageDimensions(path) {
  if (dimensionsCache.has(path)) return dimensionsCache.get(path);
  const data = readFileSync(path);
  let size;
  if (data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    size = { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  } else if (data[0] === 0xff && data[1] === 0xd8) {
    const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
    let offset = 2;
    while (offset + 4 < data.length) {
      if (data[offset++] !== 0xff) continue;
      while (data[offset] === 0xff) offset++;
      const marker = data[offset++];
      if (marker === 0xd9 || marker === 0xda) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) continue;
      if (sof.has(marker)) {
        size = { width: data.readUInt16BE(offset + 5), height: data.readUInt16BE(offset + 3) };
        break;
      }
      const length = data.readUInt16BE(offset);
      assert.ok(length >= 2, 'Invalid JPEG marker in ' + path);
      offset += length;
    }
  } else if (data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP') {
    for (let offset = 12; offset + 8 <= data.length;) {
      const type = data.toString('ascii', offset, offset + 4);
      const length = data.readUInt32LE(offset + 4);
      const start = offset + 8;
      if (type === 'VP8X') {
        size = { width: data.readUIntLE(start + 4, 3) + 1, height: data.readUIntLE(start + 7, 3) + 1 };
      } else if (type === 'VP8L' && data[start] === 0x2f) {
        const bits = data.readUInt32LE(start + 1);
        size = { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
      } else if (type === 'VP8 ' && data.toString('hex', start + 3, start + 6) === '9d012a') {
        size = { width: data.readUInt16LE(start + 6) & 0x3fff, height: data.readUInt16LE(start + 8) & 0x3fff };
      }
      if (size) break;
      offset = start + length + (length % 2);
    }
  }
  assert.ok(size?.width > 0 && size?.height > 0, 'Cannot read JPEG, PNG or WebP dimensions: ' + path);
  dimensionsCache.set(path, size);
  return size;
}

test('all canonical targets exist; indexable pages have unique metadata and one H1', () => {
  assert.ok(indexable.length > 0, 'No indexable HTML pages found.');
  const seen = { canonical: new Set(), title: new Set(), description: new Set() };
  for (const page of pages) {
    assert.equal(page.links.filter((link) => link.rel === 'canonical').length, 1, page.pathname + ': canonical count');
    const url = absolute(page.canonical, page.pathname);
    assert.equal(url.search + url.hash, '', page.pathname + ': canonical must not contain a query/fragment');
    localFile(page.canonical);
    if (!page.indexable) continue;
    assert.equal(url.pathname, page.pathname, page.pathname + ': canonical must identify this built page');
    assert.equal(page.title.length, 1, page.pathname + ': title count');
    assert.equal(page.h1.length, 1, page.pathname + ': H1 count');
    assert.ok(page.h1[0], page.pathname + ': empty H1');
    assert.match(page.robots, /max-image-preview:large/i, page.pathname + ': large image previews');
    const values = { canonical: page.canonical, title: page.title[0], description: metadata(page, 'description') };
    for (const [key, value] of Object.entries(values)) {
      const normalized = value.replace(/\s+/g, ' ').trim().toLowerCase();
      assert.ok(normalized, page.pathname + ': empty ' + key);
      assert.ok(!seen[key].has(normalized), page.pathname + ': duplicate ' + key + ': ' + value);
      seen[key].add(normalized);
    }
  }
});

test('EN/FR/DE alternates are reciprocal and omit noindex utilities', () => {
  for (const page of pages) {
    if (!page.indexable) {
      assert.equal(page.alternates.length, 0, page.pathname + ': noindex pages must not advertise hreflang');
      continue;
    }
    const locale = page.pathname.split('/')[1];
    assert.ok(locales.includes(locale), page.pathname + ': unexpected indexable language');
    const suffix = page.pathname.slice(locale.length + 1);
    assert.equal(page.alternates.length, 4, page.pathname + ': expected three locales and x-default');
    const alternatives = new Map(page.alternates.map((link) => [link.hreflang, link.href]));
    assert.deepEqual([...alternatives.keys()].sort(), [...locales, 'x-default'].sort(), page.pathname);
    for (const targetLocale of locales) {
      const expected = origin + '/' + targetLocale + suffix;
      assert.equal(alternatives.get(targetLocale), expected, page.pathname + ': wrong ' + targetLocale + ' alternate');
      absolute(expected, 'hreflang');
      localFile(expected);
      const target = byCanonical.get(expected);
      assert.ok(target, expected + ': alternate must be indexable');
      assert.equal(target.alternates.find((link) => link.hreflang === locale)?.href, page.canonical, expected + ': missing return link');
    }
    assert.equal(alternatives.get('x-default'), alternatives.get('en'), page.pathname + ': fallback must be English');
  }
  for (const page of pages.filter((item) => /\/thank-you\/$/.test(item.pathname) || item.pathname === '/' || item.pathname === '/404.html')) {
    assert.equal(page.indexable, false, page.pathname + ': utility must remain noindex');
  }
});

test('the sitemap contains exactly the built indexable canonicals', () => {
  const urls = [];
  const visited = new Set();
  function readSitemap(value) {
    const file = localFile(value);
    assert.ok(!visited.has(file), 'Repeated/circular sitemap: ' + value);
    visited.add(file);
    const xml = readFileSync(file, 'utf8');
    const locations = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => decode(match[1]).trim());
    assert.ok(locations.length > 0, 'Empty sitemap: ' + value);
    for (const location of locations) {
      absolute(location, 'sitemap location');
      if (/<sitemapindex\b/.test(xml)) readSitemap(location);
      else urls.push(location);
    }
  }
  readSitemap(origin + '/sitemap-index.xml');
  assert.equal(new Set(urls).size, urls.length, 'Sitemap contains duplicate URLs.');
  assert.ok(urls.every((value) => !/\/thank-you\/?$/.test(new URL(value).pathname)), 'Form receipts must not be in the sitemap.');
  assert.deepEqual(urls.sort(), indexable.map((page) => page.canonical).sort(), 'Sitemap/indexable-page mismatch');
});

test('JSON-LD parses and identifies the real Luxembourg sports club', () => {
  for (const page of pages) {
    const scripts = [...page.html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
      .filter((match) => attributes(match[1]).type === 'application/ld+json');
    page.schemas = scripts.flatMap((match) => {
      let value;
      assert.doesNotThrow(() => { value = JSON.parse(match[2]); }, page.pathname + ': invalid JSON-LD');
      return schemaNodes(value);
    });
    if (!page.indexable) continue;
    const organization = page.schemas.find((node) => node['@id'] === origin + '/#organization' && node.address);
    assert.ok(organization, page.pathname + ': missing club identity');
    assert.ok(hasType(organization, 'SportsOrganization'), page.pathname + ': club must be a sports organization');
    assert.ok(hasType(organization, 'SportsActivityLocation'), page.pathname + ': club must identify the sporting location');
    assert.equal(organization.name, 'Skydive Luxembourg a.s.b.l.');
    assert.equal(new URL(organization.url).href, origin + '/');
    assert.equal(organization.address.addressLocality, 'Noertrange');
    assert.equal(organization.address.addressCountry, 'LU');
    assert.match(organization.sport, /skydiving/i);
    localFile(organization.logo);
    localFile(organization.image);
    const webpage = page.schemas.find((node) => node['@id'] === page.canonical + '#webpage');
    assert.ok(webpage, page.pathname + ': missing WebPage identity');
    assert.equal(webpage.url, page.canonical);
    assert.equal(webpage.inLanguage, page.pathname.split('/')[1]);
  }
});

test('social images exist and their declared dimensions match actual large image files', () => {
  for (const page of indexable) {
    const image = metadata(page, 'og:image');
    absolute(image, page.pathname + ': social image');
    assert.equal(metadata(page, 'og:url'), page.canonical);
    assert.equal(metadata(page, 'og:title'), page.title[0]);
    assert.equal(metadata(page, 'og:description'), metadata(page, 'description'));
    assert.equal(metadata(page, 'twitter:image'), image);
    assert.equal(metadata(page, 'twitter:card'), 'summary_large_image');
    const size = imageDimensions(localFile(image));
    assert.ok(size.width >= 1200, page.pathname + ': actual social image is only ' + size.width + 'px wide');
    assert.equal(Number(metadata(page, 'og:image:width')), size.width, page.pathname + ': incorrect image width');
    assert.equal(Number(metadata(page, 'og:image:height')), size.height, page.pathname + ': incorrect image height');
    assert.ok(metadata(page, 'og:image:alt').trim(), page.pathname + ': missing image description');
  }
});

test('news articles describe their visible headline, author and relevant photograph', () => {
  const articles = indexable.filter(isArticle);
  assert.ok(articles.length > 0, 'No news article pages were built.');
  const stem = (value) => basename(new URL(value, origin).pathname).split('.')[0];
  const historicalStories = new Set(['2026-10-24-end-of-season-party', 'runway-refurbishment']);
  for (const page of articles) {
    const nodes = page.schemas.filter((node) => hasType(node, 'Article') || hasType(node, 'BlogPosting'));
    assert.equal(nodes.length, 1, page.pathname + ': Article/BlogPosting count');
    const article = nodes[0];
    assert.equal(article.headline, page.h1[0], page.pathname + ': schema headline differs from the article');
    assert.equal(article.url, page.canonical);
    assert.equal(article.inLanguage, page.pathname.split('/')[1]);
    assert.equal(article.mainEntityOfPage?.['@id'], page.canonical + '#webpage');
    assert.ok(hasType(article.author, 'SportsOrganization'), page.pathname + ': missing organizational author');
    assert.equal(article.author.name, 'Skydive Luxembourg a.s.b.l.');
    assert.equal(new URL(article.author.url).href, origin + '/');
    assert.equal(article.author['@id'], origin + '/#organization');
    assert.equal(metadata(page, 'og:type'), 'article');
    assert.ok(hasType(article.image, 'ImageObject'), page.pathname + ': missing ImageObject');
    assert.equal(article.image.url, metadata(page, 'og:image'));
    const size = imageDimensions(localFile(article.image.url));
    assert.equal(Number(article.image.width), size.width);
    assert.equal(Number(article.image.height), size.height);
    const main = page.html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
    assert.ok(tags(main, 'img').some((image) => image.src && stem(image.src) === stem(article.image.url)), page.pathname + ': shared image is not a photograph from this article');
    // These existing stories supply event/report dates, not publication dates.
    // Future stories may supply verified publication/modification metadata.
    if (historicalStories.has(page.pathname.split('/').filter(Boolean).at(-1))) {
      assert.equal(article.datePublished, undefined, page.pathname + ': publication date was not supplied');
      assert.equal(article.dateModified, undefined, page.pathname + ': modification date was not supplied');
      assert.ok(!page.meta.some((item) => item.property === 'article:published_time' || item.property === 'article:modified_time'), page.pathname + ': fabricated social publication date');
    }
    for (const [field, property] of [['datePublished', 'article:published_time'], ['dateModified', 'article:modified_time']]) {
      if (article[field] != null) {
        assert.ok(Number.isFinite(Date.parse(article[field])), page.pathname + ': invalid ' + field);
        assert.equal(metadata(page, property), article[field], page.pathname + ': inconsistent ' + field);
      }
    }
    const dates = [...main.matchAll(/<time\b([^>]*)>/gi)].map((match) => attributes(match[1]).datetime).filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)).sort();
    assert.ok(dates.length > 0, page.pathname + ': missing visible report/event date');
    const coverage = dates[0] === dates.at(-1) ? dates[0] : dates[0] + '/' + dates.at(-1);
    assert.equal(article.temporalCoverage, coverage, page.pathname + ': event/report dates differ from visible dates');
  }
});

test('breadcrumbs follow actual home/news/article routes and resolve to indexable pages', () => {
  for (const page of indexable) {
    const locale = page.pathname.split('/')[1];
    const home = origin + '/' + locale + '/';
    const breadcrumbs = page.schemas.filter((node) => hasType(node, 'BreadcrumbList'));
    if (page.canonical === home) {
      assert.equal(breadcrumbs.length, 0, page.pathname + ': homepage needs no breadcrumb trail');
      continue;
    }
    assert.equal(breadcrumbs.length, 1, page.pathname + ': breadcrumb count');
    const items = breadcrumbs[0].itemListElement;
    const expected = [home, ...(isArticle(page) ? [origin + '/' + locale + '/news/'] : []), page.canonical];
    assert.deepEqual(items.map((item) => item.item), expected, page.pathname + ': illogical breadcrumb hierarchy');
    assert.deepEqual(items.map((item) => item.position), items.map((_, index) => index + 1));
    for (const item of items) {
      assert.ok(item.name?.trim(), page.pathname + ': empty breadcrumb label');
      absolute(item.item, 'breadcrumb');
      localFile(item.item);
      assert.ok(byCanonical.has(item.item), 'Breadcrumb points to a nonindexable page: ' + item.item);
    }
    const webpage = page.schemas.find((node) => node['@id'] === page.canonical + '#webpage');
    assert.equal(webpage.breadcrumb?.['@id'], breadcrumbs[0]['@id'], page.pathname + ': unlinked breadcrumb schema');
  }
});

test('JSON-LD serialization preserves editorial text without allowing a script breakout', () => {
  const headline = '</script><script>alert(1)</script>';
  const serialized = serializeSchema({ headline });
  assert.equal(serialized.includes('<'), false);
  assert.deepEqual(JSON.parse(serialized), { headline });
});

test('the hosting root redirect permanently overrides the static fallback document', () => {
  const config = readFileSync(join(root, 'netlify.toml'), 'utf8');
  const blocks = config.split('[[redirects]]').slice(1);
  const redirect = blocks.find((block) => /^\s*from\s*=\s*"\/"\s*$/m.test(block) && /^\s*to\s*=\s*"\/en\/"\s*$/m.test(block) && !/^\s*query\s*=/m.test(block));
  assert.ok(redirect, 'Missing default-language root redirect.');
  assert.match(redirect, /^\s*status\s*=\s*301\s*$/m);
  assert.match(redirect, /^\s*force\s*=\s*true\s*$/m, 'Generated index.html must not shadow the HTTP redirect.');
});

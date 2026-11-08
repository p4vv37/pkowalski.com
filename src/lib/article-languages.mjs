import { withBase } from './paths.mjs';

export const articleLanguage = (entry) => entry.data.lang ?? 'en';
export const languageLabel = (entry) => articleLanguage(entry).toUpperCase();
export const articlePath = (entry, base = '/') => withBase(`/${entry.data.slug}/`, base);

// Never advertise drafts, even from a local preview. Missing keys are independent entries.
export function publishedTranslations(entry, posts) {
  const key = entry.data.translationKey;
  if (entry.collection !== 'posts' || entry.data.draft || !key) return [];
  const versions = posts.filter((post) => post.collection === 'posts' && !post.data.draft && post.data.translationKey === key);
  return new Set(versions.map(articleLanguage)).size > 1
    ? versions.sort((a, b) => articleLanguage(a).localeCompare(articleLanguage(b))) : [];
}

export function articleAlternates(entry, posts, site, base = '/') {
  return publishedTranslations(entry, posts).map((post) => ({
    lang: articleLanguage(post), href: new URL(articlePath(post, base), site).href,
  }));
}

// Validate all entries, including drafts, so publishing a draft cannot introduce ambiguity.
export function validateArticleEntries(posts, pages = [], reserved = []) {
  const slugs = new Map();
  const pairs = new Map();
  const reservedSlugs = new Set(['home', 'archive', '404', 'rss.xml', 'robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', 'demo', 'demos', 'flowers_demo', 'media', 'wp-content', 'wp_portfolio', '_astro', ...reserved]);
  for (const entry of [...posts, ...pages]) {
    const { slug, translationKey } = entry.data;
    const name = `${entry.collection}/${entry.id}`;
    if (typeof slug !== 'string' || !/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(slug)) {
      throw new Error(`Invalid single-segment slug ${JSON.stringify(slug)} in ${name}`);
    }
    if (reservedSlugs.has(slug) && !(entry.collection === 'pages' && slug === 'home')) {
      throw new Error(`Reserved slug "${slug}" in ${name}`);
    }
    if (slugs.has(slug)) throw new Error(`Duplicate slug "${slug}": ${slugs.get(slug)} and ${name}`);
    slugs.set(slug, name);
    if (entry.collection !== 'posts') continue;
    const lang = articleLanguage(entry);
    if (!['en', 'pl'].includes(lang)) throw new Error(`Invalid article language in ${name}: ${lang}`);
    if (translationKey === undefined) continue;
    if (typeof translationKey !== 'string' || !translationKey.trim()) throw new Error(`Empty translationKey in ${name}`);
    const pair = JSON.stringify([translationKey, lang]);
    if (pairs.has(pair)) throw new Error(`Duplicate translation (${translationKey}, ${lang}): ${pairs.get(pair)} and ${name}`);
    pairs.set(pair, name);
  }
}

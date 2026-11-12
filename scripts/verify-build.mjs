import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, relative, dirname, join } from 'node:path';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { stripBase } from '../src/lib/paths.mjs';
import { renderWordPress } from '../src/lib/wordpress.mjs';
import { articleAlternates, articlePath, articleLanguage, validateArticleEntries, publishedTranslations, listedArticles, combinedTranslations } from '../src/lib/article-languages.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const base = process.env.BASE_PATH || '/';
const imported = [];
const entries = [];
const scalar = (frontmatter, key) => {
  const value = frontmatter.match(new RegExp(`^${key}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\s#]+))`, 'm'));
  return value?.[1] ?? value?.[2] ?? value?.[3];
};
function readContent(path, collection) {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const file = join(path, entry.name);
    if (entry.isDirectory()) { readContent(file, collection); continue; }
    if (!/\.(?:md|mdx)$/.test(file)) continue;
    const source = readFileSync(file, 'utf8');
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)?.[1] || '';
    const draft = /^draft:\s*true\s*(?:#.*)?$/m.test(frontmatter);
    entries.push({ collection, id: relative(root, file), data: {
      slug: scalar(frontmatter, 'slug'), lang: scalar(frontmatter, 'lang') || 'en',
      translationKey: scalar(frontmatter, 'translationKey'), translationListing: scalar(frontmatter, 'translationListing'), draft,
    } });
    if (draft) continue;
    const id = frontmatter.match(/^wordpressId:\s*(\d+)/m)?.[1];
    if (!id) continue;
    const match = frontmatter.match(/^slug:\s*(?:"([^"]+)"|'([^']+)'|([^\s#]+))/m);
    const slug = match?.[1] || match?.[2] || match?.[3];
    if (!slug) throw new Error(`Missing slug: ${relative(root, file)}`);
    imported.push({ id, file, url: slug === 'home' ? '/' : `/${slug}/`, source });
  }
}
readContent(resolve(root, 'src/content/posts'), 'posts');
readContent(resolve(root, 'src/content/pages'), 'pages');
const errors = new Set();
const files = [];
function walk(path) {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const file = join(path, entry.name);
    if (entry.isDirectory()) walk(file);
    else files.push(file);
  }
}
walk(dist);
const privatePath = /(?:^|\/)(?:\.env(?:\.[^/]*)?|\.aws|\.ssh|\.npmrc|\.pypirc|\.netrc|wp-config\.php|credentials(?:\.[^/]*)?|id_rsa|id_ed25519)(?:\/|$)|\.(?:pem|key|p12|pfx|jks|sql|sqlite3?|db|har|tar|gz|zip)$/i;
for (const file of files) {
  if (privatePath.test(relative(dist, file))) errors.add(`Private/config/backup file must not be published: ${relative(dist, file)}`);
}
const htmlFiles = files.filter((file) => file.endsWith('.html'));
let localLinks = 0;
let images = 0;
let videos = 0;
for (const file of htmlFiles) {
  const path = relative(dist, file).split('\\').join('/');
  const url = new URL(`${base.replace(/\/$/, '')}/${path}`, 'https://build.test');
  const { document } = parseHTML(readFileSync(file, 'utf8'));
  if (!document.querySelector('html[lang]')) errors.add(`${path}: missing page language`);
  if (!document.querySelector('meta[name="viewport"]')) errors.add(`${path}: missing viewport`);
  for (const node of document.querySelectorAll('[href], [src], [poster]')) {
    for (const attr of ['href', 'src', 'poster']) {
      const value = node.getAttribute(attr);
      if (!value || /^(?:#|mailto:|tel:|data:|javascript:)/.test(value)) continue;
      let target;
      try { target = new URL(value, url); } catch { errors.add(`${path}: invalid URL ${value}`); continue; }
      if (target.origin !== url.origin) continue;
      localLinks++;
      const decoded = decodeURIComponent(target.pathname);
      const local = stripBase(decoded, base);
      if (base !== '/' && local === decoded) {
        errors.add(`${path}: link missing Pages prefix: ${value}`);
        continue;
      }
      const candidate = resolve(dist, '.' + local);
      if (!candidate.startsWith(dist + '/') && candidate !== dist) {
        errors.add(`${path}: URL escapes output directory: ${value}`);
        continue;
      }
      if (!existsSync(candidate) || (statSync(candidate).isDirectory() && !existsSync(join(candidate, 'index.html')))) errors.add(`${path}: missing local target ${value}`);
    }
  }
  images += document.querySelectorAll('[data-article-body] img').length;
  videos += document.querySelectorAll('[data-article-body] video, [data-article-body] iframe').length;
}
const normalized = (html) => parseHTML(`<html><body><div id="check">${html}</div></body></html>`).document.getElementById('check').textContent.replace(/\s+/g, ' ').trim();
let bodies = 0;
for (const article of imported) {
  const source = article.source;
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  if (!body) continue; // The original Home page contains no article content.
  const file = join(dist, article.url, 'index.html');
  if (!existsSync(file)) { errors.add(`Missing imported article: ${article.url}`); continue; }
  const doc = parseHTML(readFileSync(file, 'utf8')).document;
  const node = doc.querySelector(`[data-wordpress-id="${article.id}"]`);
  if (!node) { errors.add(`Article body not rendered: ${article.url}`); continue; }
  const format = source.match(/^format: "([^"]+)"/m)?.[1];
  const expected = renderWordPress(body, format, base);
  if (normalized(node.innerHTML) !== normalized(expected)) errors.add(`Article text differs between source and output: ${article.url}`);
  if (node.querySelectorAll('img').length !== parseHTML(expected).document.querySelectorAll('img').length) errors.add(`Image count differs: ${article.url}`);
  bodies++;
}
for (const file of files.filter((file) => /\/demo\/models\/.*\/model\.json$/.test(file))) {
  const model = JSON.parse(readFileSync(file, 'utf8'));
  for (const group of model.weightsManifest || []) {
    for (const path of group.paths) if (!existsSync(resolve(dirname(file), path))) errors.add(`Missing demo model weights: ${path}`);
  }
}
const rss = readFileSync(join(dist, 'rss.xml'), 'utf8');
const archive = parseHTML(readFileSync(join(dist, 'archive/index.html'), 'utf8')).document;
const posts = entries.filter((entry) => entry.collection === 'posts');
validateArticleEntries(posts, entries.filter((entry) => entry.collection === 'pages'));
const listed = listedArticles(posts.filter((post) => !post.data.draft));
const publishedPostCount = listed.length;
const listedIds = new Set(listed.map((post) => post.id));
const site = process.env.SITE_URL || 'https://www.pkowalski.com';
assert.doesNotMatch(rss, /<language>en<\/language>/, 'Mixed RSS must not declare a fixed English channel language');
for (const post of posts) {
  const file = join(dist, post.data.slug, 'index.html');
  if (post.data.draft) {
    assert.ok(!existsSync(file), `Draft must not be built: ${post.data.slug}`);
    assert.ok(!rss.includes(articlePath(post, base)), `Draft must not appear in RSS: ${post.data.slug}`);
    continue;
  }
  const doc = parseHTML(readFileSync(file, 'utf8')).document;
  const self = new URL(articlePath(post, base), site).href;
  assert.equal(doc.documentElement.lang, articleLanguage(post), `${post.data.slug}: html language`);
  assert.equal(doc.querySelector('link[rel="canonical"]').getAttribute('href'), self, `${post.data.slug}: self canonical`);
  assert.equal(doc.querySelector('meta[property="og:url"]').getAttribute('content'), self, `${post.data.slug}: OG URL`);
  const actual = [...doc.querySelectorAll('link[rel="alternate"][hreflang]')].map((node) => ({ lang: node.getAttribute('hreflang'), href: node.getAttribute('href') })).sort((a, b) => a.lang.localeCompare(b.lang));
  assert.deepEqual(actual, articleAlternates(post, posts, site, base), `${post.data.slug}: reciprocal published alternates`);
  const jsonld = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
  assert.equal(jsonld.inLanguage, articleLanguage(post), `${post.data.slug}: JSON-LD language`);
  assert.equal(jsonld.url, self, `${post.data.slug}: JSON-LD URL`);
  const versions = publishedTranslations(post, posts);
  const switcher = doc.querySelector('.article-languages');
  assert.equal(Boolean(switcher), versions.length > 0, `${post.data.slug}: switch only for published pairs`);
  if (switcher) {
    assert.equal(switcher.querySelector('[aria-current="page"]').getAttribute('lang'), articleLanguage(post));
    for (const other of versions.filter((version) => version.id !== post.id)) {
      assert.ok(switcher.querySelector(`a[href="${articlePath(other, base)}"][hreflang="${articleLanguage(other)}"][lang="${articleLanguage(other)}"]`), `${post.data.slug}: accessible counterpart link`);
    }
  }
  assert.equal(rss.includes(self), listedIds.has(post.id), `${post.data.slug}: RSS includes only listing representatives`);
  if (listedIds.has(post.id)) {
    const row = [...archive.querySelectorAll('[data-post]')].find((node) => node.querySelector(`h3 > a[href="${articlePath(post, base)}"]`));
    assert.ok(row, `${post.data.slug}: archive representative`);
    for (const version of combinedTranslations(post, posts)) {
      assert.ok(row.querySelector(`.listing-languages a[href="${articlePath(version, base)}"][hreflang="${articleLanguage(version)}"]`), `${post.data.slug}: combined archive language link`);
    }
  }
}
// Opt-in publication gate: normal legacy-only checkouts can still be verified.
if (process.env.REQUIRE_NPU_ARTICLES === '1') {
  for (const [slug, lang] of [['local-llms-snapdragon-x-elite', 'en'], ['local-llms-snapdragon-x-elite-pl', 'pl']]) {
    const post = posts.find((entry) => entry.data.slug === slug);
    assert.ok(post && !post.data.draft, `Missing published NPU article: ${slug}`);
    assert.equal(post.data.lang, lang);
    assert.equal(post.data.translationKey, 'snapdragon-llm-benchmark');
    assert.equal(publishedTranslations(post, posts).length, 2);
  }
}
for (const file of ['index.html', 'contact/index.html']) {
  const doc = parseHTML(readFileSync(join(dist, file), 'utf8')).document;
  assert.ok(doc.querySelector('a[href="mailto:contact@pkowalski.com"]'), `${file}: public email contact is missing`);
  assert.ok(doc.querySelector('a[href="https://github.com/p4vv37"]'), `${file}: public GitHub link is missing`);
}
assert.equal((rss.match(/<item>/g) || []).length, publishedPostCount, 'RSS entry count differs from published content');
assert.equal(archive.querySelectorAll('[data-post]').length, publishedPostCount, 'Archive entry count differs from published content');
const totalBytes = files.reduce((sum, file) => sum + statSync(file).size, 0);
if (totalBytes > 1_000_000_000) errors.add('The build exceeds the GitHub Pages 1 GB site limit');
if (errors.size) {
  console.error([...errors].join('\n'));
  console.error(`${errors.size} build verification issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`Verified ${htmlFiles.length} HTML pages and ${localLinks} local links/resources.`);
  console.log(`Verified ${bodies} imported article/page bodies, ${images} article images and ${videos} video/iframe embeds.`);
  console.log(`Archive, RSS and demo model weights are complete. Build size: ${(totalBytes / 1_000_000).toFixed(1)} MB.`);
}

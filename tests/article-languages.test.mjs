import test from 'node:test';
import assert from 'node:assert/strict';
import { articleLanguage, articlePath, articleAlternates, publishedTranslations, validateArticleEntries, combinedTranslations, listedArticles, articleNeighbors } from '../src/lib/article-languages.mjs';

const post = (slug, lang, translationKey, draft = false) => ({ collection: 'posts', id: slug, data: { slug, lang, translationKey, draft } });
const en = post('local-llms-snapdragon-x-elite', 'en', 'snapdragon-llm-benchmark');
const pl = post('local-llms-snapdragon-x-elite-pl', 'pl', 'snapdragon-llm-benchmark');

test('legacy entries default to English, retain routes and do not pair by suffix or missing key', () => {
  const legacy = post('canvasstorystudio-pl');
  assert.equal(articleLanguage(legacy), 'en');
  assert.equal(articlePath(legacy), '/canvasstorystudio-pl/');
  assert.deepEqual(publishedTranslations(legacy, [legacy, post('other')]), []);
  assert.deepEqual(publishedTranslations(post('single', 'pl', 'unpaired'), [en, pl]), []);
});

test('only published posts form reciprocal pairs, independently of ordering or slug naming', () => {
  const unrelated = post('elsewhere', 'pl', 'another-key');
  const page = { ...pl, collection: 'pages' };
  assert.deepEqual(publishedTranslations(en, [unrelated, pl, en, page]), [en, pl]);
  assert.deepEqual(publishedTranslations(pl, [en, pl]), [en, pl]);
  assert.deepEqual(publishedTranslations(page, [en, pl]), []);
  const draft = { ...pl, data: { ...pl.data, draft: true } };
  assert.deepEqual(publishedTranslations(en, [en, draft]), []);
  assert.deepEqual(publishedTranslations(draft, [en, draft]), []);
  assert.deepEqual(articleAlternates(en, [en, draft], 'https://example.com'), []);
});

for (const base of ['/', '/pkowalski.com', '/pkowalski.com/']) {
  test(`absolute alternate metadata respects base ${base} without double prefixes`, () => {
    const prefix = base === '/' ? '' : '/pkowalski.com';
    const expected = [
      { lang: 'en', href: `https://example.com${prefix}/local-llms-snapdragon-x-elite/` },
      { lang: 'pl', href: `https://example.com${prefix}/local-llms-snapdragon-x-elite-pl/` },
    ];
    assert.deepEqual(articleAlternates(en, [en, pl], 'https://example.com', base), expected);
    assert.deepEqual(articleAlternates(pl, [pl, en], 'https://example.com', base), expected);
    assert.equal(articlePath(en, base), `${prefix}/local-llms-snapdragon-x-elite/`);
  });
}

test('validation allows standalone legacy entries, explicit pair and independent page schema', () => {
  assert.doesNotThrow(() => validateArticleEntries([en, pl, post('legacy')], [{ collection: 'pages', id: 'home', data: { slug: 'home' } }], ['home']));
});

test('duplicate key/language is rejected, including drafts and default English', () => {
  assert.throws(() => validateArticleEntries([en, post('duplicate', 'en', en.data.translationKey, true)]), /Duplicate translation/);
  assert.throws(() => validateArticleEntries([post('one', undefined, 'key'), post('two', 'en', 'key')]), /Duplicate translation/);
  assert.throws(() => validateArticleEntries([post('empty', 'en', '  ')]), /Empty translationKey/);
  assert.throws(() => validateArticleEntries([post('wrong', 'de')]), /Invalid article language/);
});

test('slug collisions across posts, pages, drafts and static/legacy routes fail', () => {
  assert.throws(() => validateArticleEntries([en, { ...en, id: 'another-file' }]), /Duplicate slug/);
  assert.throws(() => validateArticleEntries([en], [{ ...en, collection: 'pages' }]), /Duplicate slug/);
  for (const slug of ['home', 'archive', '404', 'demo', 'media', 'wp_portfolio']) {
    assert.throws(() => validateArticleEntries([post(slug)]), /Reserved slug/);
  }
  assert.throws(() => validateArticleEntries([post('old-alias')], [], ['old-alias']), /Reserved slug/);
  for (const slug of ['', '../escape', 'pl/entry', 'a%2fb', 'entry?x', 'entry#x', ' spaced ', 'A', '.']) {
    assert.throws(() => validateArticleEntries([post(slug)]), /Invalid single-segment slug/);
  }
});


const combined = (slug, lang, draft = false) => {
  const entry = post(slug, lang, 'bielik-ventuno-q', draft);
  entry.data.translationListing = 'combined';
  return entry;
};
const bEn = combined('bielik', 'en');
const bPl = combined('bielik-pl', 'pl');

test('combined listing is opt-in, prefers English regardless of ordering and retains legacy pair', () => {
  assert.deepEqual(listedArticles([bPl, bEn, en, pl]), [bEn, en, pl]);
  assert.deepEqual(listedArticles([bEn, bPl, en, pl]), [bEn, en, pl]);
  assert.deepEqual(combinedTranslations(en, [en, pl]), []);
  assert.deepEqual(combinedTranslations(bPl, [bPl, bEn]), [bEn, bPl]);
  assert.equal(publishedTranslations(bPl, [bPl, bEn]).length, 2);
});

test('single published language remains listed; drafts are never alternate/listing links', () => {
  const draft = combined('bielik-pl-draft', 'pl', true);
  assert.deepEqual(listedArticles([bEn]), [bEn]);
  assert.deepEqual(combinedTranslations(bEn, [bEn, draft]), []);
  assert.deepEqual(combinedTranslations(draft, [bEn, draft]), []);
  assert.deepEqual(listedArticles([bEn, draft]), [bEn, draft]); // local preview only
  assert.deepEqual(listedArticles([bPl]), [bPl]);
});

test('combined article neighbors never point to its own translated version', () => {
  const newer = post('newer', 'en');
  const older = post('older', 'en');
  const entries = [newer, bPl, bEn, older];
  for (const entry of [bPl, bEn]) {
    assert.deepEqual(articleNeighbors(entry, entries), { previous: newer, next: older });
  }
  assert.equal(articleNeighbors(newer, entries).next, bEn);
  assert.equal(articleNeighbors(older, entries).previous, bEn);
  assert.deepEqual(articleNeighbors(post('missing', 'en'), entries), { previous: undefined, next: undefined });
});

test('combined frontmatter validates key, mode and consistent opt-in across translations', () => {
  assert.doesNotThrow(() => validateArticleEntries([bEn, bPl]));
  const noKey = { ...bEn, data: { ...bEn.data, translationKey: undefined } };
  assert.throws(() => validateArticleEntries([noKey]), /requires translationKey/);
  const independent = { ...bPl, data: { ...bPl.data, translationListing: 'independent' } };
  assert.throws(() => validateArticleEntries([bEn, independent]), /Conflicting translationListing/);
  const invalid = { ...bEn, data: { ...bEn.data, translationListing: 'invalid' } };
  assert.throws(() => validateArticleEntries([invalid]), /Invalid translationListing/);
});

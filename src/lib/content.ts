import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './paths.mjs';
import { validateArticleEntries } from './article-languages.mjs';
import routes from '../data/legacy-urls.json';

export type Post = CollectionEntry<'posts'>;
export const href = (path: string) => withBase(path, import.meta.env.BASE_URL);
export const postHref = (post: Post) => href(`/${post.data.slug}/`);
export const dateLabel = (date: string, lang = 'en') => new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${date}T12:00:00Z`));

export async function publishedPosts() {
  const posts = await getCollection('posts');
  const pages = await getCollection('pages');
  const aliases = Object.keys(routes.paths).filter((path) => /^\/[^/]+\/$/.test(path)).map((path) => path.slice(1, -1));
  validateArticleEntries(posts, pages, aliases);
  return posts.filter(({ data }) => !data.draft || import.meta.env.DEV)
    .sort((a, b) => b.data.date.localeCompare(a.data.date) || a.data.title.localeCompare(b.data.title));
}

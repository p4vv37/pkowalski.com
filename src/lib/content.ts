import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './paths.mjs';

export type Post = CollectionEntry<'posts'>;
export const href = (path: string) => withBase(path, import.meta.env.BASE_URL);
export const postHref = (post: Post) => href(`/${post.data.slug}/`);
export const dateLabel = (date: string) => new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${date}T12:00:00Z`));

export async function publishedPosts() {
  return (await getCollection('posts', ({ data }) => !data.draft || import.meta.env.DEV))
    .sort((a, b) => b.data.date.localeCompare(a.data.date) || a.data.title.localeCompare(b.data.title));
}

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { publishedPosts, postHref } from '../lib/content';

export async function GET(context: APIContext) {
  const posts = (await publishedPosts()).filter((post) => !post.data.draft);
  return rss({
    title: 'Paweł Kowalski · Work & notes',
    description: 'Machine learning, computer graphics and tools.',
    site: context.site!,
    items: posts.map((post) => ({ title: `${post.data.translationKey || post.data.lang === 'pl' ? `[${post.data.lang.toUpperCase()}] ` : ''}${post.data.title}`, pubDate: new Date(`${post.data.date}T12:00:00Z`), description: post.data.description, link: postHref(post) })),
  });
}

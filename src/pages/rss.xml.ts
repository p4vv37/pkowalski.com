import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { publishedPosts, postHref } from '../lib/content';

export async function GET(context: APIContext) {
  const posts = await publishedPosts();
  return rss({
    title: 'Paweł Kowalski · Work & notes',
    description: 'Machine learning, computer graphics and tools.',
    site: context.site!,
    items: posts.map((post) => ({ title: post.data.title, pubDate: new Date(`${post.data.date}T12:00:00Z`), description: post.data.description, link: postHref(post) })),
    customData: '<language>en</language>',
  });
}

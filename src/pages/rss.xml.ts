import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { publishedPosts, listedPosts, postHref } from '../lib/content';
import { combinedTranslations, articleLanguage } from '../lib/article-languages.mjs';

export async function GET(context: APIContext) {
  const allPosts = (await publishedPosts()).filter((post) => !post.data.draft);
  const posts = listedPosts(allPosts);
  const labels = (post: typeof posts[number]) => {
    const versions = combinedTranslations(post, allPosts);
    return versions.length > 1 ? `[${versions.map(articleLanguage).map((lang: string) => lang.toUpperCase()).join('/')}] `
      : post.data.translationKey || post.data.lang === 'pl' ? `[${post.data.lang.toUpperCase()}] ` : '';
  };
  return rss({
    title: 'Paweł Kowalski · Work & notes',
    description: 'Machine learning, computer graphics and tools.',
    site: context.site!,
    items: posts.map((post) => ({ title: `${labels(post)}${post.data.title}`, pubDate: new Date(`${post.data.date}T12:00:00Z`), description: post.data.description, link: postHref(post) })),
  });
}

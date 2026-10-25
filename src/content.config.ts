import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const schema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().default(''),
  image: z.string().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  wordpressId: z.number().optional(),
  format: z.enum(['wordpress-blocks', 'wordpress-classic', 'markdown']).default('markdown'),
});

export const collections = {
  posts: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }), schema }),
  pages: defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }), schema }),
};

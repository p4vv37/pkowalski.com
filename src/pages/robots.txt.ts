import type { APIContext } from 'astro';
import { href } from '../lib/content';

export function GET({ site }: APIContext) {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(href('/sitemap-index.xml'), site)}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

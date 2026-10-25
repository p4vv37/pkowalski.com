import { writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const isMdx = args.includes('--mdx');
const title = args.filter((arg) => arg !== '--mdx').join(' ').trim();
if (!title) {
  console.error('Usage: npm run new:post -- "Article title" [--mdx]');
  process.exit(1);
}
const slug = title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
if (!slug) { console.error('Use a title with at least one letter or number.'); process.exit(1); }
if (['archive', 'about', 'home', 'contact', 'about-us', 'demo', 'feed', 'portfolio', 'wp_portfolio'].includes(slug)) {
  console.error('This name is reserved for a site page. Choose a more specific title.'); process.exit(1);
}
const directory = resolve('src/content/posts');
if (['md', 'mdx'].some((extension) => existsSync(resolve(directory, `${slug}.${extension}`)))) {
  console.error(`An entry named ${slug} already exists.`); process.exit(1);
}
const file = resolve(directory, `${slug}.${isMdx ? 'mdx' : 'md'}`);
const frontmatter = {
  title, slug, date: new Date().toISOString().slice(0, 10),
  description: '', tags: [], draft: true,
};
writeFileSync(file, `---\n${Object.entries(frontmatter).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n\nWrite your article here.\n`, { flag: 'wx' });
console.log(`Created ${file}\nSet draft: false when it is ready to publish.`);

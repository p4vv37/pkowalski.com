import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://www.pkowalski.com',
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [mdx(), sitemap({
    filter: (page) => !/\/(?:wp_portfolio|home|portfolio|feed|category|author|about)(?:\/|$)/.test(new URL(page).pathname),
  })],
  markdown: { shikiConfig: { theme: 'github-dark' } },
  vite: {
    build: { assetsInlineLimit: 0 },
    plugins: [{
      name: 'legacy-demo-index',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const prefix = (process.env.BASE_PATH || '/').replace(/\/$/, '');
          for (const demo of ['demo', 'flowers_demo']) {
            if (request.url?.split('?')[0] === `${prefix}/${demo}/`) request.url = request.url.replace(`/${demo}/`, `/${demo}/index.html`);
          }
          next();
        });
      },
    }],
  },
});

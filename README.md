This website was automatically converted from an existing WordPress portfolio.

# pkowalski.com

[Paweł Kowalski's portfolio](https://pkowalski.com), built with Astro, Markdown/MDX and CSS, and hosted on GitHub Pages.

## Run locally

Requires Node.js 24 LTS and npm.

```bash
npm ci
npm run dev
```

Open the URL printed in the terminal, usually `http://127.0.0.1:4321`.

## Write a post

```bash
npm run new:post -- "Article title"
```

This creates a draft in `src/content/posts/`:

```markdown
---
title: "Article title"
slug: "article-title"
date: "2026-10-25"
description: "A short description for the archive and search results."
image: "/media/article-title/preview.png"
tags: ["PyTorch", "Computer graphics"]
lang: en
draft: true
---

Write the article in **Markdown**.

<img src="../media/article-title/illustration.png" alt="Image description" loading="lazy" />
```

Place images in `public/media/article-title/`. The `image` field is optional and supplies the thumbnail shown on the home page. For public images in article bodies, use an HTML `<img>` with a browser-relative `../media/…` path as above; this works with both the custom domain and the `github.io` project URL. Markdown `![…](relative-path)` is instead resolved by Astro as a source asset, not relative to `public/`.

Drafts appear in the local development server with a **Draft** label. They are excluded from production builds, the published archive and RSS. Set `draft: false` when a post is ready, then commit and push to `main`.

## Article languages (PL/EN)

Only posts support `lang: en` or `lang: pl`; omitted `lang` defaults to English. Pages and the navigation/footer remain English. Do not infer language from a filename (for example, the legacy `canvasstorystudio-pl` post is English).

For translations, create two independent Markdown/MDX posts, each with its own unique single-segment `slug`, and give both the same nonempty `translationKey`:

```yaml
# English post
slug: local-llms-snapdragon-x-elite
lang: en
translationKey: snapdragon-llm-benchmark
# Polish post (in a separate file, with its own title/date/description/body)
slug: local-llms-snapdragon-x-elite-pl
lang: pl
translationKey: snapdragon-llm-benchmark
```

All other required frontmatter remains unchanged. The generator adds `lang: en`; change it for Polish. Leave `translationKey` out for independent entries. Build validation rejects duplicate slugs (including across pages), reserved routes/legacy aliases, invalid multi-segment slugs and duplicate `(translationKey, lang)` pairs, including drafts.

The article-level PL/EN navigation uses ordinary links and only appears when both versions are published. A draft never becomes a switch/`hreflang` target, even in local preview. Each published version has its own canonical URL, document language and JSON-LD `inLanguage`; paired versions have reciprocal absolute `hreflang` links, including under `BASE_PATH`. There is no redirect, language detection or site-wide translation.

By default both versions remain separate entries in home/archive lists, counts, mixed-language older/newer navigation and the single RSS feed. To publish a new pair as **one logical article**, set `translationListing: combined` in **both** versions (with the same `translationKey`). When both are published, home/archive lists, counts and RSS use one representative (English preferred), with explicit EN/PL links on the card and archive row. Older/newer navigation skips the other version of that same article. Both language URLs still exist with their own canonical, `lang` and reciprocal `hreflang`: these are two source files and two readable pages, but one listed publication. Existing pairs such as the Snapdragon article remain independent unless explicitly opted in. A single published version remains listed on its own; a draft is never advertised as a translation. Validation rejects combined listings without a key or conflicting modes within a pair.

Paired posts (and Polish standalone posts) carry language labels; RSS has no fixed English channel language. Existing independent English posts retain their labels and routes unchanged. Article tables scroll horizontally on narrow screens and become keyboard-focusable when JavaScript is enabled; reading and the language switch do not require JavaScript.

`npm test` covers pairing, draft exclusion, validation and base-path alternate URLs. `npm run verify` checks language, self canonical/OG/JSON-LD, reciprocal links and the switch for every built post. To require the approved NPU pair as a publication gate:

```bash
REQUIRE_NPU_ARTICLES=1 npm run verify
# With a project URL, use the same SITE_URL and BASE_PATH as the build:
SITE_URL=https://p4vv37.github.io BASE_PATH=/pkowalski.com REQUIRE_NPU_ARTICLES=1 npm run verify
```

## Edit existing content

- Articles: `src/content/posts/`
- About and Contact pages: `src/content/pages/`
- Home page layout: `src/pages/index.astro`
- Home page selection: `src/data/homepage.json`
- Site styles: `src/styles/global.css`
- Article styles: `src/styles/prose.css`

Imported articles retain their original HTML and use `format: "wordpress-blocks"` or `format: "wordpress-classic"`. Edit that HTML directly. New posts use Markdown by default.

In `homepage.json`, `latestCount` controls the number of recent entries and `featuredSlugs` selects the two featured projects. Recent entries are sorted by date and exclude the featured projects to avoid duplicates.

## Add an interactive demo

For a standalone browser demo, put its files in `public/demos/example/`, including an `index.html`. Use relative asset paths inside the demo. From an article, link to `../demos/example/index.html`.

To embed components directly in an article, create an MDX post:

```bash
npm run new:post -- "Article with a demo" --mdx
```

MDX files can import Astro components from `src/components/`. React or Svelte integrations can be added if a demo needs them. GitHub Pages serves static files; Python services and GPU inference need separate hosting.

The existing paper-plane simulation is in `public/demo/`. The flower generator in `public/flowers_demo/` needs its original GAN/VAE models to restore interaction; it currently displays the original output and links to the article.

## Validate changes

```bash
npm run check          # Astro and TypeScript checks
npm test              # URL compatibility and article rendering tests
npm run build         # Generate the website in dist/
npm run verify        # Check pages, local links, media, RSS and contact links
npm run check:secrets # Scan Git history, staged changes and the generated site
npm run preview       # Serve the production build locally
```

The secret scan uses Gitleaks. The script can download a pinned Linux x64 release and verify its SHA-256, or use an installed binary through `GITLEAKS_BIN`. Detected values are redacted from logs. Local credentials, account settings and hosting backups are excluded by `.gitignore`.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` validates, builds and publishes the site on each push to `main`. Pull requests run checks without publishing. Do not commit `dist/`.

For initial setup, select **Settings → Pages → Build and deployment → Source: GitHub Actions** in the repository. Deployment progress is shown in the **Actions** tab. The workflow can also be started manually with **Run workflow**.

The build reads the hostname and base path from the repository's Pages settings, so it supports both a custom domain and the default project URL.

To test the project URL locally:

```bash
SITE_URL=https://p4vv37.github.io BASE_PATH=/pkowalski.com npm run build
SITE_URL=https://p4vv37.github.io BASE_PATH=/pkowalski.com npm run verify
```

To build for the custom domain:

```bash
SITE_URL=https://pkowalski.com BASE_PATH=/ npm run build
SITE_URL=https://pkowalski.com npm run verify
```

### Custom domain

Set `pkowalski.com` under **Settings → Pages → Custom domain**, configure the domain's DNS records for GitHub Pages, and enable **Enforce HTTPS** once the certificate is ready. Preserve email-related MX, SPF and DKIM records when changing DNS.

After changing Pages settings, run the deployment workflow again to regenerate asset paths, canonical URLs and the sitemap.

See [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) and [Astro's GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/).

## Contact and legacy URLs

Public contact: [contact@pkowalski.com](mailto:contact@pkowalski.com) · [GitHub](https://github.com/p4vv37).

`src/data/legacy-urls.json` maps WordPress URLs such as `?p=…`, `?page_id=…` and `/wp_portfolio/…` to the current pages. Page redirects run in the browser; path aliases also provide a link and a fallback without JavaScript.

Media remains available under both historical upload prefixes. The extra compatibility copy is created only in `dist/` during the build.

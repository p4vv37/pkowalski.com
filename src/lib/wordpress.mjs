import { parseHTML } from 'linkedom';
import { autop } from '@wordpress/autop';
import routes from '../data/legacy-urls.json' with { type: 'json' };
import externalMedia from '../data/external-media.json' with { type: 'json' };
import { withBase } from './paths.mjs';

const hosts = new Set(['www.pkowalski.com', 'pkowalski.com']);

export function rewriteWordPressUrl(value, base = '/') {
  if (!value || value.startsWith('#') || /^(?:mailto|tel|data|javascript):/i.test(value)) return value;
  let url;
  try { url = new URL(value, 'https://www.pkowalski.com'); } catch { return value; }
  if (!hosts.has(url.hostname)) return value;
  let path = decodeURI(url.pathname).replace(/^\/wp_portfolio(?=\/|$)/, '') || '/';
  const id = url.searchParams.get('p') || url.searchParams.get('page_id');
  if (id && routes.ids[id]) {
    path = routes.ids[id];
    url.searchParams.delete('p');
    url.searchParams.delete('page_id');
  } else if (url.searchParams.get('rara-portfolio') === 'portfolio') {
    path = '/';
    url.searchParams.delete('rara-portfolio');
  } else {
    path = routes.paths[path.endsWith('/') ? path : `${path}/`] || path;
  }
  const query = url.searchParams.toString();
  return `${withBase(path, base)}${query ? `?${query}` : ''}${url.hash}`;
}

function embed(url) {
  let parsed;
  try { parsed = new URL(url); } catch { return `<a href="${escapeAttribute(url)}">${escapeAttribute(url)}</a>`; }
  let src;
  let title;
  if (['www.youtube.com', 'youtube.com', 'youtu.be'].includes(parsed.hostname)) {
    const id = parsed.hostname === 'youtu.be' ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
    if (id && /^[\w-]+$/.test(id)) {
      src = `https://www.youtube-nocookie.com/embed/${id}`;
      title = 'YouTube video';
    }
  } else if (['vimeo.com', 'www.vimeo.com'].includes(parsed.hostname)) {
    const id = parsed.pathname.match(/\d+/)?.[0];
    if (id) { src = `https://player.vimeo.com/video/${id}`; title = 'Vimeo video'; }
  }
  if (!src) return `<a href="${escapeAttribute(url)}">${escapeAttribute(url)}</a>`;
  return `<iframe src="${src}" title="${title}" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
}

function escapeAttribute(text) {
  return text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

/** Preserve original content; restore only WordPress's rendering behavior. */
export function renderWordPress(body, format, base = '/') {
  let html = body.replace(/\[embed\]([\s\S]*?)\[\/embed\]/g, (_, url) => `<div class="video-embed">${embed(url.trim())}</div>`);
  if (format === 'wordpress-classic') html = autop(html);
  const { document } = parseHTML(`<html><body><div id="article-root">${html}</div></body></html>`);
  const root = document.getElementById('article-root');
  for (const wrapper of root.querySelectorAll('.wp-block-embed__wrapper')) {
    const url = wrapper.textContent.trim();
    wrapper.innerHTML = embed(url);
  }
  // Block comments are editor metadata, not displayed article content.
  const walker = document.createTreeWalker(root, 128);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((node) => node.remove());
  for (const node of root.querySelectorAll('[src], [href], [poster]')) {
    for (const attr of ['src', 'href', 'poster']) {
      const value = node.getAttribute(attr);
      if (value) node.setAttribute(attr, externalMedia[value] ? withBase(externalMedia[value], base) : rewriteWordPressUrl(value, base));
    }
  }
  for (const node of root.querySelectorAll('[srcset]')) {
    node.setAttribute('srcset', node.getAttribute('srcset').split(',').map((item) => {
      const [url, ...descriptor] = item.trim().split(/\s+/);
      return [rewriteWordPressUrl(url, base), ...descriptor].join(' ');
    }).join(', '));
  }
  for (const node of root.querySelectorAll('img')) {
    node.setAttribute('loading', 'lazy');
    node.setAttribute('decoding', 'async');
  }
  for (const node of root.querySelectorAll('video')) node.setAttribute('preload', 'metadata');
  for (const node of root.querySelectorAll('iframe')) {
    node.setAttribute('loading', 'lazy');
    if (!node.hasAttribute('title')) node.setAttribute('title', 'Embedded content');
  }
  return root.innerHTML;
}

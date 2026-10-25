import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { rewriteWordPressUrl, renderWordPress } from '../src/lib/wordpress.mjs';
import { withBase, resolveLegacyUrl } from '../src/lib/paths.mjs';
import routes from '../src/data/legacy-urls.json' with { type: 'json' };
import { readFileSync } from 'node:fs';

test('WordPress IDs resolve to article URLs, preserving query parameters and fragments', () => {
  assert.equal(rewriteWordPressUrl('https://www.pkowalski.com/?p=2705&utm_source=test#example'), '/reconstructing-shader-inputs-with-slangpy-and-pytorch/?utm_source=test#example');
  assert.equal(resolveLegacyUrl('https://www.pkowalski.com/?page_id=133', routes), '/about-us/');
  assert.equal(resolveLegacyUrl('https://www.pkowalski.com/?p=0', routes), null);
});

test('legacy URLs and media also work before the custom domain is switched', () => {
  const base = '/pkowalski.com/';
  assert.equal(rewriteWordPressUrl('http://www.pkowalski.com/wp_portfolio/wp-content/uploads/2025/05/image.png', base), '/pkowalski.com/wp-content/uploads/2025/05/image.png');
  assert.equal(resolveLegacyUrl('https://p4vv37.github.io/pkowalski.com/?p=2705#code', routes, base), '/pkowalski.com/reconstructing-shader-inputs-with-slangpy-and-pytorch/#code');
  assert.equal(resolveLegacyUrl('https://p4vv37.github.io/pkowalski.com/wp_portfolio/about-us/', routes, base), '/pkowalski.com/about-us/');
  assert.equal(resolveLegacyUrl('https://p4vv37.github.io/pkowalski.com/about-us/', routes, base), null);
});

test('remote links, mail addresses, fragments and external media are left alone', () => {
  for (const url of ['https://github.com/p4vv37', 'mailto:contact@pkowalski.com', '#section', 'data:image/png;base64,example']) assert.equal(rewriteWordPressUrl(url, '/portfolio'), url);
  assert.equal(withBase('https://example.com/test', '/portfolio'), 'https://example.com/test');
  assert.equal(withBase('/archive/', '/portfolio/'), '/portfolio/archive/');
});

test('classic paragraphs and the original video shortcode render without changing prose', () => {
  const html = renderWordPress('First paragraph.\n\nSecond paragraph.\n\n[embed]https://vimeo.com/162935440[/embed]', 'wordpress-classic');
  const doc = parseHTML(html).document;
  assert.equal(doc.querySelectorAll('p').length, 2);
  assert.equal(doc.querySelector('iframe').getAttribute('src'), 'https://player.vimeo.com/video/162935440');
  assert.match(html, /First paragraph\./);
  assert.match(html, /Second paragraph\./);
});

test('WordPress blocks retain code, captions and image sizes while restoring embeds', () => {
  const source = '<!-- wp:code --><pre><code>x &lt; 3\n[mask] &amp; value</code></pre><!-- /wp:code --><figure><a href="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/test.png"><img src="https://www.pkowalski.com/wp_portfolio/wp-content/uploads/test-300.png" width="300" alt="Original alt" /></a><figcaption>Original caption.</figcaption></figure><figure class="wp-block-embed"><div class="wp-block-embed__wrapper">https://www.youtube.com/watch?v=yIoPXGyT9qU</div></figure>';
  const doc = parseHTML(renderWordPress(source, 'wordpress-blocks', '/repo')).document;
  assert.equal(doc.querySelector('code').textContent, 'x < 3\n[mask] & value');
  assert.equal(doc.querySelector('figcaption').textContent, 'Original caption.');
  assert.equal(doc.querySelector('img').getAttribute('src'), '/repo/wp-content/uploads/test-300.png');
  assert.equal(doc.querySelector('img').getAttribute('width'), '300');
  assert.equal(doc.querySelector('img').getAttribute('alt'), 'Original alt');
  assert.equal(doc.querySelector('iframe').getAttribute('src'), 'https://www.youtube-nocookie.com/embed/yIoPXGyT9qU');
});

test('non-video WordPress embeds remain useful links', () => {
  const doc = parseHTML(renderWordPress('<div class="wp-block-embed__wrapper">https://twitter.com/Uconeni</div>', 'wordpress-blocks')).document;
  assert.equal(doc.querySelector('a').getAttribute('href'), 'https://twitter.com/Uconeni');
  assert.equal(doc.querySelector('a').textContent, 'https://twitter.com/Uconeni');
});

test('PNG reference images do not expose local file-path metadata', () => {
  for (const file of ['ref2.png', 'ref3.png']) {
    const png = readFileSync(new URL('../public/wp-content/uploads/2024/03/' + file, import.meta.url));
    for (let position = 8; position < png.length;) {
      const length = png.readUInt32BE(position);
      const kind = png.subarray(position + 4, position + 8).toString('ascii');
      const payload = png.subarray(position + 8, position + 8 + length);
      if (['tEXt', 'zTXt', 'iTXt'].includes(kind)) {
        const keyword = payload.subarray(0, payload.indexOf(0)).toString('utf8');
        assert.notEqual(keyword.toLowerCase(), 'file', file);
      }
      position += length + 12;
    }
  }
});

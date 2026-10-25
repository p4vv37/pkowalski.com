/** Browser QA with Firefox's native WebDriver BiDi; no browser npm dependency.
 * Start Firefox with an existing empty profile and --remote-debugging-port 9223.
 * Usage: node scripts/browser-qa.mjs [http://127.0.0.1:4321] [ws://127.0.0.1:9223/session]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const base = (process.argv[2] || 'http://127.0.0.1:4321').replace(/\/$/, '');
const socket = new WebSocket(process.argv[3] || 'ws://127.0.0.1:9223/session');
const pending = new Map();
const browserErrors = [];
const networkErrors = [];
let id = 0;
socket.onmessage = ({ data }) => {
  const value = JSON.parse(data);
  if (value.id !== undefined) {
    const operation = pending.get(value.id);
    if (!operation) return;
    clearTimeout(operation.timer);
    pending.delete(value.id);
    value.type === 'error' ? operation.reject(new Error(JSON.stringify(value))) : operation.resolve(value.result);
  } else if (value.method === 'log.entryAdded' && value.params.level === 'error') {
    browserErrors.push(value.params.text);
  } else if (value.method === 'network.responseCompleted' && value.params.response.status >= 400 && value.params.response.url.startsWith(base)) {
    networkErrors.push(`${value.params.response.status} ${value.params.response.url}`);
  }
};
function command(method, params = {}) {
  return new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`Timeout: ${method}`)); }, 30000);
    pending.set(requestId, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
}
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
try {
  const session = await command('session.new', { capabilities: {} });
  console.log(`Firefox ${session.capabilities.browserVersion}`);
  await command('session.subscribe', { events: ['log.entryAdded', 'network.responseCompleted'] });
  const { context } = await command('browsingContext.create', { type: 'tab' });
  const evaluate = async (expression) => {
    const result = await command('script.evaluate', { expression: `(async () => JSON.stringify(await (async () => { ${expression} })()))()`, target: { context }, awaitPromise: true });
    if (result.type === 'exception') throw new Error(JSON.stringify(result.exceptionDetails));
    return JSON.parse(result.result.value);
  };
  const navigate = (path) => command('browsingContext.navigate', { context, url: base + path, wait: 'complete' });
  const screenshot = async (name) => {
    mkdirSync('/tmp/pkowalski-preview', { recursive: true });
    const result = await command('browsingContext.captureScreenshot', { context, origin: 'viewport', format: { type: 'image/png' } });
    writeFileSync(`/tmp/pkowalski-preview/${name}.png`, Buffer.from(result.data, 'base64'));
  };
  await command('browsingContext.setViewport', { context, viewport: { width: 1440, height: 1100 }, devicePixelRatio: 1 });
  await navigate('/');
  assert.match(await evaluate('return document.querySelector("h1").textContent;'), /Paweł/);
  assert.equal(await evaluate('return [...document.querySelectorAll(".card-image img")].every(img => img.complete && img.naturalWidth > 0);'), true);
  await screenshot('home-desktop');
  console.log('Home: heading, selected projects and images OK');

  await navigate('/archive/');
  const total = await evaluate('return document.querySelectorAll("[data-post]").length;');
  assert.ok(total >= 36);
  let filtered = await evaluate('const input = document.querySelector("[data-search]"); input.value = "SlangPY"; input.dispatchEvent(new Event("input", {bubbles:true})); return [...document.querySelectorAll("[data-post]")].filter(row=>!row.hidden).map(row=>row.textContent);');
  assert.equal(filtered.length, 1);
  assert.match(filtered[0], /Reconstructing Shader Inputs/);
  assert.equal(await evaluate('const input = document.querySelector("[data-search]"); input.value = "no-such-entry-xyz"; input.dispatchEvent(new Event("input", {bubbles:true})); return [...document.querySelectorAll("[data-post]")].filter(row=>!row.hidden).length;'), 0);
  assert.match(await evaluate('return document.querySelector("[data-search-status]").textContent;'), /No entries/);
  const yearResults = await evaluate('const input = document.querySelector("[data-search]"); input.value=""; const year = document.querySelector("[data-year]"); year.value="2024"; year.dispatchEvent(new Event("change",{bubbles:true})); return [...document.querySelectorAll("[data-post]")].filter(row=>!row.hidden).map(row=>row.dataset.yearValue);');
  assert.ok(yearResults.length > 0 && yearResults.every((year) => year === '2024'));
  await screenshot('archive-desktop');
  console.log(`Archive: ${total} entries, title search, empty results and year filter OK`);

  await navigate('/?p=2705#main');
  assert.match(await evaluate('return location.pathname;'), /reconstructing-shader-inputs-with-slangpy-and-pytorch\/$/);
  assert.equal(await evaluate('return location.hash;'), '#main');
  assert.ok(await evaluate('return document.querySelectorAll("[data-article-body] img").length > 0 && document.querySelectorAll("[data-article-body] pre code").length > 0;'));
  await screenshot('article-desktop');
  await navigate('/wp_portfolio/?page_id=133');
  assert.match(await evaluate('return location.pathname;'), /about-us\/$/);
  console.log('Legacy query URLs and old path aliases resolve to the correct content');

  await command('browsingContext.setViewport', { context, viewport: { width: 390, height: 844 }, devicePixelRatio: 1 });
  for (const path of ['/', '/archive/', '/reconstructing-shader-inputs-with-slangpy-and-pytorch/', '/huggingface-space-with-stable-zero123/', '/contact/']) {
    await navigate(path);
    const size = await evaluate('return { width: innerWidth, document: document.documentElement.scrollWidth };');
    assert.ok(size.document <= size.width + 1, `${path} overflows on mobile: ${JSON.stringify(size)}`);
    if (path === '/') await screenshot('home-mobile');
    if (path === '/reconstructing-shader-inputs-with-slangpy-and-pytorch/') await screenshot('article-mobile');
  }
  console.log('Mobile: no horizontal overflow on home, archive, articles, iframe and contact pages');

  await command('browsingContext.setViewport', { context, viewport: { width: 1280, height: 900 }, devicePixelRatio: 1 });
  await navigate('/demo/');
  const plane = await evaluate('for (let i=0; i<100 && !window.model; i++) await new Promise(r=>setTimeout(r,100)); return {model: !!window.model, canvas: !!document.querySelector("canvas"), status: document.querySelector("#demo-status")?.textContent, frame: window.plane?.frame, tensors: window.tf?.memory().numTensors};');
  assert.ok(plane.model && plane.canvas, `Plane demo failed: ${JSON.stringify(plane)}`);
  const planeLater = await evaluate('await new Promise(r=>setTimeout(r,500)); return {frame: window.plane.frame, tensors: tf.memory().numTensors};');
  assert.ok(planeLater.frame > plane.frame, 'Plane animation is not advancing');
  assert.ok(planeLater.tensors <= plane.tensors + 2, 'Plane predictions leak tensors');
  await screenshot('plane-demo');
  console.log('Plane demo: model, animation and stable tensor usage OK');

  await navigate('/flowers_demo/');
  const flowers = await evaluate('for (let i=0; i<120 && !window.model; i++) await new Promise(r=>setTimeout(r,100)); return {model:!!window.model, canvas:!!document.querySelector("canvas"), status:document.querySelector("#demo-status")?.textContent};');
  if (flowers.model) {
    const generated = await evaluate('generate_image(); const canvas=document.querySelector("canvas"); return canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height).data.some(value=>value>0);');
    assert.ok(generated, 'Flowers generator did not render an image');
    console.log('Flowers demo: model and generated canvas image OK');
  } else {
    assert.match(flowers.status, /currently unavailable/);
    assert.ok(await evaluate('const image=document.querySelector("#original-output img"); return !document.querySelector("#original-output").hidden && image.complete && image.naturalWidth > 0 && document.querySelector("#demo-controls").hidden;'));
    console.log('Flowers demo: original model files unavailable; fallback with original output and article link OK');
  }
  await screenshot('flowers-demo');
  assert.deepEqual(networkErrors, [], 'Local network resources failed');
  assert.deepEqual(browserErrors, [], 'Browser console errors');
  console.log('Browser QA passed. Screenshots: /tmp/pkowalski-preview/');
} catch (error) {
  console.error('Console errors:', browserErrors);
  console.error('Local network errors:', networkErrors);
  throw error;
} finally {
  try { await command('session.end'); } catch {}
  socket.close();
}

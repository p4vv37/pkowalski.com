import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';

const source = readFileSync(new URL('../src/components/InputLengthChart.astro', import.meta.url), 'utf8');
const frontmatter = source.split('---')[1].replace(/interface Props\s*\{[\s\S]*?\}/, '');
const script = source.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)[1];
const plotlyUrl = 'https://cdn.plot.ly/plotly-2.35.2.min.js';

function mount(lang, loading = 'ready') {
  const context = vm.createContext({ Astro: { props: { lang } } });
  const labels = vm.runInContext(frontmatter + '\nlabels;', context);
  const markup = source.slice(source.indexOf('<figure'), source.indexOf('<script'))
    .replace(/=\{labels\.(\w+)\}/g, (_, key) => '=' + JSON.stringify(labels[key]))
    .replace(/\{labels\.(\w+)\}/g, (_, key) => labels[key]);
  const pending = loading === 'shared' ? `<script src="${plotlyUrl}"></script>` : '';
  const { document, window } = parseHTML(`<html><head>${pending}</head><body>${markup}<script data-component></script></figure></body></html>`);
  document.currentScript = document.querySelector('[data-component]');
  let plot;
  const Plotly = { newPlot(target, traces, layout, config) { plot = { target, traces, layout, config }; } };
  context.window = loading === 'ready' ? { Plotly } : {};
  context.document = document;
  vm.runInContext(script, context);
  return {
    document,
    get plot() { return plot; },
    finish(event) {
      context.window.Plotly = Plotly;
      document.querySelector(`script[src="${plotlyUrl}"]`).dispatchEvent(new window.Event(event));
    },
  };
}

for (const lang of ['pl', 'en']) {
  test(`${lang}: linear CPU/NPU chart uses recorded generation medians and measured input lengths`, () => {
    const { plot } = mount(lang);
    assert.equal(plot.traces.length, 2);
    const [cpu, npu] = plot.traces;
    assert.equal(cpu.name, 'CPU');
    assert.equal(npu.name, 'NPU · GGUF');
    assert.deepEqual(Array.from(cpu.y), [6.691707, 14.384852, 86.026999]);
    assert.deepEqual(Array.from(npu.y), [9.308503, 13.02385, 32.962808]);
    for (const trace of plot.traces) {
      assert.deepEqual(Array.from(trace.x), [420, 1572, 6180]);
      assert.equal(trace.type, 'scatter');
      assert.equal(trace.mode, 'lines+markers');
      assert.equal(trace.line.shape, 'linear', 'do not fit a curve to three measured points');
    }
    assert.equal(plot.layout.xaxis.type, 'linear', 'input lengths must have proportional spacing');
    assert.deepEqual(Array.from(plot.layout.xaxis.tickvals), [420, 1572, 6180]);
    assert.equal(plot.layout.yaxis.rangemode, 'tozero');
    assert.equal(plot.layout.yaxis.title.text, lang === 'pl' ? 'Czas generacji (s)' : 'Generation time (s)');
    assert.equal(plot.config.responsive, true);
    assert.notEqual(cpu.marker.symbol, npu.marker.symbol, 'series must be distinguishable without color');
  });

  test(`${lang}: title stays outside the plot and caption explains the sampling and backend`, () => {
    const { document, plot } = mount(lang);
    const title = document.querySelector('.input-length-chart-title');
    assert.ok(title.textContent.trim());
    assert.ok(!plot.target.contains(title));
    assert.ok(!plot.layout.title);
    const caption = document.querySelector('figcaption').textContent;
    assert.match(caption, /3/);
    assert.match(caption, /16[ ,]384/);
    assert.match(caption, /ggml-hexagon/);
    assert.match(caption, /nie QNN|not QNN/);
    assert.match(caption, /bez ładowania|excluding model loading/);
  });

  test(`${lang}: chart reuses a pending Plotly request and renders when it loads`, () => {
    const chart = mount(lang, 'shared');
    assert.equal(chart.plot, undefined);
    assert.equal(chart.document.querySelectorAll(`script[src="${plotlyUrl}"]`).length, 1);
    chart.finish('load');
    assert.equal(chart.plot.traces.length, 2);
  });

  test(`${lang}: standalone loader failure leaves an explanatory fallback`, () => {
    const chart = mount(lang, 'standalone');
    assert.equal(chart.document.querySelectorAll(`script[src="${plotlyUrl}"]`).length, 1);
    chart.finish('error');
    assert.equal(chart.plot, undefined);
    assert.match(chart.document.querySelector('.interactive-chart-plot').textContent, /ggml-hexagon/);
  });
}

test('both articles place the line chart immediately below SpeedPowerChart with a qualified description', () => {
  for (const [filename, lang] of [['snapdragon-llm-benchmark-pl.mdx', 'pl'], ['snapdragon-llm-benchmark.mdx', 'en']]) {
    const post = readFileSync(new URL('../src/content/posts/' + filename, import.meta.url), 'utf8');
    assert.match(post, /import InputLengthChart from/);
    assert.ok(post.includes(`<SpeedPowerChart lang="${lang}" />\n\n<InputLengthChart lang="${lang}" />`));
    const description = post.split(`<InputLengthChart lang="${lang}" />`)[1].split('## 1.')[0];
    assert.match(description, /2[,.]6×/);
    assert.match(description, /syntetyczny|synthetic/);
    assert.match(description, /nie dowodzi ogólnej przewagi|does not establish a general NPU advantage/);
    assert.match(description, /nie mierzono tu mocy ani energii|power and energy were not measured/);
  }
});

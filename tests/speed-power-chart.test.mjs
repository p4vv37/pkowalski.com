import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';

const source = readFileSync(new URL('../src/components/SpeedPowerChart.astro', import.meta.url), 'utf8');
const frontmatter = source.split('---')[1].replace(/interface Props\s*\{[\s\S]*?\}/, '');
const script = source.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)[1];

function mount(lang) {
  const context = vm.createContext({ Astro: { props: { lang } } });
  const labels = vm.runInContext(frontmatter + '\nlabels;', context);
  // Use the component's own markup, not a separate hand-maintained fixture.
  const markup = source.slice(source.indexOf('<figure'), source.indexOf('<script'))
    .replace(/=\{labels\.(\w+)\}/g, (_, key) => '=' + JSON.stringify(labels[key]))
    .replace(/\{labels\.(\w+)\}/g, (_, key) => labels[key]);
  const { document } = parseHTML(`<html><head></head><body>${markup}<script></script></figure></body></html>`);
  document.currentScript = document.querySelector('script');
  let plot;
  const capture = (target, traces, layout) => { plot = { target, traces, layout }; return Promise.resolve(); };
  context.window = { Plotly: { newPlot: capture, react: capture } };
  context.document = document;
  vm.runInContext(script, context);
  return { document, get plot() { return plot; } };
}

for (const lang of ['pl', 'en']) {
  test(`${lang}: chart title and metric controls are outside Plotly's overlay area`, () => {
    const { plot, document } = mount(lang);
    assert.ok(!plot.layout.updatemenus?.length, 'metric controls must not overlap the legend');
    assert.ok(!plot.layout.title?.text, 'title belongs in the HTML header, not the plot overlay');
    const header = document.querySelector('.interactive-chart-header');
    assert.ok(header.querySelector('.interactive-chart-title').textContent.trim());
    assert.equal(header.querySelectorAll('button[data-metric]').length, 2);
    assert.ok(!plot.target.contains(header), 'header must be outside the plotting area');
  });

  test(`${lang}: power shows only measured devices and decode restores all five`, () => {
    const chart = mount(lang);
    const power = chart.document.querySelector('[data-metric="power"]');
    const decode = chart.document.querySelector('[data-metric="decode"]');
    assert.equal(chart.plot.traces.length, 3, 'initial view contains only decode series');
    power.click();
    assert.equal(chart.plot.traces.length, 2);
    for (const trace of chart.plot.traces) {
      assert.deepEqual(Array.from(trace.x), ['CPU', 'GPU', 'NPU · QNN']);
      assert.equal(trace.x.length, trace.y.length);
      assert.ok(trace.y.every(Number.isFinite));
    }
    assert.equal(chart.plot.layout.yaxis.title.text, lang === 'pl' ? 'Średnia moc (W)' : 'Average power (W)');
    assert.equal(power.getAttribute('aria-pressed'), 'true');
    assert.equal(decode.getAttribute('aria-pressed'), 'false');
    decode.click();
    assert.equal(chart.plot.traces.length, 3);
    assert.equal(chart.plot.traces[0].x.length, 5);
    assert.equal(chart.plot.traces[2].y[0], null, 'unfinished CPU decode must remain missing, not zero');
    assert.equal(chart.plot.layout.yaxis.title.text, 'Decode (tok/s)');
    assert.equal(decode.getAttribute('aria-pressed'), 'true');
  });
}

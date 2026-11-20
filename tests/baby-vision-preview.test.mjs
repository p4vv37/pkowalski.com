import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseHTML } from 'linkedom';

test('WebGL initializes on the live canvas, not the fallback image', () => {
  const source = readFileSync(new URL('../src/components/BabyVisionSimulator.astro', import.meta.url), 'utf8');
  const { document } = parseHTML(source.split('---')[2].split('<script>')[0]);
  const match = source.match(/const canvas = \$<HTMLCanvasElement>\('([^']+)'\)/);
  assert.ok(match);
  const canvas = document.querySelector(match[1]);
  assert.equal(typeof canvas?.getContext, 'function', `Expected a canvas, selected ${canvas?.tagName}`);
});

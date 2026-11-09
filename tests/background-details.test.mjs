import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseHTML } from 'linkedom';

const articles = [
  ['snapdragon-llm-benchmark-pl.mdx', ['12-modele-i-pliki', '13-czym-uruchomić-model-na-cpu-gpu-i-npu', '14-kwantyzacja']],
  ['snapdragon-llm-benchmark.mdx', ['12-models-and-files', '13-what-can-run-the-model-on-the-cpu-gpu-and-npu', '14-quantization']],
];

for (const [filename, anchors] of articles) {
  const source = readFileSync(new URL('../src/content/posts/' + filename, import.meta.url), 'utf8');
  const blocks = [...source.matchAll(/<details\b[^>]*>[\s\S]*?<\/details>/g)].map(([block]) => block);

  test(`${filename}: sections 1.2–1.4 are three independent, initially collapsed native disclosures`, () => {
    assert.equal(blocks.length, 3);
    assert.equal((source.match(/<\/details>/g) || []).length, 3);
    blocks.forEach((block, i) => {
      const { document } = parseHTML(block);
      const details = document.querySelector('details');
      assert.ok(details.classList.contains('background-details'));
      assert.equal(details.hasAttribute('open'), false);
      assert.equal(details.querySelectorAll('details').length, 0, 'sections must not be nested');
      assert.equal(details.firstElementChild.tagName, 'SUMMARY');
      const summary = details.firstElementChild;
      const heading = summary.querySelector('h3');
      assert.equal(heading.id, anchors[i], 'existing heading anchors must be preserved');
      assert.ok(heading.textContent.startsWith(`1.${i + 2}.`));
      assert.equal(summary.querySelectorAll('a, button').length, 0, 'the entire summary toggles the section');
      assert.ok(details.querySelector('.background-details-content'));
    });
  });

  test(`${filename}: theory content stays inside disclosures while timing and results stay outside`, () => {
    assert.match(blocks[0], /Safetensors/);
    assert.match(blocks[0], /```text/);
    assert.match(blocks[0], /\|.*\.onnx/);
    assert.match(blocks[1], /GenieX/);
    assert.match(blocks[1], /ggml-hexagon/);
    assert.match(blocks[2], /Q4_K_M/);
    assert.match(blocks[2], /```text/);
    assert.match(blocks[2], /https:\/\/onnxruntime.ai\/docs\/performance\/model-optimizations\/quantization.html/);
    const outside = source.replace(/<details\b[^>]*>[\s\S]*?<\/details>/g, '');
    assert.match(outside, /### 1\.1\./);
    assert.match(outside, /### 1\.5\./);
    assert.match(outside, /## 4\./);
    assert.match(outside, /<SpeedPowerChart/);
    assert.match(outside, /<InputLengthChart/);
  });
}

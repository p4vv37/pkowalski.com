import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const posts = new Map(['pl', 'en'].map(lang => [lang, readFileSync(new URL(
  '../src/content/posts/snapdragon-llm-benchmark' + (lang === 'pl' ? '-pl' : '') + '.mdx', import.meta.url,
), 'utf8')]));

for (const [lang, source] of posts) {
  const intro = source.split('## 1.')[0];

  test(`${lang}: introduction reports completed tests rather than promising existing results`, () => {
    assert.doesNotMatch(intro, /Później sprawdzę|Zweryfikuję to|Later, I will test|I will verify this/);
    assert.match(intro, /sprawdziłem wybrane rozmiary modeli|I tested F16/);
    assert.match(intro, /Punktem startowym był|The starting point was/);
    assert.match(source, /Następny krok|The next step/);
  });

  test(`${lang}: power limitations precede the chart and the battery recommendation is about responsiveness`, () => {
    const bullet = intro.split('\n').find(line => /^- \*\*Bater|^- \*\*Battery/.test(line));
    assert.match(bullet, /20/);
    assert.doesNotMatch(bullet, /4 W|najlepszy wybór na baterii|best battery choice/);
    const beforeChart = intro.split('<SpeedPowerChart')[0];
    assert.match(beforeChart, /SYS/);
    assert.match(beforeChart, /pojedynczych prób|single-run/);
    assert.match(beforeChart, /różnej długości i treści|different lengths and content/);
    assert.match(beforeChart, /błąd pomiaru|measurement error/);
    assert.match(beforeChart, /Nie są to pomiary czasu pracy na baterii|not measurements of battery runtime/);
    assert.match(source, /Rekomendację opieram przede wszystkim na utrzymanej szybkości|for its tested speed and responsiveness/);
  });

  test(`${lang}: quantization explains representations without claiming measured quality superiority`, () => {
    const quantization = source.split('id="14-')[1].split('</details>')[0];
    assert.match(quantization, /wybranych tensorów|selected tensors/);
    assert.match(quantization, /Nie oceniałem jakości odpowiedzi|I did not evaluate response quality/);
    assert.doesNotMatch(quantization, /zauważalny spadek jakości|noticeable drop|inteligencji|intelligence|Zapewnia optymalny|provides an optimal/);
    assert.match(quantization, /INT4/);
    assert.match(quantization, /INT16/);
  });

  test(`${lang}: all three 32B recommendations are scoped to interactive chat, not blanket rejection`, () => {
    const recommendations = source.split('\n').filter(line => line.startsWith('- **') && line.includes('32B'));
    assert.equal(recommendations.length, 3);
    for (const line of recommendations) assert.match(line, /czatu|chat/);
    assert.match(source, /zadaniach wsadowych|batch tasks/);
    assert.doesNotMatch(source, /nie ma sensu go stosować|too slow to be useful|simply too slow in practice/);
  });
}

test('English translation note appears once and only at the end', () => {
  const source = posts.get('en').trim();
  const note = '*P.S. A note on the language:';
  assert.equal(source.split(note).length - 1, 1);
  assert.ok(source.lastIndexOf(note) > source.indexOf('### 5.2.'));
  assert.ok(source.endsWith("I'm curious to see how well this works.*"));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const articles = [
  ['arduino-local-agent-pl.md', 'aktualizacja', 'Aktualizacja'],
  ['arduino-local-agent.md', 'update', 'Update'],
];

for (const [filename, anchor, heading] of articles) {
  const source = readFileSync(new URL('../src/content/posts/' + filename, import.meta.url), 'utf8');
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

  test(`${filename}: the article starts with its original first section, not an update note`, () => {
    assert.match(body.trimStart(), /^## 1\. /);
    assert.doesNotMatch(body, /\bEdit\b/, 'update notes must not be called "Edit"');
  });

  test(`${filename}: the update is the last section and its anchor matches the summary box link`, () => {
    const sections = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
    assert.equal(sections.length, 9);
    assert.ok(sections.at(-1).startsWith(`<span id="${anchor}"></span>${heading} 17`), sections.at(-1));
    assert.match(source, /^updated: "2026-11-17"$/m);
    assert.match(source, /^updateSummary: ".+"$/m);
  });
}

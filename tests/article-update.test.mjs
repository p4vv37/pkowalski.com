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

  test(`${filename}: the Domuno update precedes the original first section`, () => {
    const [notice, firstSection] = body.trimStart().split(/\r?\n\r?\n/, 2);
    assert.match(notice, /^\*\*(?:Aktualizacja|Update).*Domuno\.\*\*/);
    assert.match(notice, /https:\/\/github\.com\/p4vv37\/domuno#readme/);
    assert.match(firstSection, /^## 1\. /);
    assert.doesNotMatch(body, /\bEdit\b/, 'update notes must not be called "Edit"');
  });

  test(`${filename}: the update is the last section and its anchor matches the summary box link`, () => {
    const sections = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
    assert.equal(sections.length, 9);
    assert.ok(sections.at(-1).startsWith(`<span id="${anchor}"></span>${heading} 17`), sections.at(-1));
    assert.match(source, /^updated: "2026-11-25"$/m);
    assert.match(source, /^updateSummary: ".+"$/m);
  });
}

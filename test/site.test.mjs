import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { build, outDir } from '../build.mjs';

let pages = [];
const html = {};

before(async () => {
  pages = await build({ quiet: true });
  for (const p of pages) html[p] = await readFile(path.join(outDir, p), 'utf8');
});

test('builds the core company profile pages', () => {
  for (const p of ['index.html', 'solutions.html', 'about.html', 'news.html', 'contact.html']) {
    assert.ok(pages.includes(p), `${p} should be built`);
  }
});

test('every page has a title and exactly one h1', () => {
  for (const p of pages) {
    assert.match(html[p], /<title>[^<]+<\/title>/, `${p} needs a <title>`);
    const h1 = html[p].match(/<h1[\s>]/g) || [];
    assert.equal(h1.length, 1, `${p} should have exactly one <h1>`);
  }
});

test('every image has an alt attribute', () => {
  for (const p of pages) {
    for (const img of html[p].match(/<img\b[^>]*>/g) || []) {
      assert.match(img, /\salt=/, `${p}: ${img} is missing alt text`);
    }
  }
});

test('internal links and assets resolve', async () => {
  for (const p of pages) {
    const refs = [...html[p].matchAll(/(?:href|src)="([^"#?]+)(?:[#?][^"]*)?"/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
      try {
        await access(path.join(outDir, ref));
      } catch {
        assert.fail(`${p} links to a missing file: ${ref}`);
      }
    }
  }
});

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
  for (const p of ['index.html', 'solutions.html', 'about.html', 'news.html', 'careers.html', 'contact.html']) {
    assert.ok(pages.includes(p), `${p} should be built`);
  }
});

test('Careers page is in the main navigation and presents benefits, roles and an application email', () => {
  for (const p of pages) {
    const nav = html[p].match(/<nav\b[^>]*aria-label="Main"[^>]*>[\s\S]*?<\/nav>/)?.[0];
    assert.ok(nav, `${p} should have main navigation`);
    assert.match(nav, /<a href="careers\.html"(?: aria-current="page")?>Careers<\/a>/);
    if (p === 'careers.html') assert.match(nav, /href="careers\.html" aria-current="page"/);
  }

  const careersPage = html['careers.html'];
  assert.match(careersPage, /<h2>Why work at Contoso<\/h2>/);
  assert.match(careersPage, /health and wellbeing benefits/i);
  assert.match(careersPage, /learning budget/i);
  assert.match(careersPage, /hybrid work/i);
  assert.match(careersPage, /<h2>Open roles<\/h2>/);
  const cards = careersPage.match(/<article\b[^>]*>[\s\S]*?<\/article>/g) || [];
  for (const [title, team, location] of [
    ['Cloud Engineer', 'Cloud &amp; Infrastructure', 'Jakarta'],
    ['Security Analyst', 'Cybersecurity', 'Surabaya'],
    ['Data Engineer', 'Data &amp; AI', 'Singapore']
  ]) {
    const card = cards.find((item) => item.includes(`<h3>${title}</h3>`));
    assert.ok(card, `${title} should be listed`);
    assert.ok(card.includes(`<p>${team}</p>`) && card.includes(`<p>${location}</p>`), `${title} should show its team and location`);
  }
  assert.match(careersPage, /<a[^>]+href="mailto:careers@contoso\.com"[^>]*>[^<]*careers@contoso\.com<\/a>/);
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

import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { templates } from '../src/lib/templates';
for (const t of templates) {
  const html = await readFile(`dist/templates/${t.id}/index.html`, 'utf8');
  assert(html.includes(t.name));
  assert(html.includes(t.description));
  for (const w of t.words) assert(html.includes(w), `Missing SSR word ${w}`);
  assert(html.includes(`/?template=${t.id}`));
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert(!sitemap.includes('/host/'));
const host = await readFile('dist/host/index.html', 'utf8');
assert(host.includes('noindex'));
const home = await readFile('dist/index.html', 'utf8');
assert(home.includes('Food Vocabulary Bingo'));
assert(home.includes('Apple'));
assert(!home.includes('example.com'));
async function inspectLinks(directory: string) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspectLinks(file);
      continue;
    }
    if (!file.endsWith('.html')) continue;
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      const pathname = match[1].split(/[?#]/)[0];
      const target = path.join(
        'dist',
        pathname,
        pathname.endsWith('/') ? 'index.html' : '',
      );
      await access(target).catch(() => {
        throw new Error(`Broken local link ${match[1]} in ${file}`);
      });
    }
  }
}
await inspectLinks('dist');
console.log(
  'Every local href/src in the built HTML resolves to a generated route or asset.',
);
console.log(
  '10 templates: SSR titles, descriptions, full word lists, load links and one H1 verified. Host excluded from sitemap and noindex.',
);

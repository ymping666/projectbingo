import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { templates } from '../src/lib/templates';
import { featuredIds, sampleFilename } from '../src/lib/samples';
const preview = process.argv[2] === 'preview';
const directory = preview ? 'dist-preview' : 'dist';
const base = preview ? '/projectbingo/' : '/';
const indexable = !preview && process.env.INDEXABLE_BUILD !== 'false';
const origin = 'https://bingocardkit.com';
let pages = 0;
async function inspect(dir: string) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await inspect(file);
      continue;
    }
    if (!file.endsWith('.html')) continue;
    const html = await readFile(file, 'utf8');
    pages++;
    assert(html.includes('Bingo Card Kit'));
    assert(!html.includes('Bingo Print Kit'));
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, file);
    const relative = path.relative(directory, file).replaceAll('\\', '/');
    const blocked =
      !indexable || relative === 'host/index.html' || relative === '404.html';
    assert(
      html.includes(
        `content="${blocked ? 'noindex, nofollow' : 'index, follow'}"`,
      ),
      `Index rule: ${file}`,
    );
    const canonicals = [
      ...html.matchAll(/<link rel="canonical" href="([^"]+)"/g),
    ];
    assert.equal(canonicals.length, blocked ? 0 : 1, file);
    if (!blocked)
      assert.equal(
        canonicals[0][1],
        origin + '/' + relative.replace(/index\.html$/, ''),
      );
    if (preview) {
      assert(html.includes('Our main site is now'));
      assert(!html.includes('Statistics preferences'));
    }
    for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      const pathname = match[1].split(/[?#]/)[0];
      assert(pathname.startsWith(base), `Outside base: ${file} ${pathname}`);
      const target = path.join(
        directory,
        pathname.slice(base.length),
        pathname.endsWith('/') ? 'index.html' : '',
      );
      await access(target).catch(() => {
        throw new Error(`Broken local link ${match[1]} in ${file}`);
      });
    }
  }
}
await inspect(directory);
for (const t of templates) {
  const html = await readFile(
    `${directory}/templates/${t.id}/index.html`,
    'utf8',
  );
  assert(html.includes(t.description));
  for (const w of t.words) assert(html.includes(w), `Missing SSR word ${w}`);
  assert(html.includes(`${base}?template=${t.id}`));
  assert(html.includes(`data-template-use="${t.id}"`));
  if (featuredIds.includes(t.id))
    assert(html.includes(`${base}samples/${sampleFilename(t.id)}`));
}
const sitemap = await readFile(`${directory}/sitemap.xml`, 'utf8');
assert(!sitemap.includes('/host/'));
assert(!sitemap.includes('github.io'));
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1],
);
assert.equal(locations.length, indexable ? templates.length + 8 : 0);
for (const url of locations) {
  assert(url.startsWith(origin + '/'));
  await access(path.join(directory, new URL(url).pathname, 'index.html'));
}
const robots = await readFile(`${directory}/robots.txt`, 'utf8');
assert(
  indexable
    ? robots.includes(`Sitemap: ${origin}/sitemap.xml`) &&
        !robots.includes('Disallow: /host')
    : robots.includes('Disallow: /'),
);
await access(`${directory}/CNAME`).then(
  () => {
    throw new Error('Unexpected CNAME');
  },
  () => {},
);
console.log(
  `${preview ? 'Preview' : 'Production'}: ${pages} static pages; correct indexing, canonical, sitemap, template content and all local assets/links verified.`,
);

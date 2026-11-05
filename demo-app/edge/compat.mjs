// Edge-case check: every title that had a non-empty v1 slug must keep it exactly.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const repo = resolve(process.argv[2] ?? new URL('..', import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const { slugify } = await import(pathToFileURL(resolve(repo, 'src/slugify.js')).href);

const fixtures = JSON.parse(readFileSync(new URL('../fixtures/v1-slugs.json', import.meta.url)));
let bad = 0;
for (const [title, want] of Object.entries(fixtures)) {
  const got = slugify(title);
  if (got !== want) { console.log(`FAIL v1 compat: slugify(${JSON.stringify(title)}) = ${JSON.stringify(got)}, v1 gave ${JSON.stringify(want)}`); bad++; }
}
if (bad) process.exit(1);
console.log('ok: v1 slugs unchanged');

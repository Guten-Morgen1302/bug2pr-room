// Smoke: the seeded bug fails, the tempting patch fails the v1 check, the correct patch passes both.
import { cpSync, copyFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const app = fileURLToPath(new URL('../demo-app/', import.meta.url));
const run = (dir, args) => spawnSync(process.execPath, args, { cwd: dir, encoding: 'utf8' }).status === 0;

const cases = [
  ['seeded bug',     null,                         { tests: false, compat: true  }],
  ['obvious patch',  'fixtures/slugify.obvious.js', { tests: true,  compat: false }],
  ['correct patch',  'fixtures/slugify.correct.js', { tests: true,  compat: true  }],
];

let failed = 0;
for (const [name, patch, want] of cases) {
  const dir = mkdtempSync(join(tmpdir(), 'bug2pr-'));
  cpSync(app, dir, { recursive: true });
  if (patch) copyFileSync(join(app, patch), join(dir, 'src/slugify.js'));
  const got = { tests: run(dir, ['--test', 'test/slugify.test.js']), compat: run(dir, ['edge/compat.mjs', dir]) };
  const ok = got.tests === want.tests && got.compat === want.compat;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: tests=${got.tests} compat=${got.compat} (want tests=${want.tests} compat=${want.compat})`);
  if (!ok) failed++;
}
process.exit(failed ? 1 : 0);

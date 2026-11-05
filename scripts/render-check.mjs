// Offline check of the template: fills params with their defaults the way the form does and fails on any placeholder left over.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const doc = JSON.parse(execFileSync('python', ['-c', 'import yaml,json,sys;print(json.dumps(yaml.safe_load(open(sys.argv[1],encoding="utf8"))))', new URL('../template/bug-to-pr-room.template.yaml', import.meta.url).pathname.replace(/^\/(\w:)/, '$1').replace(/%20/g, ' ')], { encoding: 'utf8' }));
const vals = Object.fromEntries(Object.entries(doc.params).map(([k, p]) => [k, Array.isArray(p.default) ? 'Bug2PR Server' : p.default]));
const builtins = { '{$creator}': 'callmeson', '{$agents_dir}': 'C:/agents' };
const fill = (s) => s.replace(/\{\$?\w+\}/g, (m) => builtins[m] ?? vals[m.slice(1, -1)] ?? m);
const text = fill(JSON.stringify(doc.agents) + JSON.stringify(doc.room) + JSON.stringify(doc.kickoff));
const left = [...new Set(text.match(/\{\$?\w+\}/g) ?? [])];
const names = Object.keys(doc.params);
console.log('params:', names.join(', '));
console.log('underscore params:', names.filter((n) => n.includes('_')).join(', ') || 'none');
console.log('unresolved placeholders:', left.join(', ') || 'none');
const fixer = JSON.parse(JSON.stringify(doc.agents)).find((a) => a.name.endsWith('fixer')).instructions;
console.log('fixer sees push-pr path:', fill(fixer).includes('push-pr.mjs"'), '| hint:', fill(fixer).includes('unicode-aware'));
process.exit(left.length ? 1 : 0);

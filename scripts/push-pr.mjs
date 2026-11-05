// push-pr: the only thing that holds a token. Pushes the fixer's branch, opens a PR (or, in dry-run, a local ref),
// and prints the room line with the SHA. Agents never see the token and never post this line themselves.
// Usage: node scripts/push-pr.mjs --repo <path-to-clone> --branch fix/x [--base main] [--dry-run]
// Env: GITHUB_TOKEN + BUG2PR_GH_REPO=owner/name for live mode.
import { spawnSync } from 'node:child_process';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : d; };
const dry = process.argv.includes('--dry-run') || !process.env.GITHUB_TOKEN;
const repo = arg('repo'), branch = arg('branch'), base = arg('base', 'main');
const die = (code, fix) => { console.error(`${code}: ${fix}`); process.exit(1); };
const git = (...a) => spawnSync('git', ['-C', repo, ...a], { encoding: 'utf8' });

if (!repo || !branch) die('E_USAGE', 'pass --repo <clone> --branch <branch>');
if (branch === base || /^(main|master)$/.test(branch)) die('E_GH_PROTECTED', `refusing to push ${branch}; use a fix/* branch`);
const sha = git('rev-parse', branch);
if (sha.status) die('E_GIT_BRANCH', `branch ${branch} not found in ${repo}; commit the fix on it first`);
const head = sha.stdout.trim();

const push = git('push', '--force-with-lease', 'origin', `${branch}:${branch}`);
if (push.status) die('E_GH_PUSH', `push failed: ${push.stderr.trim().split('\n').pop()}. Check branch protection and token scope`);

if (dry) {
  console.log(`PR (dry-run): branch ${branch} @ ${head.slice(0, 7)} pushed to origin; no GitHub token, no PR opened. SHA: ${head}`);
} else {
  const r = await fetch(`https://api.github.com/repos/${process.env.BUG2PR_GH_REPO}/pulls`, {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, accept: 'application/vnd.github+json' },
    body: JSON.stringify({ title: `Fix: ${branch}`, head: branch, base, body: `Opened by push-pr at ${head}` }),
  });
  if (!r.ok) die('E_GH_PR', `GitHub said ${r.status}. Check token scope (contents + pull requests write) and repo name`);
  console.log(`PR: ${(await r.json()).html_url} SHA: ${head}`);
}

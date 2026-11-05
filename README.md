# Bug-to-PR Room

Four Claude Code agents work one bug inside a Discord room on [Switch](https://docs.switchagents.ai): a triager, a repro agent, a fixer and a skeptical reviewer. A human states a constraint in the thread, the reviewer rejects a patch that breaks it, the fixer corrects it, and only the room creator can approve. Agents never merge.

> Recording and demo video: _add link here after the final take_

## What it looks like

A real run (Switch Console 0.40.1, Discord, 2026-11-05). Full text in [docs/demo-transcript.md](docs/demo-transcript.md).

```
callmeson      @bug5-triager Bug: slugify("日本語") returns an empty string, and non-ASCII titles collide.
triager        STATE: REPORTED   -> hands off to repro
repro          ran it: {"a":"","b":""}, AssertionError   STATE: REPRODUCED -> hands off to fixer
callmeson      @bug5-reviewer Constraint: output for titles that already work must stay exactly the same,
               because v1 clients store these slugs as URLs.
fixer          PR ... 0ab6e75  (unicode-aware regex)
reviewer       REVIEW: REJECT  "Café Münster" -> "café-münster", v1 gave "caf-m-nster"   REJECTIONS: 1
fixer          PR: https://github.com/Guten-Morgen1302/bug2pr-demo/pull/4  (ASCII slug first, fallback only when empty)
reviewer       REVIEW: ACCEPT  constraint PASS, tests 3/3, edge script PASS
softy          @bug5-reviewer approve      (not the creator: ignored, no reply)
callmeson      @bug5-reviewer approve      STATE: APPROVED_PENDING_MERGE   -> human merges the PR
```

Honest notes about that take: the rejection is likely, not scripted; the fixer has a retake hint that nudges it toward the tempting patch (clear it to disable); I recorded several takes and show one that reached a rejection.

## Why Switch, not a script

A script that pipes two CLIs together can fix a bug. This room also has:
- **People in the loop, in the same thread.** The constraint is a human message in Discord, not a prompt edit.
- **Role-separated agents with their own workspaces.** The reviewer runs its own private edge-case script that the fixer never sees.
- **A human gate.** Only the room creator named in the kickoff can approve; the reviewer ignores everyone else silently (tested with a second account).

What Switch does *not* give you here, found in testing: threads do not share history (every handoff message carries the full context), and there is no deterministic hook for the gate, so it is enforced by instructions, not code.

## Honest tradeoffs

- **The gate is prompt-enforced.** Tested: a second Discord account's `approve` was ignored. It is not a security boundary.
- **Three agents run with permission prompts off** (`auto_approve: true`: repro, fixer, reviewer). Claude Code otherwise refuses to run code cloned from GitHub. The triager runs no code and keeps prompts. Run this only against the demo repo.
- **The GitHub token is held by `scripts/push-pr.mjs`, not the agents' instructions**, but all agents run as your OS user, so this is separation by process and instruction, not by operating system.
- **Console shows a false "Nothing was created"** after Create all: its request times out at ~60 s while the server finishes (~70 s). Do not retry; check Discord.
- Agents only wake when `@`-mentioned, so the gate words are `@<team>-reviewer approve` / `reject <reason>`.

## Run it

Prerequisites: Windows with Switch Console, Docker, Claude Code signed in (`claude`), a Discord server and bot (docs: [Connect Discord](https://docs.switchagents.ai/switch-rooms/deploy/messaging-apps/discord.md)), and the GitHub CLI signed in (`gh auth login`).

1. Fork or use `Guten-Morgen1302/bug2pr-demo` (public, `main` protected, seeded bug in `src/slugify.js`).
2. `node scripts/build-template.mjs --team bug --repo https://github.com/<you>/bug2pr-demo.git` writes `template/bug-to-pr-room.template.yaml` (values are baked because Switch does not fill `{params}` in agent instructions).
3. Console: Templates, Import template, paste the YAML, Use template, pick your Discord connection, Create all. Wait ~70 s.
4. In the new channel post a bug for `@bug-triager`; when the fixer posts its `PR:` line, state a constraint to `@bug-reviewer`; the creator types `@bug-reviewer approve`; you merge the PR.

Without a signed-in `gh`, `push-pr` runs dry: it pushes the branch and prints `PR (dry-run)` with the SHA, and opens no PR.

## Repo map

| Path | What |
|---|---|
| `agents/` | one instructions file per role, plus shared state-machine rules |
| `scripts/build-template.mjs` | builds the Switch template from `agents/` |
| `scripts/push-pr.mjs` | pushes the fixer's branch and opens the PR; the only thing that touches a token |
| `scripts/smoke.mjs` | seeded bug fails, tempting patch fails the v1 check, correct patch passes both |
| `demo-app/` | the seeded buggy app, its tests, private edge script and answer fixtures |
| `docs/` | plan, review record, spike notes, recorded transcript |

## State machine

`REPORTED -> REPRODUCED -> FIX_PROPOSED -> REVIEWING -> REVIEW_PASSED -> APPROVED_PENDING_MERGE`, plus `ESCALATED` and `CLOSED`. A rejection counter (reviewer and human rejections together) is tested before it is incremented: rejections 1 and 2 return to the fixer, the third escalates to the human. Only the escalation path has not yet been exercised live.

## Not done / deferred

Second agent provider, Switch spend caps and Trust demos, Discord slash commands, a setup script with error codes, a 3-clone time-to-first-room measurement, and exercising ESCALATED live.

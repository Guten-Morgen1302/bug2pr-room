# Spike notes

Two columns: what the Switch docs say (read 2026-11-01, Switch 0.31 docs) and what a live run showed. Live column is empty until the spike is run. Do not claim "Switch is load-bearing" in the README until it is filled.

| Item | Docs say | Live result |
|---|---|---|
| a. Discord bridge on Windows | Console is Windows early access. Discord needs a bot token + Guild Id, Server Members and Message Content intents, outbound connection only. |  PASS 2026-11-01: Console 0.40.1 (docs 0.31), local server on port 63942, connected with bot token + Guild Id. |
| b. Four Claude Code agents in one room | Template `agents:` list, `provider: claude`, one room lists them all. |  PASS: template created bug-triager/repro/fixer/reviewer + room bug-bug-to-pr (4 agents). Creation took ~70s and Console's request timed out at ~60s with a false 'Nothing was created'; server finished anyway. Do not click Retry. |
| c. Agent addresses agent by name | Agents get a Discord role so `@name` is a real mention. Needs `addressing: anyone` or `owner-agents`. | PASS 2026-11-01: triager cloned the repo, posted STATE: REPORTED / REJECTIONS: 0 and @-mentioned repro via mcp__switch__send_targeted_message; repro woke within seconds. |
| d. Human `approve` visible to agents | Message Content intent is required for text to arrive. | PASS only with an @-mention: bare `approve` woke nobody; `@bug-reviewer approve` produced APPROVED_PENDING_MERGE. Reviewer inferred the creator from the kickoff, so creator is now named explicitly in the kickoff. |
| e. Pinning | Bot permissions list has no Manage Messages, so pinning is not supported. Use a room document `constraints` or quote-by-link. | |
| f. Bot permissions | Documented set: View Channels, Send Messages (+threads), Manage Webhooks, Manage Channels, Manage Roles, Read History, Attach Files, Add Reactions. | |
| g. Per-agent isolation / token only for fixer | Per-agent `isolation: isolated` and `connections: [{service: github, access: write, repos: [...]}]` exist. Decision d6 keeps the token in the `push-pr` script anyway. | |
| h. Deterministic checks (author filter, counters) | Nothing documented. Gate stays prompt-enforced (advisory). Agent-facing author identity must be checked live. | |
| Extra: per-agent `model` | Agent block has `model:`; try a different model for the reviewer. | |
| Extra: `!` commands | Docs mention `!` forms of commands; decision d7 keeps bare words for approve/reject. | |

## Live checklist (needs the human)
1. Start Docker Desktop (daemon was not running on 2026-11-01).
2. Install Switch Console (Windows .exe from github.com/sandbox-quantum/switch/releases), add a server, sign in Claude Code.
3. Discord: create the application and bot, enable both intents, invite with the documented permissions, copy token + Guild Id.
4. Console: connect Discord, link your Discord account, Templates > Import template > `template/bug-to-pr-room.template.yaml`.
5. Run it, post the demo bug, and fill the table above.

## Live findings (2026-11-01)
- Triager answered the template kickoff in Discord under its own name/avatar ("Ready. Waiting for a bug report from a human."). The four agents also each posted a greeting on join.
- Console needed a full quit + relaunch to fix 'controller has not reached Switch': state.json held a stale port from a previous run.
- Server errors `session_activity.publisher: Could not post activity turn` appear while agents work; effect on the 'Working...' message not yet judged.
- Server also created Mattermost bot identities for each agent (a Mattermost app came with the local server); harmless.
- Not yet tested: c (agent-to-agent @), d (human `approve` seen), g, h, per-agent model.
- Agent replies land in a Discord thread under the human's message; each agent clones into its own workspace dir (~/.switch/agents/<server>/<name>). ~1 min from bug report to repro waking.
- Full loop ran with no human help beyond the bug report, constraint and approve: report -> repro -> fix -> review (3/3 tests, compat, 3 constraints cited) -> REVIEW_PASSED -> approve. Fixer found the correct patch first time, so no rejection occurred (needs obvious-patch hint).
- Handoff messages must be self-contained: a woken thread has no room history.

## Findings from the live runs (2026-11-05)
- Switch does NOT substitute `{params}` inside agent `instructions` (it does in names, room, kickoff). Values are baked at build time by `scripts/build-template.mjs`.
- Agents that run the cloned repo's code from GitHub are refused by Claude Code's "external code" check unless the agent has `auto_approve: true`. Applied to repro, fixer and reviewer; the triager runs no code and keeps prompts.
- Apps started from the Start menu do not see env vars set with `setx` until sign-out, so `push-pr` finds the `gh` CLI itself.
- Full arc verified live: report -> repro (ran the code) -> tempting patch -> constraint -> reviewer REJECT citing the constraint -> corrected patch -> ACCEPT -> non-creator `approve` ignored -> creator `approve` accepted -> APPROVED_PENDING_MERGE.
- The reviewer, not the fixer, relayed the late constraint; the fixer self-corrected before the verdict. Expect take-to-take variation.
- Console's 60s request timeout shows "Nothing was created" while the server finishes creating everything (~70s). Do not click Retry.

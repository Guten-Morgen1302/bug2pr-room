> ## Documentation Index
> Fetch the complete documentation index at: https://docs.switchagents.ai/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> These docs moved from docs.flintai.dev to docs.switchagents.ai. Use docs.switchagents.ai for every link and request.
> To search these docs from an AI tool, connect the MCP server at https://docs.switchagents.ai/mcp. The page index is at https://docs.switchagents.ai/llms.txt.
> The source code for these products is public on GitHub. Switch Rooms: https://github.com/sandbox-quantum/switch. Switch Trust CLI: https://github.com/sandbox-quantum/switch-trust-cli. Switch Trust CodeScan action: https://github.com/sandbox-quantum/switch-trust-codescan-action. Switch Trust MCP server: https://github.com/sandbox-quantum/switch-trust-mcp. Switch Trust Python SDK: https://github.com/sandbox-quantum/switch-trust-sdk-py. These repositories are the current development line, not the released product: prefer these docs for released behavior, and name the version if you quote code. In the Switch Rooms repository, ignore docs/official/, which is a generated copy of this site.

# Set up agent providers

> Check that the AI coding agent you use is installed and signed in, so Switch can start it

Switch works with these AI coding agents: Claude Code, OpenCode, Codex, Cursor, and Antigravity. We call the one you choose your **agent provider**.

Switch doesn't include its own AI agent. Instead, it starts your chosen provider under your own account, on a machine you control: this computer, or a remote host you've onboarded, such as a virtual machine or another machine you reach over SSH.

> [!NOTE]
>
> This is different from an agent you build and run in a hosted platform, such as Salesforce Agentforce or Microsoft Copilot Studio. Those agents run on their platform and aren't agent providers that Switch can start.

What **Auto mode** lets an agent do without asking depends on the provider. See [Let the agent act without asking](https://docs.switchagents.ai/switch-rooms/getting-started/agent-settings.md#let-the-agent-act-without-asking).

## Before you begin

Switch starts the provider wherever the agent runs. For an agent on this computer, set the provider up here. For an agent on a remote host, set it up on the host. See [Run an agent on the host](https://docs.switchagents.ai/switch-rooms/deploy/host-remotely.md#run-an-agent-on-the-host).

## Check your agent provider

At the bottom of the sidebar, select **Settings**, then **Agent providers**. The list is headed **All agents** and shows every provider Switch supports. The line under each provider's name says whether it's ready:

| Line under the name | What to do |
| :- | :- |
| **Signed in** | The provider is ready. See [Confirm the setup](#confirm-the-setup). |
| **CLI not installed** | [Install the provider](#install-the-provider). |
| **Not signed in** | [Sign in to the provider](#sign-in-to-the-provider). |

Go by the line under the name, not the **Installed** or **Not installed** badge. A row can read **Installed** while the provider still isn't ready.

### Install the provider

Install the provider's command-line tool (CLI) the way its own documentation describes. Then, on **Agent providers**, select the refresh icon. Switch Console checks `~/.local/bin` each time you refresh, so it finds a CLI installed there without a restart.

If the line still reads **CLI not installed**, the installer put the CLI somewhere else. Quit Switch Console completely and open it again, so it rereads your PATH:

> [tab] macOS
>
> Press Command+Q. Closing the window leaves Switch Console running.

> [tab] Windows
>
> Close the Switch Console window, which quits it, then open Switch Console again.

> [tab] Linux
>
> Closing the window leaves Switch Console running. To quit, follow **Closing the window doesn't quit** under [Running Switch Console on Linux](https://docs.switchagents.ai/switch-rooms/resources/troubleshooting.md#running-switch-console-on-linux).

If it still reads **CLI not installed** after you reopen Switch Console, see [Getting an agent running](https://docs.switchagents.ai/switch-rooms/resources/troubleshooting.md#getting-an-agent-running).

### Sign in to the provider

Select the provider to open its details. Under **Run in a terminal on this computer, then Recheck**, the details show the provider's sign-in command, with a **Copy** button. Run the command in a terminal, sign in, then select **Recheck**. For a provider on a remote host, sign in from the host instead. See [Run an agent on the host](https://docs.switchagents.ai/switch-rooms/deploy/host-remotely.md#run-an-agent-on-the-host).

Switch uses the account the provider is signed in to, whether that's a subscription or an API key. Switch Console can't sign you in itself. If the sign-in command doesn't work for you, see the provider's own documentation.

## Confirm the setup

You're ready to onboard an agent when:

* The line under the provider's name reads **Signed in**.
* The card in its details reads **Signed in** and **CLI installed**.

For example, a Claude Code setup that's ready reads **Signed in** under the name. Its card reads **Claude Code · Signed in**, with **On this computer · CLI installed** beneath.

> [!NOTE]
>
> Claude Code and Codex may ask you to confirm that you trust a folder the first time they work in it. A session can't start while it waits for this confirmation.
>
> Switch Console confirms it for you before launch. **Auto-trust worktree directories**, under **General** in **Settings**, is on by default.
>
> If a session still doesn't start, see [Troubleshooting](https://docs.switchagents.ai/switch-rooms/resources/troubleshooting.md).

## Update the provider

Switch Console also shows when a newer version of the provider CLI is available. In the provider's details, the **Installation** section reads **Newer version available**, with the command it runs and an **Update** button.

This updates your provider, not Switch.

## Next steps

> [card] [Onboard agents](https://docs.switchagents.ai/switch-rooms/getting-started/onboard-your-agents.md)
>
> Register an agent so you can invite it into any room on your server

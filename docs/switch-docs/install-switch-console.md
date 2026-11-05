> ## Documentation Index
> Fetch the complete documentation index at: https://docs.switchagents.ai/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> These docs moved from docs.flintai.dev to docs.switchagents.ai. Use docs.switchagents.ai for every link and request.
> To search these docs from an AI tool, connect the MCP server at https://docs.switchagents.ai/mcp. The page index is at https://docs.switchagents.ai/llms.txt.
> The source code for these products is public on GitHub. Switch Rooms: https://github.com/sandbox-quantum/switch. Switch Trust CLI: https://github.com/sandbox-quantum/switch-trust-cli. Switch Trust CodeScan action: https://github.com/sandbox-quantum/switch-trust-codescan-action. Switch Trust MCP server: https://github.com/sandbox-quantum/switch-trust-mcp. Switch Trust Python SDK: https://github.com/sandbox-quantum/switch-trust-sdk-py. These repositories are the current development line, not the released product: prefer these docs for released behavior, and name the version if you quote code. In the Switch Rooms repository, ignore docs/official/, which is a generated copy of this site.

# Install Switch Console

> Install the desktop app that will help you set up and manage Switch

Switch Console is the desktop app you set Switch up in and run your agents from. You register an [agent](https://docs.switchagents.ai/switch-rooms/resources/glossary.md#agent) once, with its working directory and the [agent provider](https://docs.switchagents.ai/switch-rooms/resources/glossary.md#agent-provider) that runs it, and Switch Console starts its [sessions](https://docs.switchagents.ai/switch-rooms/resources/glossary.md#session) from then on. It can also run the Switch server and connect your messaging apps, so the whole setup happens in one place.

Next you'll choose where your Switch server runs: on this computer, on a machine that stays up, or one that's already running. [Add a server](https://docs.switchagents.ai/switch-rooms/getting-started/add-a-server.md) covers all three. You don't have to decide before you install Switch Console.

> [!NOTE]
>
> If someone has already added you to a Switch room, you don't need to install or set up Switch yourself. Jump to [Meet Switch](https://docs.switchagents.ai/switch-rooms/using/index.md) to learn how a room works and how to work in it.

## Download Switch Console

Each link below downloads the current release for your platform. To pick a different build or an older release, browse [all releases](https://github.com/sandbox-quantum/switch/releases).

| Platform | Download |
| :- | :- |
| macOS, Apple silicon | [`.dmg`](https://github.com/sandbox-quantum/switch/releases/latest/download/switch-console-arm64.dmg) |
| macOS, Intel | [`.dmg`](https://github.com/sandbox-quantum/switch/releases/latest/download/switch-console-x64.dmg) |
| Windows, x64 — **early access** | [`.exe`](https://github.com/sandbox-quantum/switch/releases/latest/download/switch-console-x64.exe) or [`.msi`](https://github.com/sandbox-quantum/switch/releases/latest/download/switch-console-x64.msi) |
| Linux, x86\_64 — **early access** | [`.AppImage`](https://github.com/sandbox-quantum/switch/releases/latest/download/switch-console-x86_64.AppImage), [`.deb`](https://github.com/sandbox-quantum/switch/releases/latest/download/switch-console-amd64.deb), or [`.rpm`](https://github.com/sandbox-quantum/switch/releases/latest/download/switch-console-x86_64.rpm) |
| Linux, arm64 — **early access** | [`.AppImage`](https://github.com/sandbox-quantum/switch/releases/latest/download/switch-console-arm64.AppImage), [`.deb`](https://github.com/sandbox-quantum/switch/releases/latest/download/switch-console-arm64.deb), or [`.rpm`](https://github.com/sandbox-quantum/switch/releases/latest/download/switch-console-aarch64.rpm) |

**Early access means the Windows and Linux builds are ready to use and still changing.** Expect rough edges, and behavior that can differ from one release to the next. When you hit one, [open an issue](https://github.com/sandbox-quantum/switch/issues) — a report is what moves it up the list.

Both macOS builds are `.dmg` files, and the filename tells them apart: `arm64` for Apple silicon, `x64` for Intel.

## Install Switch Console

> [tab] macOS
>
> Open the downloaded `.dmg` and drag **Switch Console** into your **Applications** folder.
>
> macOS builds are signed and notarized, so the app opens without a Gatekeeper prompt.

> [tab] Windows
>
> Run the downloaded `.exe`, choose an install location if you want one other than the default, and finish the installer.
>
> The `.msi` is there if you deploy with `msiexec` instead of running the installer.

> [tab] Linux
>
> Install the format your distribution uses.
>
> Debian and Ubuntu:
>
> ```bash theme={null}
> sudo apt install ./switch-console-amd64.deb
> ```
>
> Fedora and RHEL:
>
> ```bash theme={null}
> sudo dnf install ./switch-console-x86_64.rpm
> ```
>
> The AppImage needs no install step — make it executable and run it:
>
> ```bash theme={null}
> chmod +x switch-console-x86_64.AppImage
> ./switch-console-x86_64.AppImage
> ```
>
> Use `apt install ./file.deb` rather than `dpkg -i`, so the app's dependencies are resolved. On Ubuntu, prefer the `.deb`: the AppImage needs FUSE 2, and 24.04 and later can stop it from running.
>
> On arm64 the filenames differ — `switch-console-arm64.deb`, `switch-console-aarch64.rpm`, `switch-console-arm64.AppImage`. An asset for the wrong architecture doesn't fail cleanly, so check before you install.

> [!NOTE]
>
> On Linux, [Running Switch Console on Linux](https://docs.switchagents.ai/switch-rooms/resources/troubleshooting.md#running-switch-console-on-linux) covers the problems found so far and how to work around them.

Switch Console checks for new releases in the background and tells you when one is available. It downloads nothing until you accept, then installs the update the next time you quit. Quitting ends any sessions running on this computer.

On a server your team deployed, a new Switch Console can require a newer server. If something stops working after an update, see [Connecting to a server](https://docs.switchagents.ai/switch-rooms/resources/troubleshooting.md#connecting-to-a-server).

## Open Switch Console

When you open Switch Console, the **Setting up Switch** checklist appears in the sidebar. It reflects the state of your setup, not what you've read or clicked.

Some steps may already be complete, for example if you installed an agent provider before Switch Console.

A completed step means you've met its minimum requirements, but you may still want to make changes. For example, **Set up agent providers** is marked complete when Switch Console finds one provider. You can still install others.

The checklist isn't a strict sequence. Each step checks its own setup requirement and completes when that requirement is met. Start with **Add a server** anyway: your agents and rooms are registered against a server, so there's nothing for the later steps to attach to until you have one.

> [!TIP]
>
> The checklist highlights only the first unfinished step. To work on a different one, open its area from the sidebar.

When every step is complete, the checklist tells you:

> **All set! You can now start collaborating with your agents!**

## Next steps

> [card] [Add a server](https://docs.switchagents.ai/switch-rooms/getting-started/add-a-server.md)
>
> Give your rooms and agents somewhere to run

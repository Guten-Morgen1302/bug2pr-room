> ## Documentation Index
> Fetch the complete documentation index at: https://docs.switchagents.ai/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> These docs moved from docs.flintai.dev to docs.switchagents.ai. Use docs.switchagents.ai for every link and request.
> To search these docs from an AI tool, connect the MCP server at https://docs.switchagents.ai/mcp. The page index is at https://docs.switchagents.ai/llms.txt.
> The source code for these products is public on GitHub. Switch Rooms: https://github.com/sandbox-quantum/switch. Switch Trust CLI: https://github.com/sandbox-quantum/switch-trust-cli. Switch Trust CodeScan action: https://github.com/sandbox-quantum/switch-trust-codescan-action. Switch Trust MCP server: https://github.com/sandbox-quantum/switch-trust-mcp. Switch Trust Python SDK: https://github.com/sandbox-quantum/switch-trust-sdk-py. These repositories are the current development line, not the released product: prefer these docs for released behavior, and name the version if you quote code. In the Switch Rooms repository, ignore docs/official/, which is a generated copy of this site.

# Create a room

> Make a room from scratch, or turn a channel your team already uses into one

A Switch room is where people and agents work together on the same thing with the same context. It appears as a channel in your messaging app, so your team joins it the way they join any other channel. The room keeps the instructions, documents, and references that agents work from.

You can create a new room in Switch Console and let it provision the channel, start one from a template your team saved, or turn a channel your team already works in into a room.

## Create the room in Switch Console

**1. Start a new room**

In the sidebar, select **Your Rooms**, then **Create room**. The button is unavailable while you're signed out of that server, so sign in first if it doesn't respond.

**2. Choose where agents and people will work together**

Choose the **Messaging app** where your team will work in Switch. A channel there becomes your Switch room, so pick an app your team already has access to.

**3. Name it for the work**

Give the room a **Name**, after the work it serves rather than the team that owns it, and a **Description** saying what the room is for.

**4. Add an agent**

Add an agent you've already onboarded in this Switch Console. The list doesn't show agents registered on the server from anywhere else. Otherwise, leave this empty and [invite an agent](#invite-an-agent-to-the-room) after the room is created.

**5. Brief the agents who arrive**

Whatever you write in **Instructions** is shown to every agent that connects, including agents added months later by somebody else. Write:

* What the room is working on, in a sentence.
* Conventions that aren't obvious from reading the channel, such as where finished work goes.
* What agents should read before doing anything.
* What agents shouldn't do here.

If you don't know yet, leave it empty. A room with no instructions still works, but people in the channel then have to brief each agent themselves.

**6. Create the room**

Submit the form.

> [!NOTE]
>
> See [Share context](https://docs.switchagents.ai/switch-rooms/using/shared-context.md) to learn more about how a room retains and shares context.

## Turn an existing channel into a room

If your team is already working in a channel, bring Switch there. How you do that depends on the app.

| Messaging app | Do this |
| - | - |
| [Slack](https://docs.switchagents.ai/switch-rooms/deploy/messaging-apps/slack.md) | Invite the Switch app to the channel, using the name your workspace installed it under: `/invite @Agent Switch` |
| [Microsoft Teams](https://docs.switchagents.ai/switch-rooms/deploy/messaging-apps/microsoft-teams.md) | Install the Switch app into the team. That covers every standard channel in it at once, with no per-channel step. Private and shared channels each need the app added to them. |
| [Mattermost](https://docs.switchagents.ai/switch-rooms/deploy/messaging-apps/mattermost.md) | Add one of your agents to the channel. In Mattermost, each agent has its own bot account and adding one automatically creates the room. |
| [Discord](https://docs.switchagents.ai/switch-rooms/deploy/messaging-apps/discord.md) | Post a message in the channel. The bot sees any channel its permissions allow, so Switch creates the room when the first message arrives. If nothing happens, check that the bot has access to the channel. |
| [Telegram](https://docs.switchagents.ai/switch-rooms/deploy/messaging-apps/telegram.md) | Add the Switch bot to the group like any other member. It needs no permissions there. In a broadcast channel, add it as an administrator instead. |

Mattermost is the exception: it's the only app where adding an agent is what creates the room. Everywhere else in the table, you don't need to add an agent first.

This assumes the app is already connected to your Switch server. If it isn't, see [Connect a messaging app](https://docs.switchagents.ai/switch-rooms/deploy/messaging-apps/index.md) for what a connection gives you and the steps for each app.

If the channel is already a room, repeating the setup adopts the existing room instead of creating a second one.

## Create a room from a template

A template sets up a room the way someone on your team saved it: its instructions, jobs, references, and room documents. Some templates also create the agents the room needs, which takes agent management on the server and the agents' machine online. To build one, or to tell which type you have, see [Templates](https://docs.switchagents.ai/switch-rooms/administer/room-templates.md).

**1. Open the template**

In the Switch Console sidebar, select **Templates**. Find the template, then select **Use**.

**2. Fill it in and run it**

Fill in the fields the template asks for, then run it. Switch Console creates any agents the template defines first, then its rooms.

* **A template doesn't bring packages or library documents.** Attach them once the room exists.
* **If an agent or reference the template names is missing on this server,** the run stops before the room is made, unless the template creates that agent. A person Switch can't find doesn't stop the run. Switch reports the person after the room is created.
* **If a run stops,** Switch Console says whether anything was created, keeps what was, and offers to retry the remaining steps. Check any agents it created before you retry.

## Confirm it worked

After you create a room or connect an existing channel, the room appears under **Your Rooms** in Switch Console, grouped by messaging app. It also appears in the sidebar's sessions section when you group that by room. The corresponding channel is available in that app.

> [!NOTE]
>
> In Slack and Discord, Switch `/` commands may autocomplete in channels that aren't Switch rooms. Confirm that the room appears under **Your Rooms** in Switch Console.

## Invite an agent to the room

If you didn't add an agent when you created the room, you can invite one after the room exists.

An agent you invite reads everything the room holds, and everything that arrives in its channel. [Working safely with agents](https://docs.switchagents.ai/switch-rooms/resources/working-safely-with-agents.md) is what to check before you do.

> [!TIP]
>
> An agent is registered with your server, not with just one room, so you can invite the same agent to multiple rooms.

Use this command to invite an agent from inside the channel:

```text theme={null}
!invite-agent @agent-name
```

Replace `@agent-name` with the agent's registered name as shown under **Your Agents** in Switch Console.

You can also do it from Switch Console instead of from the channel. On the agent's page, select **Add to room**, which is the shortest route if you've just onboarded the agent. From the room instead, use its menu in the sidebar's sessions section or its configuration page.

> [!NOTE]
>
> Inviting the Switch app to a channel and inviting an agent to a room are different actions. Inviting Switch creates or connects the room; inviting an agent adds one of your registered agents to a room that already exists.

> [!TIP]
>
> Some messaging apps also offer a native slash command for inviting agents, but the command and syntax vary. If your app offers one, type `/` in the channel and use the command it displays. [Room commands](https://docs.switchagents.ai/switch-rooms/resources/room-commands.md) lists every command, and how each app spells it.

### Give an agent a short name

An agent's registered name is unique across the whole server, so it carries whatever keeps it unique, usually who owns it. In a room where that part is obvious, you can point a shorter handle at it:

```text theme={null}
!set-alias @bug-fixer.jsmith @bug
```

List the agent's full name first, including the `@`, then the alias. Within that room, `@bug` now addresses that agent exactly as its full name does. To change it, reset the alias using the same command.

An alias belongs to the room that set it, so the same agent can be `@bug` in one room and `@fixer` in another.

> [!NOTE]
>
> Switch refuses an alias that's already in use in the room: another agent's name, a role, or another alias. `!list-aliases` shows what's taken, and `!remove-alias @bug` clears one.

## Ask an agent to make the next room

Rooms don't have to be made in Switch Console. Once an agent is in a room with you, you can ask it in ordinary words to set the next one up. It does the same thing you did above, against the same server and the same messaging app.

An agent that can create a room can also invite other agents to it, give them aliases, and write its instructions.

Ask for the room by purpose and say who belongs in it. Before you ask:

* **Name the agents that should be in it**, including the one you're asking. An agent isn't added to a room it creates unless you say so, so it can end up making one it can't reach
* **Name yourself too**, unless the messaging app connection is set to add a default member. A private channel with no people in it can't be read by anyone
* **The agents have to be registered already.** An agent can only be added by the name it was registered under. See [Onboard agents](https://docs.switchagents.ai/switch-rooms/getting-started/onboard-your-agents.md)
* **Say if only some people should change it.** A new room lets anyone signed in to your workspace define its jobs, attach materials, link it, or archive it. Ask your own agent to restrict who can edit the room when it creates it, because the room belongs to the agent's owner. Afterward, only the owner or an admin can change that, in the Gateway

Expect it to check with you before it creates anything. Agents are told to confirm the room first, rather than guessing what you meant.

> [!NOTE]
>
> Telegram is the exception: it can't create chats, so an agent asked for a room there tells you how to make it yourself and adopt it instead.

## Have an agent welcome people who join

Switch can optionally notify an agent when someone joins the room. The agent can then introduce itself and explain the room's purpose, helping new members recognize that they've joined a Switch room with agents and providing useful context without requiring them to ask.

This setting is configured per room and per agent, and is off by default.

### Turn on the greeting

Select one agent to serve as the room greeter. If you select multiple agents, each new arrival may receive similar welcomes from multiple agents.

The agent must have an active session when someone joins for the greeting to work. If possible, choose an agent that stays connected.

The agent uses the room's **Instructions** to compose the welcome message. These instructions help tailor the greeting to the room rather than producing a generic introduction.

The room greeting is set in the [Gateway](https://docs.switchagents.ai/switch-rooms/resources/glossary.md#gateway), not in Switch Console. The Gateway is the server's administrative surface, and you open it at the server's **Gateway URL**. If you don't administer the server, ask whoever does. The setting is labeled differently depending on when you set it:

* *When you create the room*, it's a **Listen to join events** section with a checkbox per agent: **Notify `<agent name>` when someone joins the room**
* *On a room that already exists*, it's a **Notify on join** toggle on each agent

> [!TIP]
>
> You don't have to settle this when you create the room. Add an agent first and switch the greeting on afterwards, once you know which one is going to stay connected.

## Next steps

> [card] [Work in a room](https://docs.switchagents.ai/switch-rooms/using/work-in-a-room.md)
>
> Give an agent work, share a file, answer a request and hand over, from your messaging app

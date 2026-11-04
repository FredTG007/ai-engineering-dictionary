---
title: MCP (Model Context Protocol)
description: An open standard that lets LLM apps discover and call external tools and data through a common client-server interface.
difficulty: intermediate
interview: "Three internal assistants each wrap the same ticketing API, and an upstream schema change broke two of them silently. Would you move to MCP, and what risks come with it?"
interviewAnswer: "Covers one MCP server exposing tools that any client can discover, so a fix lands once; the trade-offs of tool lists bloating context and confusing tool choice, prompt injection from untrusted servers, pinning versions and scoping permissions, and when a direct integration is simpler."
---

The Model Context Protocol is a standard way for an LLM application to talk to outside tools and data. Instead of hand-writing a separate integration for every API, you run an MCP server that advertises its tools, resources and prompts, and any MCP-aware client can connect to it, list what is available and invoke it. The model still does ordinary [tool calling](./tool-calling.md); MCP just standardizes how those tools are described, discovered and transported.

The problem it addresses is integration sprawl. One team we worked with had three internal assistants, each with its own copy of a "search tickets" tool, and each copy had a slightly different [function schema](./function-schema.md). When the ticketing API added a required field, two of the three assistants broke silently and started returning empty results for a week. Moving the tool behind a single MCP server meant one fix covered every client.

An MCP setup has a few moving parts worth knowing:

| Piece | Role |
|---|---|
| Host | The application the user interacts with, such as a chat app or IDE |
| Client | The connector inside the host that speaks MCP to one server |
| Server | Exposes tools, resources and prompts over stdio or HTTP |
| Transport | The channel carrying JSON-RPC messages between client and server |

MCP does not remove the need for judgment about what you expose. Unless the host defers or filters them, every tool a server advertises ends up in the model's [context window](./context-window.md), so connecting ten servers with forty tools each can bloat prompts and make the [agent](./agent.md) pick the wrong tool. Servers also widen your attack surface: a malicious or compromised server can return text crafted for [prompt injection](./prompt-injection.md), so treat third-party servers like any other dependency and scope their permissions tightly.

In practice, MCP is most useful when several applications need the same capabilities, or when you want users to plug in their own tools without you shipping code. For a single app with two tools, a direct integration is often simpler.

_Usage:_

- "Don't build another Jira wrapper, just point the assistant at the MCP server."
- "We connected six MCP servers and now the tool list alone is eight thousand tokens."
- "Pin the server version; an update changed a tool description and the agent stopped calling it."

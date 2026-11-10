---
title: Allowlisting / Capability Scopes
description: Restricting which tools, URLs and data an agent may touch for a given task or user role, with everything else denied by default.
difficulty: intermediate
interview: "Your research agent has a generic HTTP tool and last week a web page it read talked it into calling an internal admin endpoint. How do you stop that class of incident without removing the tool?"
interviewAnswer: "Covers deny-by-default scopes enforced in code rather than in the prompt: a per-task allowlist of hosts, methods and tools, narrower scopes for steps that read untrusted content, read-only defaults with explicit escalation, and logging every denied call so the list can be tuned."
buildThis:
  title: Scoped tool gateway for an agent
  goal: Put a small policy layer between an agent and its tools so each run can only call what its task scope allows.
  steps:
    - Write three tools (fetch URL, read file, send message) and wrap them in a dispatcher the agent must go through.
    - Define scopes as JSON files listing allowed tools, host patterns and read or write permission per task type.
    - Make the dispatcher deny any call outside the active scope, return a clear error to the model and log the attempt.
    - Run a research task with a scope that allows only two documentation hosts and confirm off-list fetches are refused.
  skills:
    - Python
    - tool calling
    - policy design
    - logging
  time: an afternoon
  stretch: Add an escalation path where a denied call can be approved once by a human and the approval is recorded with the trace.
---

Allowlisting means deciding in code which tools, hosts and data an [agent](./agent.md) may touch for a given task or user, and refusing everything else. The scope is enforced by the layer that executes [tool calls](./tool-calling.md), not by a sentence in the prompt asking the model to behave. A capability scope is the same idea applied per step or per role: a triage agent gets read access to tickets, a billing agent gets write access to refunds under a limit, and neither gets the other's permissions.

The reason this matters is that prompts are advice and scopes are enforcement. One team shipped a research agent with a general-purpose HTTP tool and a system prompt that said to only visit public documentation. A page the agent read contained text instructing it to POST a summary to a URL that happened to be an internal admin endpoint reachable from the agent's network. The model followed the page. Nothing in the pipeline could have stopped it, because the only rule lived in the prompt, and [indirect prompt injection](./indirect-prompt-injection.md) is precisely the case where prompt rules fail. An allowlist of two documentation hosts would have refused the call before it left the process.

| Control | Where it lives | Holds under injection | Visible in logs |
| --- | --- | --- | --- |
| "Only use approved sites" in the system prompt | Model behaviour | No | Only if the model mentions it |
| Allowlist of hosts and tools per task | Tool executor | Yes | Every denied call is logged |

Deny by default and scope per step. Start each task with the smallest set of tools that can finish it, and tighten further for steps that read untrusted content: an agent summarising an inbound email should have no write tools at all during that step. Read-only should be the default for anything that touches real systems, with write access granted explicitly, capped by amount or count, and routed through a [human-in-the-loop](./human-in-the-loop.md) check for anything irreversible. For [computer use](./computer-use.md) agents the same rule applies to domains the browser may visit and buttons it may press.

Scopes have to be visible to be useful. Return a clear error to the model when a call is denied, so it can explain or ask instead of retrying blindly, and log every denial with the task and the attempted target. Those logs tell you which legitimate tools are missing from a scope and which attempts were attacks. Protocols such as [MCP](./mcp.md) make it easy to connect many tools; the allowlist is what keeps "connected" from meaning "available to whatever the model reads next". Treat it as one layer in your [guardrails](./guardrails.md), alongside input checks and output filtering, not a replacement for them.

_Usage:_

- "The scope for the summariser step is read-only, so even if the email tells it to forward something, it can't."
- "Add the vendor's status page to the allowlist instead of giving the agent open HTTP again."
- "We saw forty denied calls to a pastebin domain in the logs last night, so somebody is probing it."

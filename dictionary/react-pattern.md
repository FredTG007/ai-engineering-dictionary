---
title: ReAct Pattern
description: A prompting pattern where the model alternates short reasoning steps with tool actions and reads each result before continuing.
difficulty: intermediate
interview: "Your research agent answers multi-step questions in one shot and often guesses intermediate facts it could have looked up. How would restructuring it around ReAct change its behavior, and what new failure modes would you watch for?"
interviewAnswer: "Covers interleaving a brief thought, an action such as a search, and the observed result in a loop so later steps depend on real data, plus step limits, repeated-action detection, the extra latency and tokens per step, and tracing the thoughts and observations to debug runs."
buildThis:
  title: Build a ReAct loop with a calculator tool
  goal: Code a minimal ReAct agent that loops between reasoning steps and calculator tool calls until it solves a math query.
  steps:
    - Set up a local Python script using a base LLM and a simple add/multiply Python function as a tool.
    - Write a prompt template that forces the model to output a Thought, an Action, and wait for an Observation.
    - "Parse the model's text output to extract tool names and arguments, then execute the function."
    - Feed the tool result back into the conversation history and run the loop until the final answer appears.
  skills:
    - Prompt Engineering
    - Function Calling
    - Python
  time: an afternoon
  stretch: Add a web search API tool and let the agent handle multi-step questions that require both math and external facts.
---

ReAct, short for "reasoning and acting", is a pattern where the model works through a task by alternating between a short piece of reasoning, an action such as a search or an API call, and the observation that action returns. It was described by Yao and colleagues in 2022, and most modern [agent](./agent.md) frameworks still follow its basic shape, even when they no longer print the reasoning as plain text.

The pattern fixes a specific failure: a model that has to guess the facts in the middle of a task. One team's research assistant was asked which of two suppliers had the shorter delivery time to a given city. Answering in one shot, it made up a plausible delivery estimate for one supplier and compared it with a real figure for the other. Run as ReAct, the same model wrote "I need supplier A's delivery terms", called the search tool, read the result, and only then moved on to supplier B. Each step was based on data it had just seen, not on what it remembered.

A ReAct trace looks roughly like this:

| Step | Content |
|---|---|
| Thought | What do I need to know next? |
| Action | `search("supplier A delivery terms")` |
| Observation | The tool result, appended to the context |
| Thought | What does that tell me, and what is still missing? |
| Final answer | Given once the observations are enough |

Compared with plain [chain-of-thought](./chain-of-thought.md), the difference is that the reasoning is checked against the outside world at each step. The original paper found this cut down on invented facts on knowledge-heavy tasks, but it also showed new ways to fail: the model can get stuck repeating the same search, or follow a bad observation down a dead end.

In practice ReAct runs inside an [agent loop](./agent-loop.md) with [tool calling](./tool-calling.md) doing the work of the "Action" lines. The usual loop controls apply: a step limit, detection of repeated actions, and [tracing](./tracing.md) that keeps the thoughts and observations so a bad run can be replayed. Every extra step adds a model call, so a ReAct agent is slower and more expensive than a single prompt, and that cost is only worth paying when the task really does need information it cannot know in advance.

_Usage:_

- "Switch it to ReAct so it looks up the shipping terms instead of guessing them."
- "The trace shows the same Thought–Action pair four times. It's looping on one search."
- "Most of our agents are ReAct under the hood; the framework just hides the thought text."

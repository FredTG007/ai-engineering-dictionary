---
title: Tool Calling
description: A model capability where it returns a structured request to run a named function with arguments, which your code then executes.
---

Tool calling is the capability that lets a model respond with a structured request to run a specific function, with specific arguments, instead of plain text. Your application executes the function, sends the result back to the model, and the model continues with that new information. The model never runs anything itself; it only asks.

This is what connects a model to live data and actions. Without it, an assistant asked "where is my order?" can only guess or apologize. With a `get_order_status` tool, it emits a call like `{"name": "get_order_status", "arguments": {"order_id": "A1923"}}`, your code queries the database, and the model answers from the real status. It is the mechanism underneath every [agent](./agent.md).

The round trip has a consistent shape. You send the conversation along with a list of available tools, each described by a [function schema](./function-schema.md). The model either replies normally or returns one or more tool calls. You validate the arguments, run the functions, append the results to the conversation, and call the model again. Many models can request several independent calls at once, which you can execute in parallel to save time.

Most production bugs with tool calling come from the model choosing badly, not from the API. Common symptoms include:

- Calling the wrong tool because two descriptions overlap.
- Inventing argument values, such as an order ID the user never gave.
- Calling a tool when the answer was already in the conversation.
- Never calling the tool and answering from memory instead, a quiet form of [hallucination](./hallucination.md).

Treat every tool call as untrusted input. Validate arguments against the schema, check that the caller is allowed to act on the referenced resource, and return clear, short error messages the model can recover from. Tool results also land in the context, so a web page or email returned by a tool can carry instructions that amount to [prompt injection](./prompt-injection.md). Keep results trimmed, label them as data, and track tool-selection accuracy in your [evals](./evals.md) as its own metric.

_Usage:_

- "It called search_orders with an ID it made up. Validate before we hit the database."
- "Run those three tool calls in parallel; they don't depend on each other."
- "The model answered from memory instead of calling get_balance. Tighten the description."

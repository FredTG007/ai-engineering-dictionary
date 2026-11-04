---
title: Function Schema
description: The name, description and typed parameter definition that tells a model what a tool does and how to call it correctly.
difficulty: intermediate
interview: "Your agent often calls the right tool with wrong or missing arguments. How would you improve the function schema?"
interviewAnswer: "Covers clear tool and parameter names, descriptions that say when to use the tool and what each field means, enums and required fields to constrain values, units and formats spelled out, validating arguments before execution, and returning helpful validation errors."
---

A function schema is the definition you give a model for each tool it can use: a name, a plain-language description, and a typed specification of the parameters, usually written in JSON Schema. It is the model's main source of information about what the tool does, when to use it and how to fill in its arguments.

Most tool-selection bugs trace back to a vague schema. One team had two tools, `search` and `lookup`, with descriptions of "Searches records" and "Looks up records." The model picked between them almost at random, and about a quarter of customer lookups went through the slower full-text search. Renaming them to `search_help_articles` and `get_customer_by_email`, with descriptions that stated when to use each, fixed it without any other change.

A useful schema answers the questions a new colleague would ask. Here is a small example:

```json
{
  "name": "get_order_status",
  "description": "Get shipping status for one order. Use when the user gives an order ID. Do not use to search by customer name.",
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": { "type": "string", "description": "Order ID, format A followed by 4 digits, e.g. A1923" }
    },
    "required": ["order_id"]
  }
}
```

Several habits make schemas more reliable. Use specific, action-oriented names. Say when not to use a tool as well as when to use it. Prefer enums over free strings when the set of values is known, since that removes a whole class of invented arguments. Describe formats and give an example in the parameter description. Keep the number of parameters small, and mark only truly necessary ones as required so the model does not make up values to satisfy the schema.

Schemas cost tokens and attention. Every tool definition is sent with every request, so twenty verbose tools can add thousands of tokens and slow [time to first token](./time-to-first-token.md). Large tool sets also make selection harder. Group related tools, load only those relevant to the current task, and test schema changes with [evals](./evals.md) the same way you test prompt changes. Schemas are closely related to [structured output](./structured-output.md), and many providers use the same mechanism for both [tool calling](./tool-calling.md) and constrained responses. Protocols like [Model Context Protocol (MCP)](./mcp.md) standardize how these schemas are shared across applications.

_Usage:_

- "Rename 'lookup' to something that says what it looks up. The model can't read your mind."
- "Make status an enum. It keeps inventing values like 'kinda shipped'."
- "We're sending 30 tool schemas per request. That's 4k tokens before the user says hello."

---
title: Agentic RAG
description: Letting the model call retrieval as a tool, inspect what came back, and search again, instead of one fixed retrieve-then-answer pass.
difficulty: intermediate
interview: "Your single-pass RAG bot answers 80 percent of questions well but fails on ones that need a follow-up lookup. Product wants an agentic loop. How would you build it without wrecking latency and cost?"
interviewAnswer: "Covers exposing search as a tool so the model can rewrite, retrieve, judge sufficiency and retrieve again, keeping the single pass as the default and escalating only when it fails, caps on iterations and tokens, logging the trajectory so retrieval quality can still be measured, and tracking p95 latency and cost per answer alongside accuracy."
buildThis:
  title: Turn a single-pass RAG script into a bounded retrieval loop
  goal: Give the model a search tool and let it decide when to look again, with hard limits on iterations and tokens.
  steps:
    - Start from a working retrieve-then-answer script over a local index and wrap the retrieval call as a tool with a query argument.
    - Prompt the model to search, read the results, state whether they are sufficient, and either search again or answer.
    - Cap the loop at three searches and a fixed context budget, and log every query and result count per run.
    - Run thirty single-hop and thirty multi-hop questions and compare accuracy, latency and token cost against the original script.
  skills:
    - tool calling
    - RAG
    - Python
    - evals
  time: a day
  stretch: Add a sufficiency check from a second, smaller model and see whether it cuts unnecessary extra searches.
---

Agentic RAG means treating retrieval as a tool the model can call, rather than as a fixed step that runs once before generation. The model reads the first set of results, decides whether they answer the question, and if not, rewrites the query, searches again, or searches a different source. Classic [RAG](./rag.md) is a pipeline; agentic RAG is a loop with retrieval inside it.

The questions that motivate it are the ones a single pass cannot serve. "Does the plan my team is on include audit logs, and how do I export them?" needs one lookup to learn which plan the team is on and a second, dependent lookup for that plan's export procedure. A pipeline retrieves once with the whole question, gets a mix of plan pages and export pages, and guesses. A loop can retrieve the plan, read it, then form the next query with the plan name in it. The same loop can also notice that nothing relevant came back and try a synonym, which is what [query decomposition](./query-decomposition.md) and rewriting do in a fixed way, but here under the model's control.

The cost is that the model is now in charge of how much work happens. An e-commerce team shipped a retrieval loop that improved multi-hop accuracy from 52 to 79 percent on their eval set, and their p95 latency moved from 2 seconds to 14. Every question, including "what are your opening hours", was going through two or three searches because the model was told to be thorough. Their per-answer cost tripled. The fix was not to remove the loop but to bound it: the single pass stayed as the default, the loop ran only when a cheap sufficiency check said the first results were weak, and iterations were capped at three.

| Design | Latency | Cost | Handles multi-hop | Easy to evaluate |
| --- | --- | --- | --- | --- |
| Single pass | Low, predictable | Fixed | No | Yes, retrieval is one step |
| Loop on every request | High, variable | Multiplied | Yes | Harder, trajectory varies |
| Single pass with bounded escalation | Low for most, higher for hard | Mostly fixed | Yes | Manageable with trajectory logs |

Build the loop with the same machinery as any [agent](./agent.md): a search tool exposed through [tool calling](./tool-calling.md), an [agent loop](./agent-loop.md) with a step limit, and [tool-result budgets](./tool-result-budgets.md) so retrieved chunks from early iterations do not crowd out later ones. A brief [reflection](./reflection.md) step, where the model states what is still missing before searching again, tends to produce better second queries than letting it search blindly.

Evaluation changes shape too. With a pipeline, you can score retrieval and generation separately. With a loop, you also need to log the whole trajectory, the queries issued, the results read, and the stopping decision, so you can tell whether a wrong answer came from a bad query, a bad stop, or a bad synthesis.

_Usage:_

- "Multi-hop accuracy went up 27 points and p95 went from 2 seconds to 14. We need a budget on that loop."
- "Only escalate to the search loop when the first pass scores below the threshold; opening hours don't need three lookups."
- "Log every query the agent issued, or we can't tell a retrieval miss from a bad stopping decision."

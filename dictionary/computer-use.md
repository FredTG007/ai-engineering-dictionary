---
title: Computer Use / Browser Agent
description: An agent that operates a screen or browser by looking at it and clicking, typing and scrolling, rather than calling an API.
difficulty: advanced
interview: "A browser agent you shipped takes forty steps and three dollars to download one supplier invoice. How would you make it cheaper, faster and safer to run unattended?"
interviewAnswer: "Covers replacing screen-driven steps with direct API or URL access where one exists, capping steps and spend per run, caching known page layouts, and requiring confirmation before anything irreversible. Mentions recording full trajectories so failures can be replayed and scored."
buildThis:
  title: Build a browser agent that fills a form from a screenshot
  goal: Drive a local web page with a model that reads screenshots and returns click and type actions, with a hard step cap.
  steps:
    - Serve a simple local HTML form with three fields and a submit button.
    - Use Playwright to take a screenshot and send it to a vision-capable model asking for the next action as JSON.
    - Execute the action, take a new screenshot, and loop until the model reports done or fifteen steps pass.
    - Record every screenshot and action to a folder so each run can be replayed.
  skills:
    - Playwright
    - vision models
    - Python
    - JSON
  time: a day
  stretch: Add a confirmation prompt before the submit click and measure how often the model tries to submit with a field still empty.
---

Computer use is the pattern where an agent works a graphical interface the way a person does: it looks at a screenshot, decides where to click or what to type, acts, and looks again. A browser agent is the most common form, driving a web page through a headless browser. Instead of a [function schema](./function-schema.md) describing a clean API, the "tool" is the whole screen, and the [agent](./agent.md) has to find the button itself.

Teams reach for it when there is no API. Legacy supplier portals, internal admin tools and government sites often only exist as web pages, and a screen-driven agent can automate them without anyone building an integration. The model needs to be [multimodal](./multimodal.md) enough to read a screenshot, and the harness needs to translate "click the blue Download button" into real coordinates or element selectors.

The costs add up per step, and the step count is the problem. One finance team built a browser agent to fetch supplier invoices. It worked, but a single invoice took about forty screenshot-and-act cycles, each one a vision-model call, and cost around three dollars and four minutes. The portal had a direct download URL the whole time. Rewriting the task as "log in once, then hit the URL" cut it to three steps and a few cents. Treat every screen-driven step as expensive and look hard for a shortcut before accepting the loop.

| Concern | Why it bites | Common mitigation |
|---|---|---|
| Latency | Each step is a model call plus page load | Cache layouts, batch read-only steps, prefer APIs |
| Flakiness | Layouts shift, pop-ups appear, selectors break | Retry with a fresh screenshot, cap retries |
| Safety | The agent can pay, delete or send | Confirm irreversible actions, restrict allowed domains |
| Cost | Vision calls on every step | Step and dollar caps per run |

Safety needs its own design because the agent can do anything a logged-in user can. Keep it to an [allowlist](./allowlisting.md) of domains and actions, require [human-in-the-loop](./human-in-the-loop.md) confirmation before anything that moves money or sends a message, and set [tool-result budgets](./tool-result-budgets.md) so a stuck agent stops rather than clicking in circles. Evaluate with [trajectory evals](./trajectory-evals.md): record every screenshot and action, replay the runs, and score the path, not just whether the file eventually arrived.

_Usage:_

- "Forty steps to download one invoice is not automation, it's a slow person."
- "Before we ship the browser agent, every run needs a step cap and a domain allowlist."
- "It clicked 'Confirm order' because the pop-up covered the cancel button. Record those runs."

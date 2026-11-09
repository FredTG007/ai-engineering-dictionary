---
title: Red Teaming
description: Deliberately attacking your own LLM system to find safety, security and misuse failures before real users or attackers do.
difficulty: intermediate
interview: "Your team is about to launch an agent that can read account data and issue refunds. How would you plan a red-team exercise before release?"
interviewAnswer: "Covers testing safety, security, privacy, policy and abuse areas, attempting prompt injection and tool-permission escalation, combining human testers with automated attack generation, turning each successful attack into a regression eval, and repeating after major changes."
buildThis:
  title: Build an automated prompt injection red teamer
  goal: Create a script that bombards a custom assistant prompt with adversarial inputs to find safety bypasses.
  steps:
    - List ten common jailbreak and prompt injection patterns (e.g., ignore previous instructions, roleplay overrides).
    - Write a test harness that feeds these adversarial strings into your target LLM application.
    - Use a secondary judge LLM to evaluate whether the target model successfully resisted the attack.
    - Output a simple vulnerability report showing which injection styles successfully leaked system instructions.
  skills:
    - Security
    - Prompt Engineering
    - LLM Evals
  time: an afternoon
  stretch: Incorporate a self-mutating attack loop where the script uses failure outputs to generate smarter follow-up attacks.
---

Red teaming is the practice of trying to break your own AI system on purpose. A red team, whether internal staff, outside specialists or automated attack generators, plays the adversary: they attempt [jailbreaks](./jailbreak.md), [prompt injection](./prompt-injection.md), data extraction, policy violations and misuse of tools, then report what worked so it can be fixed. It is the security mindset applied to model behavior.

The value shows up in what it catches before launch. A bank preparing to release an account-assistant [agent](./agent.md) ran a two-week red-team exercise. Testers discovered that by asking the agent to "summarize my recent activity including any linked accounts", they could get it to reveal transactions from a spouse's joint account the user was not authorized to see. The bug was in tool permissions, not the model, but only adversarial use revealed it.

A useful red-team exercise usually covers several areas:

| Area | Example question |
|---|---|
| Safety | Can it be made to produce harmful instructions? |
| Security | Can injected content trigger tool calls or leak data? |
| Privacy | Can it reveal other users' data or its own system prompt? |
| Policy | Will it make commitments, give legal advice, or go off-brand? |
| Abuse | Can it be used at scale for spam or fraud? |

Manual and automated approaches complement each other. Human testers are creative and find novel multi-step attacks. Automated red teaming uses another model to generate thousands of attack variations, which is good for coverage and for checking that known attacks stay fixed. Neither replaces the other.

The output of red teaming should feed directly into your engineering process. Each successful attack becomes a test case in your [regression evals](./regression-evals.md), and patterns of failure inform new [guardrails](./guardrails.md). Run exercises again after major changes such as new tools, a model swap or a new data source, since each one opens fresh attack surface.

_Usage:_

- "Red team got the system prompt out in four messages by asking it to translate itself into French."
- "Every finding from the red-team sprint is now a regression test."
- "We added a refund tool, so we're scheduling another red-team pass before launch."

---
title: Drift
description: Gradual change in model behavior, user inputs, or data over time that quietly erodes the quality of a system that once worked.
difficulty: intermediate
interview: "Your extraction pipeline started returning dates in a new format with no deploy on your side, and offline evals still look fine. What is happening and how do you prevent it?"
interviewAnswer: "Covers model drift from provider aliases moving to new snapshots, pinning explicit versions gated by regression evals, input and data drift making the golden dataset stale, sampling live traffic into evals, and alerting on shifts in format, length and refusal rates."
---

Drift is the slow divergence between the conditions your system was built and tested for and the conditions it actually faces in production. In LLM systems it shows up in three main forms: the model changes underneath you, the inputs users send change, or the data you retrieve from changes. In each case nothing visibly breaks; quality simply erodes until someone notices.

Model drift is the version most specific to LLM engineering. A team using a provider alias like "latest" found that their extraction pipeline started returning dates in a different format one Tuesday; the provider had rolled the alias to a new snapshot. No deploy happened on their side, so the regression was invisible in their change log. Pinning an explicit model version and treating upgrades as deliberate releases, gated by [regression evals](./regression-evals.md), is the standard defense.

Input drift happens when users start asking different things. A support bot launched for billing questions gradually received more questions about a new product line it had never been prompted for, and its [hallucination](./hallucination.md) rate climbed because it tried to answer anyway. The prompts and [golden dataset](./golden-dataset.md) still reflected launch-day traffic, so offline scores stayed high while real-world quality fell.

| Type | What changes | Typical signal |
|---|---|---|
| Model drift | Provider updates weights or alias | Format or tone changes with no deploy |
| Input drift | Users' questions and language | New topics, rising "I don't know" or refusals |
| Data drift | Documents, catalog, policies | Stale or contradictory retrieved answers |
| Embedding drift | Mixed embedding model versions | Retrieval recall drops after a partial reindex |

Catching drift requires watching production, not just running tests before release. Useful practices include sampling live traffic into periodic [evals](./evals.md), clustering incoming queries to spot new topics, tracking refusal and fallback rates, and alerting on shifts in output length or format. [Observability](./observability.md) dashboards that plot these over weeks make slow decay visible. When drift is detected, refresh the golden dataset from recent traffic so your offline numbers track reality again.

_Usage:_

- "Nothing deployed, but the outputs changed. Check whether the provider moved the alias."
- "Our eval set is from launch; it doesn't cover half of what users ask now."
- "Pin the model version and make upgrades a ticket, not a surprise."

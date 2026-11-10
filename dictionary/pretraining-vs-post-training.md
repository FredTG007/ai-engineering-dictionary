---
title: Pretraining vs Post-Training
description: The two stages that make a model, where pretraining builds knowledge from raw text and post-training shapes it into an assistant.
difficulty: beginner
interview: "Your fine-tuned model answers in the right tone but still gets your product's pricing tiers wrong. Which training stage is the problem, and what would you do instead?"
interviewAnswer: "Covers that post-training (SFT, RLHF, DPO) teaches behaviour and format rather than facts, so the pricing knowledge was never in the pretrained weights and a small fine-tune will not reliably add it, and that retrieval or putting the pricing table in the prompt is the right fix, with fine-tuning reserved for style and task shape."
buildThis:
  title: Compare a base checkpoint with its chat version
  goal: Send the same prompts to a base model and its post-trained sibling and document how the outputs differ.
  steps:
    - Pick an open-weight model family that publishes both a base and an instruct checkpoint.
    - Write ten prompts mixing questions, instructions and half-finished sentences.
    - Run each prompt through both models with identical sampling settings.
    - Record side by side where the base model continues text and the chat model answers.
  skills:
    - Hugging Face
    - Python
    - Prompting
  time: an afternoon
  stretch: Write a one-page note on which behaviours you believe came from pretraining and which from post-training, with evidence.
---

Pretraining and post-training are the two stages that turn a pile of text into a usable model. Pretraining runs [next-token prediction](./next-token-prediction.md) over an enormous general corpus and produces a base model that knows a great deal about language and the world but only knows how to continue documents. Post-training takes that base and, with far less data, teaches it to behave like an assistant: answer questions, follow instructions, refuse certain requests, and use tools.

The stages give the model different things, and confusing them leads to expensive mistakes. Pretraining is where almost all knowledge and raw capability come from. Post-training mostly shapes how that capability is expressed, through [supervised fine-tuning](./supervised-fine-tuning.md) on example conversations and preference methods such as [RLHF](./rlhf.md) or [DPO](./dpo.md).

| Stage | Data | Scale | What it mainly teaches |
| --- | --- | --- | --- |
| Pretraining | Web text, books, code | Trillions of tokens | Language, facts, reasoning patterns |
| Supervised fine-tuning | Curated prompt and response pairs | Thousands to millions of examples | Format, persona, instruction following |
| Preference tuning | Ranked or chosen-versus-rejected pairs | Tens of thousands of comparisons | Helpfulness, tone, refusals |

A team learned this split the hard way. They spent three weeks and a few thousand dollars [fine-tuning](./fine-tuning.md) a model on their help-centre articles so it would "know the product". Tone improved immediately. Pricing answers did not: the model still quoted a plan that had been retired a year earlier, because a few hundred examples cannot overwrite what billions of pretraining tokens suggest a SaaS price list looks like. Moving the pricing table into the prompt via retrieval fixed the answers in an afternoon.

The practical rule is to use post-training for behaviour and context for facts. If a model answers in the wrong shape, the wrong voice, or ignores your instructions, fine-tuning on good examples helps. If it is wrong about something specific and changeable, supply the information at request time. This is also why a [base model and a chat model](./base-vs-chat-model.md) from the same family can feel like different products despite sharing nearly all their weights.

_Usage:_

- "The facts come from pretraining; our fine-tune only taught it to sound like us."
- "Don't try to fine-tune the price list in, just retrieve it."
- "Same base, different post-training, and one of them refuses half our prompts."

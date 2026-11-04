---
title: Speculative Decoding
description: A serving technique where a small draft model guesses several tokens ahead and the large model checks them in one pass.
difficulty: advanced
interview: "Your self-hosted model streams too slowly for a chat product at low traffic, but GPUs are mostly idle. Would speculative decoding help, and how would you know it is working?"
interviewAnswer: "Covers decoding being memory-bandwidth bound so one verification pass over several drafted tokens costs little more than one token, acceptance rate determining speedup, output distribution being preserved, smaller gains at high batch sizes, and measuring tokens per second and acceptance on real traffic."
---

Speculative decoding speeds up generation by letting a cheap model guess ahead and an expensive model check the guesses. A small draft model proposes the next few [tokens](./tokens.md), say four or five, and the large target model runs a single forward pass over all of them at once. Every proposed token the target agrees with is kept; at the first disagreement, the target's own choice replaces it and drafting starts again from there.

It works because normal decoding wastes the hardware. Generating one token at a time is limited by how fast the GPU can read the model's weights and [KV cache](./kv-cache.md) from memory, not by arithmetic, so checking five tokens in one pass costs little more than producing one. If the target accepts three drafted tokens on average, you get roughly three or four tokens for the price of one large-model step plus some cheap draft steps.

The output does not get worse. With greedy decoding the result is identical to what the target would have produced alone. With sampling, a rejection-sampling acceptance rule keeps the output distribution the same as the target model's, so [temperature](./temperature.md) and [top-p sampling](./top-p-sampling.md) behave as before. This is what separates it from simply serving a smaller model.

| Factor | Effect on speedup |
|---|---|
| Acceptance rate | The main driver; predictable text such as code or boilerplate accepts more |
| Draft model cost | Must be much cheaper than the target, or the gain disappears |
| Batch size | Large batches already use the GPU well, so gains shrink |
| Tokens drafted per step | Too many wastes work after the first rejection |

A team serving an internal coding assistant saw streaming at about 30 tokens per second with GPUs mostly idle outside peak hours. Adding a small draft model from the same family pushed that close to 70 for code completions, while free-form chat gained much less because acceptance was lower. At peak, with large batches, the improvement nearly vanished, since [batching](./batching.md) was already keeping the GPUs busy.

Variants avoid a separate draft model by adding extra prediction heads to the target or by drafting from n-grams in the prompt. Whatever the method, measure acceptance rate and end-to-end [latency](./latency.md) on real traffic, because the gains depend heavily on what your users ask for. Most modern [GPU serving](./gpu-serving.md) engines support it as a configuration option.

_Usage:_

- "Acceptance rate is around 70 percent on code, closer to 40 on chat."
- "Speculative decoding helps our off-peak latency but does nothing for throughput at peak."
- "The draft model has to share the tokenizer, so we picked the 1B from the same family."

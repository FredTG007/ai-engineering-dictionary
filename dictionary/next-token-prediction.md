---
title: Next-Token Prediction
description: The training objective behind language models, where the model guesses a probability for every possible next token.
difficulty: beginner
interview: "A form-filling assistant keeps completing customer addresses with plausible but wrong postcodes. How does the training objective explain this, and what would you change?"
interviewAnswer: "Covers that the model predicts likely text rather than looking facts up, so a postcode that fits the pattern beats one it was never shown, and that the fix is to supply the real value in the prompt or via a lookup tool, lower sampling randomness, and add a check that rejects completions for fields the model cannot know."
buildThis:
  title: Watch a model pick its next token
  goal: Print the top candidate tokens and their probabilities at each step of a short completion.
  steps:
    - Load a small open-weight model locally with the Hugging Face transformers library.
    - Feed it a sentence fragment and read the logits for the final position.
    - Convert the logits to probabilities and print the ten most likely tokens with their scores.
    - Append the chosen token and repeat for ten steps, once greedily and once with sampling.
  skills:
    - Python
    - Hugging Face
    - Probability
  time: an afternoon
  stretch: Plot how the probability of the top token changes as you raise the temperature from 0 to 2.
---

Next-token prediction is the single task a language model is trained on: given every token so far, output a probability for each token in the vocabulary being the next one. Training pushes those probabilities toward whatever token actually came next in the data. Everything an [LLM](./llm.md) does in production, from answering questions to calling tools, is this one step repeated until a stop condition is hit.

The model does not generate text; it generates a distribution, and your settings decide what to do with it. Picking the single most likely token every time is greedy decoding. Sampling draws from the distribution, with [temperature](./temperature.md) and [top-p sampling](./top-p-sampling.md) reshaping it first. The same prompt can therefore produce different outputs, and the "best" setting depends on whether you want a deterministic classifier or varied marketing copy.

This objective is why models are confidently wrong. A team built a form-filling assistant that completed partial customer records. It kept filling in postcodes that looked correct for the city but belonged to a different street, and about 8 percent of a week's records were wrong before anyone noticed. The model had learned what postcodes for that city tend to look like, not which postcode goes with which address. From its point of view, a plausible postcode was a good prediction. That is the mechanism behind [hallucination](./hallucination.md): there is no separate "lookup facts" step, only "predict likely text".

The fix was to stop asking the model to know things it cannot know. The postcode moved to a lookup tool, the prompt told the model to leave unknown fields blank, and a validation rule rejected any postcode not matching the address database. Sampling randomness was also lowered for that field, since variety is a liability when there is exactly one right answer.

Understanding the objective also clarifies what [tokens](./tokens.md) and [pretraining versus post-training](./pretraining-vs-post-training.md) mean. Pretraining is next-token prediction on huge amounts of text; post-training reuses the same mechanism on curated conversations so the likely next tokens become helpful ones. The model never stops being a predictor, it just learns to predict better behaviour.

_Usage:_

- "It's not looking the postcode up, it's predicting what a postcode here usually looks like."
- "At temperature zero we get the same wrong answer every time, which at least makes it reproducible."
- "The model doesn't know the field is empty; it just sees a prompt where the next token is probably a number."

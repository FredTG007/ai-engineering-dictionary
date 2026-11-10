---
title: Citation Verification
description: Checking that each cited passage actually supports the claim it is attached to before the answer reaches the user.
difficulty: intermediate
interview: "Your support bot cites the correct refund policy page but states a 45-day window the page never mentions. Users trust it because of the citation. How would you catch this automatically?"
interviewAnswer: "Covers that a citation only proves a document was retrieved, not that the claim is in it, splitting the answer into claims and checking each against its cited span with an entailment model or a judge, cheap deterministic checks for numbers and dates, and what to do with unsupported claims such as dropping them or flagging them."
buildThis:
  title: Build a claim-by-claim citation checker
  goal: Verify that every sentence a RAG answer cites is actually supported by the quoted source text.
  steps:
    - Generate twenty answers from a local RAG setup with a sentence-level citation on each claim.
    - Write a checker that extracts each claim and the cited chunk, then asks a small model whether the chunk supports, contradicts or does not mention the claim.
    - Add a deterministic pass that flags any number, date or percentage in a claim that does not appear in the cited chunk.
    - "Report the share of unsupported claims per answer and hand-label a sample to measure the checker's own accuracy."
  skills:
    - RAG
    - LLM-as-judge
    - regular expressions
    - Python
  time: a day
  stretch: Rewrite the answer with unsupported claims removed and measure how often the result is still useful.
---

Citation verification is a check that runs after generation and before display. It takes each claim in the answer, finds the source passage the answer cites for it, and tests whether that passage really supports the claim. A citation that fails the test is treated as a defect, not as decoration.

The need comes from a specific way that [grounding](./grounding.md) goes wrong. Retrieval returns the right document, the model attaches the right citation, and the sentence next to the citation is still invented. One subscription company watched its support bot cite the refund policy page, which was correct, while stating a 45-day window the page never mentioned. The real window was 30 days. Because the citation was present and accurate, the human reviewers skimming transcripts trusted the number, and the error ran for three weeks. The citation told them a document was retrieved. It said nothing about whether the claim came from it.

Verification closes that gap by checking claim against span, not answer against corpus. The usual pipeline splits the answer into atomic claims, pairs each with its cited chunk, and asks whether the chunk entails the claim. A small natural-language-inference model is fast and cheap for this; an [LLM-as-judge](./llm-as-judge.md) prompt is more flexible but slower. Numbers, dates, product names and percentages deserve a separate deterministic pass, because a string match that fails is a near-certain [hallucination](./hallucination.md) and costs nothing to run. These checks belong alongside your other [assertion-based evals](./assertion-based-evals.md).

| Check | Catches | Cost | Misses |
| --- | --- | --- | --- |
| Exact match of numbers and names | Invented figures | Negligible | Paraphrased facts |
| Entailment model per claim | Unsupported sentences | Milliseconds per claim | Subtle reasoning gaps |
| Judge model per claim | Nuanced support | Hundreds of milliseconds | Judge errors, prompt drift |

What you do with a failed claim is a product decision. Options include removing the sentence, rewriting it with a second model call that sees the verdict, downgrading the citation to "related reading", or routing the whole reply to a human. The strictest teams run verification as part of [output filtering](./output-filtering.md) in the live path; others run it offline over a sample and use the failure rate as a release gate for [RAG](./rag.md) changes.

The check has its own error rate, so measure it. Hand-label a few hundred claim and span pairs, score the verifier against them, and track false positives, because a verifier that strips true sentences will make the bot unhelpful in a quieter way than one that lets fabrications through.

_Usage:_

- "The citation was right and the number was wrong; nobody checked the span against the sentence."
- "Run the entailment check on every claim before we show the answer, and drop anything it can't support."
- "The verifier is at 94 percent agreement with our labels, good enough to gate releases but not to block replies yet."

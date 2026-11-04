# Proofread notes: 17 new v2 entries

I checked each of the 17 new entries for technical accuracy first, then clarity, typos, hype words and the CLAUDE.md rules. All links point to slugs that exist, each target is linked only once, and no hype words turned up. `npm run validate` passes (91 terms, 8 tracks, no map overlaps). I made small edits only. The notes below say what changed and what a domain expert should still check.

## transformer
- Changed: the prefill-cost claim. It now says only attention grows quadratically, that the feed-forward blocks and projections grow linearly and dominate at moderate lengths, and that the quadratic part takes over as prompts get longer. "Every other token" is now "every earlier token" (causal attention), and the interview answer was updated to match.
- Doubts: the length at which attention starts to dominate depends on model width and the attention kernel. The anecdote "more than twice as slow" fits superlinear growth but is illustrative.

## tokenizer
- Changed: vocab range is now "about 32,000 to over 200,000" (Gemma-style vocabularies go past 256k). The "never unrepresentable" byte fallback is now limited to byte-level tokenizers. "strawberry" is now "a few multi-letter pieces" instead of "one or two" (it is three tokens in cl100k).
- Doubts: "2-3x for Thai/Hindi" and the "30 percent" forecast error are illustrative. The real ratio depends heavily on the tokenizer: older vocabularies can be well above 3x for Hindi, newer ones lower.

## bm25
- No changes. k1 of 1.2-2.0 and b = 0.75 are the textbook ranges, Lucene/Elasticsearch/OpenSearch default to k1 = 1.2 and b = 0.75, and BM25 has been the Elasticsearch default since 5.0.
- Doubts: none of substance.

## retrieval-metrics
- Changed: a usage quote said recall "dropped twelve points", but the body example goes from 82 to 64 percent. The quote now says eighteen.
- Doubts: the body says "logarithm of its position". The usual convention is log2(rank + 1), and some variants use an exponential gain (2^rel - 1). Some teams define recall@k as hit rate (any relevant item in the top k), not the fraction of relevant items. The entry uses the fraction definition, which is standard.

## document-ingestion
- No changes.
- Doubts: "a PDF stores characters and positions, not paragraphs or tables" is true for most PDFs, but tagged PDFs do carry structure.

## react-pattern
- No changes. Yao et al. 2022 is correct (arXiv Oct 2022, ICLR 2023). The paper reports fewer hallucinations than chain-of-thought on HotpotQA/FEVER and names repetitive loops and uninformative searches as failure modes.
- Doubts: on HotpotQA, plain ReAct did not beat CoT with self-consistency on accuracy. The best results came from combining the two. The entry's "cut down on invented facts" is accurate, but it does not claim higher accuracy and should not be read as doing so. The big gains were on ALFWorld/WebShop, which the entry does not mention.

## workflows-vs-agents
- Changed: the closing rule ("start with the simplest structure... add autonomy only when...") was close to the wording of Anthropic's "Building effective agents" post. It now says "let production logs make the case". The workflow/agent definition itself is the field's standard distinction and is worded differently from the post.
- Doubts: 8-15 calls per ticket, p95 over a minute, five paths and the ~70 percent cost cut are illustrative.

## orchestrator-worker
- Changed: the description, opening paragraph and patterns table followed Anthropic's taxonomy too closely (prompt chaining / routing / parallelization with "sectioning or voting" / orchestrator-workers, plus "subtasks aren't pre-defined but determined by the orchestrator"). I rewrote them. The table now sorts structures by who decides the subtasks (fixed chain, routing, fixed fan-out, orchestrator-worker), and the voting item is gone. The new description is 133 characters.
- Doubts: none technical.

## error-analysis
- No changes. The numbers add up (41 + 22 + 9 of 100, with the rest uncategorised), and the "40 percent" usage quote matches.
- Doubts: the method resembles the open/axial-coding approach that Hamel Husain and Shreya Shankar teach, but the wording is original. The 50-200 sample size is a rule of thumb.

## pairwise-evals
- Changed: "absolute scores cluster in the middle of the scale and drift with the judge's mood" now reads "bunch in a narrow band and shift with small changes to the rubric or the judge". LLM judges tend to bunch high (as the 7.8/10 example shows), not in the middle, and "mood" anthropomorphised the judge.
- Doubts: "a win only when both orders agree, otherwise a tie" is one convention. Others score each order separately, or give 0.5 per order. "55 percent on 40 pairs is noise" checks out: the 95% CI is roughly 40-70 percent.

## online-vs-offline-evals
- No changes.
- Doubts: the 15 percent escalation rise is illustrative.

## indirect-prompt-injection
- Changed: the shopping-agent / product-page example repeated a usage quote in prompt-injection.md ("A product review on the page told the shopping agent..."), and that entry also has the email example. I replaced it with a sales research agent that has CRM read access. Hidden text on a prospect's pricing page made it leak deal notes through a URL, which also sets up the exfiltration-channel defence later in the entry. The interview question was updated to match.
- Doubts: none technical.

## llm-gateway
- Changed: the caching row in the table now says semantic caching needs a tuned similarity threshold, because a near match can return the wrong answer.
- Doubts: semantic caching still shouldn't be used for user-specific answers (different account, different date), which the row doesn't spell out. "Switching providers becomes a configuration change" is true at the API level, but prompts often need retuning per model.

## user-feedback-loops
- No changes.
- Doubts: "ratings on under one percent of conversations" is illustrative. Explicit feedback rates vary widely by UI, often from below 1 percent to a few percent.

## supervised-fine-tuning
- No changes. Computing the loss only on response tokens is the common default (for example, completion-only / assistant-only loss in TRL). Some setups train on the full sequence, and "usually" covers that.
- Doubts: the "hundreds to a few thousand examples" guidance depends on the task.

## dpo
- Changed: the loss sentence said DPO "raises the probability of the chosen answer". DPO actually trains the margin between the chosen and rejected log-ratios against the reference, and in practice both probabilities often fall. The entry now says that.
- Doubts: the beta wording is correct (small beta allows more drift from the reference). The PPO model count of policy, reference, reward and "often" a value model is correct for classic RLHF-PPO. GRPO-style variants drop the value model. Length bias in DPO is well documented (for example, Park et al. 2024).

## speculative-decoding
- No changes.
- Doubts: 30 to 70 tok/s (about 2.3x) on code is plausible but illustrative. "The draft model has to share the tokenizer" (usage quote) holds for the standard method and most serving engines, but there is newer work on drafting across different vocabularies. "Extra prediction heads" describes Medusa well. EAGLE is closer to a small draft layer that reads the target's hidden states. "Drafting from n-grams in the prompt" is prompt-lookup decoding. When all drafted tokens are accepted, the target also adds one bonus token. The entry's "three or four tokens" for three accepted tokens allows for this.

## Validation
`npm run validate`: passed, no failures from any file.

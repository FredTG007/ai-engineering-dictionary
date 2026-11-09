# Proposed new terms (~30)

Draft only — no entries written yet. Gaps checked against the current 91 slugs in `dictionary/` (including already-covered items such as `fallback-models`, `model-routing`, `cost-tracking`, `regression-evals`, `guardrails`, and `prompt-caching`).

For each: **name** · line · one-line definition · why it matters.

## Foundations

1. **Message roles** · Foundations · The `system` / `user` / `assistant` / `tool` labels that structure a chat transcript for the model. · Mixing roles (or stuffing instructions into user turns) is a common source of ignored system prompts and brittle few-shot examples.
2. **Stop sequences** · Foundations · Strings that tell the model to halt generation as soon as they appear. · Cheap control for truncation, sectioning, and keeping a model from continuing past a delimiter you care about.
3. **Presence and frequency penalties** · Foundations · Sampling knobs that discourage repeating tokens that already appeared. · Useful when outputs loop or echo the prompt; easy to misuse and worth knowing apart from temperature.
4. **Prompt template** · Foundations · A versioned string (or chat skeleton) with named slots filled at request time. · Separates copy from code so prompt changes can ship without redeploying application logic.
5. **Logprobs** · Foundations · Per-token log-probabilities returned alongside generated text. · Unlocks confidence heuristics, constrained decoding checks, and teaching how sampling actually works.

## RAG

6. **HyDE (Hypothetical Document Embeddings)** · RAG · Embed a model-written hypothetical answer, then retrieve with that vector instead of the raw question. · Helps when user queries are short or vocabulary-mismatched with the corpus.
7. **Query decomposition** · RAG · Splitting a multi-part question into sub-queries that are retrieved (and sometimes answered) separately. · Fixes the “one embedding can’t cover two intents” failure mode.
8. **Parent-document retrieval** · RAG · Retrieve small chunks for precision, then expand to a larger parent passage before generation. · Raises answer quality when tiny chunks match well but lack enough context to answer.
9. **Late chunking** · RAG · Embed long documents first, then derive chunk vectors from token embeddings so chunks keep document context. · Addresses the “chunk embedding forgot the surrounding section” problem.
10. **GraphRAG** · RAG · Retrieval that walks an entity/relation graph as well as (or instead of) pure vector search. · Helps with multi-hop questions over people, orgs, and linked facts.
11. **Citation verification** · RAG · Checking that every cited span actually supports the claim before the answer is shown. · Turns “looks grounded” into “is grounded”; critical for support and legal-adjacent bots.
12. **Incremental indexing** · RAG · Updating the retrieval index as documents change, without a full rebuild. · Keeps production RAG fresh when help centers and wikis edit daily.

## Agents

13. **Handoffs** · Agents · Passing a task (and a summary of state) from one agent or tool specialist to another. · The practical alternative to one mega-agent that knows every tool.
14. **Computer use / browser agent** · Agents · An agent that operates a GUI or browser (click, type, read the screen) rather than only APIs. · Growing product surface; needs its own safety, eval, and latency story.
15. **Tool-result budgets** · Agents · Caps on how many tools, tokens, or wall-clock seconds an agent may spend per run. · Stops runaway loops from burning money and time.
16. **Skill library** · Agents · Reusable, named procedures (prompts + tools + checks) an agent can select from. · Moves teams from one-off prompts to composable capabilities.
17. **Scratchpad / working memory** · Agents · An explicit place the agent writes intermediate notes outside the user-visible reply. · Improves multi-step work without dumping chain-of-thought into the customer channel.

## Evals

18. **Synthetic eval data** · Evals · Using a model (plus filters) to generate test cases when labeled data is scarce. · Speeds up golden-set growth; needs human spot-checks so you don’t eval on garbage.
19. **Rubric design** · Evals · Writing scored criteria a human or LLM-judge applies to an output. · Bad rubrics make “LLM-as-judge” look precise while measuring the wrong thing.
20. **Trajectory evals** · Evals · Scoring the whole agent path (tool calls, retries, intermediate states), not only the final answer. · Catches agents that luck into a right answer via a dangerous or wasteful path.
21. **Canary prompts** · Evals · Fixed probes mixed into live or staging traffic to detect silent quality regressions. · Complements offline regression suites when prompts or models change under you.
22. **Inter-annotator agreement** · Evals · Measuring how often human labelers agree before trusting a golden set. · If humans don’t agree, your eval score is noise.

## Safety

23. **Allowlisting / capability scopes** · Safety · Restricting which tools, URLs, or data an agent may touch per task or user role. · The agent equivalent of least privilege; beats hoping the prompt alone says “don’t”.
24. **Output filtering** · Safety · Checking or rewriting the model’s reply after generation (PII, toxicity, policy). · Last line of defense when input guards and the prompt both miss.
25. **Data poisoning** · Safety · Malicious or skewed examples in training, fine-tuning, or the retrieval corpus that bias behaviour. · RAG corpora and fine-tune sets are attack surfaces, not only the prompt.
26. **Model spec / constitution** · Safety · A written policy the model (or a stacked classifier) is aligned or judged against. · Makes “be safe” concrete enough to eval and debate.

## Production

27. **Token budget per user** · Production · A hard or soft cap on tokens (or $) each user or tenant may consume per day. · Turns cost-tracking into an enforcement mechanism before the bill spikes.
28. **Shadow traffic** · Production · Sending live requests to a candidate prompt/model without showing its output to users. · Safer than A/B when you want quality signals before cutting over.
29. **Circuit breaker** · Production · Automatically stopping calls to a failing model, tool, or dependency after error/latency thresholds. · Pairs with retries and fallbacks so incidents don’t amplify.
30. **Prompt / model canary** · Production · Rolling a prompt or model change to a tiny % of traffic before full release. · The deploy discipline software already has, applied to LLM config.
31. **Idempotency keys for tools** · Production · Client-supplied keys so retried agent tool calls don’t double-charge or double-book. · Essential once agents call payment, email, or ticket APIs.

## Training & Inference

32. **Continued pretraining** · Training & Inference · Further next-token training on domain text before any instruction tuning. · Cheaper path to domain fluency than full pretraining; distinct from SFT/LoRA.
33. **Preference data collection** · Training & Inference · Gathering ranked or chosen/rejected pairs that fuel DPO/RLHF. · The bottleneck most teams underestimate when they say “we’ll just align it”.
34. **Continuous batching** · Training & Inference · A serving scheduler that adds/removes requests in a GPU batch as they finish, not in lockstep. · Major throughput lever once you self-host; related to but not the same as request batching.
35. **Speculative safety / draft checks** · Training & Inference · Running a cheap checker on draft tokens while a larger model generates. · Emerging pattern for lowering the cost of online moderation.

## Voice

36. **Barge-in** · Voice · Letting the user interrupt the agent mid-sentence and having TTS/STT react cleanly. · Without it, voice agents feel deaf; with bad handling, they double-talk.
37. **Voice activity detection (VAD)** · Voice · Classifying audio frames as speech vs silence to know when a turn starts or ends. · Underpins turn-detection; worth its own entry because every stack tunes it differently.
38. **Speaker diarization** · Voice · Labeling who spoke when in a multi-speaker audio stream. · Needed for meeting agents and shared phone lines.
39. **Prosody / speaking style controls** · Voice · Parameters (rate, pitch, emotion SSML, style prompts) that shape how TTS sounds. · Product quality for voice beyond bare intelligibility.
40. **Telephony integration** · Voice · Connecting a voice agent to PSTN/SIP (call setup, codecs, barge-in over the phone). · Where most production voice agents actually run; different constraints than a web mic.

---

**Suggested first cut if we only add ~30:** keep 1–4, 6–12, 13–16, 18–21, 23–25, 27–30, 32–34, 36–38 (about 30). Drop the rest or park them for a later round.

**Out of scope for this proposal:** writing full entries, map positions, audio, or embeddings — awaiting approval of the list.

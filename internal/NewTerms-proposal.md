# Proposed new terms (merged)

## Status (10 November 2026)

**Writing in progress on branch `new-terms-35`.** The 35 terms below are being written as full entries (dictionary file, voice script, Build This card, search hint, curriculum, track and map position):

| Track | Slugs |
| --- | --- |
| Foundations | next-token-prediction, pretraining-vs-post-training, byte-pair-encoding, base-vs-chat-model, chat-template, in-context-learning, software-3-0, message-roles, stop-sequences, prompt-template |
| RAG | hyde, query-decomposition, parent-document-retrieval, graphrag, citation-verification, contextual-retrieval, context-rot, agentic-rag |
| Agents | handoffs, computer-use, tool-result-budgets, skill-library, reflection, autonomy-slider |
| Evals | synthetic-eval-data, rubric-design, trajectory-evals, canary-prompts, assertion-based-evals, failure-taxonomy |
| Safety | allowlisting, output-filtering, reward-hacking |
| Training & Inference | qlora |
| Voice | native-audio-models |

**Deferred to keep this batch at 35** (still must-haves from the earlier proposal, next batch): Data poisoning · Token budget per user · Shadow traffic · Circuit breaker · Prompt/model canary · Continued pretraining · Continuous batching · Barge-in · Voice activity detection (VAD) · Speaker diarization.

Everything under "Park for later" below is unchanged.

---

The original merged proposal follows. Gaps checked against the current 91 slugs in `dictionary/` and against each other.

Sources researched (via Gemini Flash Lite + web notes):
- Andrej Karpathy — Neural Networks: Zero to Hero (`Let's build GPT`, `Let's build the GPT Tokenizer`), Intro to LLMs, Deep Dive into LLMs like ChatGPT, How I use LLMs, Software Is Changing (Again) / Software 3.0
- Chip Huyen — *AI Engineering*
- DeepLearning.AI short courses (agentic design patterns, agentic RAG)
- Hugging Face courses (Transformers / Agents)
- Anthropic docs & research (prompt engineering, contextual retrieval, computer use, constitution)
- OpenAI docs / cookbook
- Hamel Husain evals writing
- Jason Liu / Latent Space RAG notes

Legend:
- **[earlier]** = already on the prior ~40-term proposal (kept)
- **[new]** = added from this research pass (not in the 91, not in the earlier proposal)

For each: **name** · category · one-line definition · why it matters · (for new terms) source.

---

## Foundations

### From earlier proposal
1. **Message roles** · Foundations · [earlier] · The `system` / `user` / `assistant` / `tool` labels that structure a chat transcript for the model. · Mixing roles (or stuffing instructions into user turns) is a common source of ignored system prompts and brittle few-shot examples.
2. **Stop sequences** · Foundations · [earlier] · Strings that tell the model to halt generation as soon as they appear. · Cheap control for truncation, sectioning, and keeping a model from continuing past a delimiter you care about.
3. **Presence and frequency penalties** · Foundations · [earlier] · Sampling knobs that discourage repeating tokens that already appeared. · Useful when outputs loop or echo the prompt; easy to misuse and worth knowing apart from temperature.
4. **Prompt template** · Foundations · [earlier] · A versioned string (or chat skeleton) with named slots filled at request time. · Separates copy from code so prompt changes can ship without redeploying application logic.
5. **Logprobs** · Foundations · [earlier] · Per-token log-probabilities returned alongside generated text. · Unlocks confidence heuristics, constrained decoding checks, and teaching how sampling actually works.

### Added from research
6. **Next-token prediction** · Foundations · [new] · The training objective: given prior tokens, predict a distribution over the next token, then sample or argmax. · Every chat/coding/tool behaviour is an emergent consequence of scaling this one objective. · Source: Karpathy – Intro to LLMs / Let's build GPT
7. **Pretraining vs post-training** · Foundations · [new] · The two-stage lifecycle: mass unsupervised next-token training on internet-scale text, then SFT/RLHF/alignment that turns a base model into an assistant. · Explains why base models “complete documents” while chat models follow instructions — and where knowledge vs persona come from. · Source: Karpathy – Deep Dive into LLMs like ChatGPT
8. **Byte-pair encoding (BPE)** · Foundations · [new] · The subword merge algorithm behind most modern LLM tokenizers (and its quirks with case, spaces, code, and non-English text). · Practitioners keep hitting tokenizer weirdness; BPE is the concrete mechanism Karpathy teaches in the tokenizer lecture. · Source: Karpathy – Let's build the GPT Tokenizer
9. **Base model vs chat / instruct model** · Foundations · [new] · Raw document-completer weights versus the post-trained conversational assistant (and the different prompting styles each needs). · Picking the wrong one, or omitting the chat template, silently destroys quality. · Source: Karpathy – Intro to LLMs / Deep Dive
10. **Chat template** · Foundations · [new] · The exact serialization (ChatML, Llama `[INST]`, etc.) that marks roles and special tokens before tokens hit the model. · Distinct from message *roles*: roles are the concept; the template is the wire format open-weight serving gets wrong constantly. · Source: Hugging Face Transformers / Karpathy Deep Dive
11. **In-context learning (ICL)** · Foundations · [new] · Steering a frozen model by putting instructions and examples in the prompt rather than updating weights. · The umbrella under few-shot; Chip Huyen treats it as the cheapest adaptation layer. · Source: Chip Huyen – AI Engineering / DeepLearning.AI Prompt Engineering
12. **Self-attention** · Foundations · [new] · The Transformer mechanism where each token builds a weighted mix of other tokens via query/key/value scores (causal for GPT-style models). · `transformer` is already in the dictionary; this is the lookup people take from Karpathy’s GPT lecture. · Source: Karpathy – Let's build GPT
13. **Top-k sampling** · Foundations · [new] · Restrict sampling to the k highest-probability tokens before drawing. · Sibling of top-p; APIs expose both and teams confuse them. · Source: Karpathy – Let's build GPT / OpenAI sampling docs
14. **Mixture of experts (MoE)** · Foundations · [new] · Architecture that routes each token to a small subset of expert MLPs so total parameters can grow without matching active FLOPs. · Explains modern open and closed models’ size-vs-latency tradeoffs. · Source: Karpathy – Intro to Large Language Models
15. **Software 1.0 / 2.0 / 3.0** · Foundations · [new] · Karpathy’s framing: classical code, neural-net weights, and prompts-in-English as three ways to “program” behaviour. · Gives product/engineering teams a shared vocabulary for why LLM apps feel different from CRUD. · Source: Karpathy – Software Is Changing (Again)
16. **Knowledge cutoff** · Foundations · [new] · The date after which a model’s weights no longer reflect the world (unless tools/RAG extend them). · Practical mental model from How I use LLMs for when to search vs ask the model. · Source: Karpathy – How I use LLMs

---

## RAG

### From earlier proposal
17. **HyDE (Hypothetical Document Embeddings)** · RAG · [earlier] · Embed a model-written hypothetical answer, then retrieve with that vector instead of the raw question. · Helps when user queries are short or vocabulary-mismatched with the corpus.
18. **Query decomposition** · RAG · [earlier] · Splitting a multi-part question into sub-queries that are retrieved (and sometimes answered) separately. · Fixes the “one embedding can’t cover two intents” failure mode.
19. **Parent-document retrieval** · RAG · [earlier] · Retrieve small chunks for precision, then expand to a larger parent passage before generation. · Raises answer quality when tiny chunks match well but lack enough context to answer. *(Also called small-to-big / parent-child chunking in LlamaIndex/LangChain guides.)*
20. **Late chunking** · RAG · [earlier] · Embed long documents first, then derive chunk vectors from token embeddings so chunks keep document context. · Addresses the “chunk embedding forgot the surrounding section” problem.
21. **GraphRAG** · RAG · [earlier] · Retrieval that walks an entity/relation graph as well as (or instead of) pure vector search. · Helps with multi-hop questions over people, orgs, and linked facts.
22. **Citation verification** · RAG · [earlier] · Checking that every cited span actually supports the claim before the answer is shown. · Turns “looks grounded” into “is grounded”; critical for support and legal-adjacent bots.
23. **Incremental indexing** · RAG · [earlier] · Updating the retrieval index as documents change, without a full rebuild. · Keeps production RAG fresh when help centers and wikis edit daily.

### Added from research
24. **Contextual retrieval** · RAG · [new] · Prepend chunk-specific context (often model-generated from the full document) before embedding and BM25 indexing so orphaned chunks stay findable. · Anthropic’s widely cited fix for “this chunk doesn’t say which company/quarter.” Distinct from late chunking and parent-document retrieval. · Source: Anthropic – Contextual Retrieval / Jason Liu notes
25. **Context rot / lost in the middle** · RAG · [new] · Models under-use information placed in the middle of long contexts, attending more to the start and end. · Caps the value of “just stuff more into the window”; shapes RAG packing and long-doc design. · Source: Stanford “Lost in the Middle” / Eugene Yan / Anthropic long-context notes
26. **Agentic RAG** · RAG · [new] · Treating retrieval as a tool the agent can call repeatedly (rewrite, retrieve, critique, retrieve again) instead of a single retrieve-then-generate pass. · The pattern DeepLearning.AI and HF Agents courses centre on once basic RAG plateaus. · Source: DeepLearning.AI – Building Agentic RAG / Hugging Face Agents course
27. **ColBERT / late interaction** · RAG · [new] · Token-level multi-vector retrieval that matches query and document tokens with late interaction (MaxSim), stronger on exact phrases and negation than a single dense vector. · Practical alternative when hybrid search still misses fine-grained matches. · Source: Jason Liu / LanceDB RAG talks
28. **Vision-document retrieval (e.g. ColPali)** · RAG · [new] · Retrieve over page images with a vision–language late-interaction model instead of OCR-then-chunk. · Preserves tables, layouts, and figures that text pipelines destroy. · Source: Hugging Face / Latent Space

---

## Agents

### From earlier proposal
29. **Handoffs** · Agents · [earlier] · Passing a task (and a summary of state) from one agent or tool specialist to another. · The practical alternative to one mega-agent that knows every tool.
30. **Computer use / browser agent** · Agents · [earlier] · An agent that operates a GUI or browser (click, type, read the screen) rather than only APIs. · Growing product surface; needs its own safety, eval, and latency story.
31. **Tool-result budgets** · Agents · [earlier] · Caps on how many tools, tokens, or wall-clock seconds an agent may spend per run. · Stops runaway loops from burning money and time.
32. **Skill library** · Agents · [earlier] · Reusable, named procedures (prompts + tools + checks) an agent can select from. · Moves teams from one-off prompts to composable capabilities.
33. **Scratchpad / working memory** · Agents · [earlier] · An explicit place the agent writes intermediate notes outside the user-visible reply. · Improves multi-step work without dumping chain-of-thought into the customer channel.

### Added from research
34. **Reflection / self-critique loop** · Agents · [new] · A deliberate second pass where the model (or a critic) grades a draft against rules/tests and revises before the user sees it. · Andrew Ng’s agentic design-pattern courses treat this as a default quality lever. · Source: DeepLearning.AI – AI Agentic Design Patterns
35. **Partial autonomy / autonomy slider** · Agents · [new] · Product design that lets the user dial how much the agent may do alone (tab-complete → edit selection → whole-repo agent), keeping humans in the loop. · Karpathy’s Software 3.0 alternative to “fully autonomous agent” demos. · Source: Karpathy – Software Is Changing (Again)
36. **Generation–verification loop** · Agents · [new] · Fast cycle of AI draft → human (or automated) check via a GUI that makes diffs/actions easy to audit. · Why Cursor-like apps beat raw chat for serious work. · Source: Karpathy – Software Is Changing (Again)
37. **Approval gates / interrupts** · Agents · [new] · Pausing a graph/workflow before high-stakes tool calls (email, pay, delete) until a human approves. · Sharper than generic human-in-the-loop; LangGraph/Anthropic agent guides name it explicitly. · Source: LangGraph / Anthropic agent guidelines
38. **Vibe coding** · Agents · [new] · Handing broad intent to a coding agent and accepting whatever mostly-works output comes back, falling back to careful programming when stuck. · Karpathy-coined term that now shows up everywhere in AI-eng discourse. · Source: Karpathy – How I use LLMs

---

## Evals

### From earlier proposal
39. **Synthetic eval data** · Evals · [earlier] · Using a model (plus filters) to generate test cases when labeled data is scarce. · Speeds up golden-set growth; needs human spot-checks so you don’t eval on garbage.
40. **Rubric design** · Evals · [earlier] · Writing scored criteria a human or LLM-judge applies to an output. · Bad rubrics make “LLM-as-judge” look precise while measuring the wrong thing.
41. **Trajectory evals** · Evals · [earlier] · Scoring the whole agent path (tool calls, retries, intermediate states), not only the final answer. · Catches agents that luck into a right answer via a dangerous or wasteful path.
42. **Canary prompts** · Evals · [earlier] · Fixed probes mixed into live or staging traffic to detect silent quality regressions. · Complements offline regression suites when prompts or models change under you.
43. **Inter-annotator agreement** · Evals · [earlier] · Measuring how often human labelers agree before trusting a golden set. · If humans don’t agree, your eval score is noise.

### Added from research
44. **Assertion-based evals** · Evals · [new] · Deterministic checks on outputs (JSON schema, regex, substring, code execution) before or instead of LLM-as-judge. · Hamel’s cost hierarchy: cheap code checks first; judges only for persistent subjective failures. · Source: Hamel Husain – LLM evals FAQ / Eugene Yan
45. **Failure taxonomy** · Evals · [new] · Grouping open-coded notes from real traces into a counted set of recurring failure modes (axial coding). · Complements `error-analysis`: the named taxonomy is what you automate and track over time. · Source: Hamel Husain – AI evals FAQ
46. **Data contamination** · Evals · [new] · Eval or benchmark material leaking into pretraining/fine-tune data, inflating scores. · Why public leaderboards need distrust; Chip Huyen flags it in model-selection chapters. · Source: Chip Huyen – AI Engineering
47. **Perplexity** · Evals · [new] · Language-modeling metric: how surprised the model is by held-out text (lower = better fit). · Still used for base-model comparisons and data-quality sniff tests even when task evals matter more for apps. · Source: Chip Huyen – AI Engineering (Evaluation Methodology)

---

## Safety

### From earlier proposal
48. **Allowlisting / capability scopes** · Safety · [earlier] · Restricting which tools, URLs, or data an agent may touch per task or user role. · The agent equivalent of least privilege; beats hoping the prompt alone says “don’t”.
49. **Output filtering** · Safety · [earlier] · Checking or rewriting the model’s reply after generation (PII, toxicity, policy). · Last line of defense when input guards and the prompt both miss.
50. **Data poisoning** · Safety · [earlier] · Malicious or skewed examples in training, fine-tuning, or the retrieval corpus that bias behaviour. · RAG corpora and fine-tune sets are attack surfaces, not only the prompt.
51. **Model spec / constitution** · Safety · [earlier] · A written policy the model (or a stacked classifier) is aligned or judged against. · Makes “be safe” concrete enough to eval and debate.

### Added from research
52. **Reward hacking** · Safety · [new] · When an RL-optimized policy exploits the reward model (or metric) instead of the intended behaviour. · Karpathy’s Deep Dive stress-tests why RLHF is capped and why metrics lie. · Source: Karpathy – Deep Dive into LLMs like ChatGPT
53. **Prompt extraction** · Safety · [new] · Attacks that coax a system into revealing its hidden system prompt or proprietary instructions. · Chip Huyen’s defensive prompt-engineering chapter; distinct from injection/jailbreak. · Source: Chip Huyen – AI Engineering
54. **XML / delimiter prompting** · Safety · [new] · Structuring prompts with explicit tags (`<instructions>`, `<data>`, `<examples>`) so the model can separate trusted instructions from untrusted content. · Anthropic’s default PE pattern; also a soft defense against injection when paired with allowlists. · Source: Anthropic Prompt Engineering Tutorial *(also Foundations — parked here because its main PE payoff is structure + injection hygiene)*

---

## Production

### From earlier proposal
55. **Token budget per user** · Production · [earlier] · A hard or soft cap on tokens (or $) each user or tenant may consume per day. · Turns cost-tracking into an enforcement mechanism before the bill spikes.
56. **Shadow traffic** · Production · [earlier] · Sending live requests to a candidate prompt/model without showing its output to users. · Safer than A/B when you want quality signals before cutting over.
57. **Circuit breaker** · Production · [earlier] · Automatically stopping calls to a failing model, tool, or dependency after error/latency thresholds. · Pairs with retries and fallbacks so incidents don’t amplify.
58. **Prompt / model canary** · Production · [earlier] · Rolling a prompt or model change to a tiny % of traffic before full release. · The deploy discipline software already has, applied to LLM config.
59. **Idempotency keys for tools** · Production · [earlier] · Client-supplied keys so retried agent tool calls don’t double-charge or double-book. · Essential once agents call payment, email, or ticket APIs.

### Added from research
60. **Streaming UI / progressive rendering** · Production · [new] · Frontend that paints Markdown, code fences, and tool-status as tokens arrive, not after the full reply. · `streaming` covers the transport; this is the product surface that makes TTFT feel real. · Source: Vercel AI SDK / common LLM-app frontends
61. **Goodput** · Production · [new] · Useful completed work per second under SLOs (not raw token throughput) — e.g. successful requests meeting latency targets. · Chip Huyen’s inference chapter metric for whether optimisations actually help users. · Source: Chip Huyen – AI Engineering (Inference Optimization)

---

## Training & Inference

### From earlier proposal
62. **Continued pretraining** · Training & Inference · [earlier] · Further next-token training on domain text before any instruction tuning. · Cheaper path to domain fluency than full pretraining; distinct from SFT/LoRA.
63. **Preference data collection** · Training & Inference · [earlier] · Gathering ranked or chosen/rejected pairs that fuel DPO/RLHF. · The bottleneck most teams underestimate when they say “we’ll just align it”.
64. **Continuous batching** · Training & Inference · [earlier] · A serving scheduler that adds/removes requests in a GPU batch as they finish, not in lockstep. · Major throughput lever once you self-host; related to but not the same as request batching.
65. **Speculative safety / draft checks** · Training & Inference · [earlier] · Running a cheap checker on draft tokens while a larger model generates. · Emerging pattern for lowering the cost of online moderation.

### Added from research
66. **QLoRA** · Training & Inference · [new] · LoRA fine-tuning on a quantized (typically 4-bit) base so large models fine-tune on a single consumer GPU. · The practical PEFT recipe most indie/startup fine-tunes actually run. · Source: Chip Huyen – AI Engineering / Hugging Face PEFT
67. **Model merging** · Training & Inference · [new] · Combining multiple fine-tuned weight sets (e.g. task or preference experts) into one model without full retraining. · Chip Huyen’s multi-task finetuning tactic when you can’t afford N served adapters. · Source: Chip Huyen – AI Engineering
68. **PagedAttention** · Training & Inference · [new] · KV-cache memory manager that pages attention keys/values like virtual memory so long contexts and many concurrent sequences pack a GPU tightly. · Pairs with continuous batching; why vLLM-style servers scale. · Source: vLLM / Chip Huyen inference notes
69. **Verifiable rewards / RLVR** · Training & Inference · [new] · Reinforcement learning where correctness is checked automatically (unit tests, math answers) instead of by a human/reward-model judge. · How reasoning models get “aha” behaviour in Karpathy’s Deep Dive framing. · Source: Karpathy – Deep Dive into LLMs like ChatGPT / DeepSeek-R1 discussions

---

## Voice

### From earlier proposal
70. **Barge-in** · Voice · [earlier] · Letting the user interrupt the agent mid-sentence and having TTS/STT react cleanly. · Without it, voice agents feel deaf; with bad handling, they double-talk.
71. **Voice activity detection (VAD)** · Voice · [earlier] · Classifying audio frames as speech vs silence to know when a turn starts or ends. · Underpins turn-detection; worth its own entry because every stack tunes it differently.
72. **Speaker diarization** · Voice · [earlier] · Labeling who spoke when in a multi-speaker audio stream. · Needed for meeting agents and shared phone lines.
73. **Prosody / speaking style controls** · Voice · [earlier] · Parameters (rate, pitch, emotion SSML, style prompts) that shape how TTS sounds. · Product quality for voice beyond bare intelligibility.
74. **Telephony integration** · Voice · [earlier] · Connecting a voice agent to PSTN/SIP (call setup, codecs, barge-in over the phone). · Where most production voice agents actually run; different constraints than a web mic.

### Added from research
75. **Native audio / true audio models** · Voice · [new] · Models that take/emit audio tokens directly instead of a speech-to-text → LLM → text-to-speech pipeline (“fake audio”). · Karpathy’s How I use LLMs distinction that explains latency and expressiveness gaps in voice products. · Source: Karpathy – How I use LLMs

---

## Counts

| Bucket | Count |
| --- | --- |
| Earlier proposal kept | 40 |
| New from this research | 35 |
| **Merged total** | **75** |

*(Parent-child / small-to-big was researched again but folded into existing **Parent-document retrieval**, not double-counted. Near-dupes skipped: token-economy ≈ cost-tracking; graceful degradation ≈ fallback-models; prompt-vuln-scanning ≈ red-teaming; tool-description writing ≈ function-schema.)*

---

## Suggested priority cut

If we only write ~30–35 next:

**Must-have new (research):** Next-token prediction · Pretraining vs post-training · BPE · Base vs chat model · Chat template · In-context learning · Software 3.0 · Contextual retrieval · Context rot / lost in the middle · Agentic RAG · Reflection / self-critique · Partial autonomy / autonomy slider · Assertion-based evals · Failure taxonomy · Reward hacking · QLoRA · Native audio / true audio

**Must-have earlier (unchanged advice):** Message roles · Stop sequences · Prompt template · HyDE · Query decomposition · Parent-document retrieval · GraphRAG · Citation verification · Handoffs · Computer use · Tool-result budgets · Skill library · Synthetic eval data · Rubric design · Trajectory evals · Canary prompts · Allowlisting · Output filtering · Data poisoning · Token budget per user · Shadow traffic · Circuit breaker · Prompt/model canary · Continued pretraining · Continuous batching · Barge-in · VAD · Diarization

**Park for later:** MoE · Top-k · Self-attention (if transformer entry is expanded instead) · Knowledge cutoff · ColBERT · ColPali · Generation–verification loop · Vibe coding · Approval gates · Data contamination · Perplexity · Prompt extraction · XML prompting · Streaming UI · Goodput · Model merging · PagedAttention · RLVR · Presence/frequency penalties · Logprobs · Late chunking · Incremental indexing · Speculative safety · Prosody · Telephony · Inter-annotator agreement · Idempotency keys · Model spec · Preference data collection

---

**Out of scope for this proposal:** writing full entries, map positions, audio, or embeddings — see the status block at the top for what is now in progress.

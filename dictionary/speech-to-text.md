---
title: Speech-to-Text (STT)
description: Converting spoken audio into written text, the first stage of most voice AI pipelines.
difficulty: beginner
interview: "Your voice ordering bot keeps mishearing product names and customers repeat themselves. Where do you start?"
interviewAnswer: "Covers measuring word error rate on real call audio, custom vocabulary or prompting the STT model with product names, and audio quality issues like noise and phone codecs. Mentions streaming versus batch latency, accents, and confirming critical fields back to the user."
---

Speech-to-text, also called automatic speech recognition or ASR, turns audio into a transcript that downstream systems can read. In a [voice agent](./voice-agents.md), it is the first stage: whatever the STT model writes down is all the [LLM](./llm.md) knows about what the caller said. If recognition is wrong, the most capable model in the world will confidently answer the wrong question.

Errors cluster in predictable places. Proper nouns, product names, account numbers, accents and noisy environments are the usual culprits. An insurance claims line kept hearing the policy prefix "QX" as "Q ex" or "queue X", so lookups failed and the agent told callers their policy did not exist. Adding custom vocabulary hints for the prefix and validating the recognized number against the expected format cut failed lookups by more than half.

Two modes matter for production. Batch transcription processes a complete recording and is accurate and cheap, which suits call analytics and meeting notes. Streaming transcription emits partial results as the person speaks, which is essential for live conversation but noisier: early partials get revised as more audio arrives. Voice agents generally act only on final segments, though some speculatively start work on partials to save time.

When choosing or tuning STT, watch these factors:

- **Word error rate** on your own audio, not a vendor benchmark, since phone-line audio at 8 kHz behaves very differently from studio recordings.
- **Latency** from end of speech to final transcript, which directly adds to response time.
- **Custom vocabulary** support for domain terms and names.
- **Language and accent coverage** for your real user base.

STT also interacts closely with [turn detection](./turn-detection.md), because the same audio stream drives both, and with [PII redaction](./pii-redaction.md), since transcripts of calls often contain card numbers and addresses read aloud.

_Usage:_

- "WER is fine on the benchmark and terrible on our call-center audio."
- "It transcribed 'cancel my order' as 'can sell my order' and the agent tried to help them sell it."
- "Add the drug names to the custom vocabulary list."

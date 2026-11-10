---
title: Native Audio Models
description: Models that take in or produce audio directly, instead of chaining speech-to-text, a text model and text-to-speech.
difficulty: intermediate
interview: "Your voice agent's cascade pipeline takes almost two seconds per turn and customers talk over it. A native audio model cuts that to under a second, but your compliance team is nervous. What changes, and how would you decide?"
interviewAnswer: "Covers the latency and expressiveness gains from skipping transcription, the loss of a clean text transcript as the point where filters, grounding and evals operate, options such as parallel transcription for logging and filtering, and a pilot that measures both turn latency and policy violations."
buildThis:
  title: Cascade versus native audio latency bench
  goal: Measure turn latency and transcript quality for a cascade voice pipeline and a native audio model on the same recorded questions.
  steps:
    - Record twenty short spoken questions as audio files, including two with background noise and one with an interruption.
    - Build a cascade from open-source speech-to-text, a text model and text-to-speech, timing each stage.
    - Send the same audio to an API that accepts audio input and returns audio, timing the full turn.
    - Tabulate time to first audible word, total turn time and whether each answer was correct.
  skills:
    - voice pipelines
    - latency measurement
    - Python
    - audio APIs
  time: a day
  stretch: "Add a parallel transcription of the native model's audio output and run your text filters on it to see what a compliance layer would cost in latency."
---

A native audio model consumes or produces audio tokens directly inside one model, rather than passing through the usual three-stage chain of [speech-to-text](./speech-to-text.md), a text model and [text-to-speech](./text-to-speech.md). The model hears the waveform rather than a transcript of it, and it can speak rather than hand text to a separate synthesiser. Some models do only one direction, audio in or audio out, and some do both.

The gains are latency and everything that gets lost in a transcript. A cascade adds the time of each stage plus the gaps between them, and each handoff drops information: tone, hesitation, laughter, emphasis, the fact that two people are talking. One team running [voice agents](./voice-agents.md) for appointment booking measured a turn latency of about 1.8 seconds with their cascade, and callers routinely started talking before the reply began. A native model brought the same turn to around 600 milliseconds, handled interruptions more gracefully, and could match the caller's pace. The difference was obvious in call recordings before anyone looked at a dashboard.

The losses are about control. In a cascade the transcript is the place where everything happens: you log it, run [output filtering](./output-filtering.md) on it, ground it against retrieved documents, and build evals from it. A native model that goes straight from audio to audio gives you no such point by default. That same booking team found its content filter had nothing to inspect, and compliance asked how they would prove what the bot had said. Their answer was to transcribe the model's audio in parallel for logging and for a filter that could cut the stream, which added cost and some latency back.

| Property | Cascade pipeline | Native audio model |
| --- | --- | --- |
| Turn [latency](./latency.md) | Sum of three stages plus gaps | One model, usually well under a second |
| Tone and interruptions | Mostly lost at transcription | Heard and reproduced |
| Transcript for logs and filters | Free, it is the pipeline | Extra transcription step |
| Swap one component | Easy | Whole model changes |
| Cost | Three bills, often cheaper total | Audio tokens, typically pricier per minute |

Choosing between them is a product decision, not a benchmark result. If the conversation is short, factual and regulated, a cascade with good [turn detection](./turn-detection.md) may be fast enough and far easier to audit. If naturalness and interruption handling are the product, a native model wins, and you should plan the parallel transcript, the filtering strategy and the evals before launch rather than after the first complaint. Native audio is one case of the broader [multimodal](./multimodal.md) trend, and the same question applies to images and video: fewer handoffs, less control at the seams.

_Usage:_

- "Native audio got us under a second, but now compliance wants a transcript we no longer produce."
- "The cascade loses the sigh. The native model heard it and slowed down."
- "Keep the cascade for the regulated flows and pilot native audio on the booking line."

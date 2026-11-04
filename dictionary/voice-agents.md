---
title: Voice Agents
description: AI agents that hold spoken conversations in real time, combining speech recognition, an LLM and speech synthesis.
---

A voice agent is an [agent](./agent.md) you talk to rather than type to. It listens to audio, works out what the caller said, decides how to respond, possibly calls tools, and speaks back, all within the rhythm of a normal conversation. Phone support lines, appointment booking, drive-through ordering and in-car assistants are typical uses.

Most voice agents are built as a pipeline:

| Stage | Job | Typical delay |
|---|---|---|
| [Speech-to-text](./speech-to-text.md) | Turn caller audio into text | 100–300 ms |
| [Turn detection](./turn-detection.md) | Decide the caller has finished | 200–800 ms |
| LLM | Generate the reply, maybe call tools | 300–1500 ms to first token |
| [Text-to-speech](./text-to-speech.md) | Turn reply text into audio | 100–300 ms to first audio |

Some newer systems use speech-to-speech models that skip the text stages, trading control and observability for lower delay and more natural prosody.

[Latency](./latency.md) is the defining constraint. In text chat, a two-second wait is fine. On a phone call, anything above about a second feels like the line went dead, and callers start saying "hello?" which the system then treats as a new utterance. A clinic's booking agent had a median response time of 2.4 seconds; callers routinely talked over it, the agent restarted its answer, and conversations spiralled. Streaming every stage, starting speech synthesis on the first sentence and using a faster model for simple turns brought the gap under 900 milliseconds and fixed most of the overlap.

Voice also changes how you write prompts. Responses must be short, free of markdown, bullet points and URLs, and phrased for the ear. Numbers, dates and email addresses need to be spoken in a way that will not be misheard. Interruptions, background noise, accents and hold music all show up in production in ways a text-only team will not anticipate.

Test with real audio rather than transcripts. Many voice-agent failures happen in recognition or turn-taking before the LLM ever sees the input.

_Usage:_

- "The agent reads the confirmation code too fast; nobody can write it down."
- "We're at 1.4 seconds voice-to-voice, and callers are already interrupting."
- "It tried to say a markdown table out loud."

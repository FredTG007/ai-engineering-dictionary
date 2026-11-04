---
title: Text-to-Speech (TTS)
description: Generating spoken audio from text, giving an AI system a voice for calls, assistants and accessibility.
---

Text-to-speech converts written text into synthetic audio. In a [voice agent](./voice-agents.md), it is the final stage, turning the LLM's reply into something the caller hears. Modern neural TTS can sound close to human, with control over voice, speed and sometimes emotion, but the quality users perceive depends heavily on what text you feed it and how quickly it starts speaking.

Time to first audio matters more than total synthesis time. Users judge responsiveness by when the voice begins, not when the sentence ends. The common approach is to [stream](./streaming.md) the LLM's output, split it at sentence or clause boundaries, and send each piece to TTS as soon as it is ready, so speech begins while the model is still writing. This mirrors the role of [time to first token](./time-to-first-token.md) in text interfaces.

The most common production problems come from text that reads fine but sounds wrong. A pharmacy assistant's replies included "Take 2.5mg 2x/day", which the TTS engine pronounced as "two point five M G two X slash day". Callers were confused and some called back to check. The fix was a normalization step that rewrote units, abbreviations, dates and symbols into speakable words before synthesis, plus a [system prompt](./system-prompt.md) change telling the model to write for the ear.

Other details worth handling:

- **Pronunciation** of names, brands and acronyms, often fixed with phonetic hints or SSML markup.
- **Interruptions:** when the user starts speaking, playback must stop immediately, and the agent should know which part of its reply was actually heard.
- **Consistency:** the same voice and pacing across turns, since sudden changes feel jarring.
- **Cost:** TTS is often billed per character, so verbose replies cost twice, once in tokens and once in audio.

Good TTS cannot rescue a reply that is too long. Keeping responses brief is the single most effective way to make a voice product feel fast and natural.

_Usage:_

- "TTS read 'Elm St. and Oak Dr.' as 'Elm Saint and Oak Doctor'. Normalize addresses first."
- "We start synthesis on the first comma now; it shaved 600 milliseconds off."
- "Stop playback the moment barge-in fires, not at the end of the sentence."

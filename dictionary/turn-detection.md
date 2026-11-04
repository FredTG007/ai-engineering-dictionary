---
title: Turn Detection
description: Deciding when a speaker has finished their turn so a voice agent knows when to respond and when to keep listening.
difficulty: intermediate
interview: "Your voice agent cuts callers off while they read out card numbers in groups of four. How would you change turn detection without adding dead air everywhere?"
interviewAnswer: "Covers the trade-off between cutting people off and adding latency, why a fixed silence threshold fails, voice activity detection plus semantic endpointing on transcript partials, adjusting timeouts by what the agent just asked, and handling barge-in versus backchannels."
---

Turn detection, sometimes called endpointing, is how a [voice agent](./voice-agents.md) decides that the person has finished speaking and it is time to reply. Humans do this effortlessly using pauses, intonation, grammar and context. Machines have to infer it from an audio stream and partial transcripts, and getting it wrong is one of the most noticeable failures in voice products.

There are two ways to fail, and they pull in opposite directions. Respond too early and the agent cuts people off mid-sentence, especially when they pause to think or recall a number. Respond too late and every exchange carries dead air that adds directly to [latency](./latency.md). A bank's voice line used a fixed 500-millisecond silence threshold. Callers reading out sixteen-digit card numbers naturally paused between groups of four, and the agent kept jumping in after the first group with "Sorry, that doesn't look like a valid card number."

Approaches have grown more sophisticated:

| Approach | How it works | Weakness |
|---|---|---|
| Silence threshold | Reply after N ms without voice activity | Cuts off slow or thoughtful speakers |
| Voice activity detection | Model distinguishes speech from noise | Still blind to meaning |
| Semantic endpointing | Model judges if the utterance sounds complete | Extra compute, can misjudge fragments |
| Context-aware | Adjusts based on what the agent just asked | More complex to build and tune |

Context helps a lot. If the agent just asked for a card number, it should wait for sixteen digits; if it asked a yes-or-no question, a short "yes" followed by a brief pause is a complete turn. Combining voice activity detection with a small model that reads the [speech-to-text](./speech-to-text.md) partials gives a good balance for most systems.

Turn detection also covers barge-in, when the user starts speaking while the agent is talking. The system has to stop [text-to-speech](./text-to-speech.md) playback quickly, decide whether the sound was a real interruption or just "mm-hmm" or a cough, and track what the user actually heard.

_Usage:_

- "Bump the endpoint timeout when we're collecting an account number."
- "It treats every 'uh-huh' as an interruption and stops mid-sentence."
- "Semantic endpointing fixed the cut-offs but added 150 milliseconds per turn."

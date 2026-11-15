---
title: "Local Home Assistant voice agent on Arduino VENTUNO Q"
slug: "arduino-local-agent"
date: "2026-11-15"
description: "Whisper Large-v3-Turbo and Qwen on the NPU, Polish Pocket TTS on the CPU of an Arduino VENTUNO Q. A local Home Assistant assistant, measurements, and the limits of testing so far."
image: "/images/arduino-local-agent/ha-context-before-after.png"
lang: "en"
translationKey: "arduino-local-agent"
translationListing: "combined"
tags: ["Home Assistant", "Arduino", "NPU", "SLM", "AI", "Whisper"]
draft: false
---

## 1. From benchmark to assistant

In a [previous experiment with Bielik](/bielik-arduino-ventuno-q/) I checked how large a model I could run on the Arduino VENTUNO Q. This time I wanted to turn the board into something useful: a local voice assistant for Home Assistant that I can talk to in Polish.

The assumption was simple: the models that recognize speech, prepare the answer, and generate voice all run on the board, with no cloud inference APIs. The goal was not to move all of Home Assistant onto the Arduino. HA still manages the home; VENTUNO Q provides it with local AI services.

### TL;DR

Ultimately three networks run on the board: **Whisper Large-v3-Turbo, Qwen2.5-3B, and Polish Pocket TTS**. The first two use the NPU, the last uses the CPU. **Linux Voice Assistant (LVA)** handles the local "Okay Nabu" wake word. The microphone and speaker are a single USB conference speakerphone. The biggest challenge was selecting fast, fully compatible components for the voice path and integrating them into a working system.

**Code and install:** [github.com/p4vv37/ha-local-agent](https://github.com/p4vv37/ha-local-agent#readme) - the gateway, the router, and the recipe for running the whole setup on Arduino.

![Arduino VENTUNO Q with a USB conference speakerphone (microphone and speaker in one device).](/images/arduino-local-agent/foto.jpg)

## 2. Three networks, one board, Home Assistant in between

VENTUNO Q has a Qualcomm Dragonwing IQ-8275 chip, 16 GB RAM, and a Hexagon accelerator. In this project it divides the work as follows:

| Stage | Active model and task | Where the compute happens |
| --- | --- | --- |
| STT - speech to text | Whisper Large-v3-Turbo W8A16: Polish speech recognition | Encoder and decoder on the NPU, audio prep and decode loop on the CPU |
| LLM - decision and answer | Qwen2.5-3B-Instruct Q4_0: text and tool calls | NPU, via GenieX |
| TTS - text to speech | Pocket TTS Polish, 6L checkpoint and the author's reference voice | CPU, official Rust ARM64 runtime, model kept in memory |

Microphone, wake word, and playback are handled by **Linux Voice Assistant (LVA)** from the [OHF-Voice](https://github.com/OHF-Voice/linux-voice-assistant) project, running on the same board. It uses the **"Okay Nabu"** phrase and a USB EMEET OfficeCore M1A conference speakerphone. LVA passes the recording to HA and plays back the returned audio. Speech recognition and synthesis are separate services.

Home Assistant picks the subsequent stages: it sends the recording to STT, the text to the agent, runs the available tools, and routes the answer to TTS.

[![Home Assistant talks to LVA, Whisper, the LLM agent, and Pocket TTS. All four services run on the VENTUNO Q, and the results return to HA.](/images/arduino-local-agent/architecture.svg)](/images/arduino-local-agent/architecture.svg)

**All three models are local, but "on the board" does not mean "everything on the NPU".** The LLM gateway itself does not control devices - it returns a function call that HA executes.

## 3. STT: from CPU to Large-v3-Turbo on the NPU

I started with Whisper Medium INT8 on the CPU. A short sample took about 12 seconds. Small and Base were faster, but in small tests they made errors in names and word joining. In a home assistant, correctly transcribing the general meaning is not always enough to pick the right device.

Next I ran Medium W8A16 on the NPU and got **0.67 s**. Finally I chose **Whisper Large-v3-Turbo W8A16** from the [official Qualcomm QCS8275 package](https://qaihub-public-assets.s3.us-west-2.amazonaws.com/qai-hub-models/models/whisper_large_v3_turbo_quantized/releases/v0.66.0/whisper_large_v3_turbo_quantized-precompiled_qnn_onnx-w8a16-qualcomm_qcs8275.zip), with the [OpenAI tokenizer](https://huggingface.co/openai/whisper-large-v3-turbo). This variant transcribes a prepared recording of **2.832 s in about 0.43 s** - roughly 28 times faster than the initial Medium on the CPU. I'm comparing successive configurations here, which also differ in model and precision. A separate ONNX Runtime uses the QNN Execution Provider. The encoder and decoder have CPU fallback disabled.

[![STT speed comparison: Medium INT8 on CPU ~12 s; on the NPU Small 0.51 s, Medium 0.67 s, Turbo 0.43 s.](/images/arduino-local-agent/stt-speed-comparison.svg)](/images/arduino-local-agent/stt-speed-comparison.svg)

## 4. LLM: why I ended up with Qwen 2.5 3B

The model had to understand Polish, support tool calling, and leave resources for the other services. Earlier attempts with an 11B variant did not give me a configuration suited to this use case, so this time I looked for a smaller model.

I tested Qwen3-1.7B, Qwen3-4B, and Qwen2.5-3B. In a controlled series of three runs, **1.7B once called a tool instead of returning the requested sentence**. Qwen2.5-3B kept the required form in all three runs.

**Qwen3-4B-Instruct-2507 in the QAIRT/QNN variant** worked with short input, but the full HA description did not fit in the configured context window. **Qwen3-4B GGUF**, in turn, ended its load attempt with a FastRPC memory-mapping error. These are two different model variants and two different problems. In the end I chose **Qwen2.5-3B** as a compromise between quality and feasibility.

[![Model comparison with full HA context: Qwen3-1.7B 18.15 s and correct form in 2 of 3 runs, Qwen2.5-3B 22.74 s and 3 of 3. The 4B variants were stopped by context limits or a load error.](/images/arduino-local-agent/npu-model-comparison.svg)](/images/arduino-local-agent/npu-model-comparison.svg)

I chose **Qwen2.5-3B-Instruct GGUF Q4_0**, run through GenieX with the Hexagon backend.

### Context from HA

As I mentioned when describing the model-size problems: even a short user utterance does not mean a short request to the model. Instructions, history, and tool definitions are added on top. To reduce this data and speed up the assistant, I limited device exposure. This cut the input from **7781 to 3550 tokens**.

[![Historic reduction of input from 7781 to 3550 tokens and of the median sentence answer from 22.741 to 9.968 seconds.](/images/arduino-local-agent/ha-context-before-after.svg)](/images/arduino-local-agent/ha-context-before-after.svg)

In a controlled task of returning a fixed sentence, the median of three runs fell from **22.74 to 9.97 s** - i.e. by **56%**. That is the time of a complete LLM answer. For comparison, without HA context a similar sentence took about **1.8 s**.

Not every request has to launch the LLM, though. An active gateway also runs a **narrow, deterministic router in front of the model**: for some unambiguous commands it can prepare `tool_calls`, which HA still executes. It uses the current tool schema and a catalog derived from the context, not a pinned list of home devices - so it adapts dynamically to HA settings.

### Why a custom router when HA has local intents?

Home Assistant can handle simple commands without an LLM, and I use that capability. With the option to prefer local intents enabled, it first tries to recognize the command with its own mechanism. If it succeeds, the gateway and Qwen are not needed.

I added my own router for commands that reach the agent even though they are still simple. The cause may be a small transcription error, e.g. "relety" instead of "rolety". I don't want to launch the LLM right away if the device name and room can be unambiguously matched to the HA catalog. The router accounts for Polish word inflection and tolerates one edit. With several matching targets it asks for disambiguation.

It is an additional layer between HA's local intents and Qwen. HA handles what it already recognizes, the router takes over a narrow class of the remaining commands, and the model gets utterances that require broader interpretation.

### Router: matching with error tolerance

The router is Python running on the CPU, not another model. Its process is split into 5 steps:

1. **Command normalization**: letter case, Polish diacritics, extra whitespace.
2. **Lemmatization** (via the `simplemma` module): inflected forms reduced to their base - `rolety` → `roleta`, `salonie` → `salon`. This matches plural and locative forms.
3. **Extracting device aliases from context**: split on comma or double space. A real entity description can join names without a comma (`"roleta  Rolety"`).
4. **Matching name and area**: first exact, then with **one-edit** tolerance (Levenshtein distance). This absorbs STT errors - `urolety` and `relety` hit `rolety`, `sypiali` hits `sypialni`.
5. **Decision**: `TOOLCALL` only with **one** matching target and **one** area. Zero or several hits → `CLARIFY` (disambiguation), never guessing. An out-of-scope utterance → `PASS` to Qwen. After the tool result the router returns a short `ACK` ("Done"/"Failed") instead of another LLM round.

The measured router decision time is about **2 ms** (no inference), versus about 10 s for a full LLM round. That's decision time, not the physical closing of a roller blind or state confirmation by HA.

## 5. TTS

For speech synthesis I use [Pocket TTS Polish - `shefowl/pocket-tts-polish-6l`](https://huggingface.co/shefowl/pocket-tts-polish-6l), with the author's Polish reference voice. **The checkpoint and reference stayed the same; the compute still runs on the CPU.** I changed the runtime and how audio is delivered, not the model to another voice or to an NPU solution.

Initially I used the Python/PyTorch path. Generating 2 s of audio took about **7.3 s**, and 7 s of audio about **20.6 s**.

Now the adapter runs a warmed-up **Pocket TTS for ARM64** process. I use the [official Kyutai v4.0.1 release](https://github.com/kyutai-labs/pocket-tts/tree/v4.0.1/rust).

The TTS server still speaks Wyoming. Before sending, it buffers **2 s** of audio and measures **RTF** (generation time divided by audio length): if the engine generates slower than the speech lasts (**RTF > 0.9**), it buffers everything and sends at the end - without re-generating the same utterance.

The wait for the first audio samples fell from **5.65 s to about 0.8 s**. This is a different measure than the full-utterance generation time given above.

[![Time to first PCM samples at the Wyoming client: Python/PyTorch 5.653 s, Rust ARM64 0.8 s.](/images/arduino-local-agent/tts-speed-comparison.svg)](/images/arduino-local-agent/tts-speed-comparison.svg)

[![Three TTS samples: first audio after 0.79, 0.96, and 0.80 s; full delivery after 0.82, 2.33, and 3.78 s for recordings of 1.5, 6.6, and 11.4 s.](/images/arduino-local-agent/tts-length-chart.svg)](/images/arduino-local-agent/tts-length-chart.svg)

*Measured at the Wyoming client, with a warmed-up Rust process. In these three samples the start of audio was available after 0.79-0.96 s, and the full delivery time grew with the utterance length.*

## 6. Connecting to HA and starting services

HA connects to **STT over Wyoming** on port `10301`, the **agent gateway** on `18191`, and **TTS over Wyoming** on `10201`. The ports can be changed as long as the addresses in HA and the services match.

The full setup recipe is in the [ha-local-agent repository README](https://github.com/p4vv37/ha-local-agent#readme). It covers preparing GenieX and Qwen, the gateway with the router, Whisper on the NPU, Polish Pocket TTS, and the LVA satellite. The wrapper code and the instructions for the other components are in one place.

### Integration: Local OpenAI LLM

I chose the community [Local OpenAI LLM](https://github.com/skye-harris/hass_local_openai_llm) integration, version **1.15.1**. It lets you point at your own OpenAI-compatible `Server URL`, so it can connect HA to GenieX. The official [OpenAI integration](https://www.home-assistant.io/integrations/openai_conversation/) targets the OpenAI service, and the [Ollama integration](https://www.home-assistant.io/integrations/ollama/) requires an Ollama server. For the gateway I set:

- **Server URL (OpenAI-compatible):** `http://<Arduino-address>:18191/v1`,
- server type `llama.cpp` with sampling options, tool calling enabled on the engine side.

The integration is a thin layer: it passes HA's tool schemas as `tools` and tool results as `role: tool` in the next iteration (loop up to 10 iterations). HA still performs control - neither the gateway nor the integration touches devices itself.

The gateway serializes requests, handles streaming differences, and has a workaround for the empty response on an identical repeated question.

![Home Assistant assistant configuration - STT, agent, and TTS assigned.](/images/arduino-local-agent/ha-assistant-config.jpg)

![Local OpenAI agent settings - tools and exposure scope.](/images/arduino-local-agent/ha-agent-settings.jpg)

The current STT unit and boot guard already point to Turbo. They guard the order and make sure not to load several STT variants on the NPU at once, and do no automatic CPU fallback. TTS has an `unless-stopped` auto-start policy. **After the latest changes (Turbo + Rust) I have not done a full board reboot.** A config change to autostart and successful service tests do not replace that check.

![Example of a real conversation (anonymized).](/images/arduino-local-agent/ha-conversation.jpg)

## 7. Result

The most important result is concrete: **speech and language models run locally on a small device, and Home Assistant can use them** - no cloud, no API keys, no GPU computer running 24/7.

In numbers:

- **STT**: Whisper Large-v3-Turbo on the NPU transcribes 2.8 s of speech in **0.43 s** (instead of ~12 s on the CPU).
- **TTS**: Pocket TTS Polish on Rust delivers the first audio after **0.79-0.96 s** in three measured samples (previously about 5.65 s in Python).
- **LLM**: Qwen2.5-3B answers in **1.8 s** without HA context. Limiting exposure cut the full answer from 22.7 s to **9.97 s**.
- **Control**: the narrow rule-based router prepares a tool call for recognized commands in **~2 ms** and tolerates small STT errors. Complex commands go to the LLM with tool calling.

User-facing effect: recognized simple commands, e.g. "open/close the roller blind", skip the LLM and don't require waiting for its answer. Everything else is handled by the local Qwen. I don't need a separate computer with a GPU for this.

### How it looks in real conversations

Beyond benchmarks I also have logs of real commands from the Assist debugger. They show the difference between local HA handling and going to the agent:

| Command | Path | VAD-end to text | Intent stage | VAD-end to `run-end` |
| --- | --- | ---: | ---: | ---: |
| Turn on the light | HA local | 0.50 s | 0.08 s | 0.58 s |
| Close the blind | HA local | 0.49 s | 0.08 s | 0.58 s |
| Open "relety" | Agent | 0.41 s | 4.94 s | 5.36 s |
| Set brightness to 50% | Agent | 0.52 s | 20.11 s | 20.63 s |
| Turn on the light | HA local | 1.91 s | 0.19 s | 2.10 s |

The starting point is the `stt-vad-end` event, i.e. the detected end of speech. The intent stage is the time from `intent-start` to `intent-end`, which also includes tool execution and answer preparation. In the brightness command, HA received a correct tool call, and after its result the agent still prepared a full confirmation sentence. That second part also costs time.

The first two commands were handled by HA's local mechanism. The "relety" example went to the agent, which returned a call opening the right blind.

### My contribution

I used ready-made models and runtimes, and focused my own work on connecting them. I prepared the gateway between HA and GenieX, the rule-based router, reading the device catalog from context, and input budget control. I also adapted the STT and TTS adapters, streaming, service startup, and diagnostics and tests.

The most work went into problems at the seams between these pieces: incorrect tool arguments generated by a small LLM, the long HA context, the delayed start of synthesis, and missing endings of voice answers. The result is a connection of these components into a local path where simple commands can skip the model, and the rest still use its capabilities.

## 8. Challenges and problems

The project's biggest problem is obvious: **3B is too small for complex thinking, and at the same time it's already sometimes too slow.**

- **Too small for deeper reasoning.** Qwen2.5-3B copies sentences well and picks tools in an unambiguous context, but it is not a model for multi-step planning, combining facts from several tools, or explaining dependencies. The harder the command, the higher the risk of invented arguments.
- **Too slow on the full context.** The full prefill with the entity description and tools is about **20 s**. In a voice conversation that's too long. Hence the "less context + router" direction.
- **No KV reuse.** The server resets the session when the question changes, so the long shared prefix is recomputed for every request. Using a cache could help speed up the answer.
- **Sharing one NPU.** Whisper (STT) and Qwen (LLM) must share the same Hexagon accelerator. Loading several models at once is sometimes unstable, and under memory pressure the 4B GGUF variant didn't load at all (FastRPC ENOMEM).

The real-conversation logs already show the STT and intent-handling times, as well as a single large latency spike before STT ended. The next step is to explain that case and measure the start of playback on the speaker. I want to check both paths - local commands and the agent conversation - to assess the time actually felt by the user.

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

Ultimately three networks run on the board: **Whisper Large-v3-Turbo, Qwen2.5-3B, and Polish Pocket TTS**. The first two use the NPU, the last uses the CPU. **Linux Voice Assistant (LVA)** handles the local "Okay Nabu" wake word; the microphone and speaker are a single USB conference speakerphone. The biggest challenge was selecting fast, fully compatible components for this pipeline of acceptable quality and integrating them into a stable system.

![Arduino VENTUNO Q with a USB conference speakerphone (microphone and speaker in one device).](/images/arduino-local-agent/foto.jpg)

## 2. Three networks, one board, Home Assistant in between

VENTUNO Q has a Qualcomm Dragonwing IQ-8275 chip, 16 GB RAM, and a Hexagon accelerator. In this project it divides the work as follows:

| Stage | Active model and task | Where the compute happens |
| --- | --- | --- |
| STT — speech to text | Whisper Large-v3-Turbo W8A16: Polish speech recognition | Encoder and decoder on the NPU; audio prep and decode loop on the CPU |
| LLM — decision and answer | Qwen2.5-3B-Instruct Q4_0: text and tool calls | Hexagon NPU backend — HTP0 (Hexagon Tensor Processor, device 0), `ngl=-1`, 10240-token context |
| TTS — text to speech | Pocket TTS Polish, 6L checkpoint and the author's reference voice | CPU, official Rust ARM64 runtime, model kept in memory |

The input and output of the path is **Linux Voice Assistant (LVA)** — an [OHF-Voice](https://github.com/OHF-Voice/linux-voice-assistant) voice satellite in a container (version 1.1.18), running on the same board. It is the "ears and mouth" of the assistant: it captures the microphone, detects the "Okay Nabu" wake phrase locally, and plays the finished answer. Audio comes in and goes out through a **USB conference speakerphone (EMEET OfficeCore M1A)** — microphone and speaker in one device, no separate sound card. LVA itself does not recognize speech, does not think, and does not synthesize voice — it delivers raw audio to HA and plays back what HA returns. The division of roles is clear: **LVA = audio + wake word, HA = orchestration, three networks = AI services on the board.**

Home Assistant picks the subsequent stages: it sends the recording to STT, the text to the agent, runs the available tools, and routes the answer to TTS.

![Architecture: Linux Voice Assistant (microphone, wake word) → Home Assistant → [STT Whisper/NPU, LLM gateway (CPU router → tool_calls, Qwen/NPU), TTS Pocket/CPU] → LVA (playback).](/images/arduino-local-agent/architecture.png)

**All three models are local, but "on the board" does not mean "everything on the NPU".** The LLM gateway itself does not control devices — it returns a function call that HA executes.

## 3. STT: from Small to Large-v3-Turbo

I started with Whisper Medium INT8 on the CPU. A short sample took about 12 seconds. Small and Base were faster, but in small tests they made errors in names and word joining. In a home assistant, correctly transcribing the general meaning is not always enough to pick the right device.

The next variant I tested was Medium W8A16 on the NPU. It turned out to be fast enough, at 0.67 s. However, it occasionally misunderstood commands. Finally I found the **Whisper Large-v3-Turbo W8A16** model, from the [official Qualcomm QCS8275 package](https://qaihub-public-assets.s3.us-west-2.amazonaws.com/qai-hub-models/models/whisper_large_v3_turbo_quantized/releases/v0.66.0/whisper_large_v3_turbo_quantized-precompiled_qnn_onnx-w8a16-qualcomm_qcs8275.zip), with the [OpenAI tokenizer](https://huggingface.co/openai/whisper-large-v3-turbo), which at 0.43 s of runtime delivered significantly higher text quality. A separate ONNX Runtime uses the QNN Execution Provider. Both the encoder and the decoder have CPU fallback disabled.

![STT speed comparison: Medium INT8 on CPU ~12 s; on the NPU Small 0.51 s, Medium 0.67 s, Turbo 0.43 s.](/images/arduino-local-agent/stt-speed-comparison.png)

## 4. LLM: why I ended up with Qwen 2.5 3B

The requirements for the model were:

- it must understand Polish,
- it must support tool calling,
- it must be small — I already knew that 11B models don't work on the NPU. This unfortunately ruled out Bielik 3.1.

So I went with small models from the Qwen family. Tests covered Qwen3-1.7B, Qwen3-4B, and Qwen2.5-3B. In a small series, 1.7B made an error once every three tries — it invented a tool or returned a useless result. The larger **Qwen3-4B-Instruct-2507 in the compiled QAIRT/QNN W4A16** variant loaded and worked correctly in tests. It did not work as an assistant, though. The problem was the context HA passes at the start of the request: with it included, the model didn't fit in memory.

The intermediate **Qwen 4B** variant looked promising but hit FastRPC memory-mapping errors. In the end, the older **Qwen 2.5 3B** turned out to be the best compromise.

![Model comparison at short and full HA context; a missing measurement is not a zero response time.](/images/arduino-local-agent/npu-model-comparison.png)

I chose **Qwen2.5-3B-Instruct GGUF Q4_0**, run through GenieX with the Hexagon backend.

### Context from HA

As I mentioned when describing the model-size problems: even a short user utterance does not mean a short request to the model. Instructions, history, and tool definitions are added on top. To reduce this data and speed up the assistant, I limited device exposure. This cut the input from **7781 to 3550 tokens**.

![Historic reduction of input from 7781 to 3550 tokens and of the median sentence answer from 22.741 to 9.968 seconds.](/images/arduino-local-agent/ha-context-before-after.png)

The median full text answer fell from **22.741 to 9.968 s**: about **2.28× faster**, i.e. 56% shorter. For comparison, without HA context a similar sentence took about 1.8 s.

Not every request has to launch the LLM, though. An active gateway also runs a **narrow, deterministic router in front of the model**: for some unambiguous commands it can prepare `tool_calls`, which HA still executes. It uses the current tool schema and a catalog derived from the context, not a pinned list of home devices — so it adapts dynamically to HA settings.

### Router: matching with error tolerance

The router is Python running on the CPU, not another model. Its process is split into 5 steps:

1. **Command normalization**: letter case, Polish diacritics, extra whitespace.
2. **Lemmatization** (via the `simplemma` module): inflected forms reduced to their base — `rolety` → `roleta`, `salonie` → `salon`. This matches plural and locative forms.
3. **Extracting tool aliases from context**: split on comma or double space. A real entity description can join names without a comma (`"roleta  Rolety"`).
4. **Matching name and area**: first exact, then with **one-edit** tolerance (Levenshtein distance). This absorbs STT errors — `urolety` and `relety` hit `rolety`, `sypiali` hits `sypialni`.
5. **Decision**: `TOOLCALL` only with **one** matching target and **one** area. Zero or several hits → `CLARIFY` (disambiguation), never guessing. An out-of-scope utterance → `PASS` to Qwen. After the tool result the router returns a short `ACK` ("Done"/"Failed") instead of another LLM round.

The measured router decision time is about **2 ms** (no inference), versus about 10 s for a full LLM round. That's decision time, not the physical closing of a roller blind or state confirmation by HA.

## 6. TTS

For speech synthesis I use [Pocket TTS Polish — `shefowl/pocket-tts-polish-6l`](https://huggingface.co/shefowl/pocket-tts-polish-6l), with the author's Polish reference voice. **The checkpoint and reference stayed the same; the compute still runs on the CPU.** I changed the runtime and how audio is delivered, not the model to another voice or to an NPU solution.

Initially I used the Python/PyTorch path. Processing a sample took about **7.3 s** of generation for 2 s of audio and **20.6 s** for 7 s.

Now the adapter runs a warmed-up **Pocket TTS for ARM64** process. The release source is the [official Kyutai v4.0.1 tag](https://github.com/kyutai-labs/pocket-tts/tree/v4.0.1/rust); the Cargo manifest in that tag is version **3.3.0**.

The TTS server still speaks Wyoming. Before sending, it buffers **2 s** of audio and measures **RTF** (generation time divided by audio length): if the engine generates slower than the speech lasts (**RTF > 0.9**), it buffers everything and sends at the end — without re-generating the same utterance.

This change cut the wait for the first audio samples from **5.65 s to 0.8 s** (comparison below).

![Time to first PCM samples at the Wyoming client: Python/PyTorch 5.653 s, Rust ARM64 0.8 s.](/images/arduino-local-agent/tts-speed-comparison.png)

![TTS (Rust, streaming): delivery time by utterance length — first PCM ~0.8 s regardless of length, full delivery grows from 0.8 to 3.8 s.](/images/arduino-local-agent/tts-length-chart.png)

*Three real samples (1.5 / 6.6 / 11.4 s of audio), warmed-up Rust process. First PCM at the Wyoming client, not the start of sound on the speaker.*

## 7. Connecting to HA and starting services

From HA's side there are three connections: **STT over Wyoming**, **an OpenAI-compatible agent API**, and **Polish TTS over Wyoming**. The port numbers (`10301`, `18191`, `10201`) come from the config in this implementation's repository (`*.service` and `docker-compose.yml` files, see the README) — they are conventional, not a protocol requirement, just my implementation: you can change them as long as HA and the services agree on the addresses. In the assistant you must assign the right stages and consciously choose which entities to expose.

### Integration: Local OpenAI LLM

HA connects to the gateway through the community **`skye-harris/hass_local_openai_llm`** ("Local OpenAI LLM", stable release **1.15.1**, Apache-2.0). This is the key choice: the official **Ollama** and **OpenAI** integrations won't accept an OpenAI-compatible endpoint outside their ecosystem, and GenieX `serve` exposes exactly that. Local OpenAI accepts any `Server URL`, so the only HA-side config is the gateway address:

- **Server URL (OpenAI-compatible):** `http://<Arduino-address>:18191/v1`,
- server type `llama.cpp` with sampling options, tool calling enabled on the engine side.

The integration is a thin layer: it passes HA's tool schemas as `tools` and tool results as `role: tool` in the next iteration (loop up to 10 iterations). HA still performs control — neither the gateway nor the integration touches devices itself.

The gateway serializes requests, handles streaming differences, and has a workaround for the empty response on an identical repeated question.

![Home Assistant assistant configuration — STT, agent, and TTS assigned.](/images/arduino-local-agent/ha-assistant-config.jpg)

![Local OpenAI agent settings — tools and exposure scope.](/images/arduino-local-agent/ha-agent-settings.jpg)

The current STT unit and boot guard already point to Turbo. They guard the order and make sure not to load several STT variants on the NPU at once, and do no automatic CPU fallback. TTS has an `unless-stopped` auto-start policy. **After the latest changes (Turbo + Rust) I have not done a full board reboot.** A config change to autostart and successful service tests do not replace that check.

![Example of a real conversation (anonymized).](/images/arduino-local-agent/ha-conversation.jpg)

## 8. Result

The most important result is concrete: **speech and language models run locally on a small device, and Home Assistant can use them** — no cloud, no API keys, no GPU computer running 24/7.

In numbers:

- **STT**: Whisper Large-v3-Turbo on the NPU transcribes 2.8 s of speech in **0.43 s** (instead of ~12 s on the CPU).
- **TTS**: Pocket TTS Polish on Rust delivers the first sound in **0.8 s** (instead of 5.65 s in Python), regardless of utterance length.
- **LLM**: Qwen2.5-3B answers in **1.8 s** without HA context; limiting exposure cut the full answer from 22.7 s to **9.97 s**.
- **Control**: the narrow rule-based router recognizes unambiguous commands in **~2 ms** and is tolerant of STT errors; complex commands go to the LLM with tool calling.

User-facing effect: simple commands ("open/close the roller blind") are handled deterministically and instantly, and everything else — by the local LLM. The whole thing runs on a single-board computer that can stay on 24/7 at low power draw.

## 9. Challenges and problems

The project's biggest problem is obvious: **3B is too small for complex thinking, and at the same time it's already sometimes too slow.**

- **Too small for deeper reasoning.** Qwen2.5-3B copies sentences well and picks tools in an unambiguous context, but it is not a model for multi-step planning, combining facts from several tools, or explaining dependencies. The harder the command, the higher the risk of invented arguments.
- **Too slow on the full context.** The full prefill with the entity description and tools is about **20 s**. In a voice conversation that's too long. Hence the "less context + router" direction.
- **No KV reuse.** The server resets the session when the question changes, so the long shared prefix is recomputed for every request. Using a cache could help speed up the answer.
- **Sharing one NPU.** Whisper (STT) and Qwen (LLM) must share the same Hexagon accelerator. Loading several models at once is sometimes unstable, and under memory pressure the 4B GGUF variant didn't load at all (FastRPC ENOMEM).

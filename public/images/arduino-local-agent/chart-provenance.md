# Pochodzenie danych do ilustracji

Wykresy publikacyjne z **angielskimi/minimalnymi etykietami** (uniwersalne dla wersji PL i EN). Dane historyczne, nie opis obecnego stanu usług. Nie zawierają surowych promptów, identyfikatorów urządzeń ani innych prywatnych danych.

## ha-context-before-after.svg / .png

Źródła w repozytorium: [ha25-vs-before.md](../../../../../docs/benchmark-results/ha25-vs-before.md), wiersze 9–24, oraz [ha25-run1.md](../../../../../docs/benchmark-results/ha25-run1.md), wiersze 8–14.

- Model: Qwen2.5-3B-Instruct Q4_0, HTP0/ngl-1, nctx 10240, GenieX 0.9.3, rezydentny WhisperSmallNPU.
- Oryginalny przechwycony prompt: 7781 → 3550 tokenów; narzędzia: 31 → 18. Redukcja tokenów 54,38%, na wykresie zaokrąglona do 54%.
- Przypadek `full_ha_sentence`: 22,741 → 9,968 s; mediana trzech prób na wariant. W benchmarku ostatnie pytanie zastąpiono stałym zadaniem kopiowania zdania. Liczby tokenów oryginalnego promptu nie są dokładnymi licznikami wejścia tego podmienionego przypadku.
- Redukcja mediany czasu: (22,741 − 9,968) / 22,741 = 56,17% (wykres: 56%). Przyspieszenie: 22,741 / 9,968 = 2,2814 (wykres: 2,28×).
- Mierzono czas całego tekstu odpowiedzi LLM, nie TTFT. Bez STT, rzeczywistego wykonania narzędzi HA, drugiej rundy LLM i TTS. Nowa mediana nadal przekracza 4 s.

## npu-model-comparison.svg / .png

Źródło: [wnioski.md](../../../../../docs/benchmark-results/wnioski.md), wiersze 7–20 oraz 30–34. To STARY zestaw pełnego kontekstu HA z 31 narzędziami, nie wariant po ograniczeniu wejścia.

| Wariant | Pełne HA, stałe zdanie: mediana [s] | Zgodność w dużym przypadku | Krótkie wejście, stałe zdanie: mediana [s] |
|---|---:|---|---:|
| Qwen3-1.7B GGUF/HTP0, kontekst 10240 | 18,148 | 2/3; raz narzędzie zamiast tekstu | 1,203 |
| Qwen2.5-3B GGUF/HTP0, kontekst 10240 | 22,741 | 3/3 | 1,805 |
| Qwen3-4B-2507 QAIRT/NPU, kontekst 4096 | SKIP | Nie mierzono | 2,063 |
| Qwen3-4B GGUF/HTP0, kontekst 10240 | FAIL ładowania | Nie mierzono | Nie mierzono |

Mediany z trzech prób. Kryterium zgodności: dokładny tekst/forma, brak niespodziewanego narzędzia, prawidłowe zakończenie. Nie jest to ocena ogólnej jakości sterowania domem; opóźnienie nie jest miarą jakości. Panel krótkiego wejścia jest oddzielny i nie mierzy pełnego HA. Czasy i błędy nie są uśredniane między modelami lub przypadkami.

SKIP: wejście około 7800 tokenów nie mieściło się w skonfigurowanych 4096; nie jest to pomiar czasu ani dowód niemożliwości uruchomienia modelu. FAIL: jedna próba inicjalizacji, HTTP 500/FastRPC mmap ENOMEM; nie oznacza uniwersalnej niemożliwości 4B. Modele nie miały osobnego świeżego bootu przed każdą próbą. QAIRT 4B (2507) i GGUF 4B to różne checkpointy; nie jest to izolowane porównanie backendów na tych samych wagach. Brak wymyślonych czasów dla SKIP/FAIL i brak sztucznych zerowych słupków.

We wszystkich zmierzonych przebiegach rezydentny WhisperSmallNPU; nie gwarantuje to jego bezczynności. Brak STT, rzeczywistych akcji HA, drugiej rundy po narzędziu i TTS; nie testowano w ten sposób całego toru głosowego.

## Renderowanie i weryfikacja

Skrypt: `generate-charts.py`. Wykorzystano już zainstalowany matplotlib 3.11.2 z `/tmp/chartvenv/bin/python`; niczego nie instalowano ani nie ładowano modeli. SVG z tekstem DejaVu Sans (fallback po stronie czytnika), PNG z rasteryzowanym DejaVu Sans; jasne tło. Wymiary PNG: 2400×1470 i 2400×1800. Oba PNG otwarto i zweryfikowano wizualnie narzędziem obrazu; poprawiono odstępy etykiet. Nie zmieniano artykułu ani źródeł benchmarku.

## architecture.svg / .png

Schemat toru: LVA (mikrofon/wybudzanie) → Home Assistant → [STT Whisper/NPU · bramka LLM (router CPU → tool_calls, Qwen/NPU) · TTS Pocket/CPU] → LVA (odtwarzanie). Czysto ilustracyjny, bez danych pomiarowych. Źródła: `generate-architecture.py` (PNG, matplotlib) i ręcznie pisany `architecture.svg`. PNG 1954×1202.

## stt-speed-comparison.svg / .png

Transkrypcja tego samego przygotowanego klipu 2,832 s, rozgrzane sesje (oś logarytmiczna):

| Wariant | Czas [s] |
|---|---:|
| Medium INT8 CPU | ~12 (orientacyjnie, inna seria niż NPU) |
| Small FP16 NPU | 0,506 (mediana z 0,496 / 0,506 / 0,540) |
| Medium W8A16 NPU | 0,673 |
| Turbo W8A16 NPU | 0,429 (mediana z 0,410 / 0,429 / 0,477) |

CPU to inna konfiguracja i inna seria niż NPU; modele mierzono w różnych chwilach, nie jest to jeden ujednolicony benchmark. Przyspieszenie ~28× (12 s → 0,43 s) jest ilustracją rzędu wielkości, nie pomiarem w tej samej serii.

## tts-speed-comparison.svg / .png

Czas do pierwszych próbek PCM u klienta Wyoming, ten sam checkpoint i referencja głosu:

| Runtime | Pierwsze PCM [s] |
|---|---:|
| Python/PyTorch | 5,653 |
| Rust ARM64 | 0,8 (0,793–0,956 w testach; produkcyjnie 0,801) |

## tts-length-chart.svg / .png

Czas dostarczenia wg długości nagrania, aktywna ścieżka Rust + streaming (rozgrzany proces):

| Długość audio | Pierwsze PCM [s] | Całość PCM [s] |
|---|---:|---:|
| 1,496 s (krótka) | 0,793 | 0,818 |
| 6,609 s (średnia, 85 znaków) | 0,956 | 2,327 |
| 11,389 s (długa, 3 zdania) | 0,801 | 3,775 |

Trzy rzeczywiste próbki (produkcja + laboratorium). Pierwsze PCM u klienta Wyoming, nie start dźwięku na głośniku. Pokazuje, że strumieniowanie trzyma pierwsze PCM płasko (~0,8 s), a całość rośnie z długością.

## Renderowanie i weryfikacja (uzupełnienie)

`generate-architecture.py` i `generate-speed-charts.py` (matplotlib 3.11.2 z `/tmp/chartvenv/bin/python`, `MPLCONFIGDIR=/tmp/mplconfig`). PNG + SVG, DejaVu Sans, jasne tło. PNG zweryfikowane programowo (wymiary, obecność kolorów NPU/CPU/old), nie wizualnie modelem obrazowym.

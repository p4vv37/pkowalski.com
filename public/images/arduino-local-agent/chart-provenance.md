# Dane i źródła wykresów

Grafiki są wspólne dla artykułów PL i EN, z krótkimi angielskimi etykietami.
Liczby pochodzą z wcześniejszych pomiarów na Arduino. Przebudowa ilustracji nie
obejmowała uruchamiania modeli ani nowych pomiarów sprzętu.

## Renderowanie

Jedynym źródłem wszystkich sześciu grafik jest `generate-charts.py`.
Pozostałe pliki `generate-*.py` są zgodnymi wstecznie punktami wejścia.
Renderer używa Python, Pillow do pomiaru tekstu, systemowego fontu Noto Sans
oraz `rsvg-convert` do eksportu PNG. Nie wymaga matplotlib ani modeli.

Każda ilustracja ma SVG z tekstem, tytułem i opisem dostępności oraz PNG
w dwukrotnej rozdzielczości. W artykule SVG można otworzyć kliknięciem.
Wszystkie słupki zaczynają się od zera i mają skalę liniową. Dane źródłowe
zachowują pełną precyzję, etykiety czasów są zaokrąglone do dwóch miejsc.
Opis metod pomiarowych znajduje się tutaj i w tekście, bez bloków przypisów
wewnątrz grafik.

## Architektura

HA komunikuje się osobno z LVA, Whisperem, bramką LLM i Pocket TTS.
Wszystkie cztery usługi są na VENTUNO Q. LVA obsługuje mikrofon,
wybudzanie i odtwarzanie, a nie inferencję STT/TTS. Wyniki usług wracają do HA,
który wykonuje narzędzia i przekazuje audio do LVA. Dwukierunkowe połączenia
na schemacie oznaczają wymianę żądań i wyników, nie kolejność etapów.
Nie ma połączeń STT ani Qwen bezpośrednio z głośnikiem.

## STT

Transkrypcja przygotowanego nagrania 2,832 s, rozgrzane sesje:

| Wariant | Czas [s] |
|---|---:|
| Medium INT8 CPU | około 12 |
| Small FP16 NPU | 0,506 |
| Medium W8A16 NPU | 0,673 |
| Large-v3-Turbo W8A16 NPU | 0,429 |

Small: mediana 0,496 / 0,506 / 0,540 s. Turbo: mediana
0,410 / 0,429 / 0,477 s. CPU i NPU pochodzą z różnych serii i konfiguracji.
Porównanie 12 / 0,429 daje około 28 razy krótszy czas, ale nie izoluje wpływu
samego akceleratora. Zmieniano też model i precyzję.
Źródło Turbo i Medium: [raport wdrożenia](../../../../../docs/whisper-turbo-npu-deployed-2026-11-15.md).

## Wybór modelu LLM

Źródło: [wnioski z benchmarku](../../../../../docs/benchmark-results/wnioski.md).
Pełny wcześniejszy kontekst HA, 31 narzędzi, zadanie zwrócenia stałego polskiego
zdania. Mediana trzech prób, czas do końca odpowiedzi LLM:

| Wariant NPU | Czas [s] | Forma zgodna z poleceniem |
|---|---:|---:|
| Qwen3-1.7B GGUF | 18,148 | 2/3 |
| Qwen2.5-3B GGUF | 22,741 | 3/3 |

2/3 oznacza jedną odpowiedź z narzędziem zamiast żądanego tekstu.
To kryterium formy odpowiedzi, nie ogólna skuteczność sterowania domem.

4B QAIRT (2507): wejście około 7800 tokenów nie mieściło się
w skonfigurowanym kontekście 4096. 4B GGUF: jedna próba ładowania zakończona
FastRPC mmap / ENOMEM. Różne checkpointy, bez osobnego zimnego startu każdego
wariantu. Brak czasu dla tych przypadków jest opisany statusem, bez zerowych
słupków. Usunięty panel krótkiego wejścia miał mediany 1,203 / 1,805 / 2,063 s,
odpowiednio dla 1.7B GGUF, 3B GGUF i 4B QAIRT.

## Ograniczenie kontekstu HA

Źródła: [porównanie](../../../../../docs/benchmark-results/ha25-vs-before.md)
i [raport](../../../../../docs/benchmark-results/ha25-run1.md).
Ten sam Qwen2.5-3B Q4_0, GenieX 0.9.3 i konfiguracja NPU.

| Wielkość | Przed | Po |
|---|---:|---:|
| Oryginalne wejście [tokeny] | 7781 | 3550 |
| Narzędzia | 31 | 18 |
| Mediana pełnego zdania [s] | 22,741 | 9,968 |

Tokeny dotyczą oryginalnego promptu. W pomiarze czasu zastąpiono końcowe pytanie
stałym zadaniem, żeby porównywać odpowiedzi o tej samej długości. Mediany z trzech
prób. Redukcja wejścia 54,38%, czasu 56,17%, przyspieszenie 2,2814 razy.
W obu historycznych konfiguracjach rezydentny WhisperSmallNPU.
Czas obejmuje odpowiedź LLM, bez STT, wykonania akcji HA i TTS.

## TTS: Python i Rust

Ten sam polski checkpoint i referencja głosu. Czas do pierwszych próbek PCM
u klienta Wyoming: Python/PyTorch 5,653 s, Rust ARM64 około 0,8 s
(w produkcyjnej próbie 0,801 s). Nie porównujemy tu czasu wygenerowania
całej wypowiedzi z czasem rozpoczęcia strumienia.
Źródła: [pierwsze pomiary Rust](../../../../../docs/pocket-rust-arduino-benchmark-2026-11-15.md),
[aktualny wariant TTS](../../../../../docs/pocket-tts-tail-fix-2026-11-15.md).

## TTS: długość wypowiedzi

| Długość audio [s] | Pierwsze PCM [s] | Całe PCM [s] |
|---|---:|---:|
| 1,496 | 0,793 | 0,818 |
| 6,609 | 0,956 | 2,327 |
| 11,389 | 0,801 | 3,775 |

Trzy rozgrzane próby z laboratorium i produkcji. Oś pozioma jest liczbowa,
a odstępy punktów odpowiadają rzeczywistym długościom audio. Linie łączą
próbki, nie są dopasowanym modelem wydajności. Nie wnioskujemy o stałym czasie
startu dla dowolnej długości. PCM oznacza dostarczenie do klienta Wyoming,
a nie fizyczny początek odtwarzania na głośniku.

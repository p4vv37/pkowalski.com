---
title: "Lokalny agent Home Assistant na Arduino VENTUNO Q"
slug: "lokalny-agent-home-assistant-arduino-ventuno-q"
date: "2026-11-15"
description: "Whisper Large-v3-Turbo i Qwen na NPU, polski Pocket TTS na CPU Arduino VENTUNO Q. Lokalny asystent Home Assistant, pomiary i granice dotychczasowych testów."
image: "/images/arduino-local-agent/ha-context-before-after.png"
lang: "pl"
translationKey: "arduino-local-agent"
translationListing: "combined"
tags: ["Home Assistant", "Arduino", "NPU", "SLM", "AI", "Whisper"]
draft: false
---

## 1. Od benchmarku do asystenta

W [poprzednim eksperymencie z Bielikiem](/bielik-arduino-ventuno-q-pl/) sprawdzałem, jak duży model można uruchomić na Arduino VENTUNO Q. Tym razem chciałem zrobić z płytki coś użytkowego: lokalnego asystenta głosowego dla Home Assistant, z którym można rozmawiać po polsku.

Założenie było proste: modele rozpoznające mowę, przygotowujące odpowiedź i generujące głos mają pracować na płytce, bez chmurowych API inferencji. Nie chodziło o przeniesienie całego Home Assistant na Arduino. HA nadal zarządza domem, a VENTUNO Q udostępnia mu lokalne usługi AI.

### TL:DR 

Ostatecznie na płytce działają trzy sieci: **Whisper Large-v3-Turbo, Qwen2.5-3B i polski Pocket TTS**. Dwie pierwsze korzystają z NPU, ostatnia z CPU. **Linux Voice Assistant (LVA)** obsługuje lokalne wybudzanie „Okay Nabu"; mikrofon i głośnik to jeden głośnik konferencyjny USB. Największym wyzwaniem był dobór wydajnych, w pełni kompatybilnych elementów tego pipeline o zadowalającej jakości oraz zintegrowanie ich w stabilnie działający system.

**Kod:** [github.com/p4vv37/ha-local-agent](https://github.com/p4vv37/ha-local-agent) — cienki wrapper (bramka + router) z instrukcjami uruchamiania.

![Arduino VENTUNO Q z głośnikiem konferencyjnym USB (mikrofon i głośnik w jednym urządzeniu).](/images/arduino-local-agent/foto.jpg)

## 2. Trzy sieci, jedna płytka, Home Assistant pomiędzy nimi

VENTUNO Q ma układ Qualcomm Dragonwing IQ-8275, 16 GB RAM i akcelerator Hexagon. W tym projekcie dzieli pracę następująco:

| Etap | Aktywny model i zadanie | Gdzie mają miejsce obliczenia |
| --- | --- | --- |
| STT - mowa na tekst | Whisper Large-v3-Turbo W8A16: rozpoznanie polskiej mowy | Encoder i decoder na NPU, przygotowanie audio i sterowanie dekodowaniem na CPU |
| LLM - decyzja i odpowiedź | Qwen2.5-3B-Instruct Q4_0: tekst oraz wywołania narzędzi | Backend Hexagon NPU - HTP0 (Hexagon Tensor Processor, urządzenie 0), `ngl=-1`, kontekst 10240 tokenów |
| TTS - tekst na mowę | Pocket TTS Polish, checkpoint 6L i referencyjny głos autora | CPU, oficjalny runtime Rust ARM64, model utrzymywany w pamięci |

Wejściem i wyjściem toru jest **Linux Voice Assistant (LVA)** - satelita głosowy [OHF-Voice](https://github.com/OHF-Voice/linux-voice-assistant) w kontenerze (wersja 1.1.18), uruchomiony na tej samej płytce. To „uszy i usta" asystenta: przechwytuje mikrofon, wykrywa lokalnie frazę wybudzenia **„Okay Nabu"** i odtwarza gotową odpowiedź. Audio wchodzi i wychodzi przez **głośnik konferencyjny USB (EMEET OfficeCore M1A)** - mikrofon i głośnik w jednym urządzeniu, bez osobnej karty dźwiękowej. LVA sam nie rozpoznaje mowy, nie myśli ani nie syntetyzuje głosu - dostarcza surowy dźwięk do HA i odtwarza to, co HA mu zwróci. Podział ról jest więc jasny: **LVA = audio i wybudzanie, HA = orkiestracja, trzy sieci = usługi AI na płytce.**

Home Assistant wybiera kolejne etapy: wysyła nagranie do STT, tekst do agenta, wykonuje dostępne narzędzia, a odpowiedź kieruje do TTS.

![Architektura: Linux Voice Assistant (mikrofon, wybudzanie) → Home Assistant → [STT Whisper/NPU, bramka LLM (router CPU → tool_calls, Qwen/NPU), TTS Pocket/CPU] → LVA (odtwarzanie).](/images/arduino-local-agent/architecture.png)

**Wszystkie trzy modele są lokalne, ale „na płytce” nie znaczy „wszystko na NPU”.** Sama bramka LLM nie steruje urządzeniami - zwraca wywołanie funkcji, które obsługuje HA.

## 3. STT: od Small do Large-v3-Turbo

Zacząłem od Whisper Medium INT8 na CPU. Dla krótkiej próbki potrzebował około 12 sekund. Small i Base były szybsze, lecz w niewielkich próbach pojawiały się błędy w nazwach i łączeniu słów. W asystencie domowym poprawna transkrypcja ogólnego sensu nie zawsze wystarcza do wyboru właściwego urządzenia.

Kolejnym przebadanym wariantem był Medium W8A16 uruchomiony na NPU. Okazał się być dostatecznie szybki, z wynikiem 0,67 s. Zdarzało mu się jednak błędnie rozumieć komendy. Ostatecznie natrafiłem na model *Whisper Large-v3-Turbo W8A16**, z [oficjalnego pakietu Qualcomm dla QCS8275](https://qaihub-public-assets.s3.us-west-2.amazonaws.com/qai-hub-models/models/whisper_large_v3_turbo_quantized/releases/v0.66.0/whisper_large_v3_turbo_quantized-precompiled_qnn_onnx-w8a16-qualcomm_qcs8275.zip), z [tokenizerem OpenAI](https://huggingface.co/openai/whisper-large-v3-turbo), który przy czasie pracy 0,43 s. okazał się dostarczać znacząco wyższą jakość tekstu. Wydzielony ONNX Runtime korzysta z QNN Execution Provider. Zarówno encoder, jak i decoder mają wyłączony fallback na CPU.

![Porównanie szybkości STT: Medium INT8 na CPU ok. 12 s, na NPU Small 0,51 s, Medium 0,67 s, Turbo 0,43 s.](/images/arduino-local-agent/stt-speed-comparison.png)

## 4. LLM: dlaczego skończyłem na Qwen 2.5 3B

Wymagania względem modelu były następujce: 
- Model musi rozumieć język Polski
- Model musi obsługiwać tool calling
- Model musi być mały - wiedziałem już, że modele 11B nie sprawdzają się na NPU.  To niestety wykluczyło Bielika 3.1.

W związku z tym postawiłem na małe modele z rodziny Qwen.
Testy obejmowały Qwen3-1.7B, Qwen3-4B oraz Qwen2.5-3B. W małej serii 1.7B raz na trzy próby popełniał błąd, wymyślał narzędzie albo zwracał bezużyteczny wynik. Większy model, **Qwen3-4B-Instruct-2507 w skompilowanym wariancie QAIRT/QNN W4A16**, załądował się i w warunkach testowych sprawdzał się poprawnie. Nie sprawdził się jednak użyty jako asystent. Problemem był kontekst przekazywany przez HA na początku zapytania: po jego uwzględnieniu model nie mieścił się w pamięci.

Obiecujący wydawał się być pośredni wariant **Qwen 4B**, który jednak napotykał błędy mapowania pamięci FastRPC. 
Ostatecznie najlepszym kompromisem okazał się więc starszy wariant: **Qwen 2.5 3B**.

![Porównanie modeli przy krótkim i pełnym kontekście HA, brak pomiaru nie jest zerowym czasem odpowiedzi.](/images/arduino-local-agent/npu-model-comparison.png)

Wybrałem **Qwen2.5-3B-Instruct GGUF Q4_0**, uruchamiany przez GenieX i backend Hexagon. 

### Kontekst od HA

Jak wspomniałem podczas opisywania problemów z rozmiarem modelu: nawet krótka wypowiedź użytkownika nie oznacza krótkiego żądania do modelu. Dochodzą instrukcje, historia i definicje narzędzi. W celu zmniejszenia ilości tych danych i przyspieszenia działania asystenta zastosowałem ograniczenie ekspozycji urządzeń. To działanie zmniejszyło wejście z **7781 do 3550 tokenów**. 

![Historyczne zmniejszenie wejścia z 7781 do 3550 tokenów oraz mediany odpowiedzi zdaniowej z 22,741 do 9,968 sekundy.](/images/arduino-local-agent/ha-context-before-after.png)

Mediana pełnej odpowiedzi tekstowej spadła z **22,741 do 9,968 s**: około **2,28 razy szybciej**, czyli o 56% krócej. Dla porównania: bez kontekstu HA podobne zdanie zajmowało około 1,8 s.

Nie każde żądanie musi jednak uruchamiać LLM. W aktywnej bramce działa też **wąski, deterministyczny router przed modelem**: dla części jednoznacznych poleceń potrafi przygotować `tool_calls`, które nadal wykonuje HA. Korzysta z bieżącego schematu narzędzi i katalogu wyprowadzonego z kontekstu, nie z przypiętej listy domowych urządzeń, dostosowuje się więc dynamicznie do ustawień HA.

### Router: dopasowanie z tolerancją na błędy

Router to Python przetwarzany na CPU, nie kolejny model. Proces jego działania podzielony jest na 5 kroków:

1. **Normalizacja komendy**: wielkość liter, polskie znaki, nadmiarowe spacje.
2. **Lematyzacja** (za pomocą modułu `simplemma`): formy odmiany sprowadzane do podstawy - `rolety` → `roleta`, `salonie` → `salon`. Dzięki temu dopasowuje się liczba mnoga i miejscownik.
3. **Wyciąganie aliasów narzędzi z kontekstu**: rozdzielane po przecinku lub po podwójnej spacji. Realny opis encji potrafi łączyć nazwy bez przecinka (`„roleta  Rolety"`).
4. **Dopasowanie nazwy i obszaru**: najpierw dokładne, potem z tolerancją **jednej edycji** (odległość Levenshteina). To dopełnienie błędów STT - `urolety` i `relety` trafiają w `rolety`, `sypiali` w `sypialni`.
5. **Decyzja**: `TOOLCALL` tylko przy **jednym** pasującym celu i **jednym** obszarze. Zero lub kilka trafień → `CLARIFY` (doprecyzowanie), nigdy zgadywanie. Wypowiedź poza zakresem → `PASS` do Qwena. Po wyniku narzędzia router zwraca krótkie `ACK` („Wykonano"/„Nie udało się."), zamiast kolejnej rundy LLM.

Zmierzony czas decyzji routera to około **2 ms** (bez inferencji), wobec około 10 s pełnej rundy LLM. To czas decyzji, nie fizycznego zamknięcia rolety ani potwierdzenia stanu przez HA.

## 6. TTS

Do syntezy mowy wykorzystuję [Pocket TTS Polish - `shefowl/pocket-tts-polish-6l`](https://huggingface.co/shefowl/pocket-tts-polish-6l), z polskim głosem referencyjnym autora. **Checkpoint i referencja pozostały te same, obliczenia nadal wykonuje CPU.** Zmieniłem runtime i sposób dostarczania audio, nie model na inny głos ani na rozwiązanie NPU.

Początkowo korzystałem ze ścieżki Python/PyTorch. Procesowanie przykłądu zajmowało około **7,3 s** generacji dla 2 s dźwięku i **20,6 s** dla 7 s.

Obecnie adapter uruchamia rozgrzany proces z **Pocket TTS dla ARM64**. Źródłem wydania jest [oficjalny tag v4.0.1 projektu Kyutai](https://github.com/kyutai-labs/pocket-tts/tree/v4.0.1/rust), manifest Cargo w tym tagu ma wersję **3.3.0**. 

Serwer TTS nadal wystawia Wyoming. Przed wysyłką zbiera **2 s** audio i mierzy **RTF** (czas generacji podzielony przez długość audio): jeśli silnik generuje wolniej, niż trwa mowa (**RTF > 0,9**), buforuje całość i wysyła na końcu - bez ponownego generowania tej samej wypowiedzi.

Ta zmiana skróciła oczekiwanie na pierwsze próbki dźwięku z **5,65 s do 0,8 s** (porównanie niżej).

![Czas do pierwszych próbek PCM u klienta Wyoming: Python/PyTorch 5,653 s, Rust ARM64 0,8 s.](/images/arduino-local-agent/tts-speed-comparison.png)

![TTS (Rust, streaming): czas dostarczenia wg długości nagrania - pierwsze PCM ~0,8 s niezależnie od długości, całość rośnie z 0,8 do 3,8 s.](/images/arduino-local-agent/tts-length-chart.png)

*Trzy rzeczywiste próbki (1,5 / 6,6 / 11,4 s audio), rozgrzany proces Rust. Pierwsze PCM u klienta Wyoming, nie start dźwięku na głośniku.*

## 7. Połączenie z HA i start usług

Od strony HA pozostają trzy połączenia: **STT przez Wyoming**, **agent przez zgodne API OpenAI** i **polski TTS przez Wyoming**. Numery portów (`10301`, `18191`, `10201`) to wartości z konfiguracji tej implementacji (patrz README). Folder `ha-local-agent/` zawiera bramkę, router i instalator usług agenta; Whisper, Pocket TTS i satelita LVA wymagają osobnego przygotowania. Porty są umowne, to nie wymóg protokołu, tylko moja implementacja: można je zmienić, ważne, by HA i usługi zgadzały się co do adresów. W asystencie trzeba przypisać właściwe etapy i świadomie wybrać udostępnione encje.

### Integracja: Local OpenAI LLM

HA łączy się z bramką przez **community `skye-harris/hass_local_openai_llm`** („Local OpenAI LLM", stabilne wydanie **1.15.1**, licencja Apache-2.0). To kluczowy wybór: oficjalne integracje **Ollama** i **OpenAI** nie przyjmą endpointu zgodnego z OpenAI spoza ich ekosystemu, a GenieX `serve` taki właśnie wystawia. Local OpenAI bierze dowolny `Server URL`, więc jedyną konfiguracją po stronie HA jest adres bramki:

- **Server URL (OpenAI-compatible):** `http://<adres-Arduino>:18191/v1`,
- typ serwera `llama.cpp` z opcjami samplingu, tool calling włączony po stronie silnika.

Integracja to cienka warstwa: przekazuje schematy narzędzi HA jako `tools`, a wyniki wywołań jako `role: tool` w kolejnej iteracji (pętla do 10 iteracji). Sterowanie nadal wykonuje HA - ani bramka, ani integracja nie ruszają urządzeń same.

Bramka serializuje żądania, obsługuje różnice w streamingu i ma obejście pustej odpowiedzi przy identycznym powtórzeniu pytania.

![Konfiguracja asystenta Home Assistant — przypisane STT, agent i TTS.](/images/arduino-local-agent/ha-assistant-config.jpg)

![Ustawienia agenta Local OpenAI — narzędzia i zakres ekspozycji.](/images/arduino-local-agent/ha-agent-settings.jpg)

Aktualna jednostka STT i boot guard wskazują już Turbo. Pilnują kolejności oraz tego, by nie ładować równocześnie kilku wariantów STT na NPU, nie wykonują automatycznego fallbacku na CPU. TTS ma politykę automatycznego startu `unless-stopped`. **Po najnowszych zmianach Turbo i Rust nie przeprowadziłem pełnego rebootu płytki.** Zmiana konfiguracji autostartu i pomyślne testy usług nie zastępują takiego sprawdzianu.

![Przykład rzeczywistej rozmowy (zanonimizowanej).](/images/arduino-local-agent/ha-conversation.jpg)

## 8. Rezultat

Najważniejszy rezultat jest konkretny: **na małym urządzeniu działają lokalne modele mowy i języka, a Home Assistant potrafi z nich korzystać** - bez chmury, bez kluczy API i bez komputera z GPU włączonego 24/7.

W liczbach:

- **STT**: Whisper Large-v3-Turbo na NPU transkrybuje 2,8 s mowy w **0,43 s** (zamiast ~12 s na CPU).
- **TTS**: Pocket TTS Polish na Rust dostarcza pierwszy dźwięk w **0,8 s** (zamiast 5,65 s w Pythonie), niezależnie od długości wypowiedzi.
- **LLM**: Qwen2.5-3B odpowiada w **1,8 s** bez kontekstu HA; ograniczenie ekspozycji skróciło pełną odpowiedź z 22,7 s do **9,97 s**.
- **Sterowanie**: wąski router regułowy rozpoznaje jednoznaczne komendy w **~2 ms** i jest odporny na błędy STT; złożone polecenia trafiają do LLM z tool calling.

Efekt użytkowy: proste polecenia („otwórz/zamknij roletę") są obsługiwane deterministycznie i natychmiast, a pozostałe zapytania - przez lokalny LLM. Całość działa na jednopłytkowym komputerze, który może chodzić 24/7 przy niewielkim poborze mocy. 

## 9. Wyzwania i problemy

Największy problem projektu jest oczywisty: **3B to za mało na skomplikowane myślenie, a jednocześnie już teraz bywa za wolno.**

- **Za mało na głębsze rozumowanie.** Qwen2.5-3B dobrze kopiuje zdania i wybiera narzędzia w jednoznacznym kontekście, ale to nie model do wielokrokowego planowania, łączenia faktów z kilku narzędzi ani wyjaśniania zależności. Im trudniejsze polecenie, tym większe ryzyko zmyślonych argumentów.
- **Za wolno na pełny kontekst.** Pełny prefill z opisem encji i narzędziami to około **20 s**. W rozmowie głosowej to za długo. Stąd kierunek „mniej kontekstu + router".
- **Bez ponownego użycia KV.** Serwer resetuje sesję przy zmianie pytania, więc długi wspólny prefiks jest liczony od nowa przy każdym żądaniu. Użyćie cache może pomóc przyspieszyć odpowiedź.
- **Współdzielenie jednego NPU.** Whisper (STT) i Qwen (LLM) muszą dzielić ten sam akcelerator Hexagon. Równoczesne ładowanie kilku modeli bywa niestabilne, a przy napiętej pamięci wariant 4B GGUF w ogóle się nie załadował (FastRPC ENOMEM). 
# pkowalski.com

Portfolio Pawła Kowalskiego. Astro, Markdown/MDX, CSS i GitHub Pages.

## Uruchomienie

Node.js 24 LTS.

```bash
npm ci
npm run dev
```

Otwórz adres pokazany w terminalu, zwykle `http://127.0.0.1:4321`.

```bash
npm run check          # typy i treści
npm test              # stare adresy i renderowanie artykułów
npm run build         # gotowa strona w dist/
npm run verify        # strony, linki, media, RSS i kontakt
npm run check:secrets # sekrety w historii Git, indeksie i gotowej stronie
npm run preview       # podgląd zbudowanej wersji
```

## Dodawanie wpisów

```bash
npm run new:post -- "Tytuł artykułu"
```

Powstanie plik w `src/content/posts/`:

```markdown
---
title: "Tytuł artykułu"
slug: "tytul-artykulu"
date: "2026-10-25"
description: "Krótki opis wpisu."
image: "/media/tytul-artykulu/preview.png"
tags: ["PyTorch", "Computer graphics"]
draft: true
---

Treść pisana w **Markdown**.

![Opis ilustracji](../media/tytul-artykulu/illustration.png)
```

Grafiki umieszczaj w `public/media/tytul-artykulu/`. Pole `image` jest opcjonalne. Ścieżki względne w treści działają zarówno na własnej domenie, jak i pod adresem projektu na `github.io`.

Szkice z `draft: true` są widoczne w lokalnym podglądzie z oznaczeniem „Draft”; nie trafiają do publikacji, archiwum ani RSS. Gdy wpis będzie gotowy, ustaw `draft: false`, zrób commit i push do `main`.

## Edycja istniejących treści

Wpisy są w `src/content/posts/`, a strony About i Contact w `src/content/pages/`. Każdy plik zawiera metadane, a poniżej treść.

Dotychczasowe wpisy mają `format: "wordpress-blocks"` lub `format: "wordpress-classic"` i zachowany HTML. Można edytować ten HTML bez konwersji. Nowe wpisy domyślnie korzystają z Markdown.

Strona główna jest w `src/pages/index.astro`. W `src/data/homepage.json` ustawiasz liczbę najnowszych wpisów (`latestCount`) i dwa wyróżnione projekty (`featuredSlugs`). Lista najnowszych aktualizuje się według dat i nie dubluje wyróżnień.

Wygląd strony jest w `src/styles/global.css`, a artykułów w `src/styles/prose.css`.

## Interaktywne dema

Samodzielne demo można umieścić w `public/demos/nazwa/index.html` razem z jego skryptami i zasobami. Wewnątrz używaj ścieżek względnych. Z artykułu linkuj do `../demos/nazwa/index.html`.

Do osadzania komponentów w treści użyj MDX:

```bash
npm run new:post -- "Artykuł z demo" --mdx
```

W pliku MDX można importować komponenty Astro z `src/components/`. React lub Svelte można dołożyć, gdy będzie tego potrzebowało konkretne demo. GitHub Pages wykonuje kod przeglądarkowy; Python lub GPU wymagają osobnej usługi.

Istniejąca symulacja lotu samolotu jest w `public/demo/`. Generator kwiatów w `public/flowers_demo/` wymaga oryginalnych modeli GAN/VAE do przywrócenia interakcji; obecnie pokazuje oryginalny wynik i link do artykułu.

## GitHub Pages

1. W repozytorium wybierz **Settings → Pages → Source: GitHub Actions**.
2. Wypchnij kod do `main`.
3. Sprawdź workflow **Build and deploy portfolio** w zakładce **Actions**. W razie potrzeby uruchom go przez **Run workflow**.
4. Otwórz adres wdrożenia, zwykle `https://p4vv37.github.io/pkowalski.com/`.

Workflow odczytuje adres z ustawień Pages, sprawdza projekt i publikuje `dist/`. Pull requesty wykonują kontrole bez publikacji. Katalog `dist/` nie jest commitowany.

### Własna domena

Po sprawdzeniu podglądu:

1. Zweryfikuj domenę w ustawieniach konta GitHub, zgodnie z instrukcją rekordu TXT.
2. W **Settings → Pages → Custom domain** ustaw `www.pkowalski.com`.
3. U operatora DNS ustaw CNAME dla `www` na `p4vv37.github.io`. Domenę główną skonfiguruj według instrukcji GitHuba. Zachowaj rekordy poczty MX/SPF/DKIM.
4. Po potwierdzeniu DNS włącz **Enforce HTTPS** i ponownie uruchom workflow.

[Instrukcja domeny GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [Astro na Pages](https://docs.astro.build/en/guides/deploy/github/).

Wariant dla adresu projektu można sprawdzić lokalnie:

```bash
SITE_URL=https://p4vv37.github.io BASE_PATH=/pkowalski.com npm run build
BASE_PATH=/pkowalski.com npm run verify
```

Bez tych zmiennych build używa `https://www.pkowalski.com`.

## Kontakt i stare adresy

Publiczny kontakt: [contact@pkowalski.com](mailto:contact@pkowalski.com), [GitHub](https://github.com/p4vv37).

Stare adresy WordPressa (`?p=…`, `?page_id=…`, `/wp_portfolio/…`) obsługuje `src/data/legacy-urls.json`. Przekierowania stron wykonuje przeglądarka; aliasy ścieżek mają także odnośnik i fallback bez JavaScript. Media są dostępne pod oboma dawnymi prefiksami. Dodatkowa kopia powstaje tylko podczas budowania `dist/`.

Pliki lokalnych kont, kluczy i kopii hostingu są wykluczone przez `.gitignore`. Kontrola sekretów wymaga Gitleaksa; skrypt potrafi pobrać przypiętą wersję dla Linux x64 i sprawdzić jej SHA-256. Można też ustawić `GITLEAKS_BIN` na własną instalację narzędzia. Wartości wykryte przez skaner są ukrywane w logach.

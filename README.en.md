<div align="center">

<img src="img/icon512x512.png" width="130" alt="Museum at Home logo">

# Museum at Home

### A calm, multilingual art gallery built for televisions

[Home](README.md) · **English** · [Русский](README.ru.md)

[![CI](https://img.shields.io/github/actions/workflow/status/Saborrr/art-screensaver-webos/ci.yml?branch=main&style=for-the-badge&label=multi-platform%20build)](https://github.com/Saborrr/art-screensaver-webos/actions)
[![Artworks](https://img.shields.io/badge/rights--checked_artworks-55-d8b56c?style=for-the-badge)](docs/CONTENT_POLICY.md)
[![Legacy webOS](https://img.shields.io/badge/legacy_runtime-Chromium_38-4f5944?style=for-the-badge)](https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine)

<img src="docs/images/app-preview.jpg" alt="Museum at Home gallery interface">

</div>

## What it is

Museum at Home transforms a television into an unobtrusive full-screen museum.
It was designed from the start for a remote control and viewing from across the
room: readable type, safe margins, predictable focus, no tiny controls and no
network dependency in packaged builds.

After twelve seconds of inactivity, artwork information and the clock fade
away. Any remote or pointer input brings them back. The behavior can be set to
**Auto-hide** or **Always visible** in the collection menu.

## Features

- Russian art and world art collections;
- filters for landscape, portrait, realism, Romanticism, Impressionism,
  Renaissance, Baroque and modern art;
- durable favorites with migration from the original storage format;
- detailed Russian and English descriptions;
- dual-image crossfade without a black frame;
- optional restrained Ken Burns movement;
- complete offline image fallbacks in packaged apps;
- PWA caching for hosted browser installations;
- content allow-list based on museum and Wikimedia rights metadata;
- ES5 runtime for webOS 3.x and older Samsung Tizen engines.

## Platform support

| Platform / common brands | Delivery | Support and limitations |
|---|---|---|
| **LG webOS 3+** | Two `.ipk` packages | Full app support. Gallery screensaver extensions activate only on LG models that expose them. |
| **Android TV / Google TV** — Sony, Philips, TCL, Xiaomi, selected Hisense models, Nvidia Shield | Android `.apk` | Full remote UI and a registered Android DreamService. Availability of third-party system screensavers depends on the device firmware. |
| **Amazon Fire TV** | The same Android `.apk` | Full-screen gallery and remote support. Install through ADB for testing; DreamService availability varies by Fire OS version. |
| **Samsung Smart TV / Tizen** | Unsigned Tizen web project | UI and Samsung Return key are supported. Samsung requires a developer certificate tied to the TV before a `.wgt` can be installed. |
| **TV browser / mini PC / kiosk** | Static web app or PWA | Works from HTTPS or a local web server. Browser mode cannot replace a manufacturer-controlled system screensaver. |
| **Apple TV** | Not yet | tvOS requires a separate native SwiftUI application. |
| **Roku** | Not yet | Roku requires a separate SceneGraph / BrightScript application. |
| **VIDAA and proprietary systems** | Browser fallback where available | Native store submission requires the vendor SDK and partner process. |

The web interface is shared, while each platform wrapper handles its launcher,
remote Back behavior, packaging and store requirements.

## Image quality on 4K televisions

LG web applications render graphics at up to 1920×1080 even on UHD models;
native 3840×2160 is reserved for video. Museum at Home therefore uses clean,
carefully compressed 1920-pixel reproductions instead of wasting memory on
files the web compositor will downscale. Android, Samsung and browser builds
use the same source-quality artwork set and preserve each painting's aspect
ratio with `object-fit: contain`.

## Remote control

| Key | Action |
|:---:|---|
| `←` / `→` | Previous / next artwork |
| `↑` or red | Add or remove favorite |
| `↓` or yellow | Open the artwork story |
| `OK`, green or blue | Open collections and settings |
| `Back`, `Return` or `Esc` | Close the panel or exit |

## Download CI builds

Open [GitHub Actions](https://github.com/Saborrr/art-screensaver-webos/actions),
select the newest successful **Museum at Home CI** run and download:

- `museum-at-home-webos` — LG 1080p and 720p `.ipk` packages;
- `museum-at-home-cross-platform` — Android TV debug APK, browser/PWA ZIP and
  unsigned Samsung Tizen ZIP.

Artifacts are intended for testing. Store releases require your own signing
keys and seller accounts.

## Install on LG webOS

Install the official LG CLI:

```bash
npm install -g @webos-tools/cli
ares-setup-device
ares-novacom --device myTV --getkey
ares-device --device myTV --system-info
```

Use the 1080 package on UHD televisions such as the LG 49UH610V:

```bash
ares-install --device myTV path/to/1080/com.saborrr.museumathome_2.1.0_all.ipk
ares-launch --device myTV com.saborrr.museumathome
```

Developer Mode sessions expire, so extend the session in LG's Developer Mode
app before its timer reaches zero.

## Install on Android TV / Google TV / Fire TV

Enable developer options and ADB on the television, then install the APK from
the cross-platform artifact:

```bash
adb connect TV_IP_ADDRESS
adb install -r museum-at-home-android-tv-debug.apk
```

For a production release, build and sign a release APK or AAB with your own
keystore. The debug artifact is intentionally not a store release.

## Install on Samsung Tizen

Samsung requires every TV application to be signed with an author and
distributor certificate that includes the target TV's DUID. Import the unsigned
project ZIP into Tizen Studio or Samsung's VS Code extension, create the
certificate profile, package it as `.wgt`, then install it on the registered TV.

The repository cannot safely automate this final signature because an author
certificate and password must never be committed to GitHub.

## Run as a web app / PWA

```bash
npm run build:platforms
npx --yes http-server dist/web -p 8080
```

Open `http://localhost:8080` for local testing. For PWA installation and service
worker caching, host `dist/web` over HTTPS.

## Development

```bash
npm test                       # catalog, remote, ES5 and platform checks
npm run audit:rights:refresh  # recheck museum and Commons metadata
npm run validate              # validate every release image
npm run build                 # LG 1080p and 720p folders
npm run build:platforms       # web, Tizen and Android asset sync
```

The shared build flow is:

```text
data/*.json + img/paintings/*
              ↓ rights and asset validation
        shared ES5 TV interface
          ↓         ↓         ↓
     LG webOS   Android APK   Tizen / PWA
```

## Content and rights

The commercial catalog contains 55 verified works. Two disputed reproductions
are blocked and one CC BY-SA reproduction remains outside the release until its
attribution flow is finalized. Search-engine results are never accepted as
proof of permission. See [Content and rights policy](docs/CONTENT_POLICY.md).

## Roadmap

- signed release automation through encrypted repository secrets;
- app-store-ready Android TV / Fire TV bundles;
- Samsung device testing and signed `.wgt` release;
- larger curated collections and optional downloadable packs;
- native Apple TV, Roku and VIDAA ports after the shared catalog API is stable;
- optional subscriptions and premium museum packs.

## Author

Created and maintained by **[Saborrr](https://github.com/Saborrr)**.

The application code is distributed under the repository's all-rights-reserved
license. Artwork and reproduction rights are tracked separately per record.

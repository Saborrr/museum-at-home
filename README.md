<div align="center">

<img src="img/icon512x512.png" width="150" alt="Museum at Home logo">

# Museum at Home

### A quiet, curated museum experience for LG webOS televisions

[![webOS 3.x+](https://img.shields.io/badge/webOS-3.x%2B-8b6b32?style=for-the-badge&logo=lg)](https://webostv.developer.lge.com/)
[![Chromium 38](https://img.shields.io/badge/legacy-Chromium_38-4f5944?style=for-the-badge)](https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine)
[![CI](https://img.shields.io/github/actions/workflow/status/Saborrr/art-screensaver-webos/ci.yml?style=for-the-badge&label=build)](https://github.com/Saborrr/art-screensaver-webos/actions)
[![License](https://img.shields.io/badge/code-all_rights_reserved-3b3328?style=for-the-badge)](LICENSE)

<img src="img/splash.png" alt="Museum at Home splash screen">

</div>

## About

Museum at Home turns a television into a calm, full-screen art gallery. It is
built specifically for the ten-foot TV experience: large readable typography,
simple remote control, offline fallbacks and restrained animation.

The commercial catalog currently generates **55 rights-checked artworks**:

- 7 Russian masterpieces with detailed Russian and English stories;
- 48 works from the world collection;
- disputed Dalí and Magritte records excluded until licensing is documented;
- one CC BY-SA reproduction held back until its attribution flow is finalized.

## Highlights

- Russian art and world art collections;
- genres and periods: landscape, portrait, realism, Romanticism,
  Impressionism, Renaissance, Baroque and modern art;
- favorites with migration from the previous storage format;
- calm dual-image crossfade without a black flash;
- optional gentle Ken Burns movement;
- detailed descriptions revealed in three lightweight stages;
- Russian and English interface;
- fully offline 1920 px image fallbacks;
- immediate remote handling while the first artwork loads;
- separate 1080p and 720p webOS builds;
- ES5 runtime tested for webOS 3.x / Chromium 38.

## Remote control

| Key | Action |
|:---:|---|
| `←` / `→` | Previous / next artwork |
| `↑` or red | Add or remove favorite |
| `↓` or yellow | Open the artwork story |
| `OK`, green or blue | Open collections and settings |
| `Back` | Close the current panel or exit |

The same controls can be used with the Magic Remote pointer.

## Image quality on UHD televisions

LG officially supports a maximum graphics display resolution of 1920×1080 for
web apps on UHD models; 3840×2160 is available for video playback, not the HTML
graphics layer. Museum at Home therefore uses clean, color-managed 1920 px
reproductions instead of wasting memory on files the webOS graphics compositor
would downscale.

For older Full HD models, LG recommends a separate 1280×720 package. The build
pipeline produces both profiles.

## Quick browser preview

Requires Node.js 18 or newer:

```bash
git clone https://github.com/Saborrr/art-screensaver-webos.git
cd art-screensaver-webos
npm test
npm run catalog
npx --yes http-server . -p 8080
```

Open `http://localhost:8080`.

## Install on an LG TV

Install the current official CLI:

```bash
npm install -g @webos-tools/cli
ares -V
```

On the TV, install **Developer Mode**, sign in, enable Developer Mode, reboot,
enable **Key Server** and note the TV IP address. The computer and TV must be on
the same network.

```bash
ares-setup-device
```

Use:

```text
Name: myTV
Port: 9922
User: prisoner
```

Get the key and verify the connection:

```bash
ares-novacom --device myTV --getkey
ares-device --device myTV --system-info
```

Build, package, install and launch:

```bash
chmod +x deploy.sh
./deploy.sh myTV 1080
```

For an older Full HD model:

```bash
./deploy.sh myTV 720
```

For rapid development without packaging:

```bash
npm run catalog
ares-launch -H . -d myTV
```

Open the inspector while the app is running:

```bash
ares-inspect -d myTV --app com.saborrr.museumathome --open
```

Developer Mode sessions expire. When the session expires, LG removes
developer-installed apps; extend it in the Developer Mode app before the timer
runs out.

## Development

```bash
npm test          # logic, catalog and ES5 compatibility tests
npm run audit:rights         # use the cached rights report where possible
npm run audit:rights:refresh # recheck every source API and update metadata
npm run validate  # strict source, rights and local-asset checks
npm run build     # creates dist/webos-1080 and dist/webos-720
```

The runtime uses a single source of truth:

```text
data/*.json
    ↓ validated generator
js/catalog.es5.js
    ↓ tested ES5 runtime
dist/webos-1080 + dist/webos-720
    ↓ official ares-package
installable .ipk files
```

GitHub Actions runs the tests, validates all local fallbacks, builds both
profiles and uploads both `.ipk` files as workflow artifacts.

## Content safety

Every release artwork must include a source page, rights statement, local
fallback and an explicit commercial-use decision. See
[the content and rights policy](docs/CONTENT_POLICY.md).

Images found through a search engine are not accepted automatically. Museum at
Home rejects installation photos, visitors, reflections, unrelated frames and
watermarks.

## Repository layout

```text
├── index.html
├── appinfo.json
├── css/style.css
├── js/
│   ├── app.es5.js
│   ├── core.es5.js
│   └── catalog.es5.js
├── data/
│   ├── collection.json
│   └── russian-collection.json
├── img/paintings/
├── scripts/
├── tests/
└── .github/workflows/ci.yml
```

The older Expo and Android experiments remain in the repository for reference,
but the release pipeline currently targets LG webOS.

## Author

Created and maintained by **[Saborrr](https://github.com/Saborrr)**.

The application code is distributed under the repository's all-rights-reserved
license. Artwork and reproduction rights are tracked separately for every
catalog record.

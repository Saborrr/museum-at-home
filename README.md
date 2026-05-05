<div align="center">

# 🎨 Art Gallery Screensaver

**Beautiful screensaver for LG webOS TVs (3.0+) displaying masterpieces from world museums**

<p>
  <img src="https://img.shields.io/badge/platform-webOS%203.0%2B-blue" alt="Platform">
  <img src="https://img.shields.io/badge/status-in%20development-orange" alt="Status">
  <img src="https://img.shields.io/badge/license-Proprietary-red" alt="License">
</p>

</div>

## ✨ Features

- 🖼️ **Fullscreen art display** with smooth transitions (fade, slide, zoom)
- 🏛️ **Two museum APIs** — Rijksmuseum (Amsterdam) & Metropolitan Museum (New York)
- 📴 **Offline fallback** — bundled collection works without internet
- ⏱️ **Customizable** — interval, transition style, info display, collection filters
- 🎮 **TV remote control** — navigate with arrow keys, OK, back
- 🕐 **Subtle clock** — always know the time
- ❤️ **Favorites** — save artworks to a local collection
- 💾 **Persistent settings** — everything saved to localStorage

## 🧪 How to Test

### In any browser (recommended)
Simply open `index.html` in Chrome, Firefox, or Safari. The app works as a regular web page — no server needed.

```bash
# Clone the repo
git clone https://github.com/Saborrr/art-screensaver-webos.git
cd art-screensaver-webos

# Open in browser
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

> ⚠️ **Note:** Met Museum API works without a key. Rijksmuseum requires a free API key — see setup below.

### Local HTTP server (for full API support)
```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# Then open http://localhost:8080
```

### On a real LG TV
```bash
# 1. Install webOS CLI
npm install -g @webos-tools/cli

# 2. Enable Developer Mode on TV (LG Developer app from Content Store)

# 3. Package
webos-cli package .

# 4. Install on TV
webos-cli install --device YOUR_TV_NAME com.artscreen.gallery
```

## 🔧 Setup

### Rijksmuseum API Key (free, recommended)
1. Go to [data.rijksmuseum.nl](https://data.rijksmuseum.nl/)
2. Register for a free API key
3. Paste it in `js/museum-api.js` → `RIJKS_KEY`

### Met Museum API
No key needed — works out of the box!

## 🎮 Controls

| Key | Action |
|:---:|:---|
| ← / → | Previous / Next artwork |
| ↑ | ❤️ Save to favorites |
| ↓ | Show info briefly |
| OK / Back | Open settings |

## 📁 Project Structure

```
art-screensaver-webos/
├── appinfo.json          # webOS app manifest
├── index.html            # Main entry point
├── css/
│   └── style.css         # All styles (dark theme, transitions)
├── js/
│   ├── museum-api.js     # Rijksmuseum & Met Museum API client
│   ├── cache.js          # Image preload & favorites storage
│   └── app.js            # Main app logic & UI controller
├── img/
│   ├── icon80x80.png     # App icon (webOS)
│   ├── icon130x130.png   # Large icon (webOS)
│   ├── splash.png        # Splash screen (webOS)
│   └── icon_source.png   # Source file for icons
└── data/
    └── collection.json   # Bundled offline collection (fallback)
```

## 🏛️ Art Sources

| Source | API | Key Required | Images |
|:---|:---|:---:|:---:|
| [Rijksmuseum](https://www.rijksmuseum.nl/) (Amsterdam) | [Rijksmuseum API](https://data.rijksmuseum.nl/) | ✅ Free | ~800,000 objects |
| [Metropolitan Museum](https://www.metmuseum.org/) (New York) | [Met Open Access](https://metmuseum.github.io/) | ❌ None | ~500,000 objects |
| Bundled collection | `data/collection.json` | ❌ None | Local file |

All artworks are public domain / open access. Images are loaded at 1920px for TV quality.

## 📺 webOS Deployment

### Requirements
- LG TV with webOS 3.0+
- [Developer Mode](https://webostv.developer.lge.com/) enabled
- `@webos-tools/cli` npm package

### Publishing to LG Content Store
1. Register at [seller.lgappstv.com](https://seller.lgappstv.com) (free)
2. Package as `.ipk`
3. Provide: screenshots, icons ✅, description, UX scenario
4. Submit for QA review (~1-2 weeks)
5. Published in LG Content Store

## 🗺️ Roadmap

- [x] Core slideshow with transitions
- [x] Rijksmuseum & Met Museum API integration
- [x] Offline fallback collection
- [x] TV remote control
- [x] Favorites with local storage
- [ ] Ken Burns effect (slow pan/zoom)
- [ ] Background music option
- [ ] More museums (Europeana, WikiArt)
- [ ] Premium collections (monetization)
- [ ] Android version (React Native)
- [ ] LG Content Store submission

## ⚖️ License

All rights reserved. This project and its source code are the property of the author.  
Unauthorized copying, distribution, or modification is prohibited without written permission.

Artwork images belong to their respective museums and are used under open access / public domain terms.

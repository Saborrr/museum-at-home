#!/bin/bash
# ==============================================================================
# Art Gallery Screensaver - Easy 1-Click Update & Deploy Script
# ==============================================================================
set -e

WORKSPACE="/home/alex/.openclaw/workspace/art-screensaver-webos"
WWW_DIR="/var/www/art"
BUILD_DIR="/tmp/webos-build"

echo "🎨 --- Art Gallery Screensaver Deployer --- 🎨"

# 1. Pull latest changes if needed (optional)
if [ "$1" == "--pull" ]; then
    echo "📥 Pulling latest changes from GitHub..."
    git pull origin main
fi

# 2. Update local bundles just in case BUNDLED_ART was edited
echo "⚙️ Regenerating bundled.js and bundled.es5.js..."
python3 /tmp/generate_bundled.py 2>/dev/null || python3 -c "
import json
with open('$WORKSPACE/data/collection.json', 'r') as f:
    data = json.load(f)
artworks = data.get('artworks', [])
bundled = []
for art in artworks:
    id_name = art.get('id')
    bundled.append({
        'id': id_name,
        'title': art.get('title'),
        'artist': art.get('artist'),
        'year': art.get('year'),
        'museum': art.get('museum'),
        'image': f'img/paintings/{id_name}.jpg',
        'thumb': f'img/paintings/{id_name}.jpg',
        'source': art.get('source')
    })
with open('$WORKSPACE/js/bundled.js', 'w') as f:
    f.write('const BUNDLED_ART = ' + json.dumps(bundled, indent=2, ensure_ascii=False) + ';\n')
with open('$WORKSPACE/js/bundled.es5.js', 'w') as f:
    f.write('\"use strict\";\n\nvar BUNDLED_ART = ' + json.dumps(bundled, indent=2, ensure_ascii=False) + ';\n')
"

# 3. Copy to Web Directory
echo "🚀 Copying files to web directory ($WWW_DIR)..."
sudo mkdir -p "$WWW_DIR"
sudo cp "$WORKSPACE/index.html" "$WWW_DIR/"
sudo cp "$WORKSPACE/appinfo.json" "$WWW_DIR/"
sudo cp -r "$WORKSPACE/css" "$WWW_DIR/"
sudo cp -r "$WORKSPACE/js" "$WWW_DIR/"
sudo cp -r "$WORKSPACE/data" "$WWW_DIR/"
sudo cp -r "$WORKSPACE/img" "$WWW_DIR/"

# Remove non-ES5 files from WWW_DIR to keep it lightweight (optional but clean)
sudo rm -f "$WWW_DIR/js/app.js" "$WWW_DIR/js/cache.js" "$WWW_DIR/js/museum-api.js" "$WWW_DIR/js/bundled.js"

# 4. Compile webOS Package (.ipk)
echo "🧹 Preparing temporary build folder for webOS..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
cp "$WORKSPACE/index.html" "$BUILD_DIR/"
cp "$WORKSPACE/appinfo.json" "$BUILD_DIR/"
cp -r "$WORKSPACE/css" "$BUILD_DIR/"
cp -r "$WORKSPACE/js" "$BUILD_DIR/"
cp -r "$WORKSPACE/data" "$BUILD_DIR/"
cp -r "$WORKSPACE/img" "$BUILD_DIR/"

# Remove ES6 source files from package to prevent compiler errors
rm -f "$BUILD_DIR/js/app.js" "$BUILD_DIR/js/cache.js" "$BUILD_DIR/js/museum-api.js" "$BUILD_DIR/js/bundled.js"

echo "🏗️ Building .ipk package..."
ares-package "$BUILD_DIR" -o "$WORKSPACE"

# Copy package to www directory for easy download
echo "💾 Publishing .ipk to web directory..."
sudo cp -v "$WORKSPACE"/com.artscreen.gallery_*.ipk "$WWW_DIR/"

# 5. Fix permissions
echo "🔒 Adjusting permissions..."
sudo chown -R www-data:www-data "$WWW_DIR"
sudo chmod -R 644 "$WWW_DIR"/*
sudo find "$WWW_DIR" -type d -exec chmod 755 {} \;

echo "🎉 --- Deploy & Compilation Successful! --- 🎉"
echo "🌐 Web version updated at: https://gofaraway.mooo.com/art/"
echo "📺 Download webOS package: https://gofaraway.mooo.com/art/com.artscreen.gallery_1.0.0_all.ipk"

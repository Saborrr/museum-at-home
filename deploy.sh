#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVICE_NAME="${1:-myTV}"
PROFILE="${2:-1080}"
BUILD_DIR="$ROOT_DIR/dist/webos-$PROFILE"
PACKAGE_DIR="$ROOT_DIR/dist/packages"
APP_ID="com.saborrr.museumathome"

if ! command -v ares-package >/dev/null 2>&1; then
  echo "webOS CLI is missing. Install it with:"
  echo "  npm install -g @webos-tools/cli"
  exit 1
fi

if [[ "$PROFILE" != "1080" && "$PROFILE" != "720" ]]; then
  echo "Usage: ./deploy.sh [device-name] [1080|720]"
  exit 1
fi

cd "$ROOT_DIR"
npm test
node scripts/generate-catalog.js --strict-assets

if [[ "$PROFILE" == "1080" ]]; then
  npm run build:1080
else
  npm run build:720
fi

mkdir -p "$PACKAGE_DIR"
ares-package "$BUILD_DIR" -o "$PACKAGE_DIR"

PACKAGE_FILE="$(find "$PACKAGE_DIR" -maxdepth 1 -type f -name "${APP_ID}_*.ipk" -print | sort | tail -n 1)"
if [[ -z "$PACKAGE_FILE" ]]; then
  echo "Package was not created."
  exit 1
fi

echo "Installing $PACKAGE_FILE on $DEVICE_NAME"
ares-install --device "$DEVICE_NAME" "$PACKAGE_FILE"
ares-launch --device "$DEVICE_NAME" "$APP_ID"
echo "Museum at Home is running on $DEVICE_NAME"

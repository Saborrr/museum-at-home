'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

test('PWA manifest is installable and points to wide artwork UI', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.name, 'Museum at Home');
  assert.equal(manifest.display, 'fullscreen');
  assert.equal(manifest.orientation, 'landscape');
  assert.ok(manifest.icons.some((icon) => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some((icon) => icon.sizes === '512x512'));
  assert.equal(manifest.screenshots[0].sizes, '1920x1080');
});

test('Samsung Tizen project targets TV and supports old web engines', () => {
  const config = read('platforms/tizen/config.xml');
  const runtime = read('js/app.es5.js');
  const platform = read('js/platform.es5.js');
  assert.match(config, /tizen:profile name="tv-samsung"/);
  assert.match(config, /required_version="2\.3"/);
  assert.match(runtime, /10009/);
  assert.match(platform, /ColorF0Red/);
});

test('Android wrapper is visible on TV launchers and needs no touchscreen', () => {
  const manifest = read('art-gallery-android/app/src/main/AndroidManifest.xml');
  const strings = read('art-gallery-android/app/src/main/res/values/strings.xml');
  assert.match(manifest, /android\.intent\.category\.LEANBACK_LAUNCHER/);
  assert.match(manifest, /android\.hardware\.touchscreen/);
  assert.match(manifest, /android:required="false"/);
  assert.match(manifest, /android:banner="@drawable\/banner"/);
  assert.match(strings, /Museum at Home/);
});

test('ambient chrome auto-hide setting survives validation', () => {
  const Core = require('../js/core.es5.js');
  assert.equal(Core.normalizeSettings({ chrome: 'always' }).chrome, 'always');
  assert.equal(Core.normalizeSettings({ chrome: 'invalid' }).chrome, 'auto');
});

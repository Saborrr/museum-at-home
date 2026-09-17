'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

test('TV runtime stays ES5-friendly for webOS 3.x Chromium 38', () => {
  const files = ['js/core.es5.js', 'js/platform.es5.js', 'js/app.es5.js'];
  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(source, /\b(?:const|let|class|async|await)\b/);
    assert.doesNotMatch(source, /=>/);
    assert.doesNotMatch(source, /\.animate\s*\(/);
    assert.doesNotMatch(source, /\bfetch\s*\(/);
  }
});

test('CSS avoids unsupported layout primitives and img pseudo-elements', () => {
  const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');
  assert.doesNotMatch(css, /\bdisplay\s*:\s*grid\b/);
  assert.doesNotMatch(css, /\binset\s*:/);
  assert.doesNotMatch(css, /#art-image[^\n]*::(?:before|after)/);
});

test('CSS supports reduced motion, visible focus and TV safe areas', () => {
  const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /safe-area-inset-left/);
  assert.match(css, /platform-(?:tizen|webos|android)/);
});

test('CSS keeps the loading state click-through and lets the error state block the screen', () => {
  const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');
  assert.match(css, /\.loading\s*\{[^}]*pointer-events:\s*none/);
  assert.match(css, /\.loading\.is-error\s*\{[^}]*pointer-events:\s*auto/);
  assert.match(css, /\.overlay\.open\s*\{[^}]*z-index:\s*300/);
});

test('app manifest uses Museum at Home identity and 1080 graphics mode', () => {
  const appInfo = JSON.parse(fs.readFileSync(path.join(root, 'appinfo.json'), 'utf8'));
  assert.equal(appInfo.title, 'Museum at Home');
  assert.equal(appInfo.resolution, '1920x1080');
  assert.equal(appInfo.disableBackHistoryAPI, true);
  assert.equal(appInfo.version, '2.1.1');
});

test('release version 2.1.1 is consistent across every platform manifest', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const tizen = fs.readFileSync(path.join(root, 'platforms/tizen/config.xml'), 'utf8');
  const android = fs.readFileSync(path.join(root, 'art-gallery-android/app/build.gradle.kts'), 'utf8');
  const readmeEn = fs.readFileSync(path.join(root, 'README.en.md'), 'utf8');
  const readmeRu = fs.readFileSync(path.join(root, 'README.ru.md'), 'utf8');

  assert.equal(pkg.version, '2.1.1');
  assert.equal(lock.version, '2.1.1');
  assert.equal(lock.packages[''].version, '2.1.1');
  assert.match(tizen, /version="2\.1\.1"/);
  assert.match(android, /versionCode\s*=\s*3/);
  assert.match(android, /versionName\s*=\s*"2\.1\.1"/);
  assert.match(readmeEn, /com\.saborrr\.museumathome_2\.1\.1_all\.ipk/);
  assert.match(readmeRu, /com\.saborrr\.museumathome_2\.1\.1_all\.ipk/);
});

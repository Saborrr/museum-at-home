'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const files = ['README.md', 'README.en.md', 'README.ru.md'];
const releaseAssets = [
  'museum-at-home-android-tv-debug.apk',
  'museum-at-home-webos-1080-unsigned.ipk',
  'museum-at-home-webos-720-unsigned.ipk',
  'museum-at-home-tizen-unsigned.zip',
  'museum-at-home-web.zip'
];

for (const filename of files) {
  test(`${filename} points to this repository and the published release`, () => {
    const text = fs.readFileSync(path.join(root, filename), 'utf8');
    assert.doesNotMatch(text, /Saborrr\/art-screensaver-webos/i);
    assert.match(text, /https:\/\/github\.com\/Saborrr\/museum-at-home\/releases\/tag\/v2\.1\.1/);
  });
}

for (const filename of ['README.en.md', 'README.ru.md']) {
  test(`${filename} lists each published test package`, () => {
    const text = fs.readFileSync(path.join(root, filename), 'utf8');
    for (const asset of releaseAssets) assert.ok(text.includes('`' + asset + '`'), asset);
  });
}

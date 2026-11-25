'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const files = ['README.md', 'README.en.md', 'README.ru.md'];
const currentAsset = 'museum-at-home-webos-1080-2.1.3.ipk';
const historicalAsset = 'museum-at-home-webos-1080-2.1.2.ipk';
const legacyAssets = [
  'museum-at-home-android-tv-debug.apk',
  'museum-at-home-webos-1080-unsigned.ipk',
  'museum-at-home-webos-720-unsigned.ipk',
  'museum-at-home-tizen-unsigned.zip',
  'museum-at-home-web.zip'
];

for (const filename of files) {
  test(`${filename} documents the LG candidate honestly and preserves historical evidence`, () => {
    const text = fs.readFileSync(path.join(root, filename), 'utf8');
    assert.doesNotMatch(text, /Saborrr\/art-screensaver-webos/i);
    assert.match(text, /https:\/\/github\.com\/Saborrr\/museum-at-home\/releases\/tag\/v2\.1\.2/);
    assert.ok(text.includes(`/releases/download/v2.1.2/${historicalAsset}`));
    assert.ok(text.includes(`dist/${currentAsset}`));
    assert.doesNotMatch(text, /releases\/(?:tag|download)\/v2\.1\.3/);
    assert.ok(text.includes("museum-at-home-webos-720-2.1.3.ipk"));
    assert.match(text, /(?:Both v2.1.3 LG packages are built|Оба пакета v2.1.3 собраны)/);
    assert.match(text, /(?:Physical LG testing|физическом LG)/);
    assert.match(text, /(?:Historical|Историческ)/);
    assert.match(text, /docs\/LG_QA_RESUBMISSION\.md/);
    assert.match(text, /(?:Stay|Остаться)/);
    assert.match(text, /80 (?:rights-checked artworks|artworks|картин)/);
    assert.match(text, /32 (?:Russian|русские)/);
    assert.match(text, /48 (?:world works|мировые)/);
    assert.match(text, /25 (?:Russian|русских)/);
    assert.match(text, /(?:artworks-80|прав-80)/);
    assert.doesNotMatch(text, /(?:artworks-55|прав-55|55 (?:commercially|verified|проверенных))/);
    assert.match(text, /LG\s?49UH610V/);
    assert.match(text, /webOS\s?3\.4/);
  });
}

for (const filename of ['README.en.md', 'README.ru.md']) {
  test(`${filename} keeps the older v2.1.1 package listing separate`, () => {
    const text = fs.readFileSync(path.join(root, filename), 'utf8');
    assert.match(text, /releases\/tag\/v2\.1\.1/);
    for (const asset of legacyAssets) assert.ok(text.includes('`' + asset + '`'), asset);
    assert.match(text, /(?:Older v2\.1\.1|Старые сборки v2\.1\.1)/);
  });

  test(`${filename} documents current Mac and CLI installation`, () => {
    const text = fs.readFileSync(path.join(root, filename), 'utf8');
    assert.match(text, /https:\/\/github\.com\/webosbrew\/dev-manager-desktop\/releases\/latest/);
    assert.ok(text.includes(`ares-install --device myTV ${currentAsset}`));
    assert.match(text, /73,141,544/);
    assert.match(text, /ares-package/);
  });
}

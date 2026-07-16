'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

test('TV runtime stays ES5-friendly for webOS 3.x Chromium 38', () => {
  const files = ['js/core.es5.js', 'js/app.es5.js'];
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

test('app manifest uses Museum at Home identity and 1080 graphics mode', () => {
  const appInfo = JSON.parse(fs.readFileSync(path.join(root, 'appinfo.json'), 'utf8'));
  assert.equal(appInfo.title, 'Museum at Home');
  assert.equal(appInfo.resolution, '1920x1080');
  assert.equal(appInfo.disableBackHistoryAPI, true);
});

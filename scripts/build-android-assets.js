'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { ROOT, loadCatalog, validateCatalog, writeBrowserCatalog } = require('./catalog-lib');

const androidAssets = path.join(
  ROOT,
  'art-gallery-android',
  'app',
  'src',
  'main',
  'assets'
);
const catalog = loadCatalog();
const result = validateCatalog(catalog, { strictAssets: true });

for (const warning of result.warnings) console.warn('WARN:', warning);
if (result.errors.length) {
  for (const error of result.errors) console.error('ERROR:', error);
  process.exit(1);
}

function copyFile(relative) {
  const source = path.join(ROOT, relative);
  const target = path.join(androidAssets, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to);
    else fs.copyFileSync(from, to);
  }
}

fs.rmSync(androidAssets, { recursive: true, force: true });
fs.mkdirSync(androidAssets, { recursive: true });
for (const relative of [
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  'css/style.css',
  'js/core.es5.js',
  'js/platform.es5.js',
  'js/app.es5.js'
]) {
  copyFile(relative);
}
copyDirectory(path.join(ROOT, 'img'), path.join(androidAssets, 'img'));
copyDirectory(path.join(ROOT, 'docs', 'images'), path.join(androidAssets, 'docs', 'images'));
writeBrowserCatalog(catalog, path.join(androidAssets, 'js', 'catalog.es5.js'));

console.log('Synced Museum at Home into the Android TV WebView assets.');

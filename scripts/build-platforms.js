'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { ROOT, loadCatalog, validateCatalog, writeBrowserCatalog } = require('./catalog-lib');

const catalog = loadCatalog();
const strictAssets = process.argv.includes('--strict-assets');
const result = validateCatalog(catalog, { strictAssets });

for (const warning of result.warnings) console.warn('WARN:', warning);
if (result.errors.length) {
  for (const error of result.errors) console.error('ERROR:', error);
  process.exit(1);
}

writeBrowserCatalog(catalog, path.join(ROOT, 'js', 'catalog.es5.js'));

function copyFile(relative, targetRoot, targetRelative = relative) {
  const source = path.join(ROOT, relative);
  const target = path.join(targetRoot, targetRelative);
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

function reset(target) {
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(target, { recursive: true });
}

function copyUniversalApp(target) {
  for (const relative of [
    'index.html',
    'manifest.webmanifest',
    'sw.js',
    'css/style.css',
    'js/catalog.es5.js',
    'js/core.es5.js',
    'js/platform.es5.js',
    'js/app.es5.js'
  ]) {
    copyFile(relative, target);
  }
  copyDirectory(path.join(ROOT, 'img'), path.join(target, 'img'));
  copyDirectory(path.join(ROOT, 'docs', 'images'), path.join(target, 'docs', 'images'));
}

const web = path.join(ROOT, 'dist', 'web');
const tizen = path.join(ROOT, 'dist', 'tizen');
const androidAssets = path.join(
  ROOT,
  'art-gallery-android',
  'app',
  'src',
  'main',
  'assets'
);

reset(web);
copyUniversalApp(web);

reset(tizen);
copyUniversalApp(tizen);
copyFile('platforms/tizen/config.xml', tizen, 'config.xml');
copyFile('img/icon512x512.png', tizen, 'icon.png');

reset(androidAssets);
copyDirectory(web, androidAssets);

console.log('Built dist/web (installable PWA/static web app)');
console.log('Built dist/tizen (unsigned Samsung Tizen project)');
console.log('Synced Museum at Home into the Android TV WebView assets');

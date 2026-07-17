'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { ROOT, loadCatalog, validateCatalog, writeBrowserCatalog } = require('./catalog-lib');

const strictAssets = process.argv.includes('--strict-assets');
const requested = process.argv.includes('--720') ? ['1280x720'] :
  process.argv.includes('--1080') ? ['1920x1080'] :
    ['1920x1080', '1280x720'];

function copyFile(relative, targetRoot) {
  const source = path.join(ROOT, relative);
  const target = path.join(targetRoot, relative);
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

const catalog = loadCatalog();
const result = validateCatalog(catalog, { strictAssets });
for (const warning of result.warnings) console.warn('WARN:', warning);
if (result.errors.length) {
  for (const error of result.errors) console.error('ERROR:', error);
  process.exit(1);
}

writeBrowserCatalog(catalog, path.join(ROOT, 'js', 'catalog.es5.js'));
const baseAppInfo = JSON.parse(fs.readFileSync(path.join(ROOT, 'appinfo.json'), 'utf8'));

for (const resolution of requested) {
  const suffix = resolution === '1920x1080' ? '1080' : '720';
  const out = path.join(ROOT, 'dist', 'webos-' + suffix);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  for (const relative of [
    'index.html',
    'manifest.webmanifest',
    'css/style.css',
    'js/catalog.es5.js',
    'js/core.es5.js',
    'js/platform.es5.js',
    'js/app.es5.js'
  ]) {
    copyFile(relative, out);
  }
  copyDirectory(path.join(ROOT, 'img'), path.join(out, 'img'));

  const appInfo = { ...baseAppInfo, resolution };
  fs.writeFileSync(
    path.join(out, 'appinfo.json'),
    JSON.stringify(appInfo, null, 2) + '\n',
    'utf8'
  );
  console.log('Built ' + path.relative(ROOT, out) + ' (' + resolution + ')');
}

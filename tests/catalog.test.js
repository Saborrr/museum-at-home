'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadCatalog, validateCatalog } = require('../scripts/catalog-lib');

const catalog = loadCatalog();

test('every existing record has complete RU/EN display fields, including review-only works', () => {
  const fs = require('node:fs');
  const Core = require('../js/core.es5.js');
  for (const file of ['collection.json', 'russian-collection.json']) {
    const records = JSON.parse(fs.readFileSync(path.join(__dirname, '../data', file), 'utf8')).artworks;
    for (const artwork of records) {
      for (const field of ['title', 'artist', 'museum', 'description', 'year', 'license']) {
        assert.equal(typeof artwork[field], 'string', artwork.id + ': ' + field);
        assert.ok(artwork[field].trim(), artwork.id + ': empty ' + field);
        assert.equal(typeof artwork[field + 'Ru'], 'string', artwork.id + ': ' + field + 'Ru');
        assert.ok(artwork[field + 'Ru'].trim(), artwork.id + ': empty ' + field + 'Ru');
        assert.equal(Core.localize(artwork, field, 'ru'), artwork[field + 'Ru']);
        assert.equal(Core.localize(artwork, field, 'en'), artwork[field]);
        assert.doesNotMatch(artwork[field], /[А-Яа-яЁё]/, artwork.id + ': Cyrillic in English ' + field);
      }
      for (const field of ['titleRu', 'artistRu', 'museumRu', 'descriptionRu']) {
        assert.match(artwork[field], /[А-Яа-яЁё]/, artwork.id + ': missing Russian text in ' + field);
      }
    }
  }
});

test('catalog validation rejects missing localized metadata before packaging', () => {
  const artwork = { ...catalog[0] };
  delete artwork.museumRu;
  assert.ok(validateCatalog([artwork]).errors.includes(artwork.id + ': missing museumRu'));
});

test('commercial catalog excludes disputed Dalí and Magritte records', () => {
  const ids = new Set(catalog.map((artwork) => artwork.id));
  assert.equal(ids.has('wiki-the-persistence-of-memory'), false);
  assert.equal(ids.has('wiki-the-son-of-man'), false);
});

test('catalog contains Russian and world collections', () => {
  assert.equal(catalog.filter((artwork) => artwork.region === 'russian').length, 32);
  assert.equal(catalog.length, 80);
  assert.ok(catalog.filter((artwork) => artwork.region === 'world').length >= 45);
});

test('a review-only reproduction is not shipped commercially', () => {
  const ids = new Set(catalog.map((artwork) => artwork.id));
  assert.equal(ids.has('ru-levitan-golden-autumn'), false);
});

test('every commercial artwork has source, rights and local fallback metadata', () => {
  const result = validateCatalog(catalog, { strictAssets: true });
  assert.deepEqual(result.errors, []);
  for (const artwork of catalog) {
    assert.match(artwork.image, /^img\/paintings\//);
    assert.equal(artwork.commercialUseAllowed, true);
    assert.ok(artwork.sourceUrl.startsWith('https://'));
    assert.ok(artwork.license.length > 8);
  }
});

test('expanded Russian collection keeps all nine artists and distinct autumn paintings', () => {
  const russian = catalog.filter((item) => item.region === 'russian');
  const additions = {
    'Ivan Shishkin': ['rye', 'mast-tree-grove', 'oak-grove', 'forest-distant-views'],
    'Isaac Levitan': ['golden-autumn-slobodka', 'above-eternal-peace', 'march', 'vladimirka'],
    'Ivan Aivazovsky': ['shipwreck-stormy-morning'],
    'Ilya Repin': ['sadko', 'religious-procession-kursk', 'mussorgsky-portrait', 'dragonfly', 'tolstoy-barefoot'],
    'Arkhip Kuindzhi': ['north', 'red-sunset-dnieper'],
    'Alexei Savrasov': ['volga-flood-yaroslavl'],
    'Vasily Polenov': ['moscow-courtyard', 'overgrown-pond', 'golden-autumn'],
    'Viktor Vasnetsov': ['alyonushka', 'flying-carpet'],
    'Valentin Serov': ['ida-rubinstein', 'princess-olga-orlova', 'henrietta-girshman']
  };
  const prefixes = ['shishkin', 'levitan', 'aivazovsky', 'repin', 'kuindzhi', 'savrasov', 'polenov', 'vasnetsov', 'serov'];
  Object.entries(additions).forEach(([artist, suffixes], index) => {
    for (const suffix of suffixes) {
      const id = 'ru-' + prefixes[index] + '-' + suffix;
      const item = russian.find((work) => work.id === id);
      assert.ok(item, id);
      assert.equal(item.artist, artist);
      assert.equal(item.rightsStatus, 'verified');
      assert.equal(item.license, 'Public domain');
    }
  });
  const slobodka = russian.find((item) => item.id === 'ru-levitan-golden-autumn-slobodka');
  assert.equal(slobodka.year, '1889');
  assert.match(slobodka.museum, /Russian Museum/);
  assert.equal(russian.some((item) => item.id === 'ru-levitan-golden-autumn'), false);
});

test('catalog deduplicates identifiers, sources, artwork identity and image bytes', () => {
  const fs = require('node:fs');
  const crypto = require('node:crypto');
  for (const keys of [catalog.map((a) => a.id), catalog.map((a) => decodeURIComponent(a.sourceUrl).replace(/_/g, ' ')), catalog.map((a) => [a.artist, a.title, a.year].join('|')), catalog.map((a) => crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, '..', a.image))).digest('hex'))]) {
    assert.equal(new Set(keys).size, catalog.length);
  }
});

test('Café Terrace ships the colour oil painting F467, not the Dallas drawing F1519', () => {
  const fs = require('node:fs');
  const crypto = require('node:crypto');
  const item = catalog.find((a) => a.id === 'wiki-cafe-terrace-at-night');
  assert.equal(item.year, '1888');
  assert.equal(item.museum, 'Kröller-Müller Museum, Otterlo');
  assert.equal(item.museumRu, 'Музей Крёллер-Мюллер, Оттерло');
  assert.match(decodeURIComponent(item.sourceUrl), /Terrasse_des_Cafés/);
  assert.equal(item.catalogueNumber, 'F467');
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, '..', item.image))).digest('hex'), '693b7b022690269740c477dc689f8e0e88ab30ee15a91783aac7acef6e974530');
  assert.match(item.descriptionRu, /рисунка.*Далласе/);
});

test('Dnieper image is the confirmed 1882 Tretyakov repetition, inventory 15129', () => {
  const item = catalog.find((a) => a.id === 'ru-kuindzhi-moonlit-dnieper');
  assert.ok(item);
  assert.equal(item.titleRu, 'Ночь на Днепре');
  assert.equal(item.year, '1882');
  assert.equal(item.yearRu, '1882');
  assert.equal(item.museum, 'State Tretyakov Gallery, Moscow');
  assert.equal(item.museumRu, 'Государственная Третьяковская галерея, Москва');
  assert.equal(item.accessionNumber, '15129');
  assert.equal(item.identityEvidenceUrl, 'https://my.tretyakov.ru/app/masterpiece/10935');
  assert.match(item.description, /repetition/);
  assert.match(item.descriptionRu, /повторение/);
  assert.doesNotMatch(item.description, /presented this painting alone/);
});

test('platform builds ship exactly the commercially allowed image set', () => {
  const fs = require('node:fs');
  const cp = require('node:child_process');
  const root = path.join(__dirname, '..');
  for (const [script, args] of [['build-webos.js', ['--1080', '--strict-assets']], ['build-platforms.js', ['--strict-assets']], ['build-android-assets.js', []]]) {
    cp.execFileSync(process.execPath, [path.join(root, 'scripts', script), ...args], { cwd: root });
  }
  const expected = catalog.map((a) => path.basename(a.image)).sort();
  for (const output of ['dist/webos-1080', 'dist/web', 'dist/tizen', 'art-gallery-android/app/src/main/assets']) {
    assert.deepEqual(fs.readdirSync(path.join(root, output, 'img/paintings')).sort(), expected, output);
  }
});

test('new Russian stories are detailed in both languages', () => {
  for (const artwork of catalog.filter((item) => item.region === 'russian')) {
    const enWords = artwork.description.trim().split(/\s+/).length;
    const ruWords = artwork.descriptionRu.trim().split(/\s+/).length;
    assert.ok(enWords >= 80, artwork.id + ' English story is too short');
    assert.ok(ruWords >= 80, artwork.id + ' Russian story is too short');
  }
});

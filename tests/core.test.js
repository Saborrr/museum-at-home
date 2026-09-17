'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../js/core.es5.js');

const catalog = [
  { id: 'ru-1', region: 'russian', tags: ['russian', 'landscape'] },
  { id: 'world-1', region: 'world', tags: ['world', 'impressionism'] },
  { id: 'world-2', region: 'world', tags: ['world', 'baroque'] }
];

test('migrates legacy favorite objects and removes unknown ids', () => {
  const value = JSON.stringify([{ id: 'ru-1', imageB64: 'large-old-value' }, { id: 'missing' }]);
  assert.deepEqual(Core.normalizeFavorites(value, catalog), { 'ru-1': true });
});

test('reads v2 favorites and serializes a stable compact value', () => {
  const favorites = Core.normalizeFavorites(
    JSON.stringify({ version: 2, ids: ['world-2', 'ru-1'] }),
    catalog
  );
  assert.equal(
    Core.serializeFavorites(favorites),
    JSON.stringify({ version: 2, ids: ['ru-1', 'world-2'] })
  );
});

test('empty favorites category is a valid empty collection', () => {
  assert.deepEqual(Core.filterCatalog(catalog, 'favorites', {}), []);
  assert.equal(Core.nextIndex(0, -1, 1), -1);
});

test('filters Russian, world and style collections', () => {
  assert.deepEqual(Core.filterCatalog(catalog, 'russian', {}).map((a) => a.id), ['ru-1']);
  assert.deepEqual(
    Core.filterCatalog(catalog, 'world', {}).map((a) => a.id),
    ['world-1', 'world-2']
  );
  assert.deepEqual(
    Core.filterCatalog(catalog, 'style:impressionism', {}).map((a) => a.id),
    ['world-1']
  );
  assert.deepEqual(
    Core.filterCatalog(catalog, 'world', {}, ['impressionism', 'baroque']).map((a) => a.id),
    ['world-1', 'world-2']
  );
  assert.deepEqual(
    Core.filterCatalog(catalog, 'russian', {}, ['landscape', 'baroque']).map((a) => a.id),
    ['ru-1']
  );
});

test('wraps artwork navigation in both directions', () => {
  assert.equal(Core.nextIndex(3, 2, 1), 0);
  assert.equal(Core.nextIndex(3, 0, -1), 2);
});

test('selects the next artwork that has not failed and terminates when all failed', () => {
  const artworks = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  assert.equal(Core.nextAvailableIndex(artworks, 0, 1, { b: true }), 2);
  assert.equal(Core.nextAvailableIndex(artworks, 2, 1, { a: true, b: true, c: true }), -1);
});

test('spatial navigation follows rendered geometry', () => {
  const rects = [
    { left: 0, top: 0, width: 100, height: 40 },
    { left: 120, top: 0, width: 100, height: 40 },
    { left: 0, top: 100, width: 40, height: 40 },
    { left: 60, top: 100, width: 40, height: 40 }
  ];
  assert.equal(Core.spatialIndex(rects, 1, 0, 1), 3);
  assert.equal(Core.spatialIndex(rects, 3, 0, -1), 0);
  assert.equal(Core.spatialIndex(rects, 2, 1, 0), 3);
});

test('spatial navigation stays at true horizontal row boundaries', () => {
  const rects = [
    { left: 0, top: 0, width: 100, height: 40 }, // All collections
    { left: 360, top: 0, width: 100, height: 40 }, // Favorites
    { left: -20, top: 200, width: 80, height: 40 }, // 30 sec
    { left: 440, top: 200, width: 100, height: 40 } // Always
  ];
  assert.equal(Core.spatialIndex(rects, 0, -1, 0), 0);
  assert.equal(Core.spatialIndex(rects, 1, 1, 0), 1);
});

test('horizontal navigation stays in the rendered style row above settings', () => {
  // Measured from the real 1280x577 menu. Lower settings are diagonally closer
  // than adjacent 266px style buttons and must not steal horizontal movement.
  const rects = [
    { left: 84, top: 240.42, width: 266, height: 44 }, // Romanticism
    { left: 357, top: 240.42, width: 266, height: 44 }, // Realism
    { left: 630, top: 240.42, width: 266, height: 44 }, // Modern art
    { left: 903, top: 240.42, width: 266, height: 44 }, // Portrait
    { left: 256, top: 383.42, width: 80, height: 43 }, // 1 min
    { left: 365.70, top: 383.42, width: 80, height: 43 }, // Gentle
    { left: 819.42, top: 383.42, width: 80, height: 43 } // English
  ];

  assert.equal(Core.spatialIndex(rects, 0, 1, 0), 1, 'Romanticism Right selects Realism');
  assert.equal(Core.spatialIndex(rects, 1, -1, 0), 0, 'Realism Left selects Romanticism');
  assert.equal(Core.spatialIndex(rects, 3, -1, 0), 2, 'Portrait Left selects Modern art');
});

test('vertical navigation prefers projection overlap before a bounded cone fallback', () => {
  const rects = [
    { left: 100, top: 0, width: 100, height: 40 },
    { left: 190, top: 180, width: 80, height: 40 }, // overlaps by 10px
    { left: 210, top: 90, width: 80, height: 40 }, // nearer, but outside projection
    { left: 500, top: 80, width: 80, height: 40 } // outside the directional cone
  ];
  assert.equal(Core.spatialIndex(rects, 0, 0, 1), 1);

  const withoutOverlap = [rects[0], rects[2], rects[3]];
  assert.equal(Core.spatialIndex(withoutOverlap, 0, 0, 1), 1);
});

test('normalizes invalid persisted settings', () => {
  assert.deepEqual(Core.normalizeSettings({
    interval: 999,
    category: 42,
    language: 'de',
    motion: 'fast',
    showClock: 'yes'
  }), Core.DEFAULT_SETTINGS);
});

test('supports long intervals, pause and clock preferences', () => {
  const settings = Core.normalizeSettings({ interval: 1800, paused: true, showClock: false });
  assert.equal(settings.interval, 1800);
  assert.equal(settings.paused, true);
  assert.equal(settings.showClock, false);
});

test('migrates a legacy single-style selection and normalizes multiple styles', () => {
  assert.deepEqual(Core.normalizeSettings({ category: 'style:realism' }).styles, ['realism']);
  assert.equal(Core.normalizeSettings({ category: 'style:realism' }).category, 'all');
  assert.deepEqual(
    Core.normalizeSettings({ styles: ['portrait', 'portrait', 'unknown', 'baroque'] }).styles,
    ['portrait', 'baroque']
  );
});

test('localizes only when translated content exists', () => {
  const artwork = { title: 'Golden Autumn', titleRu: 'Золотая осень' };
  assert.equal(Core.localize(artwork, 'title', 'ru'), 'Золотая осень');
  assert.equal(Core.localize(artwork, 'title', 'en'), 'Golden Autumn');
});

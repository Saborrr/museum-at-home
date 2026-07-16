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
});

test('wraps artwork navigation in both directions', () => {
  assert.equal(Core.nextIndex(3, 2, 1), 0);
  assert.equal(Core.nextIndex(3, 0, -1), 2);
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

test('localizes only when translated content exists', () => {
  const artwork = { title: 'Golden Autumn', titleRu: 'Золотая осень' };
  assert.equal(Core.localize(artwork, 'title', 'ru'), 'Золотая осень');
  assert.equal(Core.localize(artwork, 'title', 'en'), 'Golden Autumn');
});

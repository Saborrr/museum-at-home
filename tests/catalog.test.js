'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadCatalog, validateCatalog } = require('../scripts/catalog-lib');

const catalog = loadCatalog();

test('commercial catalog excludes disputed Dalí and Magritte records', () => {
  const ids = new Set(catalog.map((artwork) => artwork.id));
  assert.equal(ids.has('wiki-the-persistence-of-memory'), false);
  assert.equal(ids.has('wiki-the-son-of-man'), false);
});

test('catalog contains Russian and world collections', () => {
  assert.equal(catalog.filter((artwork) => artwork.region === 'russian').length, 7);
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

test('new Russian stories are detailed in both languages', () => {
  for (const artwork of catalog.filter((item) => item.region === 'russian')) {
    const enWords = artwork.description.trim().split(/\s+/).length;
    const ruWords = artwork.descriptionRu.trim().split(/\s+/).length;
    assert.ok(enWords >= 80, artwork.id + ' English story is too short');
    assert.ok(ruWords >= 80, artwork.id + ' Russian story is too short');
  }
});

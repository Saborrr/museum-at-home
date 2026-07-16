'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const WORLD_FILE = path.join(ROOT, 'data', 'collection.json');
const RUSSIAN_FILE = path.join(ROOT, 'data', 'russian-collection.json');
const BLOCKED_IDS = new Set([
  'wiki-the-persistence-of-memory',
  'wiki-the-son-of-man'
]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function sourcePage(artwork) {
  if (artwork.sourceUrl) return artwork.sourceUrl;
  if (artwork.source === 'met' && artwork.id.indexOf('met-') === 0) {
    return 'https://www.metmuseum.org/art/collection/search/' + artwork.id.substring(4);
  }
  if (artwork.source === 'wikimedia' && /^https:\/\/upload\.wikimedia\.org\//.test(artwork.image || '')) {
    const filename = (artwork.image.split('/').pop() || '').replace(/^\d+px-/, '');
    return 'https://commons.wikimedia.org/wiki/File:' + filename;
  }
  return artwork.image || '';
}

function normalizedTags(artwork, region) {
  const tags = new Set(Array.isArray(artwork.tags) ? artwork.tags : []);
  tags.add(region);
  if (tags.has('romanticism')) tags.add('romantic');
  if (tags.has('romantic')) tags.add('romanticism');
  return Array.from(tags);
}

function normalizeWorld(artwork) {
  const copy = { ...artwork };
  copy.region = 'world';
  copy.image = 'img/paintings/' + artwork.id + '.jpg';
  copy.sourceUrl = sourcePage(artwork);
  copy.license = artwork.license || (
    artwork.source === 'met'
      ? 'CC0 — The Metropolitan Museum of Art Open Access'
      : 'Public domain — Wikimedia Commons file page'
  );
  copy.commercialUseAllowed = artwork.commercialUseAllowed === true;
  copy.tags = normalizedTags(copy, 'world');
  delete copy.thumb;
  delete copy.quality;
  return copy;
}

function normalizeRussian(artwork) {
  const copy = { ...artwork };
  copy.region = 'russian';
  copy.tags = normalizedTags(copy, 'russian');
  return copy;
}

function loadCatalog() {
  const world = readJson(WORLD_FILE).artworks
    .filter((artwork) => !BLOCKED_IDS.has(artwork.id))
    .map(normalizeWorld);
  const russian = readJson(RUSSIAN_FILE).artworks.map(normalizeRussian);
  return world.concat(russian).filter((artwork) => artwork.commercialUseAllowed === true);
}

function wordCount(value) {
  return String(value || '').trim().split(/\s+/).filter(Boolean).length;
}

function jpegDimensions(file) {
  const buffer = fs.readFileSync(file);
  let offset = 2;
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const size = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7)
      };
    }
    if (size < 2) break;
    offset += 2 + size;
  }
  return null;
}

function validateCatalog(catalog, options = {}) {
  const errors = [];
  const warnings = [];
  const ids = new Set();

  for (const artwork of catalog) {
    if (!artwork.id || ids.has(artwork.id)) {
      errors.push('Duplicate or missing id: ' + artwork.id);
    }
    ids.add(artwork.id);

    for (const field of ['title', 'artist', 'year', 'image', 'description', 'descriptionRu']) {
      if (!artwork[field]) errors.push(artwork.id + ': missing ' + field);
    }
    if (!artwork.sourceUrl) errors.push(artwork.id + ': missing sourceUrl');
    if (!artwork.license) errors.push(artwork.id + ': missing license');
    if (artwork.commercialUseAllowed !== true) {
      errors.push(artwork.id + ': commercialUseAllowed must be true');
    }
    if (!Array.isArray(artwork.tags) || artwork.tags.length < 2) {
      errors.push(artwork.id + ': at least two category tags are required');
    }

    const minimum = artwork.region === 'russian' ? 80 : 35;
    if (wordCount(artwork.description) < minimum) {
      warnings.push(artwork.id + ': English description is shorter than ' + minimum + ' words');
    }
    if (wordCount(artwork.descriptionRu) < minimum) {
      warnings.push(artwork.id + ': Russian description is shorter than ' + minimum + ' words');
    }

    if (options.strictAssets && artwork.image.indexOf('img/') === 0) {
      const imageFile = path.join(ROOT, artwork.image);
      if (!fs.existsSync(imageFile)) {
        errors.push(artwork.id + ': missing local fallback ' + artwork.image);
      } else if (fs.statSync(imageFile).size > 5 * 1024 * 1024) {
        errors.push(artwork.id + ': image exceeds 5 MB');
      } else if (artwork.region === 'russian') {
        const dimensions = jpegDimensions(imageFile);
        if (!dimensions || Math.max(dimensions.width, dimensions.height) < 1900) {
          errors.push(artwork.id + ': Russian collection fallback must be at least 1900 px');
        }
      }
    }
  }

  if (catalog.some((artwork) => BLOCKED_IDS.has(artwork.id))) {
    errors.push('Commercial catalog contains a blocked artwork');
  }

  return { errors, warnings };
}

function writeBrowserCatalog(catalog, target) {
  const body = [
    '"use strict";',
    '',
    'window.MUSEUM_CATALOG = ' + JSON.stringify(catalog, null, 2) + ';',
    ''
  ].join('\n');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body, 'utf8');
}

module.exports = {
  ROOT,
  loadCatalog,
  validateCatalog,
  writeBrowserCatalog
};

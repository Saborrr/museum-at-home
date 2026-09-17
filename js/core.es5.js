(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.MuseumCore = api;
}(this, function () {
  'use strict';

  var DEFAULT_SETTINGS = {
    interval: 30,
    category: 'all',
    styles: [],
    language: 'auto',
    showClock: true,
    paused: false,
    motion: 'gentle',
    chrome: 'auto'
  };

  function cloneObject(source) {
    var result = {};
    var key;
    source = source || {};
    for (key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        result[key] = source[key];
      }
    }
    return result;
  }

  function normalizeSettings(value) {
    var input = value && typeof value === 'object' ? value : {};
    var result = cloneObject(DEFAULT_SETTINGS);
    var allowedIntervals = [15, 30, 60, 120, 300, 900, 1800];
    var allowedLanguages = ['auto', 'ru', 'en'];
    var allowedMotion = ['off', 'gentle'];
    var allowedChrome = ['auto', 'always'];
    var allowedCategories = ['all', 'russian', 'world', 'favorites'];
    var allowedStyles = [
      'landscape', 'impressionism', 'renaissance', 'baroque',
      'romantic', 'realism', 'modern', 'portrait'
    ];
    var legacyStyle = '';

    result.styles = [];

    if (allowedIntervals.indexOf(Number(input.interval)) !== -1) {
      result.interval = Number(input.interval);
    }
    if (allowedCategories.indexOf(input.category) !== -1) {
      result.category = input.category;
    } else if (typeof input.category === 'string' && input.category.indexOf('style:') === 0) {
      legacyStyle = input.category.substring(6);
      if (allowedStyles.indexOf(legacyStyle) !== -1) {
        result.category = 'all';
        result.styles.push(legacyStyle);
      }
    }
    if (Array.isArray(input.styles)) {
      input.styles.forEach(function (style) {
        if (allowedStyles.indexOf(style) !== -1 && result.styles.indexOf(style) === -1) {
          result.styles.push(style);
        }
      });
    }
    if (allowedLanguages.indexOf(input.language) !== -1) {
      result.language = input.language;
    }
    if (allowedMotion.indexOf(input.motion) !== -1) {
      result.motion = input.motion;
    }
    if (allowedChrome.indexOf(input.chrome) !== -1) {
      result.chrome = input.chrome;
    }
    if (typeof input.showClock === 'boolean') {
      result.showClock = input.showClock;
    }
    if (typeof input.paused === 'boolean') {
      result.paused = input.paused;
    }
    return result;
  }

  function buildValidIdMap(catalog) {
    var valid = {};
    var i;
    for (i = 0; i < catalog.length; i += 1) {
      valid[catalog[i].id] = true;
    }
    return valid;
  }

  function normalizeFavorites(rawValue, catalog) {
    var valid = buildValidIdMap(catalog || []);
    var parsed = rawValue;
    var result = {};
    var items;
    var i;
    var id;

    if (typeof rawValue === 'string') {
      try {
        parsed = JSON.parse(rawValue);
      } catch (ignore) {
        parsed = [];
      }
    }

    if (parsed && parsed.version === 2 && Array.isArray(parsed.ids)) {
      items = parsed.ids;
    } else if (Array.isArray(parsed)) {
      items = parsed;
    } else {
      items = [];
    }

    for (i = 0; i < items.length; i += 1) {
      id = typeof items[i] === 'string' ? items[i] : items[i] && items[i].id;
      if (id && valid[id]) {
        result[id] = true;
      }
    }
    return result;
  }

  function serializeFavorites(favoriteMap) {
    var ids = [];
    var id;
    for (id in favoriteMap) {
      if (Object.prototype.hasOwnProperty.call(favoriteMap, id) && favoriteMap[id]) {
        ids.push(id);
      }
    }
    ids.sort();
    return JSON.stringify({ version: 2, ids: ids });
  }

  function toggleFavorite(favoriteMap, id) {
    if (favoriteMap[id]) {
      delete favoriteMap[id];
      return false;
    }
    favoriteMap[id] = true;
    return true;
  }

  function hasTag(artwork, tag) {
    return Array.isArray(artwork.tags) && artwork.tags.indexOf(tag) !== -1;
  }

  function filterCatalog(catalog, category, favorites, styles) {
    var result = [];
    var i;
    var artwork;
    var activeStyles = Array.isArray(styles) ? styles.slice(0) : [];
    var baseMatch;
    var styleMatch;
    var j;
    category = category || 'all';
    favorites = favorites || {};

    if (category.indexOf('style:') === 0) {
      activeStyles.push(category.substring(6));
      category = 'all';
    }

    for (i = 0; i < catalog.length; i += 1) {
      artwork = catalog[i];
      baseMatch = category === 'all' ||
        (category === 'russian' && artwork.region === 'russian') ||
        (category === 'world' && artwork.region !== 'russian') ||
        (category === 'favorites' && favorites[artwork.id]);
      styleMatch = activeStyles.length === 0;
      for (j = 0; j < activeStyles.length && !styleMatch; j += 1) {
        if (hasTag(artwork, activeStyles[j])) {
          styleMatch = true;
        }
      }
      if (baseMatch && styleMatch) {
        result.push(artwork);
      }
    }
    return result;
  }

  function nextIndex(length, current, delta) {
    var value;
    if (!length || length < 1) {
      return -1;
    }
    value = (current + delta) % length;
    return value < 0 ? value + length : value;
  }

  function nextAvailableIndex(artworks, current, delta, failures) {
    var length = artworks ? artworks.length : 0;
    var attempts;
    var candidate = current;
    failures = failures || {};
    for (attempts = 0; attempts < length; attempts += 1) {
      candidate = nextIndex(length, candidate, delta);
      if (candidate !== -1 && !failures[artworks[candidate].id]) {
        return candidate;
      }
    }
    return -1;
  }

  function spatialIndex(rects, currentIndex, dx, dy) {
    var current = rects[currentIndex];
    var currentX;
    var currentY;
    var best = currentIndex;
    var bestScore = Infinity;
    var bestOverlaps = false;
    var i;
    var candidate;
    var x;
    var y;
    var primary;
    var cross;
    var projectionOverlaps;
    var score;
    if (!current) {
      return currentIndex;
    }
    currentX = current.left + current.width / 2;
    currentY = current.top + current.height / 2;
    for (i = 0; i < rects.length; i += 1) {
      if (i === currentIndex) {
        continue;
      }
      candidate = rects[i];
      x = candidate.left + candidate.width / 2 - currentX;
      y = candidate.top + candidate.height / 2 - currentY;
      if ((dx > 0 && x <= 0) || (dx < 0 && x >= 0) ||
          (dy > 0 && y <= 0) || (dy < 0 && y >= 0)) {
        continue;
      }
      primary = dx ? Math.abs(x) : Math.abs(y);
      cross = dx ? Math.abs(y) : Math.abs(x);
      projectionOverlaps = dx ?
        candidate.top < current.top + current.height && candidate.top + candidate.height > current.top :
        candidate.left < current.left + current.width && candidate.left + candidate.width > current.left;
      if (dx && !projectionOverlaps) {
        continue;
      }
      if (dy && !projectionOverlaps && cross > primary * 2) {
        continue;
      }
      score = primary * primary + cross * cross;
      if ((projectionOverlaps && !bestOverlaps) ||
          (projectionOverlaps === bestOverlaps && score < bestScore)) {
        bestOverlaps = projectionOverlaps;
        bestScore = score;
        best = i;
      }
    }
    return best;
  }

  function preferredLanguage(setting, browserLanguage) {
    if (setting === 'ru' || setting === 'en') {
      return setting;
    }
    return String(browserLanguage || '').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
  }

  function localize(artwork, field, language) {
    var localized = field + 'Ru';
    if (language === 'ru' && artwork[localized]) {
      return artwork[localized];
    }
    return artwork[field] || '';
  }

  return {
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,
    normalizeSettings: normalizeSettings,
    normalizeFavorites: normalizeFavorites,
    serializeFavorites: serializeFavorites,
    toggleFavorite: toggleFavorite,
    filterCatalog: filterCatalog,
    nextIndex: nextIndex,
    nextAvailableIndex: nextAvailableIndex,
    spatialIndex: spatialIndex,
    preferredLanguage: preferredLanguage,
    localize: localize
  };
}));

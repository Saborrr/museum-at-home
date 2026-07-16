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
    language: 'auto',
    showClock: true,
    motion: 'gentle'
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
    var allowedIntervals = [15, 30, 60, 120, 300];
    var allowedLanguages = ['auto', 'ru', 'en'];
    var allowedMotion = ['off', 'gentle'];

    if (allowedIntervals.indexOf(Number(input.interval)) !== -1) {
      result.interval = Number(input.interval);
    }
    if (typeof input.category === 'string' && input.category.length < 80) {
      result.category = input.category;
    }
    if (allowedLanguages.indexOf(input.language) !== -1) {
      result.language = input.language;
    }
    if (allowedMotion.indexOf(input.motion) !== -1) {
      result.motion = input.motion;
    }
    if (typeof input.showClock === 'boolean') {
      result.showClock = input.showClock;
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

  function filterCatalog(catalog, category, favorites) {
    var result = [];
    var i;
    var artwork;
    var style;
    category = category || 'all';
    favorites = favorites || {};

    for (i = 0; i < catalog.length; i += 1) {
      artwork = catalog[i];
      if (category === 'all') {
        result.push(artwork);
      } else if (category === 'russian' && artwork.region === 'russian') {
        result.push(artwork);
      } else if (category === 'world' && artwork.region !== 'russian') {
        result.push(artwork);
      } else if (category === 'favorites' && favorites[artwork.id]) {
        result.push(artwork);
      } else if (category.indexOf('style:') === 0) {
        style = category.substring(6);
        if (hasTag(artwork, style)) {
          result.push(artwork);
        }
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
    preferredLanguage: preferredLanguage,
    localize: localize
  };
}));

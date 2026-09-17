'use strict';

var VERSION = 'v3';
var CACHE_PREFIX = 'museum-at-home-';
var SHELL_CACHE = CACHE_PREFIX + 'shell-' + VERSION;
var ARTWORK_CACHE = CACHE_PREFIX + 'artwork-' + VERSION;
var MAX_ARTWORKS = 40;
var SHELL = [
  './',
  './index.html',
  './css/style.css',
  './js/catalog.es5.js',
  './js/core.es5.js',
  './js/platform.es5.js',
  './js/app.es5.js',
  './manifest.webmanifest',
  './img/icon192x192.png',
  './img/icon512x512.png'
];

function trimArtworkCache(cache) {
  return cache.keys().then(function (keys) {
    var excess = keys.length - MAX_ARTWORKS;
    var removals = [];
    var i;
    for (i = 0; i < excess; i += 1) {
      removals.push(cache.delete(keys[i]));
    }
    return Promise.all(removals);
  });
}

function cacheArtwork(request, response) {
  if (!response || !response.ok || response.type === 'opaque') {
    return response;
  }
  return caches.open(ARTWORK_CACHE).then(function (cache) {
    return cache.put(request, response.clone()).then(function () {
      return trimArtworkCache(cache);
    });
  }).then(function () {
    return response;
  }, function () {
    return response;
  });
}

function navigationResponse(request) {
  var requestUrl = new URL(request.url);
  var isShellUrl = requestUrl.pathname === '/' || requestUrl.pathname === '/index.html' || requestUrl.pathname.slice(-1) === '/';
  return fetch(request).then(function (response) {
    if (response && response.ok && isShellUrl) {
      return caches.open(SHELL_CACHE).then(function (cache) {
        return cache.put('./index.html', response.clone());
      }).then(function () {
        return response;
      }, function () {
        return response;
      });
    }
    return response;
  }).catch(function () {
    return caches.match('./index.html', { cacheName: SHELL_CACHE });
  });
}

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(SHELL_CACHE).then(function (cache) {
    return cache.addAll(SHELL);
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (key) {
      if (key.indexOf(CACHE_PREFIX) === 0 && key !== SHELL_CACHE && key !== ARTWORK_CACHE) {
        return caches.delete(key);
      }
      return null;
    }));
  }).then(function () {
    return self.clients.claim();
  }));
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url;
  if (request.method !== 'GET') {
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(navigationResponse(request));
    return;
  }
  url = new URL(request.url);
  if (url.origin === self.location.origin && url.pathname.indexOf('/img/paintings/') !== -1) {
    event.respondWith(caches.open(ARTWORK_CACHE).then(function (cache) {
      return cache.match(request).then(function (cached) {
        return cached || fetch(request).then(function (response) {
          return cacheArtwork(request, response);
        });
      });
    }).catch(function () {
      // Storage unavailable: still serve the artwork straight from the network.
      return fetch(request);
    }));
    return;
  }
  event.respondWith(caches.open(SHELL_CACHE).then(function (cache) {
    return cache.match(request).then(function (cached) {
      return cached || fetch(request);
    });
  }).catch(function () {
    // Storage unavailable: serve the subresource straight from the network.
    return fetch(request);
  }));
});

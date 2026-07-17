(function () {
  'use strict';

  function addPlatformClass() {
    var userAgent = String(navigator.userAgent || '').toLowerCase();
    var platform = 'browser';
    if (typeof window.tizen !== 'undefined' || userAgent.indexOf('tizen') !== -1) {
      platform = 'tizen';
    } else if (userAgent.indexOf('web0s') !== -1 || userAgent.indexOf('webos') !== -1) {
      platform = 'webos';
    } else if (userAgent.indexOf('android') !== -1) {
      platform = 'android';
    }
    document.documentElement.className += ' platform-' + platform;
    window.MUSEUM_PLATFORM = platform;
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator &&
        (location.protocol === 'https:' || location.hostname === 'localhost')) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () {
          // Packaged TV applications already contain every required asset.
        });
      });
    }
  }

  function registerTizenRemoteKeys() {
    var keys = ['ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue'];
    var i;
    if (typeof window.tizen === 'undefined' ||
        !window.tizen.tvinputdevice ||
        !window.tizen.tvinputdevice.registerKey) {
      return;
    }
    for (i = 0; i < keys.length; i += 1) {
      try {
        window.tizen.tvinputdevice.registerKey(keys[i]);
      } catch (ignore) {
        // Direction, Enter and Return keys still work without extra registration.
      }
    }
  }

  addPlatformClass();
  registerTizenRemoteKeys();
  registerServiceWorker();
}());

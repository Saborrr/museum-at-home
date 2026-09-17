'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function loadApp() {
  const document = {
    activeElement: null,
    body: { focus() { document.activeElement = this; } },
    addEventListener() {},
    getElementById() { return null; },
    querySelectorAll() { return []; }
  };
  const sandbox = {
    document,
    window: {},
    navigator: {},
    history: {},
    localStorage: {},
    MuseumCore: require('../js/core.es5.js'),
    Image: function () {},
    setTimeout() { return 1; },
    clearTimeout() {},
    setInterval() { return 1; },
    clearInterval() {}
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  let source = fs.readFileSync(path.join(root, 'js/app.es5.js'), 'utf8');
  source = source.replace(/\}\(\)\);\s*$/, 'globalThis.__MuseumApp = App;\n}());');
  vm.runInNewContext(source, sandbox, { filename: 'js/app.es5.js' });
  return { App: sandbox.__MuseumApp, document, sandbox };
}

function keyEvent(code, shiftKey) {
  return {
    keyCode: code,
    shiftKey: Boolean(shiftKey),
    prevented: false,
    stopped: false,
    preventDefault() { this.prevented = true; },
    stopPropagation() { this.stopped = true; }
  };
}

function focusable(document, name) {
  return {
    name,
    classList: { toggle() {}, remove() {} },
    focus() { document.activeElement = this; }
  };
}

function classList(initial) {
  const values = new Set(initial || []);
  return {
    add(value) { values.add(value); },
    remove(value) { values.delete(value); },
    contains(value) { return values.has(value); },
    toggle(value, force) {
      if (force === undefined ? !values.has(value) : force) values.add(value);
      else values.delete(value);
    }
  };
}

test('Tab and Shift+Tab stay trapped in menu and restore prior focus', () => {
  const { App, document } = loadApp();
  const prior = focusable(document, 'prior');
  const first = focusable(document, 'first');
  const last = focusable(document, 'last');
  const tab = keyEvent(9, false);
  const shiftTab = keyEvent(9, true);

  App.settings = { chrome: 'always', paused: true };
  App.artworks = [];
  App.menuOpen = true;
  App.detailsOpen = false;
  App.previousFocus = prior;
  App.focusables = [first, last];
  App.focusIndex = 1;
  App.el = {
    loading: { classList: { contains() { return false; } } },
    menu: { classList: { remove() {} }, setAttribute() {} }
  };
  App.showChrome = function () {};

  App.handleKey(tab);
  assert.equal(document.activeElement, first);
  assert.equal(App.focusIndex, 0);
  assert.equal(tab.prevented, true);

  App.handleKey(shiftTab);
  assert.equal(document.activeElement, last);
  assert.equal(App.focusIndex, 1);
  assert.equal(shiftTab.prevented, true);

  App.closeMenu();
  assert.equal(document.activeElement, prior);
});

test('Tab and Shift+Tab stay trapped in details and restore prior focus', () => {
  const { App, document } = loadApp();
  const prior = focusable(document, 'prior');
  const details = focusable(document, 'details');
  const tab = keyEvent(9, false);
  const shiftTab = keyEvent(9, true);

  App.settings = { chrome: 'always', paused: true };
  App.artworks = [];
  App.menuOpen = false;
  App.detailsOpen = true;
  App.previousFocus = prior;
  App.el = {
    loading: { classList: { contains() { return false; } } },
    details,
    detailsScroll: { scrollTop: 0 }
  };
  details.classList = { remove() {} };
  details.setAttribute = function () {};
  App.showChrome = function () {};

  App.handleKey(tab);
  assert.equal(document.activeElement, details);
  assert.equal(tab.prevented, true);

  App.handleKey(shiftTab);
  assert.equal(document.activeElement, details);
  assert.equal(shiftTab.prevented, true);

  App.closeDetails();
  assert.equal(document.activeElement, prior);
});

test('details dialog consumes Left and Right without moving or closing', () => {
  const { App } = loadApp();
  const left = keyEvent(37);
  const right = keyEvent(39);
  const detailsScroll = { scrollTop: 80 };

  App.settings = { chrome: 'always', paused: true };
  App.menuOpen = false;
  App.detailsOpen = true;
  App.el = {
    loading: { classList: classList() },
    details: { focus() {} },
    detailsScroll
  };
  App.showChrome = function () {};

  App.handleKey(left);
  App.handleKey(right);

  assert.equal(left.prevented, true);
  assert.equal(left.stopped, true);
  assert.equal(right.prevented, true);
  assert.equal(right.stopped, true);
  assert.equal(detailsScroll.scrollTop, 80);
  assert.equal(App.detailsOpen, true);
});

test('retry moves focus before hiding the retry button or completing the image load', () => {
  const { App, document } = loadApp();
  const retry = focusable(document, 'retry');
  retry.classList = classList();
  const oldLayer = { classList: classList(['active']), removeAttribute() {} };
  const nextLayer = { classList: classList(), removeAttribute() {} };

  App.artworks = [{ id: 'art-1', image: 'img/paintings/art-1.jpg', title: 'Art', artist: 'Artist', year: '1900' }];
  App.index = 0;
  App.activeLayer = 0;
  App.settings = { motion: 'off', paused: true, chrome: 'always' };
  App.language = 'en';
  App.favorites = {};
  App.detailsOpen = false;
  App.el = {
    layerA: oldLayer,
    layerB: nextLayer,
    title: {}, artist: {}, meta: {},
    favoriteButton: { classList: classList(), setAttribute() {} },
    favoriteLabel: {},
    loading: { classList: classList(['is-error']) },
    loadingText: {},
    loadingRetry: retry
  };
  App.showChrome = function () {};
  App.preloadUpcoming = function () {};
  document.activeElement = retry;

  App.retryImages();

  assert.notEqual(document.activeElement, retry);
  assert.equal(document.activeElement, document.body);
  assert.equal(retry.classList.contains('hidden'), true);

  nextLayer.onload();
  assert.equal(document.activeElement, document.body);
});

test('terminal image failure waits for an open menu to close', () => {
  const { App, document } = loadApp();
  const menuFocus = focusable(document, 'menu choice');
  const retry = focusable(document, 'retry');
  retry.classList = classList(['hidden']);
  const loading = { classList: classList(['hidden']) };

  App.settings = { chrome: 'always', paused: true };
  App.artworks = [];
  App.menuOpen = true;
  App.detailsOpen = false;
  App.previousFocus = document.body;
  App.focusables = [menuFocus];
  App.el = {
    loading,
    loadingText: {},
    loadingRetry: retry,
    menu: { classList: classList(['open']), setAttribute() {} }
  };
  App.stopSlideshow = function () {};
  App.showChrome = function () {};
  document.activeElement = menuFocus;

  App.showLoadError();

  assert.equal(document.activeElement, menuFocus);
  assert.equal(loading.classList.contains('is-error'), false);
  assert.equal(App.pendingLoadError, true);

  App.closeMenu();

  assert.equal(App.pendingLoadError, false);
  assert.equal(loading.classList.contains('is-error'), true);
  assert.equal(document.activeElement, retry);
});

test('terminal image failure waits for open artwork details to close', () => {
  const { App, document } = loadApp();
  const details = focusable(document, 'details');
  const retry = focusable(document, 'retry');
  retry.classList = classList(['hidden']);
  const loading = { classList: classList(['hidden']) };

  App.settings = { chrome: 'always', paused: true };
  App.artworks = [];
  App.menuOpen = false;
  App.detailsOpen = true;
  App.previousFocus = document.body;
  App.el = {
    details,
    loading,
    loadingText: {},
    loadingRetry: retry
  };
  details.classList = classList(['open']);
  details.setAttribute = function () {};
  App.stopSlideshow = function () {};
  App.showChrome = function () {};
  document.activeElement = details;

  App.showLoadError();

  assert.equal(document.activeElement, details);
  assert.equal(loading.classList.contains('is-error'), false);
  assert.equal(App.pendingLoadError, true);

  App.closeDetails();

  assert.equal(App.pendingLoadError, false);
  assert.equal(loading.classList.contains('is-error'), true);
  assert.equal(document.activeElement, retry);
});

test('menu Enter takes precedence over an existing load-error retry', () => {
  const { App } = loadApp();
  const event = keyEvent(13);
  let activations = 0;
  let retries = 0;

  App.settings = { chrome: 'always', paused: true };
  App.menuOpen = true;
  App.detailsOpen = false;
  App.focusables = [{}];
  App.focusIndex = 0;
  App.el = { loading: { classList: classList(['is-error']) } };
  App.showChrome = function () {};
  App.activateFocus = function () { activations += 1; };
  App.retryImages = function () { retries += 1; };

  App.handleKey(event);

  assert.equal(activations, 1);
  assert.equal(retries, 0);
  assert.equal(event.prevented, true);
});

test('a successful load clears a deferred load error before the menu closes', () => {
  const { App, document } = loadApp();
  const menuFocus = focusable(document, 'menu choice');
  const retry = focusable(document, 'retry');
  retry.classList = classList(['hidden']);
  const loading = { classList: classList(['hidden']) };
  const layerA = { classList: classList(['active']), removeAttribute() {} };
  const layerB = { classList: classList(), removeAttribute() {} };

  App.settings = { chrome: 'always', paused: true, motion: 'off', interval: 30 };
  App.language = 'en';
  App.favorites = {};
  App.artworks = [{ id: 'art-1', image: 'img/paintings/art-1.jpg', title: 'Art', artist: 'Artist', year: '1900' }];
  App.index = 0;
  App.activeLayer = 0;
  App.menuOpen = true;
  App.detailsOpen = false;
  App.previousFocus = document.body;
  App.focusables = [menuFocus];
  App.el = {
    layerA,
    layerB,
    title: {},
    artist: {},
    meta: {},
    favoriteButton: { classList: classList(), setAttribute() {} },
    favoriteLabel: {},
    loading,
    loadingText: {},
    loadingRetry: retry,
    menu: { classList: classList(['open']), setAttribute() {}, querySelectorAll() { return []; }, querySelector() { return null; } }
  };
  App.showChrome = function () {};
  App.preloadUpcoming = function () {};
  App.stopSlideshow = function () {};
  App.restartSlideshow = function () {};
  document.activeElement = menuFocus;

  App.showLoadError();
  assert.equal(App.pendingLoadError, true);

  App.showCurrent(false);
  layerB.onload();

  assert.equal(App.pendingLoadError, false);

  App.closeMenu();

  assert.equal(loading.classList.contains('is-error'), false);
  assert.equal(retry.classList.contains('hidden'), true);
});

test('every OK key variant retries instead of opening the menu behind the load error', () => {
  const { App } = loadApp();
  let retries = 0;
  let menuOpens = 0;

  App.settings = { chrome: 'always', paused: true };
  App.menuOpen = false;
  App.detailsOpen = false;
  App.el = { loading: { classList: classList(['is-error']) } };
  App.showChrome = function () {};
  App.retryImages = function () { retries += 1; };
  App.openMenu = function () { menuOpens += 1; };

  for (const code of [13, 404, 406]) {
    const event = keyEvent(code);
    App.handleKey(event);
    assert.equal(event.prevented, true, 'keyCode ' + code);
  }

  assert.equal(retries, 3);
  assert.equal(menuOpens, 0);
});

test('an empty collection clears a deferred load error instead of reporting a false failure', () => {
  const { App, document } = loadApp();
  const menuFocus = focusable(document, 'menu choice');
  const retry = focusable(document, 'retry');
  retry.classList = classList(['hidden']);
  const loading = { classList: classList(['hidden']) };
  const empty = { classList: classList(['hidden']) };
  const info = { classList: classList() };

  App.settings = { chrome: 'always', paused: true, motion: 'off', interval: 30, styles: [] };
  App.language = 'en';
  App.favorites = {};
  App.catalog = [{ id: 'a', title: 'A', image: 'img/paintings/a.jpg', tags: ['landscape'] }];
  App.artworks = [];
  App.menuOpen = true;
  App.detailsOpen = false;
  App.previousFocus = document.body;
  App.focusables = [menuFocus];
  App.el = {
    loading,
    loadingText: {},
    loadingRetry: retry,
    empty,
    info,
    artCount: {},
    categoryName: {},
    toast: {},
    menu: { classList: classList(['open']), setAttribute() {}, querySelectorAll() { return []; }, querySelector() { return null; } }
  };
  App.showChrome = function () {};
  App.showToast = function () {};
  App.stopSlideshow = function () {};
  App.restartSlideshow = function () {};
  App.clearLayers = function () {};
  App.paintFocus = function () {};
  document.activeElement = menuFocus;

  App.showLoadError();
  assert.equal(App.pendingLoadError, true);

  App.applyCategory('favorites', false);

  assert.equal(App.pendingLoadError, false);
  assert.equal(empty.classList.contains('hidden'), false);

  App.closeMenu();

  assert.equal(loading.classList.contains('is-error'), false);
  assert.equal(retry.classList.contains('hidden'), true);
  assert.equal(empty.classList.contains('hidden'), false);
});

test('retry with an empty collection restores the empty state instead of hanging on loading', () => {
  const { App, document } = loadApp();
  const retry = focusable(document, 'retry');
  retry.classList = classList(['hidden']);
  const loading = { classList: classList(['is-error']) };
  const empty = { classList: classList(['hidden']) };
  const info = { classList: classList() };

  App.settings = { chrome: 'always', paused: true, motion: 'off', interval: 30, styles: [] };
  App.language = 'en';
  App.favorites = {};
  App.catalog = [];
  App.artworks = [];
  App.index = 0;
  App.menuOpen = false;
  App.detailsOpen = false;
  App.el = {
    loading,
    loadingText: {},
    loadingRetry: retry,
    empty,
    info,
    artCount: {},
    categoryName: {},
    toast: {}
  };
  App.showChrome = function () {};
  App.showToast = function () {};
  document.activeElement = retry;

  App.retryImages();

  assert.equal(loading.classList.contains('hidden'), true);
  assert.equal(loading.classList.contains('is-error'), false);
  assert.equal(retry.classList.contains('hidden'), true);
  assert.equal(empty.classList.contains('hidden'), false);
  assert.notEqual(document.activeElement, retry);
});

test('artwork navigation skips failed images and reports a terminal failure', () => {
  const { App } = loadApp();
  let shown = 0;
  let errors = 0;

  App.artworks = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  App.index = 0;
  App.imageFailures = { b: true };
  App.showCurrent = function () { shown += 1; };
  App.showLoadError = function () { errors += 1; };

  App.changeArtwork(1);
  assert.equal(App.index, 2);
  assert.equal(shown, 1);
  assert.equal(errors, 0);

  App.imageFailures = { a: true, b: true, c: true };
  App.changeArtwork(1);
  assert.equal(errors, 1);
  assert.equal(shown, 1);
});

test('the retry button is focused again once the error overlay has faded in', () => {
  const { App, document, sandbox } = loadApp();
  const retry = { classList: classList(), focus() {} };
  const loading = { classList: classList(['hidden', 'is-error']) };
  const timers = [];

  sandbox.setTimeout = function (fn, delay) {
    timers.push({ fn, delay });
    return 1;
  };
  App.language = 'en';
  App.settings = { chrome: 'always', paused: true };
  App.el = { loading, loadingText: {}, loadingRetry: retry };

  App.displayLoadError();

  assert.equal(timers.length, 1);
  assert.equal(timers[0].delay >= 450, true);

  retry.focus = function () { document.activeElement = this; };
  timers[0].fn();

  assert.equal(document.activeElement, retry);
});

test('restartSlideshow does nothing while paused or a dialog is open', () => {
  const { App, sandbox } = loadApp();
  const blockedStates = [
    { lifecyclePaused: true, paused: false, menuOpen: false, detailsOpen: false },
    { lifecyclePaused: false, paused: true, menuOpen: false, detailsOpen: false },
    { lifecyclePaused: false, paused: false, menuOpen: true, detailsOpen: false },
    { lifecyclePaused: false, paused: false, menuOpen: false, detailsOpen: true }
  ];

  for (const state of blockedStates) {
    let scheduled = 0;
    let chromeChanges = 0;
    sandbox.setTimeout = function () { scheduled += 1; return 99; };
    App.slideTimer = null;
    App.settings = { interval: 15, paused: state.paused };
    App.lifecyclePaused = state.lifecyclePaused;
    App.menuOpen = state.menuOpen;
    App.detailsOpen = state.detailsOpen;
    App.showChrome = function () { chromeChanges += 1; };

    App.restartSlideshow();

    assert.equal(scheduled, 0, JSON.stringify(state));
    assert.equal(chromeChanges, 0, JSON.stringify(state));
    assert.equal(App.slideTimer, null, JSON.stringify(state));
  }
});

test('selecting a non-empty collection drops a deferred load error instead of showing a false failure', () => {
  const { App, document } = loadApp();
  const menuFocus = focusable(document, 'menu choice');
  const retry = focusable(document, 'retry');
  retry.classList = classList(['hidden']);
  const loading = { classList: classList(['hidden']) };
  const empty = { classList: classList(['hidden']) };
  const info = { classList: classList() };
  const layerA = { classList: classList(['active']), removeAttribute() {} };
  const layerB = { classList: classList(), removeAttribute() {} };

  App.settings = { chrome: 'always', paused: true, motion: 'off', interval: 30, styles: [], category: 'all' };
  App.language = 'en';
  App.favorites = {};
  App.catalog = [{ id: 'a', title: 'A', image: 'img/paintings/a.jpg', artist: 'Artist', year: '1900', tags: ['landscape'] }];
  App.artworks = [];
  App.imageFailures = { a: true };
  App.index = 0;
  App.activeLayer = 0;
  App.menuOpen = true;
  App.detailsOpen = false;
  App.previousFocus = document.body;
  App.focusables = [menuFocus];
  App.el = {
    layerA,
    layerB,
    title: {},
    artist: {},
    meta: {},
    favoriteButton: { classList: classList(), setAttribute() {} },
    favoriteLabel: {},
    loading,
    loadingText: {},
    loadingRetry: retry,
    empty,
    info,
    artCount: {},
    categoryName: {},
    toast: {},
    menu: { classList: classList(['open']), setAttribute() {}, querySelectorAll() { return []; }, querySelector() { return null; } }
  };
  App.showChrome = function () {};
  App.preloadUpcoming = function () {};
  App.stopSlideshow = function () {};
  App.restartSlideshow = function () {};
  App.showToast = function () {};
  document.activeElement = menuFocus;

  App.showLoadError();
  assert.equal(App.pendingLoadError, true);
  assert.equal(document.activeElement, menuFocus);

  App.applyCategory('all', false);

  // A new collection is loading: the stale failure must not survive into it, and its images get a
  // fresh chance instead of staying marked from the earlier outage.
  assert.equal(App.artworks.length, 1);
  assert.equal(App.pendingLoadError, false);
  assert.equal(App.imageFailures.a, undefined);

  App.closeMenu();

  assert.equal(loading.classList.contains('is-error'), false);
  assert.equal(retry.classList.contains('hidden'), true);
  assert.equal(empty.classList.contains('hidden'), true);
});

test('a successful load clears the failure mark for its artwork', () => {
  const { App } = loadApp();
  const layerA = { classList: classList(['active']), removeAttribute() {} };
  const layerB = { classList: classList(), removeAttribute() {} };

  App.settings = { chrome: 'always', paused: true, motion: 'off', interval: 30, styles: [] };
  App.language = 'en';
  App.favorites = {};
  App.artworks = [
    { id: 'a', image: 'img/paintings/a.jpg', title: 'A', artist: 'Artist', year: '1900' },
    { id: 'b', image: 'img/paintings/b.jpg', title: 'B', artist: 'Artist', year: '1901' }
  ];
  App.index = 0;
  App.activeLayer = 0;
  App.imageFailures = { a: true, b: true };
  App.detailsOpen = false;
  App.el = {
    layerA,
    layerB,
    title: {},
    artist: {},
    meta: {},
    favoriteButton: { classList: classList(), setAttribute() {} },
    favoriteLabel: {},
    loading: { classList: classList(['hidden']) },
    loadingText: {},
    loadingRetry: { classList: classList(['hidden']), focus() {} }
  };
  App.showChrome = function () {};
  App.preloadUpcoming = function () {};
  App.restartSlideshow = function () {};

  App.showCurrent(false);

  // Nothing has loaded yet, so the earlier marks still guard against cycling through failures.
  assert.equal(App.imageFailures.a, true);

  layerB.onload();

  assert.equal(App.imageFailures.a, undefined);
  assert.equal(App.imageFailures.b, true);
});

test('selecting a collection gives previously failed images a fresh chance', () => {
  const { App } = loadApp();
  let errors = 0;
  let shown = 0;

  App.settings = { chrome: 'always', paused: true, motion: 'off', interval: 30, styles: [], category: 'all' };
  App.language = 'en';
  App.favorites = {};
  App.catalog = [
    { id: 'a', title: 'A', image: 'img/paintings/a.jpg', tags: ['landscape'] },
    { id: 'b', title: 'B', image: 'img/paintings/b.jpg', tags: ['landscape'] }
  ];
  App.artworks = [];
  App.imageFailures = { a: true, b: true };
  App.index = 0;
  App.el = {
    layerA: { classList: classList(['active']), removeAttribute() {} },
    layerB: { classList: classList(), removeAttribute() {} },
    title: {},
    artist: {},
    meta: {},
    favoriteButton: { classList: classList(), setAttribute() {} },
    favoriteLabel: {},
    loading: { classList: classList(['hidden']) },
    loadingText: {},
    loadingRetry: { classList: classList(['hidden']), focus() {} },
    empty: { classList: classList(['hidden']) },
    info: { classList: classList() },
    artCount: {},
    categoryName: {},
    toast: {}
  };
  App.showChrome = function () {};
  App.preloadUpcoming = function () {};
  App.showToast = function () {};
  App.showCurrent = function () { shown += 1; };
  App.showLoadError = function () { errors += 1; };

  App.applyCategory('all', false);

  assert.equal(App.imageFailures.a, undefined);
  assert.equal(App.imageFailures.b, undefined);

  App.changeArtwork(1);

  assert.equal(App.index, 1);
  assert.equal(shown, 2);
  assert.equal(errors, 0);
});

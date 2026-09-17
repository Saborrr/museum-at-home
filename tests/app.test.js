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

test('a deferred terminal error clears the loading state while the dialog stays open', () => {
  const { App, document } = loadApp();
  const retry = focusable(document, 'retry');
  retry.classList = classList(['hidden']);
  const loading = { classList: classList() };      // visible loading state, no error yet

  App.settings = { chrome: 'always', paused: true };
  App.artworks = [];
  App.menuOpen = true;
  App.detailsOpen = false;
  App.el = { loading, loadingText: {}, loadingRetry: retry };
  App.stopSlideshow = function () {};
  App.showChrome = function () {};

  App.showLoadError();

  assert.equal(App.pendingLoadError, true);
  assert.equal(loading.classList.contains('hidden'), true);
  assert.equal(loading.classList.contains('is-error'), false);
  assert.equal(retry.classList.contains('hidden'), true);
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
  App.consecutiveStalls = 2;
  document.activeElement = retry;

  App.retryImages();

  assert.equal(loading.classList.contains('hidden'), true);
  assert.equal(loading.classList.contains('is-error'), false);
  assert.equal(retry.classList.contains('hidden'), true);
  assert.equal(empty.classList.contains('hidden'), false);
  assert.notEqual(document.activeElement, retry);
  assert.equal(App.consecutiveStalls, 0);
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
  App.consecutiveStalls = 1;
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
  assert.equal(App.consecutiveStalls, 0);

  App.changeArtwork(1);

  assert.equal(App.index, 1);
  assert.equal(shown, 2);
  assert.equal(errors, 0);
});

test('a stale load event cannot clear a failure mark or hide the loading state', () => {
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
  App.imageFailures = { a: true };
  App.detailsOpen = false;
  App.el = {
    layerA,
    layerB,
    title: {},
    artist: {},
    meta: {},
    favoriteButton: { classList: classList(), setAttribute() {} },
    favoriteLabel: {},
    loading: { classList: classList() },
    loadingText: {},
    loadingRetry: { classList: classList(['hidden']), focus() {} }
  };
  App.showChrome = function () {};
  App.preloadUpcoming = function () {};
  App.restartSlideshow = function () {};

  App.showCurrent(false);
  const staleOnload = layerB.onload;

  // A newer load starts before the stale element settles: its event must be ignored completely.
  App.loadToken += 1;
  staleOnload();

  assert.equal(App.imageFailures.a, true);
  assert.equal(App.activeLayer, 0);
  assert.equal(App.el.loading.classList.contains('hidden'), false);
  assert.equal(App.el.loading.classList.contains('is-error'), false);
});

test('a delayed cleanup cannot tear down a newer load on the same layer', () => {
  const { App, sandbox } = loadApp();
  const timers = [];
  sandbox.setTimeout = function (fn, delay) {
    timers.push({ fn, delay });
    return timers.length;
  };
  const layerA = { classList: classList(['active']), removeAttribute() { this.stripped = true; } };
  const layerB = { classList: classList(), removeAttribute() { this.stripped = true; } };

  App.settings = { chrome: 'always', paused: true, motion: 'off', interval: 30, styles: [] };
  App.language = 'en';
  App.favorites = {};
  App.artworks = [
    { id: 'a', image: 'img/paintings/a.jpg', title: 'A', artist: 'Artist', year: '1900' },
    { id: 'b', image: 'img/paintings/b.jpg', title: 'B', artist: 'Artist', year: '1901' }
  ];
  App.index = 0;
  App.activeLayer = 0;
  App.imageFailures = {};
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
  const armedWatchdog = timers.some((timer) => timer.delay >= 5000);
  layerB.onload();

  assert.equal(armedWatchdog, true);
  assert.equal(App.loadWatchdogTimer, null);

  const cleanup = timers[timers.length - 1];
  assert.equal(cleanup.delay >= 1000, true);

  // Navigate again before the cleanup fires: the old image's layer is reused for a new load.
  App.index = 1;
  App.showCurrent(false);
  const liveOnload = layerA.onload;

  cleanup.fn();

  assert.equal(layerA.onload, liveOnload);
  assert.equal(layerA.stripped, undefined);
  assert.equal(layerA.src, 'img/paintings/b.jpg');

  // The same timer must still tear down a genuinely stale, inactive layer.
  layerA.museumLoadToken = App.loadToken - 1;
  cleanup.fn();
  assert.equal(layerA.onload, null);
  assert.equal(layerA.onerror, null);
  assert.equal(layerA.stripped, true);
});

test('a stalled load is reported instead of hanging forever', () => {
  const { App, sandbox } = loadApp();
  const timers = [];
  sandbox.setTimeout = function (fn, delay) {
    timers.push({ fn, delay });
    return timers.length;
  };
  let errors = 0;
  let shown = 0;

  App.language = 'en';
  App.artworks = [{ id: 'a' }, { id: 'b' }];
  App.index = 0;
  App.imageFailures = {};
  App.showToast = function () {};
  App.showLoadError = function () { errors += 1; };
  App.showCurrent = function () { shown += 1; };

  App.armLoadWatchdog(App.loadToken);

  assert.equal(timers.length, 1);
  assert.equal(timers[0].delay, 45000);

  timers[0].fn();

  assert.equal(App.imageFailures.a, true);
  assert.equal(App.index, 1);
  assert.equal(shown, 1);
  assert.equal(errors, 0);

  // Once every artwork is marked the terminal error is raised instead of another attempt.
  App.imageFailures = { a: true, b: true };
  App.index = 0;
  App.armLoadWatchdog(App.loadToken);
  timers[timers.length - 1].fn();

  assert.equal(errors, 1);
  assert.equal(shown, 1);

  // A failure reported for an older load must not blame the artwork on screen now.
  App.imageFailures = {};
  App.index = 0;
  App.failCurrentLoad(App.artworks[0], App.loadToken - 1);

  assert.equal(App.imageFailures.a, undefined);
  assert.equal(App.index, 0);
  assert.equal(errors, 1);

  // A watchdog belonging to an older load must stay silent.
  App.imageFailures = {};
  App.index = 0;
  App.armLoadWatchdog(App.loadToken - 1);
  timers[timers.length - 1].fn();

  assert.equal(errors, 1);
  assert.equal(App.imageFailures.a, undefined);
});

test('the load watchdog keeps waiting while the app is suspended', () => {
  const { App, sandbox } = loadApp();
  const timers = [];
  sandbox.setTimeout = function (fn, delay) {
    timers.push({ fn, delay });
    return timers.length;
  };
  let errors = 0;

  App.language = 'en';
  App.artworks = [{ id: 'a' }];
  App.index = 0;
  App.imageFailures = {};
  App.lifecyclePaused = true;
  App.showToast = function () {};
  App.showLoadError = function () { errors += 1; };
  App.showCurrent = function () {};

  App.armLoadWatchdog(App.loadToken);
  const armed = timers.length;

  timers[armed - 1].fn();

  assert.equal(errors, 0);
  assert.equal(App.imageFailures.a, undefined);
  assert.equal(timers.length, armed + 1);
  assert.equal(App.loadWatchdogTimer, timers.length);
});

test('selecting a full collection from an empty one shows the loading state', () => {
  const { App } = loadApp();
  const layerA = { classList: classList(), removeAttribute() {} };
  const layerB = { classList: classList(), removeAttribute() {} };
  const loading = { classList: classList(['hidden']) };
  const retry = { classList: classList(['hidden']), focus() {} };

  App.settings = { chrome: 'always', paused: true, motion: 'off', interval: 30, styles: [], category: 'all' };
  App.language = 'en';
  App.favorites = {};
  App.catalog = [{ id: 'a', title: 'A', image: 'img/paintings/a.jpg', artist: 'Artist', year: '1900', tags: ['landscape'] }];
  App.artworks = [];
  App.imageFailures = {};
  App.index = 0;
  App.activeLayer = 0;
  App.detailsOpen = false;
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
    empty: { classList: classList() },
    info: { classList: classList() },
    artCount: {},
    categoryName: {},
    toast: {}
  };
  App.showChrome = function () {};
  App.preloadUpcoming = function () {};
  App.showToast = function () {};
  App.restartSlideshow = function () {};

  App.applyCategory('all', false);

  assert.equal(App.artworks.length, 1);
  assert.equal(loading.classList.contains('hidden'), false);
  assert.equal(loading.classList.contains('is-error'), false);
  assert.equal(retry.classList.contains('hidden'), true);

  layerB.onload();

  assert.equal(loading.classList.contains('hidden'), true);
  assert.equal(retry.classList.contains('hidden'), true);
});

test('an empty collection stops the load watchdog', () => {
  const { App, sandbox } = loadApp();
  const timers = [];
  sandbox.setTimeout = function (fn, delay) {
    timers.push({ fn, delay });
    return timers.length;
  };
  const layerA = { classList: classList(['active']), removeAttribute() {} };
  const layerB = { classList: classList(), removeAttribute() {} };

  App.settings = { chrome: 'always', paused: true, motion: 'off', interval: 30, styles: [], category: 'all' };
  App.language = 'en';
  App.favorites = {};
  App.catalog = [{ id: 'a', title: 'A', image: 'img/paintings/a.jpg', artist: 'Artist', year: '1900', tags: ['landscape'] }];
  App.artworks = [{ id: 'a', image: 'img/paintings/a.jpg', title: 'A', artist: 'Artist', year: '1900' }];
  App.index = 0;
  App.imageFailures = {};
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

  // A load is in flight, so the watchdog is armed.
  App.armLoadWatchdog(App.loadToken);
  assert.notEqual(App.loadWatchdogTimer, null);

  App.applyCategory('favorites', false);

  assert.equal(App.artworks.length, 0);
  assert.equal(App.loadWatchdogTimer, null);
  assert.equal(App.el.empty.classList.contains('hidden'), false);
});

test('two consecutive stalled loads surface the terminal error', () => {
  const { App, sandbox } = loadApp();
  const timers = [];
  sandbox.setTimeout = function (fn, delay) {
    timers.push({ fn, delay });
    return timers.length;
  };
  let errors = 0;
  let shown = 0;

  App.language = 'en';
  App.artworks = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  App.index = 0;
  App.imageFailures = {};
  App.consecutiveStalls = 0;
  App.showToast = function () {};
  App.showLoadError = function () { errors += 1; };
  App.showCurrent = function () { shown += 1; };

  // The first stalled load is treated like a broken artwork: move on to the next one.
  App.armLoadWatchdog(App.loadToken);
  timers[timers.length - 1].fn();

  assert.equal(App.index, 1);
  assert.equal(shown, 1);
  assert.equal(errors, 0);

  // A second stall in a row means the connection is dead: report instead of walking the catalogue.
  App.armLoadWatchdog(App.loadToken);
  timers[timers.length - 1].fn();

  assert.equal(errors, 1);
  assert.equal(shown, 1);
});

test('a successful load forgets earlier stalls', () => {
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
  App.imageFailures = {};
  App.consecutiveStalls = 1;
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
  layerB.onload();

  assert.equal(App.consecutiveStalls, 0);
});

test('a loading state never covers an open dialog and appears after it closes', () => {
  const { App } = loadApp();
  const layerA = { classList: classList(), removeAttribute() {} };
  const layerB = { classList: classList(), removeAttribute() {} };
  const loading = { classList: classList(['hidden']) };

  App.settings = { chrome: 'always', paused: true, motion: 'off', interval: 30, styles: [], category: 'all' };
  App.language = 'en';
  App.favorites = {};
  App.catalog = [{ id: 'a', title: 'A', image: 'img/paintings/a.jpg', artist: 'Artist', year: '1900', tags: [] }];
  App.artworks = [];
  App.index = 0;
  App.activeLayer = 0;
  App.menuOpen = true;
  App.detailsOpen = false;
  App.focusables = [];
  App.el = {
    layerA,
    layerB,
    menu: { classList: classList(['open']), setAttribute() {} },
    title: {},
    artist: {},
    meta: {},
    favoriteButton: { classList: classList(), setAttribute() {} },
    favoriteLabel: {},
    loading,
    loadingText: {},
    loadingRetry: { classList: classList(['hidden']), focus() {} },
    empty: { classList: classList() },
    info: { classList: classList() },
    artCount: {},
    categoryName: {},
    toast: {}
  };
  App.saveSettings = function () {};
  App.updateMenuSelection = function () {};
  App.showChrome = function () {};
  App.preloadUpcoming = function () {};
  App.restartSlideshow = function () {};

  App.applyCategory('all', false);

  assert.equal(loading.classList.contains('hidden'), true);
  assert.equal(App.menuOpen, true);

  App.closeMenu();

  assert.equal(loading.classList.contains('hidden'), false);
  assert.equal(loading.classList.contains('is-error'), false);
});

test('a watchdog-condemned layer cannot revive after the terminal error', () => {
  const { App } = loadApp();
  const layerA = { classList: classList(['active']), removeAttribute() {} };
  const layerB = {
    classList: classList(),
    removed: false,
    removeAttribute(name) {
      if (name === 'src') this.removed = true;
    }
  };
  let errors = 0;
  let shown = 0;

  App.settings = { chrome: 'always', paused: true, motion: 'off', interval: 30, styles: [] };
  App.language = 'en';
  App.favorites = {};
  App.artworks = [
    { id: 'a', image: 'img/paintings/a.jpg', title: 'A', artist: 'Artist', year: '1900' },
    { id: 'b', image: 'img/paintings/b.jpg', title: 'B', artist: 'Artist', year: '1901' }
  ];
  App.index = 0;
  App.activeLayer = 0;
  App.imageFailures = {};
  App.consecutiveStalls = 1;
  App.el = {
    layerA,
    layerB,
    title: {},
    artist: {},
    meta: {},
    favoriteButton: { classList: classList(), setAttribute() {} },
    favoriteLabel: {},
    loading: { classList: classList() },
    loadingText: {},
    loadingRetry: { classList: classList(['hidden']), focus() {} }
  };
  App.showChrome = function () {};
  App.preloadUpcoming = function () {};
  App.restartSlideshow = function () {};
  App.showToast = function () {};
  App.showLoadError = function () { errors += 1; };

  App.showCurrent(false);
  const condemnedToken = App.loadToken;
  const lateOnload = layerB.onload;
  App.showCurrent = function () { shown += 1; };

  App.failCurrentLoad(App.artworks[0], condemnedToken, true);

  assert.equal(errors, 1);
  assert.equal(shown, 0);
  assert.equal(layerB.onload, null);
  assert.equal(layerB.onerror, null);
  assert.equal(layerB.removed, true);
  assert.equal(layerB.museumLoadToken, 0);
  assert.equal(App.loadToken > condemnedToken, true);

  lateOnload();

  assert.equal(errors, 1);
  assert.equal(App.activeLayer, 0);
  assert.equal(App.imageFailures.a, true);
});

test('opening the menu hides an existing non-error loading screen', () => {
  const { App } = loadApp();
  const loading = { classList: classList() };
  const menuChoice = { classList: classList(), focus() {}, getBoundingClientRect() { return {}; } };

  App.settings = { category: 'all', chrome: 'always', paused: true };
  App.menuOpen = false;
  App.detailsOpen = false;
  App.el = {
    loading,
    menu: {
      classList: classList(),
      setAttribute() {},
      querySelectorAll() { return [menuChoice]; },
      querySelector() { return menuChoice; }
    }
  };
  App.stopSlideshow = function () {};
  App.showChrome = function () {};
  App.updateMenuSelection = function () {};
  App.paintFocus = function () {};

  App.openMenu();

  assert.equal(App.menuOpen, true);
  assert.equal(loading.classList.contains('hidden'), true);

  App.menuOpen = false;
  loading.classList.remove('hidden');
  loading.classList.add('is-error');
  App.openMenu();
  assert.equal(App.menuOpen, false);
});

test('opening details hides existing loading and closing restores it on a blank stage', () => {
  const { App } = loadApp();
  const loading = { classList: classList() };
  const details = { classList: classList(), setAttribute() {}, focus() {} };

  App.settings = { category: 'all', chrome: 'always', paused: true };
  App.language = 'en';
  App.artworks = [{ id: 'a', title: 'A', artist: 'Artist', year: '1900', description: 'Story', museum: 'Museum', license: 'Public domain' }];
  App.index = 0;
  App.menuOpen = false;
  App.detailsOpen = false;
  App.el = {
    loading,
    loadingText: {},
    loadingRetry: { classList: classList(['hidden']) },
    layerA: { classList: classList() },
    layerB: { classList: classList() },
    details,
    detailsKicker: {},
    detailsTitle: {},
    detailsByline: {},
    detailsDescription: { classList: classList() },
    detailsMuseum: { classList: classList() },
    detailsRights: { classList: classList() },
    detailsScroll: { scrollTop: 0 }
  };
  App.stopSlideshow = function () {};
  App.showChrome = function () {};
  App.resetReveal = function () {};

  App.openDetails();

  assert.equal(App.detailsOpen, true);
  assert.equal(loading.classList.contains('hidden'), true);

  App.closeDetails();

  assert.equal(App.detailsOpen, false);
  assert.equal(loading.classList.contains('hidden'), false);

  loading.classList.add('is-error');
  App.openDetails();
  assert.equal(App.detailsOpen, false);
});

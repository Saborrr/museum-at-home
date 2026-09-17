'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

test('artwork cache put rejection still returns the fetched response', async () => {
  const response = {
    ok: true,
    type: 'basic',
    clone() { return { cached: true }; }
  };
  const sandbox = {
    Promise,
    URL,
    fetch() { return Promise.resolve(response); },
    caches: {
      open() {
        return Promise.resolve({ put() { return Promise.reject(new Error('quota exceeded')); } });
      },
      match() { return Promise.resolve(null); },
      keys() { return Promise.resolve([]); }
    },
    self: {
      location: { origin: 'https://museum.test' },
      clients: { claim() { return Promise.resolve(); } },
      skipWaiting() {},
      addEventListener() {}
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), sandbox, {
    filename: 'sw.js'
  });

  assert.equal(await sandbox.cacheArtwork({ url: 'art.jpg' }, response), response);
});

test('an artwork request still resolves when the artwork cache is unavailable', async () => {
  const response = { ok: true, type: 'basic' };
  const handlers = {};
  const sandbox = {
    Promise,
    URL,
    fetch() { return Promise.resolve(response); },
    caches: {
      open() { return Promise.reject(new Error('storage disabled')); },
      match() { return Promise.resolve(null); },
      keys() { return Promise.resolve([]); }
    },
    self: {
      location: { origin: 'https://museum.test' },
      clients: { claim() { return Promise.resolve(); } },
      skipWaiting() {},
      addEventListener(type, handler) { handlers[type] = handler; }
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), sandbox, {
    filename: 'sw.js'
  });

  let answer = null;
  handlers.fetch({
    request: {
      method: 'GET',
      mode: 'no-cors',
      url: 'https://museum.test/img/paintings/art-1.jpg'
    },
    respondWith(promise) { answer = promise; }
  });

  assert.equal(await answer, response);
});

test('a same-origin shell request still resolves when the shell cache is unavailable', async () => {
  const response = { ok: true, type: 'basic' };
  const handlers = {};
  const sandbox = {
    Promise,
    URL,
    fetch() { return Promise.resolve(response); },
    caches: {
      open() { return Promise.reject(new Error('storage disabled')); },
      match() { return Promise.resolve(null); },
      keys() { return Promise.resolve([]); }
    },
    self: {
      location: { origin: 'https://museum.test' },
      clients: { claim() { return Promise.resolve(); } },
      skipWaiting() {},
      addEventListener(type, handler) { handlers[type] = handler; }
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), sandbox, {
    filename: 'sw.js'
  });

  let answer = null;
  handlers.fetch({
    request: { method: 'GET', mode: 'same-origin', url: 'https://museum.test/css/style.css' },
    respondWith(promise) { answer = promise; }
  });

  assert.equal(await answer, response);
});

test('only the app shell URL is stored as the offline navigation fallback', async () => {
  const puts = [];
  const response = {
    ok: true,
    clone() { return { cached: true }; }
  };
  const cache = {
    put(key) { puts.push(key); return Promise.resolve(); },
    match() { return Promise.resolve(null); },
    keys() { return Promise.resolve([]); }
  };
  const sandbox = {
    Promise,
    URL,
    fetch() { return Promise.resolve(response); },
    caches: {
      open() { return Promise.resolve(cache); },
      match() { return Promise.resolve(null); },
      keys() { return Promise.resolve([]); }
    },
    self: {
      location: { origin: 'https://museum.test' },
      clients: { claim() { return Promise.resolve(); } },
      skipWaiting() {},
      addEventListener() {}
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), sandbox, {
    filename: 'sw.js'
  });

  await sandbox.navigationResponse({ url: 'https://museum.test/?promo=1' });
  assert.deepEqual(puts, ['./index.html']);

  await sandbox.navigationResponse({ url: 'https://museum.test/promo' });
  assert.deepEqual(puts, ['./index.html']);

  await sandbox.navigationResponse({ url: 'https://museum.test/' });
  assert.deepEqual(puts, ['./index.html', './index.html']);

  await sandbox.navigationResponse({ url: 'https://museum.test/index.html' });
  assert.equal(puts.length, 3);
});

test('navigation response stays pending until its cache update finishes', async () => {
  let finishPut;
  const putFinished = new Promise((resolve) => { finishPut = resolve; });
  const response = {
    ok: true,
    clone() { return { cached: true }; }
  };
  const sandbox = {
    Promise,
    URL,
    fetch() { return Promise.resolve(response); },
    caches: {
      open() {
        return Promise.resolve({ put() { return putFinished; } });
      },
      match() { return Promise.resolve(null); },
      keys() { return Promise.resolve([]); }
    },
    self: {
      location: { origin: 'https://museum.test' },
      clients: { claim() { return Promise.resolve(); } },
      skipWaiting() {},
      addEventListener() {}
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), sandbox, {
    filename: 'sw.js'
  });

  let settled = false;
  const navigation = sandbox.navigationResponse({ url: 'https://museum.test/' });
  navigation.then(() => { settled = true; });
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(settled, false);

  finishPut();
  assert.equal(await navigation, response);
});

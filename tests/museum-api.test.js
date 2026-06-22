const test = require('node:test');
const assert = require('node:assert/strict');

// Pull the function out of the existing module.
// We load the ES5 build because that is what the deployed app uses.
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(
  path.join(__dirname, '..', 'js', 'museum-api.es5.js'),
  'utf8'
);
// Evaluate the module in an isolated sandbox and grab the helper.
const sandbox = {};
new Function('sandbox', `${src}; sandbox.MuseumAPI = MuseumAPI;`)(sandbox);
const { isPainting } = sandbox.MuseumAPI;

test('isPainting accepts Met Paintings classification', () => {
  assert.equal(
    isPainting({ classification: 'Paintings', objectName: 'Painting' }),
    true
  );
});

test('isPainting accepts triptych (objectName starts with "Painting")', () => {
  assert.equal(isPainting({ objectName: 'Painting, triptych' }), true);
});

test('isPainting rejects stained-glass panel', () => {
  assert.equal(
    isPainting({ classification: 'Glass-Stained', objectName: 'Panel' }),
    false
  );
});

test('isPainting rejects photograph', () => {
  assert.equal(isPainting({ classification: 'Photographs' }), false);
});

test('isPainting rejects objects missing both fields', () => {
  assert.equal(isPainting({}), false);
});

test('fetchMet skips non-painting objects even if returned by Met', async () => {
  // Stub global fetch inside the loaded module by re-evaluating it.
  const calls = [];
  global.fetch = async (url) => {
    calls.push(url);
    if (url.includes('/search?')) {
      return { json: async () => ({ objectIDs: [1, 2, 3] }) };
    }
    // 1 = painting, 2 = stained glass, 3 = painting
    const fixtures = {
      1: { primaryImage: 'a.jpg', isPublicDomain: true, objectID: 1, classification: 'Paintings', objectName: 'Painting' },
      2: { primaryImage: 'b.jpg', isPublicDomain: true, objectID: 2, classification: 'Glass-Stained', objectName: 'Panel' },
      3: { primaryImage: 'c.jpg', isPublicDomain: true, objectID: 3, classification: 'Paintings', objectName: 'Painting' },
    };
    return { json: async () => fixtures[url.split('/').pop()] };
  };
  const result = await sandbox.MuseumAPI.fetchMet('painting', 3);
  assert.equal(result.length, 2);
  assert.ok(result.every(a => a.id === 'met-1' || a.id === 'met-3'));
  delete global.fetch;
});
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
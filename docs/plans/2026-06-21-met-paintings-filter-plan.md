# Met Paintings Filter — Implementation Plan

> **For implementer:** Use TDD throughout. Write failing test first. Watch it fail. Then implement.

**Goal:** Filter `MuseumAPI.fetchMet()` so the screensaver rotation only
contains paintings (no stained glass, prints, photographs, panels).

**Architecture:** Two-layer filter. (1) Add `&medium=Paintings` to the Met
search URL so the server returns fewer non-painting IDs. (2) Add a
`MuseumAPI.isPainting(obj)` guard that re-checks the per-object
`classification` and `objectName` before adding it to the result list, so a
future taxonomy change on Met's side cannot regress the screensaver.

**Tech Stack:** Plain JavaScript (ES2017), Node.js ≥ 16 for running the unit
test via `node --test`. No external test framework needed for a one-file
guard; if the project later adopts Jest/Vitest, migrate the same test.

---

## Task 1: Add failing unit test for `isPainting()`

**Files:**
- Create: `tests/museum-api.test.js`

**Step 1: Write the failing test**

```js
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
```

**Step 2: Run test — confirm it fails**

Command: `cd /home/alex/art-screensaver-webos && node --test tests/museum-api.test.js`
Expected: FAIL with `TypeError: sandbox.MuseumAPI.isPainting is not a function`.

**Step 3: Implement `isPainting()` in `js/museum-api.es5.js`**

Add immediately after the `fetchMet` method (before `fetchBundled`):

```js
/**
 * Decide whether a Met object is a painting.
 * Accepts Paintings classification OR an objectName that starts with "Painting".
 */
isPainting: function (obj) {
  var cls = (obj.classification || '').toLowerCase();
  var name = (obj.objectName || '').toLowerCase();
  return cls === 'paintings' || name.indexOf('painting') === 0;
},
```

**Step 4: Run test — confirm it passes**

Command: `node --test tests/museum-api.test.js`
Expected: 5 tests pass, 0 fail.

**Step 5: Commit**

`cd /home/alex/art-screensaver-webos && git add js/museum-api.es5.js tests/museum-api.test.js && git commit -m "feat(museum-api): add isPainting guard with unit tests"`

---

## Task 2: Mirror `isPainting()` into the ES6 source

The repo carries two parallel builds (`museum-api.js` ES6, `museum-api.es5.js`
ES5). They must stay in sync. Do this **before** wiring the guard into
`fetchMet`, otherwise the deployed build will diverge from source.

**Files:**
- Modify: `js/museum-api.js`

**Step 1: Add the same method to the ES6 file**

```js
/**
 * Decide whether a Met object is a painting.
 * Accepts Paintings classification OR an objectName that starts with "Painting".
 */
isPainting(obj) {
  const cls = (obj.classification || '').toLowerCase();
  const name = (obj.objectName || '').toLowerCase();
  return cls === 'paintings' || name.startsWith('painting');
},
```

Place it directly after `fetchMet`, before `fetchBundled`.

**Step 2: Verify the test still passes**

Command: `node --test tests/museum-api.test.js`
Expected: 5 tests pass (the test reads the `.es5.js` file, but the human
check confirms the ES6 file is in sync).

**Step 3: Commit**

`git add js/museum-api.js && git commit -m "feat(museum-api): mirror isPainting into ES6 source"`

---

## Task 3: Add `&medium=Paintings` to the Met search URL

This is the server-side half of the two-layer filter. The unit test does not
cover it (network call); the human verification is the deploy + manual
browse. Skip TDD here per the exceptions in `references/tdd.md` — the
change is a one-line URL parameter.

**Files:**
- Modify: `js/museum-api.es5.js` and `js/museum-api.js`

**Step 1: Update the URL inside `fetchMet`**

In both files, change:

```js
const searchUrl = this.MET_BASE + '/search?q=' + encodeURIComponent(query) +
  '&hasImages=true&isHighlight=true';
```

to:

```js
const searchUrl = this.MET_BASE + '/search?q=' + encodeURIComponent(query) +
  '&hasImages=true&isHighlight=true&medium=Paintings';
```

**Step 2: Smoke check from the server**

Command: `curl -sL 'https://collectionapi.metmuseum.org/public/collection/v1/search?q=paintings&hasImages=true&isHighlight=true&medium=Paintings' | python3 -c "import json,sys;print(len(json.load(sys.stdin)['objectIDs']))"`
Expected: a positive integer ≤ 52 (today: 45).

**Step 3: Commit**

`git add js/museum-api.js js/museum-api.es5.js && git commit -m "perf(museum-api): ask Met for medium=Paintings only"`

---

## Task 4: Wire `isPainting()` into the per-id loop

Now both halves of the filter are present but the per-id loop still pushes
non-paintings. Gate the push with the new guard.

**Files:**
- Modify: `js/museum-api.es5.js` and `js/museum-api.js`

**Step 1: Add a failing test that exercises the loop**

Append to `tests/museum-api.test.js`:

```js
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
```

**Step 2: Run test — confirm it fails**

Command: `node --test tests/museum-api.test.js`
Expected: the new test fails (currently both non-paintings slip through,
so `result.length` is 3, not 2). Older 5 tests still pass.

**Step 3: Gate the push in the loop**

In both `js/museum-api.es5.js` and `js/museum-api.js`, inside the per-id
loop in `fetchMet`, change:

```js
if (obj.primaryImage && obj.isPublicDomain) {
  artworks.push({ ... });
}
```

to:

```js
if (obj.primaryImage && obj.isPublicDomain && this.isPainting(obj)) {
  artworks.push({ ... });
}
```

**Step 4: Run test — confirm it passes**

Command: `node --test tests/museum-api.test.js`
Expected: 6 tests pass, 0 fail.

**Step 5: Commit**

`git add js/museum-api.js js/museum-api.es5.js tests/museum-api.test.js && git commit -m "feat(museum-api): filter out non-paintings in fetchMet loop"`

---

## Task 5: Manual browser smoke test (deployed site)

Code is in, tests are green. Per the design doc, the final verification is
on the deployed app, because the unit tests cannot prove "no glass in the
overlay".

**Files:** none changed.

**Step 1: Deploy the updated bundle**

The repo has a `deploy.sh` helper. Use it.

Command: `cd /home/alex/art-screensaver-webos && ./deploy.sh`
Expected: script reports a new package + a copy step into `/var/www/art/`.
If the script is interactive (asks for confirmation), say "yes".

**Step 2: Browser verification**

1. Open `https://gofaraway.mooo.com/art/` in a fresh tab.
2. Open DevTools → Network, filter on `collectionapi.metmuseum.org`. Confirm
   the search request includes `medium=Paintings`.
3. Set the change interval to 15 s and let ~30 cards cycle.
4. For each, hover the title/artist overlay — confirm no words like
   "Stained", "Panel", "Photograph", "Print" appear.
5. Toggle a favourite, reload the page, confirm the favourite is still
   tagged with `classification: "Paintings"` in `localStorage`.

**Step 3: Roll back if anything looks wrong**

`cd /home/alex/art-screensaver-webos && git revert --no-edit HEAD~4..HEAD && ./deploy.sh`

---

## Execution Handoff

Plan saved to `docs/plans/2026-06-21-met-paintings-filter-plan.md`. Two
execution options:

1. **Subagent-Driven** — I dispatch a fresh sub-agent per task, review
   between tasks. Slower wall-clock, but the TDD steps run in clean
   contexts (each sub-agent re-reads only the files it needs).
2. **Manual** — You run the tasks yourself, paste output back if you want
   me to review.

Which approach?

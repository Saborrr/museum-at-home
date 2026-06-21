# Design — Met Museum paintings-only filter

**Date:** 2026-06-21
**Status:** Awaiting approval (Superpowers Phase 1: Brainstorming)
**Author:** Ama
**Project:** art-screensaver-webos

---

## Context

Art Gallery Screensaver fetches artwork from the Met Museum API to fill its
screensaver rotation. The current query

```
/search?q=paintings&hasImages=true&isHighlight=true
```

returns a mix of **paintings**, **stained-glass panels**, **photographs**, and
**prints** (verified on 2026-06-21: e.g. Met object `469887` is a stained-glass
panel titled "Martyrdom of Saint Lawrence"). The user wants only paintings on
screen — portraits are fine, but non-paintings (glass, photographs, panels,
sculpture) must be excluded.

The Rijksmuseum path in `fetchRijks()` is currently dead: the embedded API key
is the placeholder `YOUR_RIJKS_KEY`. So all real traffic today is Met-only.

## Goal

`fetchMet()` returns **only objects where `objectName === "Painting"`** (or
where the medium query already filters out non-paintings). All other artwork
types are excluded before being added to the rotation.

## Approach — two-layer filter

**Layer 1 — server-side (Met API):** add `&medium=Paintings` to the search URL.
Verified today: this trims the response from 52 → 45 objects, and every spot
checked in the result set is a painting (including triptychs).

**Layer 2 — client-side (defensive):** keep a small `isPainting(obj)` guard
that accepts an object only if `obj.classification === "Paintings"` **or**
`obj.objectName.toLowerCase().startsWith("painting")`. This guards against
Met's medium taxonomy drifting in the future.

Rejected approaches (recorded for posterity):

- **Curated whitelist of 50 IDs** — best long-term quality, but requires
  manual curation; out of scope for a one-evening fix.
- **Drop the Met call entirely** — Rijks path is dead, so the screensaver
  would fall back to the bundled 3-item `collection.json` (which is broken
  anyway — to be investigated separately).
- **`medium=Painting` (singular)** — verified today, Met returns an error.
- **`classificationId=31`** — works, but cuts results to 13, too aggressive.

## Changes

### File: `js/museum-api.js`

In `fetchMet()`, update the search URL:

```js
const searchUrl =
  `${this.MET_BASE}/search?q=${encodeURIComponent(query)}` +
  `&hasImages=true&isHighlight=true&medium=Paintings`;
```

Add a new method on `MuseumAPI`:

```js
isPainting(obj) {
  const cls = (obj.classification || '').toLowerCase();
  const name = (obj.objectName || '').toLowerCase();
  return cls === 'paintings' || name.startsWith('painting');
}
```

Inside the per-id loop in `fetchMet()`, gate the `artworks.push(...)` on
`this.isPainting(obj)`.

**Also update `js/museum-api.es5.js`** — index.html loads the ES5 build
(`/js/museum-api.es5.js`), so the change has to land in both files, or the
deployed build will not see the fix.

### File: `index.html`

No changes — script tags stay as-is.

### No new files

The bundled `data/collection.json` already only has 3 items and is
inconsistent with the README claim of 26 local paintings. Investigating that
is a separate task and **out of scope** for this fix.

## Testing

Manual checks (no automated test framework in the repo):

1. Open `https://gofaraway.mooo.com/art/` in a browser.
2. Open DevTools → Network, watch the `search?…medium=Paintings` request.
3. Cycle through ~30 paintings using the 15s interval; confirm no stained
   glass, photographs, prints, or sculpture appear in the overlay text or
   alt text.
4. Verify the favourite toggle still works (it depends on the same
   `artworks` array).
5. Spot-check `cache.js` writes — confirm the cached metadata for stored
   favourites still has `classification` / `objectName` so the
   `isPainting` guard can be re-applied if the cache is ever read back in
   without a fresh API call.

## Rollback

`git revert <this-commit>` and redeploy. The two-line change in
`museum-api.js` is fully reversible.

## Open questions

- Should we also normalise the Rijks path? Today it silently returns `[]`
  for every collection because the API key is a placeholder. The user
  flagged this when we discussed the project, but fixing it requires
  registering for a Rijks API key — separate task.
- `data/collection.json` has only 3 items, not the 26 mentioned in the
  README. Worth a follow-up, but not blocking this fix.

---

**Next step (Superpowers):** wait for user approval, then move to
**Phase 2: Writing Plans** → `2026-06-21-met-paintings-filter-plan.md`
with TDD-style tasks (2–5 minutes each: write test, watch fail, fix,
watch pass, commit).

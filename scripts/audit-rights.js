'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('./catalog-lib');

const DATA_FILE = path.join(ROOT, 'data', 'collection.json');
const RUSSIAN_DATA_FILE = path.join(ROOT, 'data', 'russian-collection.json');
const REPORT_DIR = path.join(ROOT, 'reports');
const REPORT_FILE = path.join(REPORT_DIR, 'rights-audit.json');
const WRITE = process.argv.includes('--write');
const REFRESH = process.argv.includes('--refresh');
const BLOCKED = new Set([
  'wiki-the-persistence-of-memory',
  'wiki-the-son-of-man'
]);

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchWithRetry(url, options) {
  let response;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(url, options);
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt < 3) {
      const retryAfter = Number(response.headers.get('retry-after')) || (attempt + 1) * 2;
      await wait(retryAfter * 1000);
    }
  }
  return response;
}

function commonsFilename(artwork) {
  const sourceUrl = artwork.sourceUrl || '';
  if (sourceUrl.includes('commons.wikimedia.org/wiki/File:')) {
    return decodeURIComponent(sourceUrl.split('/wiki/File:').pop());
  }
  const imageUrl = artwork.image || '';
  if (!imageUrl.includes('upload.wikimedia.org')) return null;
  return decodeURIComponent((imageUrl.split('/').pop() || '').replace(/^\d+px-/, ''));
}

async function auditMet(artwork) {
  const objectId = artwork.id.replace(/^met-/, '');
  const url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + objectId;
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error('Met API ' + response.status);
  const data = await response.json();
  return {
    status: data.isPublicDomain === true ? 'verified' : 'blocked',
    license: data.isPublicDomain === true ? 'CC0 — The Met Open Access' : 'Not public domain',
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/' + objectId,
    evidenceUrl: url
  };
}

async function auditCommons(artwork) {
  const filename = commonsFilename(artwork);
  if (!filename) throw new Error('Could not determine Commons filename');
  const params = new URLSearchParams({
    action: 'query',
    titles: 'File:' + filename,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    format: 'json',
    origin: '*'
  });
  const url = 'https://commons.wikimedia.org/w/api.php?' + params.toString();
  const response = await fetchWithRetry(url, {
    headers: { 'User-Agent': 'MuseumAtHomeRightsAudit/2.0' }
  });
  if (!response.ok) throw new Error('Commons API ' + response.status);
  const data = await response.json();
  const page = Object.values(data.query && data.query.pages || {})[0] || {};
  const info = page.imageinfo && page.imageinfo[0] || {};
  const meta = info.extmetadata || {};
  const license = meta.LicenseShortName && meta.LicenseShortName.value || '';
  const copyrighted = meta.Copyrighted && meta.Copyrighted.value;
  const publicDomain = /public domain|pd-old|pdm/i.test(license) || copyrighted === 'False';
  return {
    status: publicDomain ? 'verified' : 'review',
    license: license || 'Unknown',
    sourceUrl: info.descriptionurl || artwork.image,
    evidenceUrl: url
  };
}

async function auditArtwork(artwork) {
  if (BLOCKED.has(artwork.id)) {
    return {
      id: artwork.id,
      status: 'blocked',
      license: 'Separate artwork license required',
      sourceUrl: artwork.image,
      reason: 'Commercial blocklist'
    };
  }
  try {
    const result = artwork.source === 'met'
      ? await auditMet(artwork)
      : await auditCommons(artwork);
    return { id: artwork.id, ...result };
  } catch (error) {
    return { id: artwork.id, status: 'error', reason: error.message };
  }
}

async function main() {
  const documents = [DATA_FILE, RUSSIAN_DATA_FILE].map((file) => ({
    file,
    data: JSON.parse(fs.readFileSync(file, 'utf8'))
  }));
  const artworks = documents.flatMap((document) => document.data.artworks);
  const previous = !REFRESH && fs.existsSync(REPORT_FILE)
    ? JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8')).results || []
    : [];
  const previousById = new Map(previous.map((item) => [item.id, item]));
  const results = [];
  for (const artwork of artworks) {
    const cached = previousById.get(artwork.id);
    if (cached && (cached.status === 'verified' || cached.status === 'blocked')) {
      results.push(cached);
      continue;
    }
    results.push(await auditArtwork(artwork));
    if (artwork.source !== 'met') await wait(175);
  }

  const verifiedAt = new Date().toISOString().slice(0, 10);
  const totals = results.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  const report = { verifiedAt, totals, results };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    REPORT_FILE,
    JSON.stringify(report, null, 2) + '\n',
    'utf8'
  );

  if (WRITE) {
    const byId = Object.fromEntries(results.map((item) => [item.id, item]));
    for (const document of documents) {
      for (const artwork of document.data.artworks) {
        const audit = byId[artwork.id];
        artwork.commercialUseAllowed = audit.status === 'verified';
        artwork.license = audit.license || artwork.license || 'Unknown';
        artwork.sourceUrl = audit.sourceUrl || artwork.sourceUrl || artwork.image;
        artwork.rightsVerifiedAt = verifiedAt;
        artwork.rightsStatus = audit.status;
      }
      fs.writeFileSync(document.file, JSON.stringify(document.data, null, 2) + '\n', 'utf8');
    }
  }

  console.log(JSON.stringify(totals, null, 2));
  if (totals.error) process.exitCode = 1;
}

main();

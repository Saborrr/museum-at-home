'use strict';

const path = require('node:path');
const { ROOT, loadCatalog, validateCatalog, writeBrowserCatalog } = require('./catalog-lib');

const strictAssets = process.argv.includes('--strict-assets');
const catalog = loadCatalog();
const result = validateCatalog(catalog, { strictAssets });

for (const warning of result.warnings) {
  console.warn('WARN:', warning);
}
if (result.errors.length) {
  for (const error of result.errors) console.error('ERROR:', error);
  process.exit(1);
}

writeBrowserCatalog(catalog, path.join(ROOT, 'js', 'catalog.es5.js'));
console.log('Generated catalog with ' + catalog.length + ' commercially cleared artworks.');

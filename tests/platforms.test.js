'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

test('PWA manifest is installable and points to wide artwork UI', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.name, 'Museum at Home');
  assert.equal(manifest.display, 'fullscreen');
  assert.equal(manifest.orientation, 'landscape');
  assert.ok(manifest.icons.some((icon) => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some((icon) => icon.sizes === '512x512'));
  assert.equal(manifest.screenshots[0].sizes, '1920x1080');
});

test('Samsung Tizen project targets TV and supports old web engines', () => {
  const config = read('platforms/tizen/config.xml');
  const runtime = read('js/app.es5.js');
  const platform = read('js/platform.es5.js');
  assert.match(config, /tizen:profile name="tv-samsung"/);
  assert.match(config, /required_version="2\.3"/);
  assert.match(runtime, /10009/);
  assert.match(platform, /ColorF0Red/);
});

test('Android wrapper is visible on TV launchers and needs no touchscreen', () => {
  const manifest = read('art-gallery-android/app/src/main/AndroidManifest.xml');
  const strings = read('art-gallery-android/app/src/main/res/values/strings.xml');
  assert.match(manifest, /android\.intent\.category\.LEANBACK_LAUNCHER/);
  assert.match(manifest, /android\.hardware\.touchscreen/);
  assert.match(manifest, /android:required="false"/);
  assert.match(manifest, /android:banner="@drawable\/banner"/);
  assert.match(strings, /Museum at Home/);
});

test('native TV wrappers declare input and lifecycle integration', () => {
  const tizen = read('platforms/tizen/config.xml');
  const activity = read('art-gallery-android/app/src/main/java/com/saborrr/museumathome/MainActivity.kt');
  const dream = read('art-gallery-android/app/src/main/java/com/saborrr/museumathome/ArtDreamService.kt');
  const gradle = read('art-gallery-android/app/build.gradle.kts');
  assert.match(tizen, /privilege\/tv\.inputdevice/);
  assert.match(activity, /MuseumAppPause/);
  assert.match(activity, /MuseumAppResume/);
  assert.match(activity, /removeView\(webView\)/);
  assert.match(dream, /MuseumAppPause/);
  assert.match(dream, /MuseumAppResume/);
  assert.match(dream, /removeView\(view\)/);
  assert.match(gradle, /syncMuseumWebAssets/);
  assert.match(gradle, /preBuild.*dependsOn/s);
});

test('Gradle sync uses an isolated Android asset generator with complete boundaries', () => {
  const gradle = read('art-gallery-android/app/build.gradle.kts');
  const generatorPath = path.join(root, 'scripts/build-android-assets.js');
  assert.equal(fs.existsSync(generatorPath), true, 'dedicated Android generator must exist');
  const generator = fs.readFileSync(generatorPath, 'utf8');

  assert.match(gradle, /scripts\/build-android-assets\.js/);
  assert.doesNotMatch(gradle, /build-platforms\.js/);
  for (const input of ['scripts', 'data', 'css', 'js', 'img', 'docs']) {
    assert.match(gradle, new RegExp(`fileTree\\(museumRoot\\.resolve\\("${input}"\\)\\)`));
  }
  for (const input of ['index.html', 'manifest.webmanifest', 'sw.js']) {
    assert.match(gradle, new RegExp(`museumRoot\\.resolve\\("${input.replace('.', '\\.') }"\\)`));
  }
  assert.match(gradle, /outputs\.dir\(layout\.projectDirectory\.dir\("src\/main\/assets"\)\)/);
  assert.doesNotMatch(gradle, /outputs\.(?:dir|file)[\s\S]*(?:dist|js\/catalog\.es5\.js)/);

  assert.doesNotMatch(generator, /dist/);
  assert.doesNotMatch(generator, /ROOT,\s*'js',\s*'catalog\.es5\.js'/);
  assert.match(generator, /writeBrowserCatalog\(catalog,\s*path\.join\(androidAssets,\s*'js',\s*'catalog\.es5\.js'\)\)/);
});

test('ambient chrome auto-hide setting survives validation', () => {
  const Core = require('../js/core.es5.js');
  assert.equal(Core.normalizeSettings({ chrome: 'always' }).chrome, 'always');
  assert.equal(Core.normalizeSettings({ chrome: 'invalid' }).chrome, 'auto');
});

test('gallery exposes bounded image recovery and localized settings', () => {
  const runtime = read('js/app.es5.js');
  const markup = read('index.html');
  assert.match(runtime, /nextAvailableIndex/);
  assert.match(runtime, /showLoadError/);
  assert.match(runtime, /loading\.classList\.contains\('is-error'\)[\s\S]{0,180}retryImages/);
  assert.match(runtime, /interval5m/);
  assert.match(runtime, /clearFilters/);
  assert.match(markup, /data-action="retry"/);
  assert.match(markup, /data-action="paused"/);
  assert.match(markup, /data-action="clock"/);
});

test('service worker separates versioned shell and bounded artwork caches', () => {
  const worker = read('sw.js');
  const platform = read('js/platform.es5.js');
  assert.match(worker, /SHELL_CACHE/);
  assert.match(worker, /ARTWORK_CACHE/);
  assert.match(worker, /MAX_ARTWORKS\s*=\s*40/);
  assert.match(worker, /request\.mode === 'navigate'/);
  assert.match(worker, /trimArtworkCache/);
  assert.match(worker, /museum-at-home-/);
  assert.match(platform, /registration\.update/);
});

test('the packaged Android WebView does not register a persistent service worker', () => {
  const platform = read('js/platform.es5.js');
  assert.match(
    platform,
    /var packaged = location\.hostname === 'appassets\.androidplatform\.net'/
  );
  assert.match(platform, /if \(!packaged &&/);
});
"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Art Gallery Screensaver — Main App
 * Controls slideshow, keyboard/remote input, settings
 */

var App = {
  artworks: [],
  currentIndex: 0,
  timer: null,
  settings: {},
  infoTimeout: null,
  isSettingsOpen: false,
  kenBurnsClass: null,
  kenBurnsCount: 6,
  // DOM refs
  els: {},
  // i18n: translations for UI strings. Add a key here once, use t(key) anywhere.
  I18N: {
    en: {
      settingsTitle: 'Settings',
      settingsInterval: 'Change interval',
      settingsTransition: 'Transition',
      settingsShowInfo: 'Show info',
      settingsCollection: 'Collection',
      settingsLanguage: 'Language',
      settingsHint: 'Press BACK or OK to close',
      settingsClose: '✕ Close Settings',
      loading: 'Loading art...',
      saved: 'Saved to favorites!',
      removed: 'Removed from favorites',
      errorNoArt: 'No artworks found. Check connection.',
      errorNoLocal: 'No local images. Run deploy.sh to download missing paintings.',
      errorChecking: 'Checking available artworks...',
      loadingCollection: 'Loading collection...',
      favHint: 'Press UP to save',
      descTitle: 'About this artwork',
      descHint: 'Press UP or OK to close',
      colAll: 'All',
      colImpressionism: 'Impressionism',
      colRenaissance: 'Renaissance',
      colModern: 'Modern',
      colFavorites: '❤️ Favorites',
      transFade: 'Fade',
      transSlide: 'Slide',
      transZoom: 'Zoom',
      transKenBurns: 'Ken Burns',
      infoAlways: 'Always',
      infoBrief: 'Brief',
      infoNever: 'Never',
      i15: '15s',
      i30: '30s',
      i60: '1 min',
      i120: '2 min',
      i300: '5 min'
    },
    ru: {
      settingsTitle: 'Настройки',
      settingsInterval: 'Интервал',
      settingsTransition: 'Переход',
      settingsShowInfo: 'Показывать инфо',
      settingsCollection: 'Коллекция',
      settingsLanguage: 'Язык',
      settingsHint: 'Нажмите BACK или OK для закрытия',
      settingsClose: '✕ Закрыть настройки',
      loading: 'Загрузка картин...',
      saved: 'Добавлено в избранное',
      removed: 'Удалено из избранного',
      errorNoArt: 'Картины не найдены. Проверьте соединение.',
      errorNoLocal: 'Нет локальных картин. Запустите deploy.sh для скачивания.',
      errorChecking: 'Проверка доступных картин...',
      loadingCollection: 'Загрузка коллекции...',
      favHint: 'Нажмите UP чтобы сохранить',
      descTitle: 'Об этой картине',
      descHint: 'Нажмите UP или OK для закрытия',
      colAll: 'Все',
      colImpressionism: 'Импрессионизм',
      colRenaissance: 'Ренессанс',
      colModern: 'Модерн',
      colFavorites: '❤️ Избранное',
      transFade: 'Затухание',
      transSlide: 'Сдвиг',
      transZoom: 'Зум',
      transKenBurns: 'Кен Бёрнс',
      infoAlways: 'Всегда',
      infoBrief: 'Кратко',
      infoNever: 'Никогда',
      i15: '15 сек',
      i30: '30 сек',
      i60: '1 мин',
      i120: '2 мин',
      i300: '5 мин'
    }
  },
  // Translation helper
  t: function t(key) {
    var lang = (this.settings && this.settings.language) || 'en';
    var dict = this.I18N[lang] || this.I18N.en;
    return dict[key] || this.I18N.en[key] || key;
  },
  /**
   * Apply current language to all data-i18n elements in the DOM,
   * plus dynamic labels (close button, etc).
   * No prefix preservation — full replacement every time (idempotent).
   */
  applyLanguage: function applyLanguage() {
    var app = this;
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      var dict = app.I18N[app.settings.language] || app.I18N.en;
      var val = dict[key];
      if (val) nodes[i].textContent = val;
    }
    // Update settings-panel button labels via mapping table (overrides HTML defaults)
    var btnMaps = {
      collection: { all: 'colAll', impressionism: 'colImpressionism', renaissance: 'colRenaissance', modern: 'colModern', favorites: 'colFavorites' },
      transition: { fade: 'transFade', slide: 'transSlide', zoom: 'transZoom', kenburns: 'transKenBurns' },
      showInfo: { always: 'infoAlways', brief: 'infoBrief', never: 'infoNever' },
      language: { en: 'English', ru: 'Русский' },
      interval: { '15': 'i15', '30': 'i30', '60': 'i60', '120': 'i120', '300': 'i300' }
    };
    var groups = document.querySelectorAll('.setting-options');
    for (var gi = 0; gi < groups.length; gi++) {
      var grp = groups[gi];
      var sKey = grp.dataset.setting;
      var map = btnMaps[sKey];
      if (!map) continue;
      var btns = grp.querySelectorAll('button');
      var langDict = app.I18N[app.settings.language] || app.I18N.en;
      var enDict = app.I18N.en;
      for (var bi = 0; bi < btns.length; bi++) {
        var dictKey = map[btns[bi].dataset.value];
        if (dictKey && langDict[dictKey]) {
          btns[bi].textContent = langDict[dictKey];
        } else if (dictKey && enDict[dictKey]) {
          btns[bi].textContent = enDict[dictKey];
        }
      }
    }
  },
  init: function init() {
    var _this = this;
    console.log('ArtGallery: init START, webOS=' + (window.PalmSystem ? 'YES' : 'NO'));
    // Ensure body can receive keyboard focus on webOS TV (required for Magic Remote keydown)
    document.body.setAttribute('tabindex', '0');
    document.body.style.outline = 'none';
    document.body.focus();
    console.log('ArtGallery: body focus=' + (document.activeElement === document.body ? 'YES' : document.activeElement && document.activeElement.tagName));
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            // Cache DOM elements
            _this.els = {
              image: document.getElementById('art-image'),
              title: document.getElementById('art-title'),
              artist: document.getElementById('art-artist'),
              year: document.getElementById('art-year'),
              museum: document.getElementById('art-museum'),
              info: document.getElementById('art-info'),
              settings: document.getElementById('settings-panel'),
              loading: document.getElementById('loading'),
              clock: document.getElementById('clock'),
              favHint: document.getElementById('fav-hint'),
              favIcon: document.getElementById('fav-icon'),
              favText: document.getElementById('fav-text'),
              favFlash: document.getElementById('fav-flash'),
              favBadge: document.getElementById('fav-badge'),
              favCount: document.getElementById('fav-count'),
              badgeFavIcon: document.getElementById('badge-fav-icon'),
              dbg: document.getElementById('debug-overlay'),
              descPanel: document.getElementById('description-panel'),
              descTitle: document.getElementById('desc-title'),
              descArtist: document.getElementById('desc-artist'),
              descMeta: document.getElementById('desc-meta'),
              descBody: document.getElementById('desc-body'),
              descClose: document.getElementById('desc-close')
            };
            console.log('ArtGallery: els cached, dbg=' + !!_this.els.dbg);

            // Recalculate text position when image actually renders
            _this.els.image.addEventListener('load', function () {
              // Small delay to let layout settle after paint
              setTimeout(function () {
                return _this.positionInfo();
              }, 50);
            });

            // Load saved settings
            _this.settings = ImageCache.loadSettings();
            _this.applySettingsUI();
            _this.applyLanguage();

            // Start clock
            _this.updateClock();
            setInterval(function () {
              return _this.updateClock();
            }, 1000);

            // Update favorites badge
            _this.updateFavBadge();

            // Load artworks — skip API, go straight to bundled (all local)
            console.log('ArtGallery: fetching bundled...');
            _context.n = 1;
            return MuseumAPI.fetchBundled();
          case 1:
            _this.artworks = _context.v;
            if (_this.artworks.length === 0) {
              _this.els.loading.querySelector('p').textContent = _this.t('errorNoArt');
              return _context.a(2);
            }
            // Filter: keep only artworks whose images actually load (skip 404s)
            _this.els.loading.querySelector('p').textContent = _this.t('errorChecking');
            _context.n = 10;
            return _this.filterAvailable(_this.artworks);
          case 10:
            _this.artworks = _context.v;
            if (_this.artworks.length === 0) {
              _this.els.loading.querySelector('p').textContent = _this.t('errorNoLocal');
              return _context.a(2);
            }
            _context.n = 2;
            break;
          case 2:
            // Shuffle and start
            _this.artworks = MuseumAPI.shuffle(_this.artworks);

            // Preload first 3 images, then start slideshow
            _context.n = 3;
            return ImageCache.preloadNext(_this.artworks, -1);
          case 3:
            _this.hideLoading();
            _this.showArtwork(0);
            _this.startTimer();

            // Preload remaining in background
            ImageCache.preloadNext(_this.artworks, 2);

            // Setup input handlers
            _this.setupInput();
            console.log('ArtGallery: setupInput() returned OK, ready. ' + _this.artworks.length + ' artworks loaded.');

            // Reposition info on resize
            window.addEventListener('resize', function () {
              return _this.positionInfo();
            });
          case 4:
            return _context.a(2);
        }
      }, _callee);
    }))();
  },
  /**
   * Position art info inside the actual painting bounds
   */
  positionInfo: function positionInfo(retryCount) {
    var self = this;
    var img = this.els.image;
    var info = this.els.info;
    var count = retryCount || 0;
    if (!img.naturalWidth || !img.naturalHeight) {
      if (count < 20) {
        setTimeout(function () {
          self.positionInfo(count + 1);
        }, 100);
      }
      return;
    }

    // The image element fills 100% of #art-wrapper via CSS,
    // so use the wrapper (parent) as the container reference
    var container = img.parentElement;
    var containerW = container.clientWidth;
    var containerH = container.clientHeight;
    var imgRatio = img.naturalWidth / img.naturalHeight;
    var boxRatio = containerW / containerH;
    var renderedW, renderedH, offsetX, offsetY;
    if (imgRatio > boxRatio) {
      // Landscape/wider image — fills width, bars top/bottom
      renderedW = containerW;
      renderedH = containerW / imgRatio;
      offsetX = 0;
      offsetY = (containerH - renderedH) / 2;
    } else {
      // Portrait/taller image — fills height, bars left/right
      renderedH = containerH;
      renderedW = containerH * imgRatio;
      offsetX = (containerW - renderedW) / 2;
      offsetY = 0;
    }

    // Clamp: never position outside the painting area
    var infoBottom = containerH - offsetY - renderedH;
    var infoLeft = offsetX;
    var infoWidth = renderedW;
    info.style.bottom = "".concat(Math.round(Math.max(infoBottom + 40, 20)), "px");
    info.style.left = "".concat(Math.round(infoLeft + 60), "px");
    info.style.width = "".concat(Math.round(infoWidth - 120), "px");
  },
  /**
   * Filter artworks: keep only those whose image files actually load.
   * Skips 404s so slideshow doesn't spin through phantom artworks.
   */
  filterAvailable: function filterAvailable(artworks) {
    var _this9 = this;
    return _asyncToGenerator(
    /*#__PURE__*/
    _regenerator().m(function _callee5() {
      var available, promises, i, results, ok;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            available = [];
            promises = [];
            for (i = 0; i < artworks.length; i++) {
              (function (art) {
                promises.push(
                  ImageCache.preload(art)["then"](function () {
                    available.push(art);
                  })["catch"](function () {
                    console.warn('Skipping missing image:', art.id);
                  })
                );
              })(artworks[i]);
            }
            _context5.n = 1;
            return Promise.all(promises);
          case 1:
            // Shuffle available set so it's not in the order of the source list
            results = _toConsumableArray(available);
            for (var j = results.length - 1; j > 0; j--) {
              var k = Math.floor(Math.random() * (j + 1));
              var _ref = [results[j], results[k]];
              results[j] = _ref[0];
              results[k] = _ref[1];
            }
            // Make sure at least 1 is available; otherwise return empty
            ok = results.length > 0 ? results : [];
            return _context5.a(2, ok);
          case 2:
            return _context5.a(2);
        }
      }, _callee5);
    }))();
  },
  /**
   * Display artwork at index
   */
  showArtwork: function showArtwork(index) {
    var _this2 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var art, transition, imgEl, variant, isFav, _t;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            art = _this2.artworks[index];
            if (art) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            _this2.currentIndex = index;

            // Transition out
            transition = _this2.settings.transition;
            if (!(transition === 'fade' || transition === 'kenburns')) {
              _context2.n = 2;
              break;
            }
            _this2.els.image.classList.add('fade-out');
            _context2.n = 2;
            return _this2.wait(800);
          case 2:
            // Load image (from cache or network)
            imgEl = ImageCache.get(art.id);
            if (imgEl) {
              _context2.n = 6;
              break;
            }
            _context2.p = 3;
            _context2.n = 4;
            return ImageCache.preload(art);
          case 4:
            imgEl = ImageCache.get(art.id);
            _context2.n = 6;
            break;
          case 5:
            _context2.p = 5;
            _t = _context2.v;
            // Skip this artwork
            _this2.next();
            return _context2.a(2);
          case 6:
            // Remove previous Ken Burns class
            if (_this2.kenBurnsClass) {
              _this2.els.image.classList.remove(_this2.kenBurnsClass);
              _this2.kenBurnsClass = null;
            }

            // Set image
            _this2.els.image.src = art.image;

            // Transition in
            if (transition === 'kenburns') {
              // Pick a random Ken Burns variant
              variant = Math.floor(Math.random() * _this2.kenBurnsCount) + 1;
              _this2.kenBurnsClass = "ken-burns-".concat(variant);
              _this2.els.image.classList.remove('fade-out');
              _this2.els.image.classList.add(_this2.kenBurnsClass);
              // Set animation duration to match slideshow interval
              _this2.els.image.style.animationDuration = "".concat(_this2.settings.interval, "s");
            } else if (transition === 'fade') {
              _this2.els.image.classList.remove('fade-out');
              _this2.els.image.style.animationDuration = '';
            } else if (transition === 'slide') {
              _this2.els.image.className = 'slide-in';
              _this2.els.image.style.animationDuration = '';
            } else if (transition === 'zoom') {
              _this2.els.image.className = 'zoom-in';
              _this2.els.image.style.animationDuration = '';
            }

            // Update info
            _this2.els.title.textContent = art.title;
            _this2.els.artist.textContent = art.artist;
            _this2.els.year.textContent = art.year;
            _this2.els.museum.textContent = art.museum;
            // Remember current art for description panel
            _this2.currentArt = art;
            // Hide description panel when artwork changes (so it fades out with the painting)
            if (_this2.els.descPanel) _this2.els.descPanel.classList.add('hidden');
            // Pre-fill description panel so it's ready when user presses DOWN
            _this2.populateDescription();

            // Reset ALL favorite UI on artwork change so nothing leaks across paintings.
            // This is critical on webOS 3.0 where leftover animations can persist.
            if (_this2.els.favFlash) _this2.els.favFlash.classList.remove('show');
            if (_this2.els.favHint) {
              _this2.els.favHint.classList.remove('show', 'hide');
            }
            var lingeringParticles = document.querySelectorAll('.fav-particle');
            for (var pk = 0; pk < lingeringParticles.length; pk++) {
              lingeringParticles[pk].remove();
            }
            // Cancel any pending fav-hint timeout
            if (_this2._favHintTimeout) clearTimeout(_this2._favHintTimeout);

            // Show favorite indicator (heart on the picture itself, bottom-left)
            isFav = ImageCache.isFavorite(art.id);
            _this2.els.image.classList.toggle('is-fav', isFav);
            // Refresh the top-left badge so the heart reflects the NEW painting
            // (red only if this painting is in favorites — not just any fav).
            _this2.updateFavBadge();

            // Show/hide info based on settings
            _this2.showInfo();

            // Position info inside painting bounds (after image loads)
            requestAnimationFrame(function () {
              return _this2.positionInfo();
            });

            // Preload next images
            ImageCache.preloadNext(_this2.artworks, index);
          case 7:
            return _context2.a(2);
        }
      }, _callee2, null, [[3, 5]]);
    }))();
  },
  /**
   * Show artwork info based on setting
   */
  showInfo: function showInfo() {
    var _this3 = this;
    if (this.infoTimeout) clearTimeout(this.infoTimeout);
    if (this.settings.showInfo === 'never') {
      this.els.info.classList.add('hidden');
    } else if (this.settings.showInfo === 'brief') {
      this.els.info.classList.remove('hidden');
      this.infoTimeout = setTimeout(function () {
        _this3.els.info.classList.add('hidden');
      }, 5000);
    } else {
      this.els.info.classList.remove('hidden');
    }
  },
  /**
   * Slideshow timer
   */
  startTimer: function startTimer() {
    var _this4 = this;
    this.stopTimer();
    this.timer = setInterval(function () {
      return _this4.next();
    }, this.settings.interval * 1000);
  },
  stopTimer: function stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  next: function next() {
    // Don't cycle the slideshow while description panel is open
    if (this.els.descPanel && !this.els.descPanel.classList.contains('hidden')) return;
    var next = (this.currentIndex + 1) % this.artworks.length;
    this.showArtwork(next);
  },
  prev: function prev() {
    if (this.els.descPanel && !this.els.descPanel.classList.contains('hidden')) return;
    var prev = (this.currentIndex - 1 + this.artworks.length) % this.artworks.length;
    this.showArtwork(prev);
  },
  /**
   * Clock display
   */
  updateClock: function updateClock() {
    var now = new Date();
    var h = now.getHours().toString().padStart(2, '0');
    var m = now.getMinutes().toString().padStart(2, '0');
    this.els.clock.textContent = "".concat(h, ":").concat(m);
  },
  hideLoading: function hideLoading() {
    this.els.loading.classList.add('hidden');
  },
  wait: function wait(ms) {
    return new Promise(function (r) {
      return setTimeout(r, ms);
    });
  },
  /**
   * Populate description panel with the current artwork's details.
   * Shows long description (if available) plus full metadata.
   */
  /**
   * Populate description panel — fills fields and starts typewriter effect.
   */
  populateDescription: function populateDescription() {
    var app = this;
    var art = this.currentArt || this.artworks[this.currentIndex];
    if (!art) return;
    if (!this.els.descPanel) return;
    var lang = this.settings && this.settings.language || 'en';
    this.els.descTitle.textContent = art.title || (lang === 'ru' ? 'Без названия' : 'Untitled');
    this.els.descArtist.textContent = art.artist || (lang === 'ru' ? 'Неизвестный художник' : 'Unknown artist');
    var meta = [];
    if (art.year) meta.push(art.year);
    if (art.museum) meta.push(art.museum);
    this.els.descMeta.textContent = meta.join(' • ');
    // Pick description by current language
    var descKey = lang === 'ru' ? 'descriptionRu' : 'description';
    var body = (art[descKey] && art[descKey].length > 0) ? art[descKey]
      : (art.description && art.description.length > 0) ? art.description
      : (lang === 'ru'
        ? 'Подробное описание для этой картины пока недоступно. Известно: написана в ' + (art.year || 'неизвестная дата') + ', художник — ' + (art.artist || 'неизвестен') + '. Хранится в ' + (art.museum || 'неизвестном месте') + '.'
        : 'No detailed description available for this artwork yet. Known facts: painted in ' + (art.year || 'unknown date') + ' by ' + (art.artist || 'unknown artist') + '. Currently at ' + (art.museum || 'unknown location') + '.');
    this.els.descBody.textContent = '';
    if (this._smoothRevealTimer) clearTimeout(this._smoothRevealTimer);
    this.smoothRevealEffect(this.els.descBody, body);
  },
  /**
   * Smooth reveal effect — "morning mist clearing" style.
   * The whole description body fades in gently from below with a long ease-out
   * (~1.1s), and each word additionally fades in with a small stagger so the
   * text appears as a soft wave of clarity. No translateY/scale on individual
   * words (the previous typewriter's per-word jump was jerky — "обрывками").
   */
  smoothRevealEffect: function(el, text) {
    var app = this;
    if (this._smoothRevealTimer) clearTimeout(this._smoothRevealTimer);
    el.textContent = '';
    el.classList.add('typewriter-active');
    if (!text) { el.classList.remove('typewriter-active'); return; }
    // Build HTML — wrap each word in a span so we can stagger fade-in.
    var tokens = text.split(/(\s+)/);
    var html = '';
    for (var t = 0; t < tokens.length; t++) {
      var tok = tokens[t];
      if (tok && /\S/.test(tok)) {
        var safe = tok.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html += '<span class="smooth-word">' + safe + '</span>';
      } else {
        html += tok; // whitespace
      }
    }
    el.innerHTML = html;
    // Container starts dimmed and slightly below, then settles up smoothly.
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'opacity 1100ms cubic-bezier(0.25,0.46,0.45,0.94),' +
                          'transform 1100ms cubic-bezier(0.25,0.46,0.45,0.94)';
    // Force reflow before applying the transition (webOS 3.0 needs this).
    void el.offsetWidth;
    requestAnimationFrame(function() {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    // Per-word fade-in: pure opacity, no movement — the wave passes through.
    var words = el.querySelectorAll('.smooth-word');
    var baseStagger = 28; // ms between words — gentle, not rushed
    var startDelay = 80;  // small delay so the container starts fading first
    for (var w = 0; w < words.length; w++) {
      (function(idx) {
        var span = words[idx];
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.transition = 'opacity 480ms cubic-bezier(0.25,0.46,0.45,0.94)';
        setTimeout(function() { span.style.opacity = '1'; }, startDelay + idx * baseStagger);
      })(w);
    }
    // Auto-scroll description panel to bottom when content overflows.
    this._smoothRevealTimer = setTimeout(function() {
      var panel = el.parentNode;
      if (panel && panel.scrollHeight > panel.clientHeight) {
        panel.scrollTop = panel.scrollHeight;
      }
    }, 250);
    // Drop the active class once everything has settled in.
    setTimeout(function() { el.classList.remove('typewriter-active'); }, 1600);
  },
  /**
   * Toggle favorite with INSTANT UI feedback (don't wait for localStorage).
   * Storage is updated synchronously in cache.es5.js but UI shows the heart
   * immediately so the user gets no perceptible delay.
   */
  toggleFavorite: function toggleFavorite() {
    var app = this;
    var art = app.artworks[app.currentIndex];
    if (!art) return;
    // Determine current state SYNCHRONOUSLY (avoid waiting for ImageCache)
    var favs = ImageCache.getFavorites();
    var idx = -1;
    for (var i = 0; i < favs.length; i++) if (favs[i].id === art.id) idx = i;
    var added = idx === -1;
    // Update UI IMMEDIATELY
    app.els.image.classList.toggle('is-fav', added);
    if (added) {
      app.els.favIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n        <defs><linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">\n          <stop offset="0%" style="stop-color:#f0a0b0"/>\n          <stop offset="50%" style="stop-color:#d4708a"/>\n          <stop offset="100%" style="stop-color:#b85570"/>\n        </defs></defs>\n        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#hg)"/>\n      </svg>';
      app.els.favIcon.classList.remove('remove-icon');
    } else {
      app.els.favIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#555" stroke="#888" stroke-width="0.5"/>\n        <line x1="6" y1="6" x2="18" y2="18" stroke="#999" stroke-width="1.5" stroke-linecap="round"/>\n      </svg>';
      app.els.favIcon.classList.add('remove-icon');
    }
    app.els.favText.textContent = app.t(added ? 'saved' : 'removed');
    app._lastFavAction = added ? 'saved' : 'removed';
    app.els.favHint.classList.remove('show', 'hide');
    void app.els.favHint.offsetWidth;
    app.els.favHint.classList.add(added ? 'show' : 'hide');
    if (added) {
      app.els.favFlash.classList.remove('show');
      void app.els.favFlash.offsetWidth;
      app.els.favFlash.classList.add('show');
    }
    // Persist + spawn particles in background — don't await
    setTimeout(function () {
      try {
        ImageCache.toggleFavorite(art);
      } catch (e) { /* storage error — already shown UI */ }
      app.updateFavBadge();
    }, 0);
    if (added) app.spawnParticles(8);
    setTimeout(function () {
      app.els.favHint.classList.remove('show', 'hide');
      app.els.favFlash.classList.remove('show');
      var ps = document.querySelectorAll('.fav-particle');
      for (var j = 0; j < ps.length; j++) ps[j].remove();
    }, 3000);
  },
  spawnParticles: function spawnParticles(count) {
    var colors = ['#d4708a', '#c08090', '#e0a0b0', '#b86078', '#ddb8c4', '#ffffff'];
    var screensaver = document.getElementById('screensaver');
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      p.className = 'fav-particle';
      var angle = 360 / count * i;
      var distance = 60 + Math.random() * 40;
      var dx = Math.cos(angle * Math.PI / 180) * distance;
      var dy = Math.sin(angle * Math.PI / 180) * distance;
      var color = colors[Math.floor(Math.random() * colors.length)];
      var size = 4 + Math.random() * 6;
      p.style.width = "".concat(size, "px");
      p.style.height = "".concat(size, "px");
      p.style.background = color;
      p.style.boxShadow = "0 0 6px ".concat(color);
      p.style.setProperty('--dx', "".concat(dx, "px"));
      p.style.setProperty('--dy', "".concat(dy, "px"));
      p.style.animation = 'none';
      screensaver.appendChild(p);

      // Animate with unique direction (fallback for old browsers without .animate())
      try {
        p.animate([{
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1
        }, {
          transform: "translate(calc(-50% + ".concat(dx, "px), calc(-50% + ").concat(dy, "px)) scale(0.2)"),
          opacity: 0
        }], {
          duration: 600 + Math.random() * 300,
          easing: 'ease-out',
          fill: 'forwards'
        });
      } catch (e) {
        p.style.transition = 'all 0.6s ease-out';
        p.style.opacity = '0';
        p.style.transform = "translate(calc(-50% + ".concat(dx, "px), calc(-50% + ").concat(dy, "px)) scale(0.2)");
      }
    }
  },
  updateFavBadge: function updateFavBadge() {
    var count = ImageCache.getFavoritesCount();
    // The heart in the top-left reflects whether the CURRENTLY shown painting
    // is in favorites — NOT just whether ANY painting has been saved.
    // (Bug fix 28.06.2026: previously the heart was red as soon as any painting
    //  was favorited, which made it impossible to tell which painting was fav.)
    var currentArt = this.currentArt || (this.artworks && this.artworks[this.currentIndex]);
    var isCurrentFav = currentArt ? ImageCache.isFavorite(currentArt.id) : false;
    this.els.favCount.textContent = count;
    // 'has-favs' just reveals the badge (with count) when something is saved.
    this.els.favBadge.classList.toggle('has-favs', count > 0);
    // 'current-fav' adds the red glow + pulse ONLY for the currently shown fav.
    this.els.favBadge.classList.toggle('current-fav', isCurrentFav);
    // Heart glyph: red filled only if the current painting is a favorite.
    if (this.els.badgeFavIcon) {
      this.els.badgeFavIcon.textContent = isCurrentFav ? '❤️' : '🤍';
    }
  },
  /**
   * Settings UI
   */
  toggleSettings: function toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
    if (this.isSettingsOpen) {
      this.stopTimer();
      this.els.settings.classList.remove('hidden');
      this.focusFirstOption();
    } else {
      this.els.settings.classList.add('hidden');
      this.startTimer();
    }
  },
  applySettingsUI: function applySettingsUI() {
    var app = this;
    // Multi-select aware: collection can be 'all', 'favorites', or an array of tags.
    // Single-select for everything else.
    document.querySelectorAll('.setting-options').forEach(function (group) {
      var setting = group.dataset.setting;
      var value = app.settings[setting];
      var isMulti = setting === 'collection';
      group.querySelectorAll('button').forEach(function (btn) {
        var btnVal = btn.dataset.value;
        var active = isMulti
          ? (value === 'all' && btnVal === 'all')
            || (value === 'favorites' && btnVal === 'favorites')
            || (Array.isArray(value) && value.indexOf(btnVal) !== -1)
          : btnVal === value;
        btn.classList.toggle('active', !!active);
      });
    });
    // Close button inside settings panel
    var closeBtn = document.getElementById('settings-close-btn');
    if (closeBtn && !closeBtn._wired) {
      closeBtn._wired = true;
      closeBtn.addEventListener('click', function () {
        if (app.isSettingsOpen) app.toggleSettings();
      });
    }
  },
  focusFirstOption: function focusFirstOption() {
    var first = this.els.settings.querySelector('button');
    if (first) {
      document.querySelectorAll('.setting-options button').forEach(function (b) {
        return b.classList.remove('focused');
      });
      first.classList.add('focused');
    }
  },
  /**
   * Keyboard / Remote control input
   * WebOS remote maps to standard keys:
   *   Arrow keys, Enter, Backspace (back), Escape
   */
  setupInput: function setupInput() {
    // CRITICAL: use arrow function so `this` = App via lexical scope.
    // Otherwise ares-package's minifier renames `var _this7 = this;` to `var e = this;`
    // inside this function and clashes with the event parameter `e`, breaking all App method calls.
    var app = this;
    console.log('ArtGallery: setupInput() called');
    document.addEventListener('keydown', function (event) {
      // webOS 3.0 Magic Remote sends ONLY keyCode; e.key is always undefined here.
      // Real codes observed on LG 43UH610V:
      //   UP=38, DOWN=40, LEFT=37, RIGHT=39, OK=13, BACK=1003, 0=48, 1=49, RED=403
      var code = event.keyCode || event.which || 0;
      console.log('KEY ' + code + ' settings=' + app.isSettingsOpen);
      // Show on-screen debug overlay (last key pressed + current artwork)
      var dbg = document.getElementById('debug-overlay');
      if (dbg) {
        dbg.style.display = 'block';
        dbg.style.background = 'rgba(0,0,0,0.7)';
        var cur = app.artworks[app.currentIndex];
        var curTitle = cur ? cur.id : 'NONE';
        dbg.textContent = 'KEY ' + code + ' | settings=' + (app.isSettingsOpen ? 'OPEN' : 'closed') + ' | idx=' + app.currentIndex + '/' + app.artworks.length + ' cur=' + curTitle;
      }

      // ENTER / OK (13) — open settings OR click focused button in settings OR close description
      if (code === 13) {
        if (app.els.descPanel && !app.els.descPanel.classList.contains('hidden')) {
          // Close description panel and resume slideshow
          app.els.descPanel.classList.add('hidden');
          if (app.els.descClose) app.els.descClose.classList.remove('focused');
          app.startTimer();
          if (event.preventDefault) event.preventDefault();
          return;
        }
        if (app.isSettingsOpen) {
          var focusedBtn = app.els.settings.querySelector('button.focused');
          if (focusedBtn) focusedBtn.click();
        } else {
          app.toggleSettings();
        }
        if (event.preventDefault) event.preventDefault();
        return;
      }

      // BACK (1003 on webOS 3.0) — only close settings
      if (code === 1003) {
        if (app.isSettingsOpen) {
          app.toggleSettings();
          if (event.preventDefault) event.preventDefault();
        }
        return;
      }

      // If settings open — navigate inside with arrows
      if (app.isSettingsOpen) {
        app.handleSettingsInput(event);
        return;
      }

      // LEFT (37) — previous artwork
      if (code === 37) {
        app.prev();
        app.startTimer();
        return;
      }

      // RIGHT (39) — next artwork
      if (code === 39) {
        app.next();
        app.startTimer();
        return;
      }

      // UP (38) — if description panel is open, close it; otherwise save/remove favorite
      if (code === 38) {
        if (app.els.descPanel && !app.els.descPanel.classList.contains('hidden')) {
          app.els.descPanel.classList.add('hidden');
          if (app.els.descClose) app.els.descClose.classList.remove('focused');
          return;
        }
        app.toggleFavorite();
        return;
      }

      // DOWN (40) — show description panel (or close it if already open).
      // Also pauses the slideshow so the picture doesn't change while reading.
      if (code === 40) {
        if (app.els.descPanel) {
          if (app.els.descPanel.classList.contains('hidden')) {
            app.populateDescription();
            app.els.descPanel.classList.remove('hidden');
            if (app.descCloseTimeout) clearTimeout(app.descCloseTimeout);
            // Pause slideshow while reading
            app.stopTimer();
            // Auto-focus the close button so user knows how to dismiss
            if (app.els.descClose) {
              app.els.descClose.classList.add('focused');
            }
          } else {
            app.els.descPanel.classList.add('hidden');
            if (app.els.descClose) app.els.descClose.classList.remove('focused');
            // Resume slideshow after closing
            app.startTimer();
          }
        }
        return;
      }

      // UP (38) — close description if open (also resumes slideshow)
      if (code === 38) {
        if (app.els.descPanel && !app.els.descPanel.classList.contains('hidden')) {
          app.els.descPanel.classList.add('hidden');
          if (app.els.descClose) app.els.descClose.classList.remove('focused');
          app.startTimer();
          return;
        }
        app.toggleFavorite();
        return;
      }

      // Number keys — quick-jump to N-th artwork (handy)
      if (code >= 48 && code <= 57) {
        var idx = (code - 48) % Math.max(app.artworks.length, 1);
        if (app.artworks[idx]) app.showArtwork(idx);
        return;
      }
    });

    // Settings button clicks (for mouse/touch — also works on TV).
    // Use `app` (same name as in keydown handler above) so ares-package's
    // minifier doesn't break the closure reference.
    document.querySelectorAll('.setting-options button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('.setting-options');
        var setting = group.dataset.setting;
        var btnVal = btn.dataset.value;

        // Multi-select toggle for collection. Special handling:
        // - 'all' is exclusive: selecting it clears tag selections.
        // - 'favorites' is exclusive: same.
        // - Tag toggles (impressionism/renaissance/etc.) add/remove from array.
        if (setting === 'collection') {
          if (btnVal === 'all' || btnVal === 'favorites') {
            app.settings.collection = btnVal;
          } else {
            // Switch to array mode if currently 'all' or 'favorites'
            var cur = app.settings.collection;
            if (!Array.isArray(cur)) cur = [];
            var idx = cur.indexOf(btnVal);
            if (idx === -1) cur.push(btnVal); else cur.splice(idx, 1);
            app.settings.collection = cur.length === 0 ? 'all' : cur;
          }
          app.applySettingsUI(); // refresh .active classes
        } else {
          app.settings[setting] = btnVal;
          group.querySelectorAll('button').forEach(function (b) {
            return b.classList.remove('active');
          });
          btn.classList.add('active');
        }

        ImageCache.saveSettings(app.settings);
        // Re-apply language when language setting changes.
        // Also refresh description panel + fav-hint labels so they update immediately
        // (don't wait for the next artwork change).
        if (setting === 'language') {
          app.applyLanguage();
          if (app.currentArt) {
            app.populateDescription();
          }
          // Re-translate the central fav hint if it's currently showing
          if (app.els.favText && !app.els.favHint.classList.contains('hidden')) {
            app.els.favText.textContent = app.t(app._lastFavAction || 'saved');
          }
          // Update loading text if loading
          if (app.els.loading && !app.els.loading.classList.contains('hidden')) {
            var lp = app.els.loading.querySelector('p');
            if (lp) lp.textContent = app.t('errorChecking');
          }
        }

        // If collection changed, reload
        if (setting === 'collection') {
          app.reloadCollection();
        }

        // If interval changed, restart timer
        if (setting === 'interval') {
          app.startTimer();
        }
      });
    });
  },
  handleSettingsInput: function handleSettingsInput(e) {
    var app = this;
    var code = e.keyCode;
    // Build list of groups + Close button (Close is the "virtual" 5th target)
    var groupEls = app.els.settings.querySelectorAll('.setting-options');
    var groups = [];
    for (var gi = 0; gi < groupEls.length; gi++) {
      groups.push(Array.prototype.slice.call(groupEls[gi].querySelectorAll('button')));
    }
    var closeBtn = document.getElementById('settings-close-btn');

    // Locate currently focused element (group index + button index OR close)
    var focusedGroup = -1;
    var focusedBtnIdx = -1;
    var focusedIsClose = false;
    for (var g = 0; g < groups.length; g++) {
      for (var b = 0; b < groups[g].length; b++) {
        if (groups[g][b].classList.contains('focused')) {
          focusedGroup = g;
          focusedBtnIdx = b;
        }
      }
    }
    if (focusedGroup === -1 && closeBtn && closeBtn.classList.contains('focused')) {
      focusedIsClose = true;
    }

    // Helpers
    function clearAll() {
      for (var g2 = 0; g2 < groups.length; g2++) {
        for (var b2 = 0; b2 < groups[g2].length; b2++) {
          groups[g2][b2].classList.remove('focused');
        }
      }
      if (closeBtn) closeBtn.classList.remove('focused');
    }
    function focusG(g, b) { groups[g][b].classList.add('focused'); }
    function focusClose() { if (closeBtn) closeBtn.classList.add('focused'); }

    // Default focus if nothing selected
    if (focusedGroup === -1 && !focusedIsClose) {
      clearAll();
      if (groups.length > 0 && groups[0].length > 0) focusG(0, 0);
      return;
    }

    if (code === 37) { // LEFT — previous button in same group
      clearAll();
      if (focusedIsClose) {
        var lg = groups.length - 1;
        focusG(lg, groups[lg].length - 1);
      } else if (focusedBtnIdx > 0) {
        focusG(focusedGroup, focusedBtnIdx - 1);
      } else {
        focusG(focusedGroup, focusedBtnIdx);
      }
    } else if (code === 39) { // RIGHT — next button in same group
      clearAll();
      if (focusedIsClose) {
        focusClose();
      } else if (focusedBtnIdx < groups[focusedGroup].length - 1) {
        focusG(focusedGroup, focusedBtnIdx + 1);
      } else {
        focusG(focusedGroup, focusedBtnIdx);
      }
    } else if (code === 38) { // UP — previous group, same column
      clearAll();
      if (focusedIsClose) {
        var lg2 = groups.length - 1;
        focusG(lg2, groups[lg2].length - 1);
      } else if (focusedGroup > 0) {
        var prevLen = groups[focusedGroup - 1].length;
        focusG(focusedGroup - 1, Math.min(focusedBtnIdx, prevLen - 1));
      } else {
        focusG(focusedGroup, focusedBtnIdx);
      }
    } else if (code === 40) { // DOWN — next group, same column (or close at the end)
      clearAll();
      if (focusedIsClose) {
        focusG(0, 0);
      } else if (focusedGroup < groups.length - 1) {
        var nextLen = groups[focusedGroup + 1].length;
        focusG(focusedGroup + 1, Math.min(focusedBtnIdx, nextLen - 1));
      } else {
        focusClose();
      }
    } else if (code === 13) { // ENTER — click focused
      if (focusedIsClose) {
        app.toggleSettings();
      } else if (focusedGroup >= 0) {
        groups[focusedGroup][focusedBtnIdx].click();
      }
    } else if (code === 461 || code === 1003 || code === 27) {
      app.toggleSettings();
    }
  },
  reloadCollection: function reloadCollection() {
    var _this8 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            _this8.els.loading.querySelector('p').textContent = 'Loading collection...';
            _this8.els.loading.classList.remove('hidden');
            _context4.n = 1;
            return MuseumAPI.getArtworks(_this8.settings.collection);
          case 1:
            _this8.artworks = _context4.v;
            _this8.artworks = MuseumAPI.shuffle(_this8.artworks);
            ImageCache.cache.clear();
            _context4.n = 2;
            return ImageCache.preloadNext(_this8.artworks, -1);
          case 2:
            _this8.hideLoading();
            _this8.showArtwork(0);
            _this8.startTimer();
          case 3:
            return _context4.a(2);
        }
      }, _callee4);
    }))();
  }
};

// Start the app
window.onerror = function (msg, url, line, col, err) {
  console.error('window.onerror:', msg, '@', line + ':' + col, err && err.stack);
  var dbg = document.getElementById('debug-overlay');
  if (dbg) {
    dbg.style.display = 'block';
    dbg.style.background = 'rgba(120,0,0,0.85)';
    dbg.textContent = 'ERR ' + line + ': ' + msg;
  }
  var el = document.getElementById('loading');
  if (el) el.querySelector('p').textContent = 'Error: ' + msg;
};
window.addEventListener('unhandledrejection', function (e) {
  console.error('Unhandled rejection:', e.reason && (e.reason.message || e.reason));
});
document.addEventListener('DOMContentLoaded', function () {
  console.log('ArtGallery: DOMContentLoaded fired');
  App.init()["catch"](function (err) {
    console.error('App init error:', err && err.stack || err);
    var el = document.getElementById('loading');
    if (el) el.querySelector('p').textContent = 'Init Error: ' + (err && err.message || err);
  });
});

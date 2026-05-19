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
  init: function init() {
    var _this = this;
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
              favCount: document.getElementById('fav-count')
            };

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

            // Start clock
            _this.updateClock();
            setInterval(function () {
              return _this.updateClock();
            }, 1000);

            // Update favorites badge
            _this.updateFavBadge();

            // Load artworks — skip API, go straight to bundled (all local)
            _context.n = 1;
            return MuseumAPI.fetchBundled();
          case 1:
            _this.artworks = _context.v;
            if (!(_this.artworks.length === 0)) {
              _context.n = 2;
              break;
            }
            _this.els.loading.querySelector('p').textContent = 'No artworks found. Check connection.';
            return _context.a(2);
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
    info.style.bottom = "".concat(Math.round(Math.max(infoBottom + 14, 6)), "px");
    info.style.left = "".concat(Math.round(infoLeft + 20), "px");
    info.style.width = "".concat(Math.round(infoWidth - 40), "px");
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

            // Show favorite indicator
            isFav = ImageCache.isFavorite(art.id);
            _this2.els.image.classList.toggle('is-fav', isFav);

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
    var next = (this.currentIndex + 1) % this.artworks.length;
    this.showArtwork(next);
  },
  prev: function prev() {
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
   * Toggle favorite for current artwork — with particle burst
   */
  toggleFavorite: function toggleFavorite() {
    var _this5 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var art, added;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            art = _this5.artworks[_this5.currentIndex];
            if (art) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            _context3.n = 2;
            return ImageCache.toggleFavorite(art);
          case 2:
            added = _context3.v;
            // Update UI
            _this5.els.image.classList.toggle('is-fav', added);
            _this5.updateFavBadge();

            // Flash effect
            _this5.els.favFlash.classList.remove('show');
            void _this5.els.favFlash.offsetWidth; // reflow
            if (added) _this5.els.favFlash.classList.add('show');

            // Heart animation
            if (added) {
              _this5.els.favIcon.innerHTML = "<svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs><linearGradient id=\"hg\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n          <stop offset=\"0%\" style=\"stop-color:#f0a0b0\"/>\n          <stop offset=\"50%\" style=\"stop-color:#d4708a\"/>\n          <stop offset=\"100%\" style=\"stop-color:#b85570\"/>\n        </linearGradient></defs>\n        <path d=\"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\" fill=\"url(#hg)\"/>\n      </svg>";
              _this5.els.favIcon.classList.remove('remove-icon');
            } else {
              _this5.els.favIcon.innerHTML = "<svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n        <path d=\"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\" fill=\"#555\" stroke=\"#888\" stroke-width=\"0.5\"/>\n        <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\" stroke=\"#999\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n      </svg>";
              _this5.els.favIcon.classList.add('remove-icon');
            }
            _this5.els.favText.textContent = added ? 'Saved!' : 'Removed';
            _this5.els.favHint.classList.remove('show', 'hide');
            void _this5.els.favHint.offsetWidth; // reflow
            _this5.els.favHint.classList.add(added ? 'show' : 'hide');

            // Particle burst (only on add)
            if (added) {
              _this5.spawnParticles(8);
            }
            setTimeout(function () {
              _this5.els.favHint.classList.remove('show', 'hide');
              _this5.els.favFlash.classList.remove('show');
              // Clean particles
              document.querySelectorAll('.fav-particle').forEach(function (p) {
                return p.remove();
              });
            }, 1500);
          case 3:
            return _context3.a(2);
        }
      }, _callee3);
    }))();
  },
  /**
   * Spawn particle burst around center
   */
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
    this.els.favCount.textContent = count;
    this.els.favBadge.style.opacity = count > 0 ? '0.5' : '0.2';
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
    var _this6 = this;
    document.querySelectorAll('.setting-options').forEach(function (group) {
      var setting = group.dataset.setting;
      var value = _this6.settings[setting];
      group.querySelectorAll('button').forEach(function (btn) {
        btn.classList.toggle('active', btn.dataset.value === value);
      });
    });
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
    var _this7 = this;
    var focusedBtn = null;
    document.addEventListener('keydown', function (e) {
      // Settings open — navigate settings
      if (_this7.isSettingsOpen) {
        _this7.handleSettingsInput(e);
        return;
      }
      switch (e.keyCode) {
        case 37: // LEFT
        case 174:
          // webOS Channel Down
          _this7.prev();
          _this7.startTimer(); // Reset timer on manual change
          break;
        case 39: // RIGHT  
        case 175:
          // webOS Channel Up
          _this7.next();
          _this7.startTimer();
          break;
        case 38: // UP — save to favorites
        case 48:
          // 0 key (alternative)
          _this7.toggleFavorite();
          break;
        case 13: // ENTER / OK
        case 461: // webOS Back
        case 27:
          // ESC
          _this7.toggleSettings();
          break;
        case 40:
          // DOWN — show info briefly
          _this7.els.info.classList.remove('hidden');
          if (_this7.infoTimeout) clearTimeout(_this7.infoTimeout);
          _this7.infoTimeout = setTimeout(function () {
            if (_this7.settings.showInfo === 'never' || _this7.settings.showInfo === 'brief') {
              _this7.els.info.classList.add('hidden');
            }
          }, 5000);
          break;
      }
    });

    // Settings button clicks (for mouse/touch — also works on TV)
    document.querySelectorAll('.setting-options button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('.setting-options');
        var setting = group.dataset.setting;
        _this7.settings[setting] = btn.dataset.value;
        group.querySelectorAll('button').forEach(function (b) {
          return b.classList.remove('active');
        });
        btn.classList.add('active');
        ImageCache.saveSettings(_this7.settings);

        // If collection changed, reload
        if (setting === 'collection') {
          _this7.reloadCollection();
        }

        // If interval changed, restart timer
        if (setting === 'interval') {
          _this7.startTimer();
        }
      });
    });
  },
  handleSettingsInput: function handleSettingsInput(e) {
    var _buttons$focusedIdx7;
    var buttons = _toConsumableArray(this.els.settings.querySelectorAll('button'));
    var focusedIdx = buttons.findIndex(function (b) {
      return b.classList.contains('focused');
    });
    switch (e.keyCode) {
      case 38:
        // UP
        if (focusedIdx > 0) {
          var _buttons$focusedIdx, _buttons;
          (_buttons$focusedIdx = buttons[focusedIdx]) === null || _buttons$focusedIdx === void 0 || _buttons$focusedIdx.classList.remove('focused');
          (_buttons = buttons[focusedIdx - 1]) === null || _buttons === void 0 || _buttons.classList.add('focused');
        }
        break;
      case 40:
        // DOWN
        if (focusedIdx < buttons.length - 1) {
          var _buttons$focusedIdx2, _buttons2;
          (_buttons$focusedIdx2 = buttons[focusedIdx]) === null || _buttons$focusedIdx2 === void 0 || _buttons$focusedIdx2.classList.remove('focused');
          (_buttons2 = buttons[focusedIdx + 1]) === null || _buttons2 === void 0 || _buttons2.classList.add('focused');
        }
        break;
      case 37:
        // LEFT — previous in current group
        if (focusedIdx > 0) {
          var _buttons$prev, _buttons$focusedIdx3;
          var prev = focusedIdx - 1;
          // Stay in same group
          if (((_buttons$prev = buttons[prev]) === null || _buttons$prev === void 0 ? void 0 : _buttons$prev.closest('.setting-options')) === ((_buttons$focusedIdx3 = buttons[focusedIdx]) === null || _buttons$focusedIdx3 === void 0 ? void 0 : _buttons$focusedIdx3.closest('.setting-options'))) {
            var _buttons$focusedIdx4, _buttons$prev2;
            (_buttons$focusedIdx4 = buttons[focusedIdx]) === null || _buttons$focusedIdx4 === void 0 || _buttons$focusedIdx4.classList.remove('focused');
            (_buttons$prev2 = buttons[prev]) === null || _buttons$prev2 === void 0 || _buttons$prev2.classList.add('focused');
          }
        }
        break;
      case 39:
        // RIGHT — next in current group
        if (focusedIdx < buttons.length - 1) {
          var _buttons$next, _buttons$focusedIdx5;
          var next = focusedIdx + 1;
          if (((_buttons$next = buttons[next]) === null || _buttons$next === void 0 ? void 0 : _buttons$next.closest('.setting-options')) === ((_buttons$focusedIdx5 = buttons[focusedIdx]) === null || _buttons$focusedIdx5 === void 0 ? void 0 : _buttons$focusedIdx5.closest('.setting-options'))) {
            var _buttons$focusedIdx6, _buttons$next2;
            (_buttons$focusedIdx6 = buttons[focusedIdx]) === null || _buttons$focusedIdx6 === void 0 || _buttons$focusedIdx6.classList.remove('focused');
            (_buttons$next2 = buttons[next]) === null || _buttons$next2 === void 0 || _buttons$next2.classList.add('focused');
          }
        }
        break;
      case 13:
        // ENTER — select
        if (focusedIdx >= 0) (_buttons$focusedIdx7 = buttons[focusedIdx]) === null || _buttons$focusedIdx7 === void 0 || _buttons$focusedIdx7.click();
        break;
      case 461: // webOS Back
      case 27:
        // ESC
        this.toggleSettings();
        break;
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
window.onerror = function (msg, url, line) {
  var el = document.getElementById('loading');
  if (el) el.querySelector('p').textContent = 'Error: ' + msg;
};
document.addEventListener('DOMContentLoaded', function () {
  App.init();
});

"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Image Cache — preloads and caches images for smooth transitions
 * Uses in-memory cache + preloading strategy
 */

var ImageCache = {
  cache: new Map(),
  maxSize: 30,
  preloadCount: 3,
  // How many images to preload ahead
  /**
   * Preload an image and add to cache
   */
  preload: function preload(artwork) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      if (_this.cache.has(artwork.id)) {
        resolve(artwork);
        return;
      }
      var img = new Image();
      img.onload = function () {
        _this.cache.set(artwork.id, {
          artwork: artwork,
          element: img,
          loadedAt: Date.now()
        });

        // Evict oldest if over max
        if (_this.cache.size > _this.maxSize) {
          var oldest = _this.findOldest();
          if (oldest) _this.cache["delete"](oldest);
        }
        resolve(artwork);
      };
      img.onerror = function () {
        console.warn('Failed to load:', artwork.title);
        reject(new Error('Image load failed'));
      };
      img.src = artwork.image;
    });
  },
  /**
   * Preload next N artworks
   */
  preloadNext: function preloadNext(artworks, currentIndex) {
    var _this2 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var promises, i, idx;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            promises = [];
            for (i = 1; i <= _this2.preloadCount; i++) {
              idx = (currentIndex + i) % artworks.length;
              if (!_this2.cache.has(artworks[idx].id)) {
                promises.push(_this2.preload(artworks[idx])["catch"](function () {}));
              }
            }
            _context.n = 1;
            return Promise.all(promises);
          case 1:
            return _context.a(2);
        }
      }, _callee);
    }))();
  },
  /**
   * Get cached image element
   */
  get: function get(id) {
    var entry = this.cache.get(id);
    return entry ? entry.element : null;
  },
  /**
   * Find oldest cache entry
   */
  findOldest: function findOldest() {
    var oldestKey = null;
    var oldestTime = Infinity;
    var _iterator = _createForOfIteratorHelper(this.cache),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          entry = _step$value[1];
        if (entry.loadedAt < oldestTime) {
          oldestTime = entry.loadedAt;
          oldestKey = key;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return oldestKey;
  },
  /**
   * Save settings to localStorage
   */
  saveSettings: function saveSettings(settings) {
    try {
      localStorage.setItem('artscreen-settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save settings');
    }
  },
  /**
   * Load settings from localStorage
   */
  loadSettings: function loadSettings() {
    try {
      var saved = localStorage.getItem('artscreen-settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Defaults
    return {
      interval: 30,
      transition: 'fade',
      showInfo: 'always',
      collection: 'all', // 'all' | 'favorites' | ['impressionism','renaissance',...]
      language: 'en'
    };
  },
  /**
   * Favorites — stored as array of artwork objects with base64 image data
   */
  getFavorites: function getFavorites() {
    try {
      var favs = localStorage.getItem('artscreen-favorites');
      return favs ? JSON.parse(favs) : [];
    } catch (e) {
      return [];
    }
  },
  isFavorite: function isFavorite(artworkId) {
    var favs = this.getFavorites();
    return favs.some(function (f) {
      return f.id === artworkId;
    });
  },
  toggleFavorite: function toggleFavorite(artwork) {
    var _this3 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var favs, idx, base64, favArt, _t;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            favs = _this3.getFavorites();
            idx = favs.findIndex(function (f) {
              return f.id === artwork.id;
            });
            if (!(idx >= 0)) {
              _context2.n = 1;
              break;
            }
            // Remove from favorites
            favs.splice(idx, 1);
            localStorage.setItem('artscreen-favorites', JSON.stringify(favs));
            return _context2.a(2, false);
          case 1:
            // Save just metadata + path; never embed base64 (would overflow localStorage quota on webOS TV).
            // We rely on img/paintings/ being bundled in the .ipk, so the image is always available.
            try {
              var slimArt = {
                id: artwork.id,
                title: artwork.title,
                artist: artwork.artist,
                year: artwork.year,
                museum: artwork.museum,
                image: artwork.image,
                thumb: artwork.thumb,
                source: artwork.source,
                savedAt: Date.now()
              };
              favs.push(slimArt);
              localStorage.setItem('artscreen-favorites', JSON.stringify(favs));
              return _context2.a(2, true);
            } catch (e) {
              console.warn('Save favorite failed (storage?):', e && e.message);
              return _context2.a(2, false);
            }
          case 3:
            _context2.p = 3;
            _t = _context2.v;
            console.warn('Failed to save favorite:', _t);
            return _context2.a(2, false);
          case 4:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 3]]);
    }))();
  },
  /**
   * Convert image URL to base64 for offline storage
   */
  imageToBase64: function imageToBase64(url) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = function () {
        return reject(new Error('CORS or load failed'));
      };
      img.src = url;
    });
  },
  getFavoritesCount: function getFavoritesCount() {
    return this.getFavorites().length;
  }
};

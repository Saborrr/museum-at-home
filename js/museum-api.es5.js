"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
 * Museum API — fetches art from Rijksmuseum + Met Museum
 * Both are free APIs with high-quality images
 */

var MuseumAPI = {
  // Rijksmuseum (Amsterdam) — free API key at https://data.rijksmuseum.nl/
  RIJKS_KEY: 'YOUR_RIJKSMUSEUM_API_KEY',
  // Get free key at data.rijksmuseum.nl

  // Met Museum Open Access — no key needed!
  MET_BASE: 'https://collectionapi.metmuseum.org/public/collection/v1',
  // Collections (search terms for filtering)
  collections: {
    all: '',
    impressionism: 'impressionism',
    renaissance: 'renaissance',
    modern: 'modern art'
  },
  /**
   * Fetch artworks from Rijksmuseum
   */
  fetchRijks: function fetchRijks() {
    var _arguments = arguments,
      _this = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var collection, count, query, url, resp, data, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            collection = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : '';
            count = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : 20;
            query = collection || 'painting';
            url = "https://www.rijksmuseum.nl/api/en/collection?key=".concat(_this.RIJKS_KEY) + "&q=".concat(encodeURIComponent(query), "&imgonly=true&ps=").concat(count, "&toppieces=true") + "&st=Objects&s=Relevance";
            _context.p = 1;
            _context.n = 2;
            return fetch(url);
          case 2:
            resp = _context.v;
            _context.n = 3;
            return resp.json();
          case 3:
            data = _context.v;
            return _context.a(2, data.artObjects.filter(function (art) {
              return art.webImage && art.webImage.url;
            }).map(function (art) {
              var _art$headerImage;
              return {
                id: "rijks-".concat(art.objectNumber),
                title: art.title,
                artist: art.principalOrFirstMaker,
                year: art.longTitle ? art.longTitle.split(',').pop().trim() : '',
                museum: 'Rijksmuseum, Amsterdam',
                image: art.webImage.url.replace('=s0', '=s1920'),
                // Request 1920px wide
                thumb: ((_art$headerImage = art.headerImage) === null || _art$headerImage === void 0 ? void 0 : _art$headerImage.url) || art.webImage.url.replace('=s0', '=s400'),
                source: 'rijksmuseum'
              };
            }));
          case 4:
            _context.p = 4;
            _t = _context.v;
            console.error('Rijksmuseum API error:', _t);
            return _context.a(2, []);
        }
      }, _callee, null, [[1, 4]]);
    }))();
  },
  /**
   * Fetch artworks from Met Museum (no key needed!)
   */
  fetchMet: function fetchMet() {
    var _arguments2 = arguments,
      _this2 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var collection, count, query, searchUrl, searchResp, searchData, ids, artworks, _iterator, _step, id, resp, obj, _t2, _t3, _t4;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            collection = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : '';
            count = _arguments2.length > 1 && _arguments2[1] !== undefined ? _arguments2[1] : 20;
            query = collection || 'paintings';
            _context2.p = 1;
            // Step 1: Search for objects
            searchUrl = "".concat(_this2.MET_BASE, "/search?q=").concat(encodeURIComponent(query), "&hasImages=true&isHighlight=true&medium=Paintings");
            _context2.n = 2;
            return fetch(searchUrl);
          case 2:
            searchResp = _context2.v;
            _context2.n = 3;
            return searchResp.json();
          case 3:
            searchData = _context2.v;
            if (!(!searchData.objectIDs || searchData.objectIDs.length === 0)) {
              _context2.n = 4;
              break;
            }
            return _context2.a(2, []);
          case 4:
            // Step 2: Fetch details for random subset (avoid hammering API)
            ids = _this2.shuffle(searchData.objectIDs).slice(0, count);
            artworks = [];
            _iterator = _createForOfIteratorHelper(ids);
            _context2.p = 5;
            _iterator.s();
          case 6:
            if ((_step = _iterator.n()).done) {
              _context2.n = 12;
              break;
            }
            id = _step.value;
            _context2.p = 7;
            _context2.n = 8;
            return fetch("".concat(_this2.MET_BASE, "/objects/").concat(id));
          case 8:
            resp = _context2.v;
            _context2.n = 9;
            return resp.json();
          case 9:
            obj = _context2.v;
            if (obj.primaryImage && obj.isPublicDomain && _this2.isPainting(obj)) {
              artworks.push({
                id: "met-".concat(obj.objectID),
                title: obj.title,
                artist: obj.artistDisplayName || 'Unknown',
                year: obj.objectDate || '',
                museum: 'Metropolitan Museum of Art, New York',
                image: obj.primaryImage,
                thumb: obj.primaryImageSmall || obj.primaryImage,
                source: 'met'
              });
            }
            _context2.n = 11;
            break;
          case 10:
            _context2.p = 10;
            _t2 = _context2.v;
          case 11:
            _context2.n = 6;
            break;
          case 12:
            _context2.n = 14;
            break;
          case 13:
            _context2.p = 13;
            _t3 = _context2.v;
            _iterator.e(_t3);
          case 14:
            _context2.p = 14;
            _iterator.f();
            return _context2.f(14);
          case 15:
            return _context2.a(2, artworks);
          case 16:
            _context2.p = 16;
            _t4 = _context2.v;
            console.error('Met Museum API error:', _t4);
            return _context2.a(2, []);
        }
      }, _callee2, null, [[7, 10], [5, 13, 14, 15], [1, 16]]);
    }))();
  },
  /**
   * Decide whether a Met object is a painting.
   * Accepts Paintings classification OR an objectName that starts with "Painting".
   */
  isPainting: function (obj) {
    var cls = (obj.classification || '').toLowerCase();
    var name = (obj.objectName || '').toLowerCase();
    return cls === 'paintings' || name.indexOf('painting') === 0;
  },
  /**
   * Load artworks from bundled collection (works offline & with file://)
   */
  fetchBundled: function fetchBundled() {
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var resp, _t5;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            if (!(typeof BUNDLED_ART !== 'undefined' && BUNDLED_ART.length > 0)) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2, BUNDLED_ART);
          case 1:
            _context3.p = 1;
            _context3.n = 2;
            return fetch('data/collection.json');
          case 2:
            resp = _context3.v;
            _context3.n = 3;
            return resp.json();
          case 3:
            return _context3.a(2, _context3.v);
          case 4:
            _context3.p = 4;
            _t5 = _context3.v;
            return _context3.a(2, []);
        }
      }, _callee3, null, [[1, 4]]);
    }))();
  },
  /**
   * Get art for a collection — tries API, falls back to bundled
   */
  getArtworks: function getArtworks() {
    var _arguments3 = arguments,
      _this3 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var collection, favs, tag, _yield$Promise$all, _yield$Promise$all2, rijks, met, all, bundled;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            collection = _arguments3.length > 0 && _arguments3[0] !== undefined ? _arguments3[0] : 'all';
            if (!(collection === 'favorites')) {
              _context4.n = 1;
              break;
            }
            favs = ImageCache.getFavorites(); // Convert saved favorites back to artwork format
            return _context4.a(2, favs.map(function (f) {
              return {
                id: f.id,
                title: f.title,
                artist: f.artist,
                year: f.year,
                museum: f.museum,
                image: f.imageB64 || f.image,
                // Use base64 if available (offline!)
                thumb: f.thumb || '',
                source: 'favorites'
              };
            }));
          case 1:
            tag = _this3.collections[collection] || ''; // Try both APIs in parallel
            _context4.n = 2;
            return Promise.all([_this3.fetchRijks(tag, 15), _this3.fetchMet(tag, 15)]);
          case 2:
            _yield$Promise$all = _context4.v;
            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
            rijks = _yield$Promise$all2[0];
            met = _yield$Promise$all2[1];
            all = [].concat(_toConsumableArray(rijks), _toConsumableArray(met)); // If APIs failed or returned nothing, use bundled
            if (!(all.length < 5)) {
              _context4.n = 4;
              break;
            }
            _context4.n = 3;
            return _this3.fetchBundled();
          case 3:
            bundled = _context4.v;
            all = [].concat(_toConsumableArray(all), _toConsumableArray(bundled));
          case 4:
            return _context4.a(2, _this3.shuffle(all));
        }
      }, _callee4);
    }))();
  },
  /** Shuffle array */shuffle: function shuffle(arr) {
    var a = _toConsumableArray(arr);
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var _ref = [a[j], a[i]];
      a[i] = _ref[0];
      a[j] = _ref[1];
    }
    return a;
  }
};

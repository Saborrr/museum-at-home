(function () {
  'use strict';

  var SETTINGS_KEY = 'museumAtHome.settings.v2';
  var FAVORITES_KEY = 'museumAtHome.favorites.v2';
  var LEGACY_FAVORITES_KEY = 'artscreen-favorites';
  var MOTION_CLASSES = ['motion-a', 'motion-b', 'motion-c'];
  // Artwork files are large and TVs can sit on slow Wi-Fi. This remains well below the 200s+
  // browser-network hang observed in testing without declaring a healthy 17s response broken.
  var STALLED_LOAD_MS = 45000;
  // Two stalled loads in a row mean the connection is dead, not that one artwork is broken.
  var MAX_CONSECUTIVE_STALLS = 2;

  var I18N = {
    ru: {
      all: 'Все коллекции',
      russian: 'Русское искусство',
      world: 'Мировое искусство',
      favorites: 'Избранное',
      landscape: 'Пейзаж',
      impressionism: 'Импрессионизм',
      renaissance: 'Возрождение',
      baroque: 'Барокко',
      romantic: 'Романтизм',
      realism: 'Реализм',
      modern: 'Модернизм',
      portrait: 'Портрет',
      addFavorite: 'В избранное',
      removeFavorite: 'Сохранено',
      added: 'Добавлено в избранное',
      removed: 'Удалено из избранного',
      story: 'История картины',
      collections: 'Коллекции',
      menuTitle: 'Выберите коллекцию',
      styles: 'Жанры и эпохи',
      interval: 'Смена картины',
      interval15s: '15 с',
      interval30s: '30 с',
      interval1m: '1 мин',
      interval2m: '2 мин',
      interval5m: '5 мин',
      interval15m: '15 мин',
      interval30m: '30 мин',
      keepArtwork: 'Оставить картину',
      motion: 'Движение',
      motionGentle: 'Плавное',
      motionOff: 'Выключено',
      language: 'Язык',
      languageAuto: 'Авто',
      languageRu: 'Русский',
      languageEn: 'English',
      clearFilters: 'Сбросить фильтры',
      clock: 'Часы',
      retry: 'Повторить',
      loadFailed: 'Не удалось загрузить картины.',
      chrome: 'Информация',
      chromeAuto: 'Авто',
      chromeAlways: 'Всегда',
      loading: 'Готовим вашу галерею…',
      emptyTitle: 'В избранном пока ничего нет',
      emptyText: 'Вернитесь к картинам и нажмите кнопку вверх.',
      showAll: 'Показать все картины',
      works: 'картин',
      imageError: 'Не удалось открыть картину. Показываем следующую.',
      noDescription: 'Подробное описание для этой картины готовится.',
      license: 'Источник и права',
      publicDomain: 'Общественное достояние. Источник репродукции указан в каталоге.',
      menuHint: 'Стрелки — выбор · OK — применить/снять · Back — закрыть',
      controls: ['← → Картины', '↑ Избранное', '↓ О картине', 'OK Коллекции']
    },
    en: {
      all: 'All collections',
      russian: 'Russian art',
      world: 'World art',
      favorites: 'Favorites',
      landscape: 'Landscape',
      impressionism: 'Impressionism',
      renaissance: 'Renaissance',
      baroque: 'Baroque',
      romantic: 'Romanticism',
      realism: 'Realism',
      modern: 'Modern art',
      portrait: 'Portrait',
      addFavorite: 'Add favorite',
      removeFavorite: 'Saved',
      added: 'Added to favorites',
      removed: 'Removed from favorites',
      story: 'Story of the artwork',
      collections: 'Collections',
      menuTitle: 'Choose a collection',
      styles: 'Genres and periods',
      interval: 'Change artwork',
      interval15s: '15 sec',
      interval30s: '30 sec',
      interval1m: '1 min',
      interval2m: '2 min',
      interval5m: '5 min',
      interval15m: '15 min',
      interval30m: '30 min',
      keepArtwork: 'Keep artwork',
      motion: 'Motion',
      motionGentle: 'Gentle',
      motionOff: 'Off',
      language: 'Language',
      languageAuto: 'Auto',
      languageRu: 'Russian',
      languageEn: 'English',
      clearFilters: 'Clear filters',
      clock: 'Clock',
      retry: 'Retry',
      loadFailed: 'Could not load any artwork.',
      chrome: 'Information',
      chromeAuto: 'Auto-hide',
      chromeAlways: 'Always',
      loading: 'Preparing your gallery…',
      emptyTitle: 'No favorites yet',
      emptyText: 'Return to the gallery and press the Up button.',
      showAll: 'Show all artworks',
      works: 'artworks',
      imageError: 'Could not open this artwork. Showing the next one.',
      noDescription: 'A detailed story for this artwork is being prepared.',
      license: 'Source and rights',
      publicDomain: 'Public domain. The reproduction source is documented in the catalog.',
      menuHint: 'Arrows — select · OK — apply/remove · Back — close',
      controls: ['← → Artworks', '↑ Favorite', '↓ Story', 'OK Collections']
    }
  };

  var CATEGORY_KEYS = {
    all: 'all',
    russian: 'russian',
    world: 'world',
    favorites: 'favorites',
    'style:landscape': 'landscape',
    'style:impressionism': 'impressionism',
    'style:renaissance': 'renaissance',
    'style:baroque': 'baroque',
    'style:romantic': 'romantic',
    'style:realism': 'realism',
    'style:modern': 'modern',
    'style:portrait': 'portrait'
  };

  var App = {
    catalog: [],
    artworks: [],
    favorites: {},
    settings: null,
    language: 'ru',
    index: 0,
    activeLayer: 0,
    loadToken: 0,
    slideTimer: null,
    clockTimer: null,
    toastTimer: null,
    detailTimers: [],
    chromeTimer: null,
    preloads: [],
    focusables: [],
    focusIndex: 0,
    menuOpen: false,
    detailsOpen: false,
    imageFailures: {},
    previousFocus: null,
    pendingLoadError: false,
    loadWatchdogTimer: null,
    consecutiveStalls: 0,
    lifecyclePaused: false,

    init: function () {
      this.cacheElements();
      this.bindInputImmediately();
      this.settings = this.loadSettings();
      this.language = MuseumCore.preferredLanguage(
        this.settings.language,
        navigator.language || navigator.userLanguage
      );
      this.catalog = Array.isArray(window.MUSEUM_CATALOG) ? window.MUSEUM_CATALOG.slice(0) : [];
      this.favorites = this.loadFavorites();
      this.updateLanguage();
      this.updateClock();
      this.clockTimer = setInterval(this.updateClock.bind(this), 30000);
      this.applyCategory(this.settings.category, true);
      window.MuseumAppBack = function () {
        return App.handlePlatformBack();
      };
      window.MuseumAppPause = function () {
        App.lifecyclePaused = true;
        App.stopSlideshow();
      };
      window.MuseumAppResume = function () {
        App.lifecyclePaused = false;
        if (App.artworks.length && !App.menuOpen && !App.detailsOpen) {
          App.restartSlideshow();
        }
      };
      document.body.focus();
      this.showChrome();
      setTimeout(function () {
        App.el.controlsHint.classList.add('is-dimmed');
      }, 9000);
    },

    cacheElements: function () {
      this.el = {
        stage: document.getElementById('art-stage'),
        layerA: document.getElementById('art-layer-a'),
        layerB: document.getElementById('art-layer-b'),
        info: document.getElementById('art-info'),
        title: document.getElementById('art-title'),
        artist: document.getElementById('art-artist'),
        meta: document.getElementById('art-meta'),
        categoryName: document.getElementById('category-name'),
        clock: document.getElementById('clock'),
        favoriteButton: document.getElementById('favorite-button'),
        favoriteLabel: document.getElementById('favorite-label'),
        controlsHint: document.getElementById('controls-hint'),
        empty: document.getElementById('empty-state'),
        emptyTitle: document.getElementById('empty-title'),
        emptyText: document.getElementById('empty-text'),
        details: document.getElementById('details-panel'),
        detailsKicker: document.getElementById('details-kicker'),
        detailsTitle: document.getElementById('details-title'),
        detailsByline: document.getElementById('details-byline'),
        detailsScroll: document.getElementById('details-scroll'),
        detailsDescription: document.getElementById('details-description'),
        detailsMuseum: document.getElementById('details-museum'),
        detailsRights: document.getElementById('details-rights'),
        menu: document.getElementById('menu-panel'),
        menuTitle: document.getElementById('menu-title'),
        collectionsHeading: document.getElementById('collections-heading'),
        stylesHeading: document.getElementById('styles-heading'),
        intervalHeading: document.getElementById('interval-heading'),
        motionHeading: document.getElementById('motion-heading'),
        languageHeading: document.getElementById('language-heading'),
        chromeHeading: document.getElementById('chrome-heading'),
        menuHint: document.getElementById('menu-hint'),
        artCount: document.getElementById('art-count'),
        toast: document.getElementById('toast'),
        loading: document.getElementById('loading'),
        loadingText: document.getElementById('loading-text'),
        loadingRetry: document.getElementById('loading-retry')
      };
    },

    bindInputImmediately: function () {
      document.addEventListener('keydown', function (event) {
        App.handleKey(event);
      }, true);

      document.addEventListener('mousemove', function () {
        App.showChrome();
      });

      this.el.favoriteButton.addEventListener('click', function (event) {
        event.stopPropagation();
        App.toggleFavorite();
      });

      this.el.stage.addEventListener('click', function (event) {
        if (App.menuOpen || App.detailsOpen || !App.artworks.length) {
          return;
        }
        if (event.clientX < window.innerWidth * 0.34) {
          App.changeArtwork(-1);
        } else if (event.clientX > window.innerWidth * 0.66) {
          App.changeArtwork(1);
        } else {
          App.openDetails();
        }
      });

      this.el.menu.addEventListener('click', function (event) {
        var target = App.findActionTarget(event.target);
        if (target) {
          App.handleMenuAction(target);
        }
      });

      this.el.empty.addEventListener('click', function (event) {
        var target = App.findActionTarget(event.target);
        if (target) {
          App.handleMenuAction(target);
        }
      });

      this.el.loadingRetry.addEventListener('click', function () {
        App.retryImages();
      });
    },

    findActionTarget: function (target) {
      while (target && target !== document.body) {
        if (target.getAttribute && target.getAttribute('data-action')) {
          return target;
        }
        target = target.parentNode;
      }
      return null;
    },

    handleKey: function (event) {
      var code = event.keyCode || event.which;
      var handled = true;
      this.showChrome();

      if (this.detailsOpen) {
        if (code === 9) {
          this.el.details.focus();
        } else if (code === 38) {
          this.el.detailsScroll.scrollTop -= 130;
        } else if (code === 40) {
          this.el.detailsScroll.scrollTop += 130;
        } else if (code === 37 || code === 39) {
          // Consume horizontal D-pad input so native spatial navigation cannot escape the dialog.
        } else if (code === 461 || code === 1003 || code === 10009 || code === 4 || code === 27 || code === 13) {
          this.closeDetails();
        } else {
          handled = false;
        }
      } else if (this.menuOpen) {
        if (code === 9) {
          if (this.focusables.length) {
            this.focusIndex = (this.focusIndex + (event.shiftKey ? -1 : 1) + this.focusables.length) %
              this.focusables.length;
            this.paintFocus();
          }
        } else if (code === 37) {
          this.moveFocus(-1, 0);
        } else if (code === 39) {
          this.moveFocus(1, 0);
        } else if (code === 38) {
          this.moveFocus(0, -1);
        } else if (code === 40) {
          this.moveFocus(0, 1);
        } else if (code === 13) {
          this.activateFocus();
        } else if (code === 461 || code === 1003 || code === 10009 || code === 4 || code === 27) {
          this.closeMenu();
        } else {
          handled = false;
        }
      } else if (this.el.loading.classList.contains('is-error')) {
        if (code === 13 || code === 404 || code === 406) {
          this.retryImages();
        } else if (code === 461 || code === 1003 || code === 10009 || code === 4 || code === 27) {
          this.exitApp();
        }
        // The opaque error layer covers the gallery: swallow other keys instead of acting blindly.
      } else if (code === 37) {
        this.changeArtwork(-1);
      } else if (code === 39) {
        this.changeArtwork(1);
      } else if (code === 38 || code === 403) {
        this.toggleFavorite();
      } else if (code === 40 || code === 405) {
        this.openDetails();
      } else if (code === 13 || code === 404 || code === 406) {
        this.openMenu();
      } else if (code === 461 || code === 1003 || code === 10009 || code === 4 || code === 27) {
        this.exitApp();
      } else {
        handled = false;
      }

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    },

    exitApp: function () {
      if (typeof window.tizen !== 'undefined' &&
          window.tizen.application &&
          window.tizen.application.getCurrentApplication) {
        window.tizen.application.getCurrentApplication().exit();
        return;
      }
      try {
        window.close();
      } catch (ignore) {
        history.back();
      }
    },

    handlePlatformBack: function () {
      if (this.detailsOpen) {
        this.closeDetails();
        return true;
      }
      if (this.menuOpen) {
        this.closeMenu();
        return true;
      }
      return false;
    },

    loadSettings: function () {
      var parsed = null;
      try {
        parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
      } catch (ignore) {
        parsed = null;
      }
      return MuseumCore.normalizeSettings(parsed);
    },

    saveSettings: function () {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      } catch (ignore) {
        this.showToast('Settings could not be saved');
      }
    },

    loadFavorites: function () {
      var raw = null;
      try {
        raw = localStorage.getItem(FAVORITES_KEY);
        if (!raw) {
          raw = localStorage.getItem(LEGACY_FAVORITES_KEY);
        }
      } catch (ignore) {
        raw = null;
      }
      var normalized = MuseumCore.normalizeFavorites(raw, this.catalog);
      try {
        localStorage.setItem(FAVORITES_KEY, MuseumCore.serializeFavorites(normalized));
      } catch (ignoreSave) {
        // The gallery still works if persistent storage is unavailable.
      }
      return normalized;
    },

    saveFavorites: function () {
      try {
        localStorage.setItem(FAVORITES_KEY, MuseumCore.serializeFavorites(this.favorites));
        return true;
      } catch (ignore) {
        return false;
      }
    },

    shuffle: function (items) {
      var copy = items.slice(0);
      var i;
      var j;
      var temp;
      for (i = copy.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
      }
      return copy;
    },

    applyCategory: function (category, initial) {
      var filtered;
      this.settings.category = category || 'all';
      this.saveSettings();
      filtered = MuseumCore.filterCatalog(
        this.catalog,
        this.settings.category,
        this.favorites,
        this.settings.styles
      );
      this.artworks = this.shuffle(filtered);
      this.index = 0;
      this.updateCategoryName();
      this.updateMenuSelection();
      this.el.artCount.textContent = this.artworks.length + ' ' + I18N[this.language].works;

      if (!this.artworks.length) {
        this.stopSlideshow();
        this.pendingLoadError = false;
        this.el.loading.classList.remove('is-error');
        this.el.loadingRetry.classList.add('hidden');
        this.el.info.classList.add('is-hidden');
        this.el.empty.classList.remove('hidden');
        this.el.loading.classList.add('hidden');
        this.clearLayers();
      } else {
        this.el.empty.classList.add('hidden');
        this.el.info.classList.remove('is-hidden');
        // Every selection checks the collection afresh: marks left by an earlier outage are stale,
        // so drop them and allow images that still fail to re-mark themselves.
        this.imageFailures = {};
        this.consecutiveStalls = 0;
        if (!this.menuOpen && !this.detailsOpen &&
            !this.el.layerA.classList.contains('active') &&
            !this.el.layerB.classList.contains('active')) {
          // Coming back from an empty collection leaves a blank stage: show the loading state until
          // the first artwork of the new collection arrives.
          this.showLoadingState();
        }
        this.showCurrent(Boolean(initial));
      }
    },

    updateCategoryName: function () {
      var key = CATEGORY_KEYS[this.settings.category] || 'all';
      var name = I18N[this.language][key] || I18N[this.language].all;
      var styles = this.settings.styles || [];
      var labels = [];
      var i;
      for (i = 0; i < styles.length && i < 2; i += 1) {
        labels.push(I18N[this.language][styles[i]] || styles[i]);
      }
      if (styles.length > 2) {
        labels.push('+' + (styles.length - 2));
      }
      this.el.categoryName.textContent = name + (labels.length ? ' · ' + labels.join(', ') : '');
    },

    currentArtwork: function () {
      return this.artworks.length ? this.artworks[this.index] : null;
    },

    showCurrent: function (immediate) {
      var artwork = this.currentArtwork();
      var oldLayer = this.activeLayer === 0 ? this.el.layerA : this.el.layerB;
      var nextLayer = this.activeLayer === 0 ? this.el.layerB : this.el.layerA;
      var token;
      var motionClass;

      if (!artwork) {
        return;
      }

      this.loadToken += 1;
      token = this.loadToken;
      // A fresh load attempt invalidates a failure deferred from a previous collection: should this
      // image fail too, onerror raises the error again (deferred while a dialog is open).
      this.pendingLoadError = false;
      this.updateArtworkText(artwork);
      this.updateFavoriteButton();
      this.closeDetails();
      this.showChrome();

      nextLayer.onload = function () {
        if (token !== App.loadToken) {
          return;
        }
        App.clearLoadWatchdog();
        App.removeMotionClasses(nextLayer);
        motionClass = MOTION_CLASSES[App.index % MOTION_CLASSES.length];
        if (App.settings.motion === 'gentle') {
          nextLayer.classList.add(motionClass);
        }
        nextLayer.classList.add('active');
        oldLayer.classList.remove('active');
        App.activeLayer = App.activeLayer === 0 ? 1 : 0;
        // This image just loaded, so it is no longer a failure candidate.
        delete App.imageFailures[artwork.id];
        App.consecutiveStalls = 0;
        App.pendingLoadError = false;
        App.el.loading.classList.add('hidden');
        App.el.loading.classList.remove('is-error');
        App.el.loadingRetry.classList.add('hidden');
        if (document.activeElement === App.el.loadingRetry) {
          document.body.focus();
        }
        App.restartSlideshow();
        App.preloadUpcoming();
        setTimeout(function () {
          // Only tear the old image down when that layer is neither visible nor already carrying a
          // newer load: this timer can outlive the layer it was scheduled for.
          if (!oldLayer.classList.contains('active') && oldLayer.museumLoadToken !== App.loadToken) {
            App.removeMotionClasses(oldLayer);
            oldLayer.onload = null;
            oldLayer.onerror = null;
            oldLayer.removeAttribute('src');
          }
        }, immediate ? 50 : 1100);
      };

      nextLayer.onerror = function () {
        App.failCurrentLoad(artwork, token);
      };

      nextLayer.alt = this.localized(artwork, 'title');
      // Which load this element is serving, so a delayed cleanup can tell a stale image apart from a
      // newer load already in flight on the same layer.
      nextLayer.museumLoadToken = token;
      this.armLoadWatchdog(token);
      if (immediate) {
        oldLayer.classList.remove('active');
      }
      nextLayer.src = artwork.image;
    },

    showLoadError: function () {
      this.stopSlideshow();
      if (this.menuOpen || this.detailsOpen) {
        this.pendingLoadError = true;
        // While a dialog is open the gallery stays clear: the deferred error is displayed when the
        // dialog closes, so the loading state must not sit over the dialog in the meantime.
        this.el.loading.classList.remove('is-error');
        this.el.loading.classList.add('hidden');
        return;
      }
      this.displayLoadError();
    },

    displayLoadError: function () {
      this.pendingLoadError = false;
      this.el.loading.classList.remove('hidden');
      this.el.loading.classList.add('is-error');
      this.el.loadingText.textContent = I18N[this.language].loadFailed;
      this.el.loadingRetry.textContent = I18N[this.language].retry;
      this.el.loadingRetry.classList.remove('hidden');
      this.el.loadingRetry.focus();
      if (document.activeElement !== this.el.loadingRetry) {
        // The overlay fades in over 450ms and stays visibility:hidden until then, so the
        // synchronous focus above is ignored: retry once the element is really visible.
        setTimeout(function () {
          if (App.el.loading.classList.contains('is-error')) {
            App.el.loadingRetry.focus();
          }
        }, 500);
      }
    },

    showLoadingState: function () {
      this.el.loadingText.textContent = I18N[this.language].loading;
      this.el.loadingRetry.classList.add('hidden');
      this.el.loading.classList.remove('is-error');
      this.el.loading.classList.remove('hidden');
    },

    armLoadWatchdog: function (token) {
      this.clearLoadWatchdog();
      this.loadWatchdogTimer = setTimeout(function () {
        App.loadWatchdogTimer = null;
        if (token !== App.loadToken || !App.artworks.length) {
          return;
        }
        if (App.lifecyclePaused) {
          // A TV screensaver can be suspended mid-load: keep waiting instead of blaming the image.
          App.armLoadWatchdog(token);
          return;
        }
        App.failCurrentLoad(App.currentArtwork(), token, true);
      }, STALLED_LOAD_MS);
    },

    clearLoadWatchdog: function () {
      if (this.loadWatchdogTimer) {
        clearTimeout(this.loadWatchdogTimer);
        this.loadWatchdogTimer = null;
      }
    },

    abortStalledLoad: function (token) {
      var layers;
      var i;
      var layer;
      if (!this.el) {
        return;
      }
      layers = [this.el.layerA, this.el.layerB];
      for (i = 0; i < layers.length; i += 1) {
        layer = layers[i];
        if (layer && layer.museumLoadToken === token) {
          // This exact request timed out. Detach callbacks before removing src so a late completion
          // cannot revive the layer or dismiss a terminal error on its own.
          layer.onload = null;
          layer.onerror = null;
          layer.museumLoadToken = 0;
          layer.removeAttribute('src');
          this.loadToken += 1;
          return;
        }
      }
    },

    failCurrentLoad: function (artwork, token, stalled) {
      var nextIndex;
      if (token !== this.loadToken || !artwork) {
        return;
      }
      this.clearLoadWatchdog();
      if (stalled) {
        this.abortStalledLoad(token);
      }
      this.consecutiveStalls = stalled ? this.consecutiveStalls + 1 : 0;
      this.imageFailures[artwork.id] = true;
      this.showToast(I18N[this.language].imageError);
      if (this.consecutiveStalls >= MAX_CONSECUTIVE_STALLS) {
        // The images are not broken, the network is: stop walking the catalogue and offer a retry.
        this.showLoadError();
        return;
      }
      nextIndex = MuseumCore.nextAvailableIndex(this.artworks, this.index, 1, this.imageFailures);
      if (nextIndex !== -1) {
        this.index = nextIndex;
        this.showCurrent(false);
      } else {
        this.showLoadError();
      }
    },

    retryImages: function () {
      this.imageFailures = {};
      this.consecutiveStalls = 0;
      this.pendingLoadError = false;
      this.el.loading.classList.remove('is-error');
      if (document.activeElement === this.el.loadingRetry) {
        document.body.focus();
      }
      this.el.loadingRetry.classList.add('hidden');
      this.el.loadingText.textContent = I18N[this.language].loading;
      this.index = 0;
      if (!this.artworks.length) {
        // Nothing left to retry: fall back to the empty state instead of a loading screen.
        this.el.loading.classList.add('hidden');
        this.el.empty.classList.remove('hidden');
        return;
      }
      this.showCurrent(true);
    },

    clearLayers: function () {
      this.loadToken += 1;
      this.clearLoadWatchdog();
      this.el.layerA.classList.remove('active');
      this.el.layerB.classList.remove('active');
      this.el.layerA.removeAttribute('src');
      this.el.layerB.removeAttribute('src');
    },

    removeMotionClasses: function (element) {
      var i;
      for (i = 0; i < MOTION_CLASSES.length; i += 1) {
        element.classList.remove(MOTION_CLASSES[i]);
      }
    },

    changeArtwork: function (delta) {
      var next;
      if (this.artworks.length < 2) {
        return;
      }
      next = MuseumCore.nextAvailableIndex(this.artworks, this.index, delta, this.imageFailures);
      if (next !== -1) {
        this.index = next;
        this.showCurrent(false);
      } else {
        this.showLoadError();
      }
    },

    preloadUpcoming: function () {
      var offset;
      var next;
      var image;
      while (this.preloads.length > 4) {
        image = this.preloads.shift();
        image.onload = null;
        image.onerror = null;
        image.removeAttribute('src');
      }
      for (offset = 1; offset <= 2; offset += 1) {
        next = MuseumCore.nextIndex(this.artworks.length, this.index, offset);
        if (next !== -1 && !this.imageFailures[this.artworks[next].id]) {
          image = new Image();
          image.src = this.artworks[next].image;
          this.preloads.push(image);
        }
      }
    },

    updateArtworkText: function (artwork) {
      var title = this.localized(artwork, 'title');
      var artist = this.localized(artwork, 'artist');
      var museum = this.localized(artwork, 'museum');
      this.el.title.textContent = title;
      this.el.artist.textContent = artist;
      this.el.meta.textContent = artwork.year + (museum ? ' · ' + museum : '');
    },

    localized: function (artwork, field) {
      return MuseumCore.localize(artwork, field, this.language);
    },

    toggleFavorite: function () {
      var artwork = this.currentArtwork();
      var isNowFavorite;
      if (!artwork) {
        return;
      }
      isNowFavorite = MuseumCore.toggleFavorite(this.favorites, artwork.id);
      if (!this.saveFavorites()) {
        MuseumCore.toggleFavorite(this.favorites, artwork.id);
        this.showToast('Storage unavailable');
        return;
      }
      this.updateFavoriteButton(true);
      this.showToast(isNowFavorite ? I18N[this.language].added : I18N[this.language].removed);

      if (this.settings.category === 'favorites' && !isNowFavorite) {
        this.applyCategory('favorites', false);
      }
    },

    updateFavoriteButton: function (animate) {
      var artwork = this.currentArtwork();
      var active = artwork && this.favorites[artwork.id];
      this.el.favoriteButton.classList.toggle('is-active', Boolean(active));
      this.el.favoriteLabel.textContent = active ?
        I18N[this.language].removeFavorite :
        I18N[this.language].addFavorite;
      this.el.favoriteButton.setAttribute('aria-label', this.el.favoriteLabel.textContent);
      this.el.favoriteButton.setAttribute('aria-pressed', active ? 'true' : 'false');

      if (animate) {
        this.el.favoriteButton.classList.remove('pop');
        this.el.favoriteButton.offsetWidth;
        this.el.favoriteButton.classList.add('pop');
        setTimeout(function () {
          App.el.favoriteButton.classList.remove('pop');
        }, 460);
      }
    },

    restartSlideshow: function () {
      this.stopSlideshow();
      if (this.lifecyclePaused || this.settings.paused || this.menuOpen || this.detailsOpen) {
        return;
      }
      this.showChrome();
      this.slideTimer = setTimeout(function () {
        App.changeArtwork(1);
      }, this.settings.interval * 1000);
    },

    stopSlideshow: function () {
      if (this.slideTimer) {
        clearTimeout(this.slideTimer);
        this.slideTimer = null;
      }
    },

    openDetails: function () {
      var artwork = this.currentArtwork();
      var description;
      var museum;
      var rights;
      var i;
      if (!artwork || this.menuOpen || this.el.loading.classList.contains('is-error')) {
        return;
      }
      if (!this.el.loading.classList.contains('is-error')) {
        // A dialog must never sit invisibly below the opaque loading state. Terminal errors remain
        // blocking; ordinary in-flight loading is restored on close if no artwork is visible yet.
        this.el.loading.classList.add('hidden');
      }
      this.stopSlideshow();
      this.previousFocus = document.activeElement;
      this.detailsOpen = true;
      description = this.localized(artwork, 'description') || I18N[this.language].noDescription;
      museum = this.localized(artwork, 'museum');
      rights = artwork.license || I18N[this.language].publicDomain;
      this.el.detailsKicker.textContent = I18N[this.language].story;
      this.el.detailsTitle.textContent = this.localized(artwork, 'title');
      this.el.detailsByline.textContent =
        this.localized(artwork, 'artist') + ' · ' + artwork.year;
      this.el.detailsDescription.textContent = description;
      this.el.detailsMuseum.textContent = museum;
      this.el.detailsRights.textContent = I18N[this.language].license + ': ' + rights;
      this.el.detailsScroll.scrollTop = 0;
      this.el.details.classList.add('open');
      this.el.details.setAttribute('aria-hidden', 'false');
      this.el.details.focus();

      for (i = 0; i < this.detailTimers.length; i += 1) {
        clearTimeout(this.detailTimers[i]);
      }
      this.detailTimers = [];
      this.resetReveal(this.el.detailsDescription);
      this.resetReveal(this.el.detailsMuseum);
      this.resetReveal(this.el.detailsRights);
      this.detailTimers.push(setTimeout(function () {
        App.el.detailsDescription.classList.add('visible');
      }, 60));
      this.detailTimers.push(setTimeout(function () {
        App.el.detailsMuseum.classList.add('visible');
      }, 210));
      this.detailTimers.push(setTimeout(function () {
        App.el.detailsRights.classList.add('visible');
      }, 360));
    },

    resetReveal: function (element) {
      element.classList.remove('visible');
      element.offsetWidth;
    },

    closeDetails: function () {
      if (!this.detailsOpen) {
        return;
      }
      this.detailsOpen = false;
      this.el.details.classList.remove('open');
      this.el.details.setAttribute('aria-hidden', 'true');
      if (this.artworks.length && !this.pendingLoadError) {
        this.restartSlideshow();
      }
      this.showChrome();
      if (this.previousFocus && this.previousFocus.focus) {
        this.previousFocus.focus();
      }
      if (this.pendingLoadError) {
        this.displayLoadError();
      } else if (this.artworks.length &&
          !this.el.layerA.classList.contains('active') &&
          !this.el.layerB.classList.contains('active')) {
        this.showLoadingState();
      }
    },

    openMenu: function () {
      var selected;
      var i;
      if (this.el.loading.classList.contains('is-error')) {
        return;
      }
      if (this.detailsOpen) {
        this.closeDetails();
      }
      if (!this.el.loading.classList.contains('is-error')) {
        // The menu is above the gallery logically but below loading visually, so clear ordinary
        // loading before opening it. closeMenu restores loading when the stage is still blank.
        this.el.loading.classList.add('hidden');
      }
      this.previousFocus = document.activeElement;
      this.stopSlideshow();
      this.showChrome();
      this.menuOpen = true;
      this.el.menu.classList.add('open');
      this.el.menu.setAttribute('aria-hidden', 'false');
      this.updateMenuSelection();
      this.focusables = this.el.menu.querySelectorAll('.focusable');
      this.focusIndex = 0;
      selected = this.el.menu.querySelector('[data-action="category"][data-value="' +
        this.settings.category + '"]');
      if (selected) {
        for (i = 0; i < this.focusables.length; i += 1) {
          if (this.focusables[i] === selected) {
            this.focusIndex = i;
            break;
          }
        }
      }
      this.paintFocus();
    },

    closeMenu: function () {
      var i;
      if (!this.menuOpen) {
        return;
      }
      this.menuOpen = false;
      this.el.menu.classList.remove('open');
      this.el.menu.setAttribute('aria-hidden', 'true');
      for (i = 0; i < this.focusables.length; i += 1) {
        this.focusables[i].classList.remove('focused');
      }
      if (this.artworks.length && !this.pendingLoadError) {
        this.restartSlideshow();
      }
      this.showChrome();
      if (this.previousFocus && this.previousFocus.focus) {
        this.previousFocus.focus();
      } else {
        document.body.focus();
      }
      if (this.pendingLoadError) {
        this.displayLoadError();
      } else if (this.artworks.length &&
          !this.el.layerA.classList.contains('active') &&
          !this.el.layerB.classList.contains('active')) {
        this.showLoadingState();
      }
    },

    moveFocus: function (dx, dy) {
      var rects = [];
      var i;
      for (i = 0; i < this.focusables.length; i += 1) {
        rects.push(this.focusables[i].getBoundingClientRect());
      }
      this.focusIndex = MuseumCore.spatialIndex(rects, this.focusIndex, dx, dy);
      this.paintFocus();
    },

    paintFocus: function () {
      var i;
      for (i = 0; i < this.focusables.length; i += 1) {
        this.focusables[i].classList.toggle('focused', i === this.focusIndex);
      }
      if (this.focusables[this.focusIndex]) {
        this.focusables[this.focusIndex].focus();
      }
    },

    activateFocus: function () {
      if (this.focusables[this.focusIndex]) {
        this.handleMenuAction(this.focusables[this.focusIndex]);
      }
    },

    handleMenuAction: function (element) {
      var action = element.getAttribute('data-action');
      var value = element.getAttribute('data-value');
      if (action === 'category') {
        this.applyCategory(value, false);
      } else if (action === 'clearFilters') {
        this.settings.styles = [];
        this.applyCategory('all', false);
      } else if (action === 'style') {
        if (this.settings.styles.indexOf(value) === -1) {
          this.settings.styles.push(value);
        } else {
          this.settings.styles.splice(this.settings.styles.indexOf(value), 1);
        }
        this.applyCategory(this.settings.category, false);
      } else if (action === 'interval') {
        this.settings.interval = Number(value);
        this.settings.paused = false;
        this.saveSettings();
        this.updateMenuSelection();
        this.restartSlideshow();
      } else if (action === 'paused') {
        this.settings.paused = !this.settings.paused;
        this.saveSettings();
        this.updateMenuSelection();
        this.restartSlideshow();
      } else if (action === 'motion') {
        this.settings.motion = value;
        this.saveSettings();
        this.updateMenuSelection();
        this.showCurrent(false);
      } else if (action === 'language') {
        this.settings.language = value;
        this.saveSettings();
        this.language = MuseumCore.preferredLanguage(
          value,
          navigator.language || navigator.userLanguage
        );
        this.updateLanguage();
        this.updateMenuSelection();
      } else if (action === 'clock') {
        this.settings.showClock = !this.settings.showClock;
        this.saveSettings();
        this.updateClock();
        this.updateMenuSelection();
      } else if (action === 'chrome') {
        this.settings.chrome = value;
        this.saveSettings();
        this.updateMenuSelection();
        this.showChrome();
      }
    },

    updateMenuSelection: function () {
      var buttons = document.querySelectorAll('[data-action]');
      var i;
      var action;
      var value;
      var selected;
      for (i = 0; i < buttons.length; i += 1) {
        action = buttons[i].getAttribute('data-action');
        value = buttons[i].getAttribute('data-value');
        selected = (action === 'category' && value === this.settings.category) ||
          (action === 'clearFilters' && this.settings.category === 'all' && this.settings.styles.length === 0) ||
          (action === 'style' && this.settings.styles.indexOf(value) !== -1) ||
          (action === 'interval' && !this.settings.paused && Number(value) === this.settings.interval) ||
          (action === 'paused' && this.settings.paused) ||
          (action === 'motion' && value === this.settings.motion) ||
          (action === 'language' && value === this.settings.language) ||
          (action === 'clock' && this.settings.showClock) ||
          (action === 'chrome' && value === this.settings.chrome);
        buttons[i].classList.toggle('selected', Boolean(selected));
        buttons[i].setAttribute('aria-pressed', selected ? 'true' : 'false');
      }
    },

    updateLanguage: function () {
      var t = I18N[this.language];
      var labels = document.querySelectorAll('[data-action="category"], [data-action="style"]');
      var i;
      var value;
      var key;
      var intervalKeys = {
        15: 'interval15s', 30: 'interval30s', 60: 'interval1m', 120: 'interval2m',
        300: 'interval5m', 900: 'interval15m', 1800: 'interval30m'
      };
      document.documentElement.lang = this.language;
      this.el.loadingText.textContent = t.loading;
      this.el.detailsKicker.textContent = t.story;
      this.el.menuTitle.textContent = t.menuTitle;
      this.el.collectionsHeading.textContent = t.collections;
      this.el.stylesHeading.textContent = t.styles;
      this.el.intervalHeading.textContent = t.interval;
      this.el.motionHeading.textContent = t.motion;
      this.el.languageHeading.textContent = t.language;
      this.el.chromeHeading.textContent = t.chrome;
      this.el.menuHint.textContent = t.menuHint;
      this.el.emptyTitle.textContent = t.emptyTitle;
      this.el.emptyText.textContent = t.emptyText;
      document.querySelector('#empty-state [data-value="all"]').textContent = t.showAll;
      for (i = 0; i < labels.length; i += 1) {
        value = labels[i].getAttribute('data-value');
        key = labels[i].getAttribute('data-action') === 'style' ? value : (CATEGORY_KEYS[value] || 'all');
        labels[i].textContent = t[key] || value;
      }
      labels = document.querySelectorAll('[data-action="interval"]');
      for (i = 0; i < labels.length; i += 1) {
        labels[i].textContent = t[intervalKeys[Number(labels[i].getAttribute('data-value'))]];
      }
      document.querySelector('[data-action="paused"]').textContent = t.keepArtwork;
      document.querySelector('[data-action="motion"][data-value="gentle"]').textContent = t.motionGentle;
      document.querySelector('[data-action="motion"][data-value="off"]').textContent = t.motionOff;
      document.querySelector('[data-action="language"][data-value="auto"]').textContent = t.languageAuto;
      document.querySelector('[data-action="language"][data-value="ru"]').textContent = t.languageRu;
      document.querySelector('[data-action="language"][data-value="en"]').textContent = t.languageEn;
      document.querySelector('[data-action="clearFilters"]').textContent = t.clearFilters;
      document.querySelector('[data-action="clock"]').textContent = t.clock;
      this.el.loadingRetry.textContent = t.retry;
      labels = this.el.controlsHint.getElementsByTagName('span');
      for (i = 0; i < labels.length; i += 1) {
        labels[i].textContent = t.controls[i];
      }
      document.querySelector('[data-action="chrome"][data-value="auto"]').textContent = t.chromeAuto;
      document.querySelector('[data-action="chrome"][data-value="always"]').textContent = t.chromeAlways;
      this.updateCategoryName();
      if (this.currentArtwork()) {
        this.updateArtworkText(this.currentArtwork());
        this.updateFavoriteButton();
      }
      this.el.artCount.textContent = this.artworks.length + ' ' + t.works;
    },

    updateClock: function () {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      this.el.clock.textContent =
        (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
      this.el.clock.style.display = this.settings && this.settings.showClock ? 'block' : 'none';
    },

    showToast: function (text) {
      clearTimeout(this.toastTimer);
      this.el.toast.textContent = text;
      this.el.toast.classList.add('show');
      this.toastTimer = setTimeout(function () {
        App.el.toast.classList.remove('show');
      }, 1800);
    },

    showChrome: function () {
      clearTimeout(this.chromeTimer);
      document.getElementById('app').classList.remove('chrome-hidden');
      if (this.settings && this.settings.chrome === 'auto' && !this.menuOpen && !this.detailsOpen) {
        this.chromeTimer = setTimeout(function () {
          document.getElementById('app').classList.add('chrome-hidden');
        }, 12000);
      }
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    App.init();
  });
}());

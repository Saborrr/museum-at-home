(function () {
  'use strict';

  var SETTINGS_KEY = 'museumAtHome.settings.v2';
  var FAVORITES_KEY = 'museumAtHome.favorites.v2';
  var LEGACY_FAVORITES_KEY = 'artscreen-favorites';
  var MOTION_CLASSES = ['motion-a', 'motion-b', 'motion-c'];

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
      motion: 'Движение',
      language: 'Язык',
      loading: 'Готовим вашу галерею…',
      emptyTitle: 'В избранном пока ничего нет',
      emptyText: 'Вернитесь к картинам и нажмите кнопку вверх.',
      showAll: 'Показать все картины',
      works: 'картин',
      imageError: 'Не удалось открыть картину. Показываем следующую.',
      noDescription: 'Подробное описание для этой картины готовится.',
      license: 'Источник и права',
      publicDomain: 'Общественное достояние. Источник репродукции указан в каталоге.',
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
      motion: 'Motion',
      language: 'Language',
      loading: 'Preparing your gallery…',
      emptyTitle: 'No favorites yet',
      emptyText: 'Return to the gallery and press the Up button.',
      showAll: 'Show all artworks',
      works: 'artworks',
      imageError: 'Could not open this artwork. Showing the next one.',
      noDescription: 'A detailed story for this artwork is being prepared.',
      license: 'Source and rights',
      publicDomain: 'Public domain. The reproduction source is documented in the catalog.',
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
    preloads: [],
    focusables: [],
    focusIndex: 0,
    menuOpen: false,
    detailsOpen: false,
    imageFailures: {},

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
      document.body.focus();
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
        artCount: document.getElementById('art-count'),
        toast: document.getElementById('toast'),
        loading: document.getElementById('loading'),
        loadingText: document.getElementById('loading-text')
      };
    },

    bindInputImmediately: function () {
      document.addEventListener('keydown', function (event) {
        App.handleKey(event);
      }, true);

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

      if (this.detailsOpen) {
        if (code === 38) {
          this.el.detailsScroll.scrollTop -= 130;
        } else if (code === 40) {
          this.el.detailsScroll.scrollTop += 130;
        } else if (code === 461 || code === 1003 || code === 13) {
          this.closeDetails();
        } else {
          handled = false;
        }
      } else if (this.menuOpen) {
        if (code === 37) {
          this.moveFocus(-1, 0);
        } else if (code === 39) {
          this.moveFocus(1, 0);
        } else if (code === 38) {
          this.moveFocus(0, -1);
        } else if (code === 40) {
          this.moveFocus(0, 1);
        } else if (code === 13) {
          this.activateFocus();
        } else if (code === 461 || code === 1003) {
          this.closeMenu();
        } else {
          handled = false;
        }
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
      } else if (code === 461 || code === 1003) {
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
      try {
        window.close();
      } catch (ignore) {
        history.back();
      }
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
      filtered = MuseumCore.filterCatalog(this.catalog, this.settings.category, this.favorites);
      this.artworks = this.shuffle(filtered);
      this.index = 0;
      this.updateCategoryName();
      this.updateMenuSelection();
      this.el.artCount.textContent = this.artworks.length + ' ' + I18N[this.language].works;

      if (!this.artworks.length) {
        this.stopSlideshow();
        this.el.info.classList.add('is-hidden');
        this.el.empty.classList.remove('hidden');
        this.el.loading.classList.add('hidden');
        this.clearLayers();
      } else {
        this.el.empty.classList.add('hidden');
        this.el.info.classList.remove('is-hidden');
        this.showCurrent(Boolean(initial));
      }
    },

    updateCategoryName: function () {
      var key = CATEGORY_KEYS[this.settings.category] || 'all';
      this.el.categoryName.textContent = I18N[this.language][key] || I18N[this.language].all;
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
      this.updateArtworkText(artwork);
      this.updateFavoriteButton();
      this.closeDetails();

      nextLayer.onload = function () {
        if (token !== App.loadToken) {
          return;
        }
        App.removeMotionClasses(nextLayer);
        motionClass = MOTION_CLASSES[App.index % MOTION_CLASSES.length];
        if (App.settings.motion === 'gentle') {
          nextLayer.classList.add(motionClass);
        }
        nextLayer.classList.add('active');
        oldLayer.classList.remove('active');
        App.activeLayer = App.activeLayer === 0 ? 1 : 0;
        App.el.loading.classList.add('hidden');
        App.restartSlideshow();
        App.preloadUpcoming();
        setTimeout(function () {
          if (!oldLayer.classList.contains('active')) {
            App.removeMotionClasses(oldLayer);
      oldLayer.onload = null;
      oldLayer.onerror = null;
      oldLayer.removeAttribute('src');
          }
        }, immediate ? 50 : 1100);
      };

      nextLayer.onerror = function () {
        if (token !== App.loadToken) {
          return;
        }
        App.imageFailures[artwork.id] = true;
        App.showToast(I18N[App.language].imageError);
        if (App.artworks.length > 1) {
          App.index = MuseumCore.nextIndex(App.artworks.length, App.index, 1);
          App.showCurrent(false);
        }
      };

      nextLayer.alt = this.localized(artwork, 'title');
      if (immediate) {
        oldLayer.classList.remove('active');
      }
      nextLayer.src = artwork.image;
    },

    clearLayers: function () {
      this.loadToken += 1;
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
      next = MuseumCore.nextIndex(this.artworks.length, this.index, delta);
      if (next !== -1) {
        this.index = next;
        this.showCurrent(false);
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
      if (!artwork || this.menuOpen) {
        return;
      }
      this.stopSlideshow();
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
      if (this.artworks.length) {
        this.restartSlideshow();
      }
    },

    openMenu: function () {
      var selected;
      var i;
      if (this.detailsOpen) {
        this.closeDetails();
      }
      this.stopSlideshow();
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
      if (this.artworks.length) {
        this.restartSlideshow();
      }
      document.body.focus();
    },

    moveFocus: function (dx, dy) {
      var current = this.focusables[this.focusIndex];
      var row = Number(current.getAttribute('data-row'));
      var col = Number(current.getAttribute('data-col'));
      var bestIndex = this.focusIndex;
      var bestDistance = 999;
      var i;
      var candidate;
      var candidateRow;
      var candidateCol;
      var distance;

      for (i = 0; i < this.focusables.length; i += 1) {
        candidate = this.focusables[i];
        candidateRow = Number(candidate.getAttribute('data-row'));
        candidateCol = Number(candidate.getAttribute('data-col'));
        if (dx && candidateRow === row && ((dx > 0 && candidateCol > col) || (dx < 0 && candidateCol < col))) {
          distance = Math.abs(candidateCol - col);
        } else if (dy && ((dy > 0 && candidateRow > row) || (dy < 0 && candidateRow < row))) {
          distance = Math.abs(candidateRow - row) * 10 + Math.abs(candidateCol - col);
        } else {
          continue;
        }
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      }

      this.focusIndex = bestIndex;
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
        this.closeMenu();
      } else if (action === 'interval') {
        this.settings.interval = Number(value);
        this.saveSettings();
        this.updateMenuSelection();
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
      }
    },

    updateMenuSelection: function () {
      var buttons = document.querySelectorAll('[data-action]');
      var i;
      var action;
      var value;
      for (i = 0; i < buttons.length; i += 1) {
        action = buttons[i].getAttribute('data-action');
        value = buttons[i].getAttribute('data-value');
        buttons[i].classList.toggle(
          'selected',
          (action === 'category' && value === this.settings.category) ||
          (action === 'interval' && Number(value) === this.settings.interval) ||
          (action === 'motion' && value === this.settings.motion) ||
          (action === 'language' && value === this.settings.language)
        );
      }
    },

    updateLanguage: function () {
      var t = I18N[this.language];
      var labels = document.querySelectorAll('[data-action="category"]');
      var i;
      var value;
      var key;
      document.documentElement.lang = this.language;
      this.el.loadingText.textContent = t.loading;
      this.el.detailsKicker.textContent = t.story;
      this.el.menuTitle.textContent = t.menuTitle;
      this.el.collectionsHeading.textContent = t.collections;
      this.el.stylesHeading.textContent = t.styles;
      this.el.intervalHeading.textContent = t.interval;
      this.el.motionHeading.textContent = t.motion;
      this.el.languageHeading.textContent = t.language;
      this.el.emptyTitle.textContent = t.emptyTitle;
      this.el.emptyText.textContent = t.emptyText;
      document.querySelector('#empty-state [data-value="all"]').textContent = t.showAll;
      for (i = 0; i < labels.length; i += 1) {
        value = labels[i].getAttribute('data-value');
        key = CATEGORY_KEYS[value] || 'all';
        labels[i].textContent = t[key] || value;
      }
      labels = this.el.controlsHint.getElementsByTagName('span');
      for (i = 0; i < labels.length; i += 1) {
        labels[i].textContent = t.controls[i];
      }
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
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    App.init();
  });
}());

/**
 * Art Gallery Screensaver — Main App
 * Controls slideshow, keyboard/remote input, settings
 */

const App = {
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

  async init() {
    // Cache DOM elements
    this.els = {
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
      favHeart: document.getElementById('fav-heart'),
      favText: document.getElementById('fav-text'),
      favBadge: document.getElementById('fav-badge'),
      favCount: document.getElementById('fav-count')
    };

    // Load saved settings
    this.settings = ImageCache.loadSettings();
    this.applySettingsUI();

    // Start clock
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);

    // Update favorites badge
    this.updateFavBadge();

    // Load artworks from APIs (with 8s timeout)
    try {
      this.artworks = await Promise.race([
        MuseumAPI.getArtworks(this.settings.collection),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000))
      ]);
    } catch (e) {
      console.warn('API failed:', e.message);
    }

    if (this.artworks.length === 0) {
      // Fallback: show bundled collection
      this.els.loading.querySelector('p').textContent = 'Using offline collection...';
      this.artworks = await MuseumAPI.fetchBundled();
    }

    if (this.artworks.length === 0) {
      this.els.loading.querySelector('p').textContent = 'No artworks found. Check connection.';
      return;
    }

    // Shuffle and start
    this.artworks = MuseumAPI.shuffle(this.artworks);
    
    // Preload first 3 images, then start slideshow
    await ImageCache.preloadNext(this.artworks, -1);
    
    this.hideLoading();
    this.showArtwork(0);
    this.startTimer();

    // Preload remaining in background
    ImageCache.preloadNext(this.artworks, 2);

    // Setup input handlers
    this.setupInput();

    // Reposition info on resize
    window.addEventListener('resize', () => this.positionInfo());
  },

  /**
   * Position art info inside the actual painting bounds
   */
  positionInfo() {
    const img = this.els.image;
    const info = this.els.info;

    if (!img.naturalWidth || !img.naturalHeight) {
      // Image not loaded yet, fallback
      info.style.bottom = '20px';
      info.style.padding = '0 60px';
      return;
    }

    const containerW = img.clientWidth;
    const containerH = img.clientHeight;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = containerW / containerH;

    let renderedW, renderedH, offsetX, offsetY;

    if (imgRatio > boxRatio) {
      // Image is wider — fills width, bars top/bottom
      renderedW = containerW;
      renderedH = containerW / imgRatio;
      offsetX = 0;
      offsetY = (containerH - renderedH) / 2;
    } else {
      // Image is taller — fills height, bars left/right
      renderedH = containerH;
      renderedW = containerH * imgRatio;
      offsetX = (containerW - renderedW) / 2;
      offsetY = 0;
    }

    // Position info at the bottom of the actual painting area
    const infoBottom = containerH - offsetY - renderedH;
    const infoLeft = offsetX;
    const infoWidth = renderedW;

    info.style.bottom = `${Math.max(infoBottom + 12, 8)}px`;
    info.style.left = `${infoLeft}px`;
    info.style.width = `${infoWidth}px`;
    info.style.padding = '0';
  },

  /**
   * Display artwork at index
   */
  async showArtwork(index) {
    const art = this.artworks[index];
    if (!art) return;

    this.currentIndex = index;

    // Transition out
    const transition = this.settings.transition;

    if (transition === 'fade' || transition === 'kenburns') {
      this.els.image.classList.add('fade-out');
      await this.wait(800);
    }

    // Load image (from cache or network)
    let imgEl = ImageCache.get(art.id);
    
    if (!imgEl) {
      try {
        await ImageCache.preload(art);
        imgEl = ImageCache.get(art.id);
      } catch (e) {
        // Skip this artwork
        this.next();
        return;
      }
    }

    // Remove previous Ken Burns class
    if (this.kenBurnsClass) {
      this.els.image.classList.remove(this.kenBurnsClass);
      this.kenBurnsClass = null;
    }

    // Set image
    this.els.image.src = art.image;

    // Transition in
    if (transition === 'kenburns') {
      // Pick a random Ken Burns variant
      const variant = Math.floor(Math.random() * this.kenBurnsCount) + 1;
      this.kenBurnsClass = `ken-burns-${variant}`;
      this.els.image.classList.remove('fade-out');
      this.els.image.classList.add(this.kenBurnsClass);
      // Set animation duration to match slideshow interval
      this.els.image.style.animationDuration = `${this.settings.interval}s`;
    } else if (transition === 'fade') {
      this.els.image.classList.remove('fade-out');
      this.els.image.style.animationDuration = '';
    } else if (transition === 'slide') {
      this.els.image.className = 'slide-in';
      this.els.image.style.animationDuration = '';
    } else if (transition === 'zoom') {
      this.els.image.className = 'zoom-in';
      this.els.image.style.animationDuration = '';
    }

    // Update info
    this.els.title.textContent = art.title;
    this.els.artist.textContent = art.artist;
    this.els.year.textContent = art.year;
    this.els.museum.textContent = art.museum;

    // Show favorite indicator
    const isFav = ImageCache.isFavorite(art.id);
    this.els.image.classList.toggle('is-fav', isFav);

    // Show/hide info based on settings
    this.showInfo();

    // Position info inside painting bounds (after image loads)
    requestAnimationFrame(() => this.positionInfo());

    // Preload next images
    ImageCache.preloadNext(this.artworks, index);
  },

  /**
   * Show artwork info based on setting
   */
  showInfo() {
    if (this.infoTimeout) clearTimeout(this.infoTimeout);
    
    if (this.settings.showInfo === 'never') {
      this.els.info.classList.add('hidden');
    } else if (this.settings.showInfo === 'brief') {
      this.els.info.classList.remove('hidden');
      this.infoTimeout = setTimeout(() => {
        this.els.info.classList.add('hidden');
      }, 5000);
    } else {
      this.els.info.classList.remove('hidden');
    }
  },

  /**
   * Slideshow timer
   */
  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => this.next(), this.settings.interval * 1000);
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  next() {
    const next = (this.currentIndex + 1) % this.artworks.length;
    this.showArtwork(next);
  },

  prev() {
    const prev = (this.currentIndex - 1 + this.artworks.length) % this.artworks.length;
    this.showArtwork(prev);
  },

  /**
   * Clock display
   */
  updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    this.els.clock.textContent = `${h}:${m}`;
  },

  hideLoading() {
    this.els.loading.classList.add('hidden');
  },

  wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  },

  /**
   * Toggle favorite for current artwork
   */
  async toggleFavorite() {
    const art = this.artworks[this.currentIndex];
    if (!art) return;

    const added = await ImageCache.toggleFavorite(art);
    
    // Update UI
    this.els.image.classList.toggle('is-fav', added);
    this.updateFavBadge();

    // Show hint animation
    this.els.favHeart.textContent = added ? '❤️' : '💔';
    this.els.favText.textContent = added ? 'Saved!' : 'Removed';
    this.els.favHint.classList.add('show');
    
    setTimeout(() => {
      this.els.favHint.classList.remove('show');
    }, 1500);
  },

  updateFavBadge() {
    const count = ImageCache.getFavoritesCount();
    this.els.favCount.textContent = count;
    this.els.favBadge.style.opacity = count > 0 ? '0.5' : '0.2';
  },

  /**
   * Settings UI
   */
  toggleSettings() {
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

  applySettingsUI() {
    document.querySelectorAll('.setting-options').forEach(group => {
      const setting = group.dataset.setting;
      const value = this.settings[setting];
      
      group.querySelectorAll('button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.value === value);
      });
    });
  },

  focusFirstOption() {
    const first = this.els.settings.querySelector('button');
    if (first) {
      document.querySelectorAll('.setting-options button').forEach(b => b.classList.remove('focused'));
      first.classList.add('focused');
    }
  },

  /**
   * Keyboard / Remote control input
   * WebOS remote maps to standard keys:
   *   Arrow keys, Enter, Backspace (back), Escape
   */
  setupInput() {
    let focusedBtn = null;

    document.addEventListener('keydown', (e) => {
      // Settings open — navigate settings
      if (this.isSettingsOpen) {
        this.handleSettingsInput(e);
        return;
      }

      switch (e.keyCode) {
        case 37: // LEFT
        case 174: // webOS Channel Down
          this.prev();
          this.startTimer(); // Reset timer on manual change
          break;
          
        case 39: // RIGHT  
        case 175: // webOS Channel Up
          this.next();
          this.startTimer();
          break;
          
        case 38: // UP — save to favorites
        case 48: // 0 key (alternative)
          this.toggleFavorite();
          break;
          
        case 13: // ENTER / OK
        case 461: // webOS Back
        case 27: // ESC
          this.toggleSettings();
          break;
          
        case 40: // DOWN — show info briefly
          this.els.info.classList.remove('hidden');
          if (this.infoTimeout) clearTimeout(this.infoTimeout);
          this.infoTimeout = setTimeout(() => {
            if (this.settings.showInfo === 'never' || this.settings.showInfo === 'brief') {
              this.els.info.classList.add('hidden');
            }
          }, 5000);
          break;
      }
    });

    // Settings button clicks (for mouse/touch — also works on TV)
    document.querySelectorAll('.setting-options button').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.setting-options');
        const setting = group.dataset.setting;
        
        this.settings[setting] = btn.dataset.value;
        
        group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        ImageCache.saveSettings(this.settings);
        
        // If collection changed, reload
        if (setting === 'collection') {
          this.reloadCollection();
        }
        
        // If interval changed, restart timer
        if (setting === 'interval') {
          this.startTimer();
        }
      });
    });
  },

  handleSettingsInput(e) {
    const buttons = [...this.els.settings.querySelectorAll('button')];
    const focusedIdx = buttons.findIndex(b => b.classList.contains('focused'));
    
    switch (e.keyCode) {
      case 38: // UP
        if (focusedIdx > 0) {
          buttons[focusedIdx]?.classList.remove('focused');
          buttons[focusedIdx - 1]?.classList.add('focused');
        }
        break;
        
      case 40: // DOWN
        if (focusedIdx < buttons.length - 1) {
          buttons[focusedIdx]?.classList.remove('focused');
          buttons[focusedIdx + 1]?.classList.add('focused');
        }
        break;
        
      case 37: // LEFT — previous in current group
        if (focusedIdx > 0) {
          const prev = focusedIdx - 1;
          // Stay in same group
          if (buttons[prev]?.closest('.setting-options') === buttons[focusedIdx]?.closest('.setting-options')) {
            buttons[focusedIdx]?.classList.remove('focused');
            buttons[prev]?.classList.add('focused');
          }
        }
        break;
        
      case 39: // RIGHT — next in current group
        if (focusedIdx < buttons.length - 1) {
          const next = focusedIdx + 1;
          if (buttons[next]?.closest('.setting-options') === buttons[focusedIdx]?.closest('.setting-options')) {
            buttons[focusedIdx]?.classList.remove('focused');
            buttons[next]?.classList.add('focused');
          }
        }
        break;
        
      case 13: // ENTER — select
        if (focusedIdx >= 0) buttons[focusedIdx]?.click();
        break;
        
      case 461: // webOS Back
      case 27: // ESC
        this.toggleSettings();
        break;
    }
  },

  async reloadCollection() {
    this.els.loading.querySelector('p').textContent = 'Loading collection...';
    this.els.loading.classList.remove('hidden');
    
    this.artworks = await MuseumAPI.getArtworks(this.settings.collection);
    this.artworks = MuseumAPI.shuffle(this.artworks);
    
    ImageCache.cache.clear();
    await ImageCache.preloadNext(this.artworks, -1);
    
    this.hideLoading();
    this.showArtwork(0);
    this.startTimer();
  }
};

// Start the app
document.addEventListener('DOMContentLoaded', () => App.init());

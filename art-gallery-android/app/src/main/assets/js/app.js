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
      favIcon: document.getElementById('fav-icon'),
      favText: document.getElementById('fav-text'),
      favFlash: document.getElementById('fav-flash'),
      favBadge: document.getElementById('fav-badge'),
      favCount: document.getElementById('fav-count')
    };

    // Recalculate text position when image actually renders
    this.els.image.addEventListener('load', () => {
      // Small delay to let layout settle after paint
      setTimeout(() => this.positionInfo(), 50);
    });

    // Load saved settings
    this.settings = ImageCache.loadSettings();
    this.applySettingsUI();

    // Start clock
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);

    // Update favorites badge
    this.updateFavBadge();

    // Load artworks — skip API, go straight to bundled (all local)
    this.artworks = await MuseumAPI.fetchBundled();

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

    if (!img.naturalWidth || !img.naturalHeight) return;

    // The image element fills 100% of #art-wrapper via CSS,
    // so use the wrapper (parent) as the container reference
    const container = img.parentElement;
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = containerW / containerH;

    let renderedW, renderedH, offsetX, offsetY;

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
    const infoBottom = containerH - offsetY - renderedH;
    const infoLeft = offsetX;
    const infoWidth = renderedW;

    info.style.bottom = `${Math.round(Math.max(infoBottom + 14, 6))}px`;
    info.style.left = `${Math.round(infoLeft + 20)}px`;
    info.style.width = `${Math.round(infoWidth - 40)}px`;
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
   * Toggle favorite for current artwork — with particle burst
   */
  async toggleFavorite() {
    const art = this.artworks[this.currentIndex];
    if (!art) return;

    const added = await ImageCache.toggleFavorite(art);
    
    // Update UI
    this.els.image.classList.toggle('is-fav', added);
    this.updateFavBadge();

    // Flash effect
    this.els.favFlash.classList.remove('show');
    void this.els.favFlash.offsetWidth; // reflow
    if (added) this.els.favFlash.classList.add('show');

    // Heart animation
    if (added) {
      this.els.favIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f0a0b0"/>
          <stop offset="50%" style="stop-color:#d4708a"/>
          <stop offset="100%" style="stop-color:#b85570"/>
        </linearGradient></defs>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#hg)"/>
      </svg>`;
      this.els.favIcon.classList.remove('remove-icon');
    } else {
      this.els.favIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#555" stroke="#888" stroke-width="0.5"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="#999" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
      this.els.favIcon.classList.add('remove-icon');
    }
    this.els.favText.textContent = added ? 'Saved!' : 'Removed';
    this.els.favHint.classList.remove('show', 'hide');
    void this.els.favHint.offsetWidth; // reflow
    this.els.favHint.classList.add(added ? 'show' : 'hide');

    // Particle burst (only on add)
    if (added) {
      this.spawnParticles(8);
    }

    setTimeout(() => {
      this.els.favHint.classList.remove('show', 'hide');
      this.els.favFlash.classList.remove('show');
      // Clean particles
      document.querySelectorAll('.fav-particle').forEach(p => p.remove());
    }, 1500);
  },

  /**
   * Spawn particle burst around center
   */
  spawnParticles(count) {
    const colors = ['#d4708a', '#c08090', '#e0a0b0', '#b86078', '#ddb8c4', '#ffffff'];
    const screensaver = document.getElementById('screensaver');
    
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'fav-particle';
      const angle = (360 / count) * i;
      const distance = 60 + Math.random() * 40;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 4 + Math.random() * 6;
      
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.background = color;
      p.style.boxShadow = `0 0 6px ${color}`;
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
      p.style.animation = 'none';
      
      screensaver.appendChild(p);
      
      // Animate with unique direction (fallback for old browsers without .animate())
      try {
        p.animate([
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2)`, opacity: 0 }
        ], {
          duration: 600 + Math.random() * 300,
          easing: 'ease-out',
          fill: 'forwards'
        });
      } catch(e) {
        p.style.transition = 'all 0.6s ease-out';
        p.style.opacity = '0';
        p.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2)`;
      }
    }
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
window.onerror = function(msg, url, line) {
  var el = document.getElementById('loading');
  if (el) el.querySelector('p').textContent = 'Error: ' + msg;
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });

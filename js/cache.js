/**
 * Image Cache — preloads and caches images for smooth transitions
 * Uses in-memory cache + preloading strategy
 */

const ImageCache = {
  cache: new Map(),
  maxSize: 30,
  preloadCount: 3, // How many images to preload ahead
  
  /**
   * Preload an image and add to cache
   */
  preload(artwork) {
    return new Promise((resolve, reject) => {
      if (this.cache.has(artwork.id)) {
        resolve(artwork);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        this.cache.set(artwork.id, {
          artwork: artwork,
          element: img,
          loadedAt: Date.now()
        });
        
        // Evict oldest if over max
        if (this.cache.size > this.maxSize) {
          const oldest = this.findOldest();
          if (oldest) this.cache.delete(oldest);
        }
        
        resolve(artwork);
      };
      
      img.onerror = () => {
        console.warn('Failed to load:', artwork.title);
        reject(new Error('Image load failed'));
      };
      
      img.src = artwork.image;
    });
  },
  
  /**
   * Preload next N artworks
   */
  async preloadNext(artworks, currentIndex) {
    const promises = [];
    for (let i = 1; i <= this.preloadCount; i++) {
      const idx = (currentIndex + i) % artworks.length;
      if (!this.cache.has(artworks[idx].id)) {
        promises.push(this.preload(artworks[idx]).catch(() => {}));
      }
    }
    await Promise.all(promises);
  },
  
  /**
   * Get cached image element
   */
  get(id) {
    const entry = this.cache.get(id);
    return entry ? entry.element : null;
  },
  
  /**
   * Find oldest cache entry
   */
  findOldest() {
    let oldestKey = null;
    let oldestTime = Infinity;
    
    for (const [key, entry] of this.cache) {
      if (entry.loadedAt < oldestTime) {
        oldestTime = entry.loadedAt;
        oldestKey = key;
      }
    }
    
    return oldestKey;
  },
  
  /**
   * Save settings to localStorage
   */
  saveSettings(settings) {
    try {
      localStorage.setItem('artscreen-settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save settings');
    }
  },
  
  /**
   * Load settings from localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('artscreen-settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    
    // Defaults
    return {
      interval: 30,
      transition: 'fade',
      showInfo: 'always',
      collection: 'all'
    };
  },

  /**
   * Favorites — stored as array of artwork objects with base64 image data
   */
  getFavorites() {
    try {
      const favs = localStorage.getItem('artscreen-favorites');
      return favs ? JSON.parse(favs) : [];
    } catch (e) {
      return [];
    }
  },

  isFavorite(artworkId) {
    const favs = this.getFavorites();
    return favs.some(f => f.id === artworkId);
  },

  async toggleFavorite(artwork) {
    const favs = this.getFavorites();
    const idx = favs.findIndex(f => f.id === artwork.id);
    
    if (idx >= 0) {
      // Remove from favorites
      favs.splice(idx, 1);
      localStorage.setItem('artscreen-favorites', JSON.stringify(favs));
      return false; // removed
    } else {
      // Add to favorites — download image as base64 for offline
      try {
        const base64 = await this.imageToBase64(artwork.image);
        const favArt = {
          ...artwork,
          imageB64: base64,
          savedAt: Date.now()
        };
        delete favArt.image; // Use base64 instead
        favs.push(favArt);
        localStorage.setItem('artscreen-favorites', JSON.stringify(favs));
        return true; // added
      } catch (e) {
        console.error('Failed to save favorite:', e);
        // Save without base64 (will need internet)
        favs.push({ ...artwork, savedAt: Date.now() });
        localStorage.setItem('artscreen-favorites', JSON.stringify(favs));
        return true;
      }
    }
  },

  /**
   * Convert image URL to base64 for offline storage
   */
  imageToBase64(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('CORS or load failed'));
      img.src = url;
    });
  },

  getFavoritesCount() {
    return this.getFavorites().length;
  }
};

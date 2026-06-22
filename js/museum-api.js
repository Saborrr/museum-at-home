/**
 * Museum API — fetches art from Rijksmuseum + Met Museum
 * Both are free APIs with high-quality images
 */

const MuseumAPI = {
  
  // Rijksmuseum (Amsterdam) — free API key at https://data.rijksmuseum.nl/
  RIJKS_KEY: 'YOUR_RIJKSMUSEUM_API_KEY', // Get free key at data.rijksmuseum.nl
  
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
  async fetchRijks(collection = '', count = 20) {
    const query = collection || 'painting';
    const url = `https://www.rijksmuseum.nl/api/en/collection?key=${this.RIJKS_KEY}` +
      `&q=${encodeURIComponent(query)}&imgonly=true&ps=${count}&toppieces=true` +
      `&st=Objects&s=Relevance`;
    
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      
      return data.artObjects
        .filter(art => art.webImage && art.webImage.url)
        .map(art => ({
          id: `rijks-${art.objectNumber}`,
          title: art.title,
          artist: art.principalOrFirstMaker,
          year: art.longTitle ? art.longTitle.split(',').pop().trim() : '',
          museum: 'Rijksmuseum, Amsterdam',
          image: art.webImage.url.replace('=s0', '=s1920'), // Request 1920px wide
          thumb: art.headerImage?.url || art.webImage.url.replace('=s0', '=s400'),
          source: 'rijksmuseum'
        }));
    } catch (e) {
      console.error('Rijksmuseum API error:', e);
      return [];
    }
  },

  /**
   * Fetch artworks from Met Museum (no key needed!)
   */
  async fetchMet(collection = '', count = 20) {
    const query = collection || 'paintings';
    
    try {
      // Step 1: Search for objects
      const searchUrl = `${this.MET_BASE}/search?q=${encodeURIComponent(query)}&hasImages=true&isHighlight=true&medium=Paintings`;
      const searchResp = await fetch(searchUrl);
      const searchData = await searchResp.json();
      
      if (!searchData.objectIDs || searchData.objectIDs.length === 0) return [];
      
      // Step 2: Fetch details for random subset (avoid hammering API)
      const ids = this.shuffle(searchData.objectIDs).slice(0, count);
      const artworks = [];
      
      for (const id of ids) {
        try {
          const resp = await fetch(`${this.MET_BASE}/objects/${id}`);
          const obj = await resp.json();
          
          if (obj.primaryImage && obj.isPublicDomain) {
            artworks.push({
              id: `met-${obj.objectID}`,
              title: obj.title,
              artist: obj.artistDisplayName || 'Unknown',
              year: obj.objectDate || '',
              museum: 'Metropolitan Museum of Art, New York',
              image: obj.primaryImage,
              thumb: obj.primaryImageSmall || obj.primaryImage,
              source: 'met'
            });
          }
        } catch (e) {
          // Skip individual failures
        }
      }
      
      return artworks;
    } catch (e) {
      console.error('Met Museum API error:', e);
      return [];
    }
  },

  /**
   * Decide whether a Met object is a painting.
   * Accepts Paintings classification OR an objectName that starts with "Painting".
   */
  isPainting(obj) {
    const cls = (obj.classification || '').toLowerCase();
    const name = (obj.objectName || '').toLowerCase();
    return cls === 'paintings' || name.startsWith('painting');
  },

  /**
   * Load artworks from bundled collection (works offline & with file://)
   */
  async fetchBundled() {
    // Use inline bundled data (works with file:// protocol)
    if (typeof BUNDLED_ART !== 'undefined' && BUNDLED_ART.length > 0) {
      return BUNDLED_ART;
    }
    // Fallback: try fetch (works on web server)
    try {
      const resp = await fetch('data/collection.json');
      return await resp.json();
    } catch (e) {
      return [];
    }
  },

  /**
   * Get art for a collection — tries API, falls back to bundled
   */
  async getArtworks(collection = 'all') {
    // Special case: favorites collection
    if (collection === 'favorites') {
      const favs = ImageCache.getFavorites();
      // Convert saved favorites back to artwork format
      return favs.map(f => ({
        id: f.id,
        title: f.title,
        artist: f.artist,
        year: f.year,
        museum: f.museum,
        image: f.imageB64 || f.image, // Use base64 if available (offline!)
        thumb: f.thumb || '',
        source: 'favorites'
      }));
    }
    
    const tag = this.collections[collection] || '';
    
    // Try both APIs in parallel
    const [rijks, met] = await Promise.all([
      this.fetchRijks(tag, 15),
      this.fetchMet(tag, 15)
    ]);
    
    let all = [...rijks, ...met];
    
    // If APIs failed or returned nothing, use bundled
    if (all.length < 5) {
      const bundled = await this.fetchBundled();
      all = [...all, ...bundled];
    }
    
    return this.shuffle(all);
  },

  /** Shuffle array */
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
};

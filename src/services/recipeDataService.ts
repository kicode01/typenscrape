
// Service for managing chunked recipe database
interface ChunkedRecipeData {
  chunks: any[];
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

class RecipeDataService {
  private data: ChunkedRecipeData = {
    chunks: [],
    isLoaded: false,
    isLoading: false,
    error: null
  };

  private readonly CHUNK_COUNT = 10;
  private readonly CACHE_KEY = 'recipe_chunks_cache';
  private readonly CACHE_TIMESTAMP_KEY = 'recipe_chunks_timestamp';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  async loadChunkedDatabase(): Promise<any[]> {
    if (this.data.isLoaded) {
      return this.data.chunks;
    }

    if (this.data.isLoading) {
      // Wait for current loading to complete
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.data.isLoaded) {
            resolve(this.data.chunks);
          } else if (this.data.error) {
            resolve([]);
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    // Check cache first
    const cachedData = this.getCachedData();
    if (cachedData) {
      this.data.chunks = cachedData;
      this.data.isLoaded = true;
      return cachedData;
    }

    // Load chunks from JSON files
    this.data.isLoading = true;
    this.data.error = null;

    try {
      const chunkPromises = [];
      
      for (let i = 1; i <= this.CHUNK_COUNT; i++) {
        const chunkPromise = import(`../data/recipe-chunk-${i}.json`)
          .then(module => module.default)
          .catch(error => {
            console.warn(`Failed to load recipe-chunk-${i}.json:`, error);
            return [];
          });
        chunkPromises.push(chunkPromise);
      }

      const chunks = await Promise.all(chunkPromises);
      const combinedData = chunks.flat();

      this.data.chunks = combinedData;
      this.data.isLoaded = true;
      this.data.isLoading = false;

      // Cache the loaded data
      this.setCachedData(combinedData);

      console.log(`Loaded ${combinedData.length} recipes from ${this.CHUNK_COUNT} chunks`);
      return combinedData;

    } catch (error) {
      console.error('Error loading chunked database:', error);
      this.data.error = error instanceof Error ? error.message : 'Failed to load database';
      this.data.isLoading = false;
      return [];
    }
  }

  private getCachedData(): any[] | null {
    try {
      const timestamp = localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
      if (!timestamp) return null;

      const age = Date.now() - parseInt(timestamp);
      if (age > this.CACHE_DURATION) {
        // Cache expired
        this.clearCache();
        return null;
      }

      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (!cachedData) return null;

      return JSON.parse(cachedData);
    } catch (error) {
      console.warn('Error reading cached data:', error);
      this.clearCache();
      return null;
    }
  }

  private setCachedData(data: any[]): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.warn('Error caching data:', error);
    }
  }

  private clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
  }

  getLoadingState() {
    return {
      isLoaded: this.data.isLoaded,
      isLoading: this.data.isLoading,
      error: this.data.error
    };
  }

  clearData(): void {
    this.data = {
      chunks: [],
      isLoaded: false,
      isLoading: false,
      error: null
    };
    this.clearCache();
  }
}

export const recipeDataService = new RecipeDataService();

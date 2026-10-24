// Service for managing chunked recipe database optimized for low-end devices
import { idbService } from './idbService';

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

    this.data.isLoading = true;
    this.data.error = null;

    try {
      const allChunks: any[] = [];
      
      // Sequentially load chunks to keep peak memory low on budget devices
      const cacheBust = Date.now();
      for (let i = 1; i <= 16; i++) {
        try {
          const response = await fetch(`/data/chunk_${i}.json?v=${cacheBust}`);
          if (response.ok) {
            const chunkData = await response.json();
            
            // Sanitize data globally
            const sanitizedData = chunkData.map((recipe: any) => {
              if (recipe.name) {
                recipe.name = recipe.name
                  .replace(/^(how to make|how to cook|recipe for)\s+/i, '')
                  .replace(/\s+recipe$/i, '')
                  .trim();
                
                // Capitalize first letter of each word
                recipe.name = recipe.name.replace(/\b\w/g, (c: string) => c.toUpperCase());
              }
              
              if (Array.isArray(recipe.instructions)) {
                recipe.instructions = recipe.instructions.map((step: string) => 
                  step.replace(/^step\s*\d+[:.-]?\s*/i, '').trim()
                );
              }
              
              return recipe;
            });
            
            allChunks.push(...sanitizedData);
          }
        } catch (error) {
          console.warn(`Failed to load /data/chunk_${i}.json:`, error);
        }
      }
      
      this.data.chunks = allChunks;
      this.data.isLoaded = true;
      this.data.isLoading = false;

      // Seed into IndexedDB asynchronously without blocking the UI thread or hitting 5MB localStorage limits
      setTimeout(() => {
        idbService.bulkInsertRecipes(allChunks).catch(e => {
          console.warn('IDB background seed error:', e);
        });
      }, 500);

      console.log(`Loaded ${allChunks.length} real recipes from chunked database into low-end optimized storage`);
      return allChunks;

    } catch (error) {
      console.error('Error loading chunked database:', error);
      this.data.error = error instanceof Error ? error.message : 'Failed to load database';
      this.data.isLoading = false;
      
      this.data.chunks = [];
      this.data.isLoaded = true;
      return [];
    }
  }

  getLoadingState() {
    return {
      isLoaded: this.data.isLoaded,
      isLoading: this.data.isLoading,
      error: this.data.error,
      totalRecipes: this.data.chunks.length
    };
  }

  clearData(): void {
    this.data = {
      chunks: [],
      isLoaded: false,
      isLoading: false,
      error: null
    };
  }

  getDatabaseStats() {
    return {
      totalRecipes: this.data.chunks.length,
      isLoaded: this.data.isLoaded,
      isLoading: this.data.isLoading,
      error: this.data.error
    };
  }
}

export const recipeDataService = new RecipeDataService();

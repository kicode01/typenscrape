import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface LocalRecipe {
  id: string;
  name: string;
  ingredients: string;
  ingredientsArray: string[];
  description?: string;
  prepTime?: string;
  cookTime?: string;
  recipeYield?: string;
  source?: string;
  url?: string;
  image?: string;
  createdAt?: number;
}

interface TypenScrapeDBSchema extends DBSchema {
  recipes: {
    key: string;
    value: LocalRecipe;
    indexes: {
      'by-name': string;
      'by-ingredients': string;
    };
  };
}

class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase<TypenScrapeDBSchema>> | null = null;
  private readonly DB_NAME = 'TypenScrapeOfflineDB';
  private readonly DB_VERSION = 1;

  constructor() {
    this.initDB();
  }

  private initDB() {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      console.warn('IndexedDB is not supported in this browser environment.');
      return;
    }

    this.dbPromise = openDB<TypenScrapeDBSchema>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('recipes')) {
          const store = db.createObjectStore('recipes', { keyPath: 'id' });
          store.createIndex('by-name', 'name', { unique: false });
          // Multi-entry index on ingredientsArray for ultra-fast matching
          store.createIndex('by-ingredients', 'ingredientsArray', { multiEntry: true, unique: false });
        }
      },
    });
  }

  /**
   * Bulk insert recipes into IndexedDB
   */
  async bulkInsertRecipes(recipes: Partial<LocalRecipe>[]): Promise<number> {
    if (!this.dbPromise) return 0;

    try {
      const db = await this.dbPromise;
      const tx = db.transaction('recipes', 'readwrite');
      const store = tx.objectStore('recipes');

      let inserted = 0;
      for (const recipe of recipes) {
        if (!recipe.name) continue;

        const id = recipe.id || `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const ingredientsText = recipe.ingredients || '';
        
        const ingredientsArray = recipe.ingredientsArray || ingredientsText
          .split('\n')
          .flatMap(line => line.split(' '))
          .map(word => word.replace(/[^a-zA-Z]/g, '').toLowerCase())
          .filter(word => word.length > 2);

        await store.put({
          id,
          name: recipe.name,
          ingredients: ingredientsText,
          ingredientsArray: Array.from(new Set(ingredientsArray)),
          description: recipe.description || '',
          prepTime: recipe.prepTime || 'PT15M',
          cookTime: recipe.cookTime || 'PT20M',
          recipeYield: recipe.recipeYield || '2-4 servings',
          source: recipe.source || 'Local Database',
          url: recipe.url || '',
          image: recipe.image || '',
          createdAt: Date.now()
        });
        inserted++;
      }

      await tx.done;
      console.log(`💾 IndexedDB: Successfully bulk inserted ${inserted} recipes.`);
      return inserted;
    } catch (error) {
      console.error('IndexedDB bulk insert error:', error);
      return 0;
    }
  }

  /**
   * Fast offline search for recipes matching target ingredients
   */
  async searchByIngredients(ingredients: string[], maxResults: number = 20): Promise<LocalRecipe[]> {
    if (!this.dbPromise) return [];

    try {
      const db = await this.dbPromise;
      const tx = db.transaction('recipes', 'readonly');
      const store = tx.objectStore('recipes');
      const index = store.index('by-ingredients');

      const matchesMap = new Map<string, { recipe: LocalRecipe; score: number }>();
      const searchTerms = ingredients.map(i => i.trim().toLowerCase()).filter(i => i.length > 0);

      for (const term of searchTerms) {
        const results = await index.getAll(term);
        for (const recipe of results) {
          const current = matchesMap.get(recipe.id);
          if (current) {
            current.score += 1;
          } else {
            matchesMap.set(recipe.id, { recipe, score: 1 });
          }
        }
      }

      // Sort by best ingredient match count
      const sorted = Array.from(matchesMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(item => item.recipe);

      console.log(`⚡ IndexedDB: Found ${sorted.length} matching recipes offline.`);
      return sorted;
    } catch (error) {
      console.error('IndexedDB search error:', error);
      return [];
    }
  }

  /**
   * Get total offline recipe count in IndexedDB
   */
  async getRecipeCount(): Promise<number> {
    if (!this.dbPromise) return 0;
    try {
      const db = await this.dbPromise;
      return await db.count('recipes');
    } catch (error) {
      console.error('Error counting IndexedDB recipes:', error);
      return 0;
    }
  }
}

export const idbService = new IndexedDbService();

import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  limit, 
  Timestamp, 
  DocumentData,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

export interface FirebaseRecipe {
  id?: string;
  name: string;
  ingredients: string;
  ingredientsArray?: string[];
  description?: string;
  prepTime?: string;
  cookTime?: string;
  recipeYield?: string;
  source?: string;
  url?: string;
  image?: string;
  createdAt?: Timestamp | Date;
}

export class FirebaseRecipeService {
  private collectionName = 'recipes';

  /**
   * Checks if Firebase is active and available for queries
   */
  isAvailable(): boolean {
    return isFirebaseConfigured() && db !== null;
  }

  /**
   * Search Firestore recipes matching any of the given ingredients
   */
  async searchByIngredients(ingredients: string[], maxResults: number = 20): Promise<FirebaseRecipe[]> {
    if (!this.isAvailable() || !db) {
      console.warn('Firebase is not configured or unavailable.');
      return [];
    }

    try {
      const recipesRef = collection(db, this.collectionName);
      
      // Clean and normalize ingredients for matching
      const cleanedIngredients = ingredients.map(ing => ing.trim().toLowerCase());

      // Query recipes where ingredientsArray contains any of the search ingredients
      const q = query(
        recipesRef,
        where('ingredientsArray', 'array-contains-any', cleanedIngredients),
        limit(maxResults)
      );

      const querySnapshot = await getDocs(q);
      const results: FirebaseRecipe[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        results.push({
          id: doc.id,
          name: data.name || 'Untitled Recipe',
          ingredients: data.ingredients || '',
          ingredientsArray: data.ingredientsArray || [],
          description: data.description || '',
          prepTime: data.prepTime || '',
          cookTime: data.cookTime || '',
          recipeYield: data.recipeYield || '',
          source: data.source || 'Firebase',
          url: data.url || '',
          image: data.image || '',
        });
      });

      console.log(`🔥 Retrieved ${results.length} recipes from Firestore`);
      return results;
    } catch (error) {
      console.error('Error fetching recipes from Firestore:', error);
      return [];
    }
  }

  /**
   * Save a newly generated or favorite recipe to Firestore
   */
  async saveRecipe(recipe: Partial<FirebaseRecipe>): Promise<string | null> {
    if (!this.isAvailable() || !db) {
      console.warn('Firebase is not configured. Recipe not saved to cloud.');
      return null;
    }

    try {
      const recipesRef = collection(db, this.collectionName);
      
      const newRecipeData = {
        name: recipe.name || 'Untitled Recipe',
        ingredients: recipe.ingredients || '',
        ingredientsArray: recipe.ingredientsArray || this.extractIngredientsArray(recipe.ingredients || ''),
        description: recipe.description || '',
        prepTime: recipe.prepTime || 'PT15M',
        cookTime: recipe.cookTime || 'PT20M',
        recipeYield: recipe.recipeYield || '2-4 servings',
        source: recipe.source || 'TypenScrape Community',
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(recipesRef, newRecipeData);
      console.log(`🔥 Saved recipe to Firestore with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error('Error saving recipe to Firestore:', error);
      return null;
    }
  }

  private extractIngredientsArray(ingredientsText: string): string[] {
    return ingredientsText
      .split('\n')
      .map(item => item.trim().toLowerCase())
      .filter(item => item.length > 0);
  }

  /**
   * Sync user's local history and favorites to Firestore
   */
  async syncUserData(userId: string, history: any[], favorites: any[], theme?: string, settings?: any, xp?: number): Promise<void> {
    if (!this.isAvailable() || !db) return;
    try {
      const userDocRef = doc(db, 'users', userId);
      const dataToSave: any = {
        history,
        favorites,
        lastSynced: Timestamp.now()
      };
      
      if (theme) dataToSave.theme = theme;
      if (settings) dataToSave.settings = settings;
      if (xp !== undefined) dataToSave.xp = xp;

      await setDoc(userDocRef, dataToSave, { merge: true });
      console.log('🔥 User data synced to Firestore.');
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  }

  /**
   * Get user's cloud history and favorites from Firestore
   */
  async getUserData(userId: string): Promise<{ history: any[], favorites: any[], theme?: string, settings?: any, xp?: number } | null> {
    if (!this.isAvailable() || !db) return null;
    try {
      const userDocRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          history: data.history || [],
          favorites: data.favorites || [],
          theme: data.theme,
          settings: data.settings,
          xp: data.xp
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }
}

export const firebaseRecipeService = new FirebaseRecipeService();

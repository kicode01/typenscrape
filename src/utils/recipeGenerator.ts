
import { generateRecipeWithGemini } from '../services/geminiService';
import { generateOfflineRecipe } from './offlineRecipeGenerator';
import { recipeDataService } from '../services/recipeDataService';

export async function generateRecipeFromIngredients(
  ingredients: string[], 
  preferences: string = '', 
  apiKey?: string
): Promise<any> {
  
  if (apiKey && apiKey.trim()) {
    try {
      // Try to use Gemini API for enhanced generation
      return await generateRecipeWithGemini(ingredients, preferences, apiKey);
    } catch (error) {
      console.log('API call failed, falling back to offline generation:', error);
      // Fallback to offline generation if API fails
    }
  }

  // Use smart offline generation
  return await generateOfflineRecipe(ingredients);
}

export { recipeDataService };

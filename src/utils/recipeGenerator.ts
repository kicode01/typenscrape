import { generateRecipeWithGemini } from '../services/geminiService';
import { generateOfflineRecipe } from './offlineRecipeGenerator';
import { firebaseRecipeService } from '../services/firebaseRecipeService';
import { idbService } from '../services/idbService';
import { convertExternalRecipe } from './recipeConverter';
import { recipeDataService } from '../services/recipeDataService';

export async function generateRecipeFromIngredients(
  ingredients: string[], 
  preferences: string = '', 
  apiKey?: string
): Promise<any> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const effectiveApiKey = apiKey?.trim() || import.meta.env.VITE_GEMINI_API_KEY;

  // 1. If Online and a Gemini API Key is available, use Gemini AI
  if (!isOnline) {
    console.log('[Compiler] Offline, using Procedural Engine...');
    return await generateOfflineRecipe(ingredients);
  }

  if (!effectiveApiKey) {
    throw new Error('MISSING_API_KEY');
  }

  try {
    console.log('[Compiler] Generating recipe via Gemini AI...');
    return await generateRecipeWithGemini(ingredients, preferences, effectiveApiKey);
  } catch (error: any) {
    if (error.message === 'INVALID_INGREDIENTS') {
      throw new Error('INVALID_INGREDIENTS'); // Bubble this up to UI immediately
    }
    console.log('[Compiler] AI generation failed:', error);
    throw new Error('AI_FAILED');
  }
}

export { recipeDataService, idbService };

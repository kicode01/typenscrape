import { FilipinoDish } from './filipinoRecipeService';

export async function searchSpoonacular(query: string): Promise<FilipinoDish | null> {
  const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
  if (!apiKey) {
    throw new Error('Spoonacular API key is missing');
  }

  // Use the complexSearch endpoint and tell it to include full recipe information!
  // We limit it to 1 result to save bandwidth and closely match the "AI Generation" single-result UX.
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&addRecipeInformation=true&number=1&apiKey=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 402) {
      throw new Error('QUOTA_EXCEEDED');
    }
    throw new Error('Spoonacular API failed');
  }

  const data = await response.json();
  
  if (!data.results || data.results.length === 0) {
    throw new Error('NO_RESULTS');
  }

  const recipe = data.results[0];

  // Parse instructions safely
  let instructions: string[] = [];
  if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
    instructions = recipe.analyzedInstructions[0].steps.map((s: any) => s.step);
  } else if (recipe.instructions) {
    // Fallback if they only provide a raw HTML/text string
    instructions = [recipe.instructions.replace(/<[^>]+>/g, '')];
  } else {
    instructions = ["Instructions not provided by Spoonacular."];
  }

  // Parse ingredients
  let ingredients: string[] = [];
  if (recipe.extendedIngredients) {
    ingredients = recipe.extendedIngredients.map((i: any) => i.original);
  }

  // Map to our internal FilipinoDish format!
  return {
    id: `sp_${recipe.id}`,
    name: recipe.title || 'Unknown Recipe',
    description: recipe.summary ? recipe.summary.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '',
    prepTime: recipe.preparationMinutes ? `${recipe.preparationMinutes} mins` : '',
    cookTime: recipe.readyInMinutes ? `${recipe.readyInMinutes} mins` : '30 mins',
    totalTime: '',
    servings: recipe.servings ? `${recipe.servings}` : '2',
    ingredients: ingredients,
    ingredientNames: ingredients,
    instructions: instructions,
    source: 'Spoonacular Web',
    category: recipe.dishTypes && recipe.dishTypes.length > 0 ? recipe.dishTypes[0] : 'Others',
    rarity: recipe.spoonacularScore > 90 ? 'Legendary' : recipe.spoonacularScore > 70 ? 'Epic' : 'Rare',
    stats: {
      prepSpeed: recipe.readyInMinutes ? Math.max(10, 100 - recipe.readyInMinutes) : 50,
      health: recipe.healthScore || 50,
      flavor: recipe.spoonacularScore || 70,
      budget: recipe.pricePerServing ? Math.max(10, 100 - (recipe.pricePerServing / 10)) : 50
    }
  };
}

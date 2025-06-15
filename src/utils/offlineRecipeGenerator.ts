import { convertExternalRecipe } from './recipeConverter';
import { recipeDataService } from '../services/recipeDataService';

interface RecipeTemplate {
  name: string;
  description: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  mainIngredients: string[];
  ingredients: Array<{ name: string; amount: string }>;
  instructions: string[];
  tips: string[];
  suggestions: string[];
  relatedDishes: string[];
}

const ingredientCategories = {
  proteins: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'eggs', 'tofu', 'turkey', 'lamb'],
  vegetables: ['onion', 'garlic', 'tomato', 'carrot', 'potato', 'bell pepper', 'spinach', 'mushroom', 'broccoli', 'cauliflower', 'zucchini', 'eggplant'],
  carbs: ['rice', 'pasta', 'bread', 'quinoa', 'potato', 'noodles', 'flour', 'oats'],
  dairy: ['cheese', 'milk', 'butter', 'cream', 'yogurt', 'mozzarella', 'parmesan'],
  spices: ['salt', 'pepper', 'garlic powder', 'paprika', 'cumin', 'oregano', 'basil', 'thyme', 'rosemary'],
  oils: ['olive oil', 'vegetable oil', 'coconut oil', 'sesame oil', 'butter']
};

const cookingMethods = {
  quick: ['stir fry', 'sauté', 'pan fry', 'scramble', 'grill'],
  medium: ['bake', 'roast', 'simmer', 'steam', 'braise'],
  slow: ['slow cook', 'stew', 'casserole', 'soup', 'curry']
};

const cuisinePatterns = {
  italian: ['pasta', 'tomato', 'basil', 'mozzarella', 'parmesan', 'olive oil'],
  asian: ['rice', 'soy sauce', 'ginger', 'garlic', 'sesame oil', 'noodles'],
  mexican: ['beans', 'corn', 'peppers', 'avocado', 'lime', 'cilantro'],
  mediterranean: ['olive oil', 'tomato', 'onion', 'garlic', 'herbs', 'lemon'],
  indian: ['curry', 'turmeric', 'cumin', 'garam masala', 'onion', 'garlic']
};

async function getRecipeDatabase(): Promise<RecipeTemplate[]> {
  try {
    const chunkedData = await recipeDataService.loadChunkedDatabase();
    return chunkedData.map(convertExternalRecipe);
  } catch (error) {
    console.warn('Failed to load chunked database:', error);
    return [];
  }
}

function analyzeIngredients(ingredients: string[]) {
  const normalized = ingredients.map(ing => ing.toLowerCase());
  const analysis: any = {
    proteins: [],
    vegetables: [],
    carbs: [],
    dairy: [],
    spices: [],
    oils: [],
    cuisineType: 'fusion',
    cookingMethod: 'medium',
    difficulty: 'Easy'
  };

  Object.keys(ingredientCategories).forEach(category => {
    analysis[category] = normalized.filter(ing => 
      ingredientCategories[category].some(catIng => 
        ing.includes(catIng) || catIng.includes(ing)
      )
    );
  });

  let maxCuisineScore = 0;
  Object.keys(cuisinePatterns).forEach(cuisine => {
    const score = cuisinePatterns[cuisine].filter(pattern =>
      normalized.some(ing => ing.includes(pattern) || pattern.includes(ing))
    ).length;
    if (score > maxCuisineScore) {
      maxCuisineScore = score;
      analysis.cuisineType = cuisine;
    }
  });

  if (analysis.proteins.length > 0 && analysis.vegetables.length > 2) analysis.cookingMethod = 'quick';
  else if (analysis.carbs.includes('pasta') || analysis.carbs.includes('rice')) analysis.cookingMethod = 'medium';
  else if (ingredients.length > 6) analysis.cookingMethod = 'slow';

  if (ingredients.length <= 4) analysis.difficulty = 'Easy';
  else if (ingredients.length <= 7) analysis.difficulty = 'Medium';
  else analysis.difficulty = 'Hard';

  return analysis;
}

function findMatchingRecipes(ingredients: string[], database: RecipeTemplate[]): (RecipeTemplate & { matchScore: number; matchedCount: number })[] {
  const normalizedIngredients = ingredients.map(ing => ing.toLowerCase());
  return database.map(recipe => {
    let score = 0;
    let matchedIngredients = 0;

    recipe.mainIngredients.forEach(mainIng => {
      if (normalizedIngredients.some(ing => ing.includes(mainIng.toLowerCase()) || mainIng.toLowerCase().includes(ing))) {
        score += 3;
        matchedIngredients++;
      }
    });

    recipe.ingredients.forEach(recipeIng => {
      if (normalizedIngredients.some(ing => ing.includes(recipeIng.name.toLowerCase()) || recipeIng.name.toLowerCase().includes(ing))) {
        score += 1;
        matchedIngredients++;
      }
    });

    const matchPercentage = matchedIngredients / Math.max(recipe.ingredients.length, ingredients.length);
    if (matchPercentage > 0.5) score += 2;

    return { ...recipe, matchScore: score, matchedCount: matchedIngredients };
  })
  .filter(recipe => recipe.matchScore > 0)
  .sort((a, b) => b.matchScore - a.matchScore);
}

function generateSmartInstructions(analysis: any, ingredients: string[]): string[] {
  const { proteins, vegetables, carbs, cookingMethod, cuisineType } = analysis;
  
  let instructions = ["Prepare all ingredients by washing, chopping, and measuring as needed"];

  if (analysis.oils.length > 0) {
    instructions.push(`Heat ${analysis.oils[0]} in a large pan over medium heat`);
  } else {
    instructions.push("Heat 2 tbsp olive oil in a large pan over medium heat");
  }

  if (proteins.length > 0) {
    const protein = proteins[0];
    if (protein.includes('chicken') || protein.includes('beef')) instructions.push(`Season and cook ${protein} until golden brown and cooked through, about 6-8 minutes`);
    else if (protein.includes('fish')) instructions.push(`Gently cook ${protein} until flakes easily, about 4-5 minutes per side`);
    else instructions.push(`Cook ${protein} until properly done`);
  }

  const aromatics = vegetables.filter(v => ['onion', 'garlic'].some(a => v.includes(a)));
  if (aromatics.length > 0) instructions.push(`Add ${aromatics.join(' and ')} and sauté until fragrant, about 2 minutes`);

  const otherVeggies = vegetables.filter(v => !['onion', 'garlic'].some(a => v.includes(a)));
  if (otherVeggies.length > 0) instructions.push(`Add ${otherVeggies.join(', ')} and cook until tender, about 5-7 minutes`);

  if (carbs.includes('rice')) instructions.push("Add cooked rice and toss to combine with other ingredients");
  else if (carbs.includes('pasta')) instructions.push("Add cooked pasta and toss gently to combine");

  if (cuisineType === 'italian' && analysis.dairy.length > 0) instructions.push(`Stir in ${analysis.dairy.join(' and ')} and let melt`);
  else if (cuisineType === 'asian') instructions.push("Add soy sauce and sesame oil to taste");

  instructions.push("Season with salt and pepper to taste", "Cook for another 2-3 minutes to meld all the flavors together", "Taste and adjust seasoning before serving. A garnish of fresh herbs is always a great addition!", "Serve hot and enjoy!");

  return instructions;
}

function generateSmartTips(analysis: any, ingredients: string[]): string[] {
  const tips = [];
  if (analysis.proteins.length > 0) tips.push("Don't overcook proteins - they'll become tough and dry");
  if (analysis.vegetables.length > 3) tips.push("Cut vegetables into similar sizes for even cooking");
  if (analysis.cuisineType === 'asian') tips.push("Have all ingredients prepped before you start cooking - Asian dishes cook quickly");
  if (analysis.difficulty === 'Hard') tips.push("Take your time with prep work - it makes cooking much easier");
  tips.push("A splash of acid (like lemon juice or vinegar) at the end of cooking can brighten up the entire dish.");
  tips.push("Don't overcrowd the pan! Cook in batches if necessary to ensure ingredients sear rather than steam.");
  tips.push("Taste as you go and adjust seasonings to your preference", "Let the dish rest for a few minutes before serving to allow flavors to settle");
  return tips;
}

function generateSmartSuggestions(analysis: any, ingredients: string[]): string[] {
  const suggestions = [];
  if (analysis.proteins.length === 0) suggestions.push("Add a protein like chicken, beef, or tofu");
  if (analysis.vegetables.length < 2) suggestions.push("Add more vegetables for nutrition and flavor");
  if (!ingredients.some(ing => ['onion', 'garlic'].some(a => ing.toLowerCase().includes(a)))) suggestions.push("Onion and garlic for base flavors");
  if (analysis.cuisineType === 'italian' && !analysis.spices.some(s => s.includes('basil'))) suggestions.push("Fresh basil for authentic Italian flavor");
  if (analysis.cuisineType === 'asian' && !ingredients.some(ing => ing.toLowerCase().includes('ginger'))) suggestions.push("Fresh ginger for authentic Asian taste");
  suggestions.push("A handful of toasted nuts or seeds for a delightful crunch.");
  suggestions.push("A spoonful of something umami-rich like soy sauce, tomato paste, or miso.");
  suggestions.push("Fresh herbs like parsley or cilantro for garnish", "Lemon or lime juice for brightness");
  return suggestions.slice(0, 5);
}

function generateCreativeName(ingredients: string[], analysis: any): string {
  const { cuisineType, proteins, cookingMethod } = analysis;
  const cuisineAdjectives = { 
    italian: ["Tuscan", "Rustic", "Hearty", "Classic"], 
    asian: ["Sizzling", "Aromatic", "Umami-Rich", "Fusion"], 
    mexican: ["Fiesta", "Zesty", "Spicy", "Fresh"], 
    mediterranean: ["Sun-Kissed", "Coastal", "Herb-Crusted"], 
    fusion: ["Gourmet", "Creative", "Global", "Signature"] 
  };
  const cookingMethodNames = { 
    quick: ["Stir-Fry", "Skillet", "Sauté"], 
    medium: ["Bake", "Roast", "Casserole"], 
    slow: ["Slow-Cooked Stew", "Hearty Braise", "Rich Curry"] 
  };
  const adjective = cuisineAdjectives[cuisineType]?.[Math.floor(Math.random() * cuisineAdjectives[cuisineType].length)] || "Delicious";
  const method = cookingMethodNames[cookingMethod]?.[Math.floor(Math.random() * cookingMethodNames[cookingMethod].length)] || "Dish";
  const mainIngredient = proteins.length > 0 ? proteins[0] : ingredients[0];
  return `${adjective} ${mainIngredient} ${method}`.replace(/\b\w/g, l => l.toUpperCase());
}

export async function generateOfflineRecipe(ingredients: string[]): Promise<any> {
  const analysis = analyzeIngredients(ingredients);
  const database = await getRecipeDatabase();

  if (database.length > 0) {
    const matchingRecipes = findMatchingRecipes(ingredients, database);
    if (matchingRecipes.length > 0) {
      const baseRecipe = matchingRecipes[0];
      const customizedIngredients = baseRecipe.ingredients.filter(ing => ingredients.some(userIng => userIng.toLowerCase().includes(ing.name.toLowerCase().split(',')[0]) || ing.name.toLowerCase().includes(userIng.toLowerCase())));
      const additionalIngredients = ingredients.filter(userIng => !baseRecipe.ingredients.some(recipeIng => recipeIng.name.toLowerCase().includes(userIng.toLowerCase()) || userIng.toLowerCase().includes(recipeIng.name.toLowerCase().split(',')[0]))).map(ing => ({ name: ing, amount: "to taste" }));
      if (!customizedIngredients.some(ing => ing.name.toLowerCase().includes('salt'))) customizedIngredients.push({ name: "Salt", amount: "to taste" });
      if (!customizedIngredients.some(ing => ing.name.toLowerCase().includes('pepper'))) customizedIngredients.push({ name: "Black pepper", amount: "to taste" });

      return {
        ...baseRecipe,
        name: generateCreativeName(ingredients, analysis),
        description: `A delicious ${analysis.cuisineType} inspired dish featuring ${ingredients.slice(0, 3).join(', ')}.`,
        difficulty: analysis.difficulty,
        ingredients: [...customizedIngredients, ...additionalIngredients],
        instructions: generateSmartInstructions(analysis, ingredients),
        tips: generateSmartTips(analysis, ingredients),
        suggestions: generateSmartSuggestions(analysis, ingredients),
      };
    }
  }

  const baseIngredients = ingredients.map(ing => ({ name: ing, amount: "as needed" }));
  if (!analysis.oils.length) baseIngredients.push({ name: "Olive oil", amount: "2 tbsp" });
  baseIngredients.push({ name: "Salt", amount: "to taste" }, { name: "Black pepper", amount: "to taste" });
  if (analysis.cuisineType === 'italian') baseIngredients.push({ name: "Italian herbs", amount: "1 tsp" });
  else if (analysis.cuisineType === 'asian') baseIngredients.push({ name: "Soy sauce", amount: "2 tbsp" });

  let cookTime = "20 minutes";
  if (analysis.proteins.length > 0) cookTime = "25 minutes";
  if (analysis.cookingMethod === 'slow') cookTime = "45 minutes";
  if (analysis.cookingMethod === 'quick') cookTime = "15 minutes";

  return {
    name: generateCreativeName(ingredients, analysis),
    description: `A ${analysis.cuisineType} inspired ${analysis.cookingMethod} dish with ${ingredients.join(', ')}.`,
    cookTime,
    servings: ingredients.length > 6 ? "6 servings" : "4 servings",
    difficulty: analysis.difficulty,
    ingredients: baseIngredients,
    instructions: generateSmartInstructions(analysis, ingredients),
    tips: generateSmartTips(analysis, ingredients),
    suggestions: generateSmartSuggestions(analysis, ingredients),
    relatedDishes: Object.values(cuisinePatterns[analysis.cuisineType] || ['pasta', 'rice', 'stir fry']).slice(0, 4),
  };
}

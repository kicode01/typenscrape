// Comprehensive offline recipe database and generator
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

// Enhanced ingredient categories and cooking knowledge
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

// Get chunked database only
async function getRecipeDatabase(): Promise<RecipeTemplate[]> {
  try {
    const chunkedData = await recipeDataService.loadChunkedDatabase();
    return chunkedData.map(convertExternalRecipe);
  } catch (error) {
    console.warn('Failed to load chunked database:', error);
    return [];
  }
}

// Smart ingredient analysis
function analyzeIngredients(ingredients: string[]) {
  const normalized = ingredients.map(ing => ing.toLowerCase());
  
  const analysis = {
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

  // Categorize ingredients
  Object.keys(ingredientCategories).forEach(category => {
    analysis[category] = normalized.filter(ing => 
      ingredientCategories[category].some(catIng => 
        ing.includes(catIng) || catIng.includes(ing)
      )
    );
  });

  // Determine cuisine type
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

  // Determine cooking method based on ingredients
  if (analysis.proteins.length > 0 && analysis.vegetables.length > 2) {
    analysis.cookingMethod = 'quick'; // Stir fry style
  } else if (analysis.carbs.includes('pasta') || analysis.carbs.includes('rice')) {
    analysis.cookingMethod = 'medium';
  } else if (ingredients.length > 6) {
    analysis.cookingMethod = 'slow'; // Complex dishes
  }

  // Set difficulty based on ingredient count and types
  if (ingredients.length <= 4) {
    analysis.difficulty = 'Easy';
  } else if (ingredients.length <= 7) {
    analysis.difficulty = 'Medium';
  } else {
    analysis.difficulty = 'Hard';
  }

  return analysis;
}

// Smart recipe matching with weighted scoring
function findMatchingRecipes(ingredients: string[], database: RecipeTemplate[]): RecipeTemplate[] {
  const normalizedIngredients = ingredients.map(ing => ing.toLowerCase());
  
  return database.map(recipe => {
    let score = 0;
    let matchedIngredients = 0;

    // Score based on main ingredient matches (higher weight)
    recipe.mainIngredients.forEach(mainIng => {
      const matches = normalizedIngredients.some(ing => 
        ing.includes(mainIng.toLowerCase()) || mainIng.toLowerCase().includes(ing)
      );
      if (matches) {
        score += 3;
        matchedIngredients++;
      }
    });

    // Score based on regular ingredient matches
    recipe.ingredients.forEach(recipeIng => {
      const matches = normalizedIngredients.some(ing => 
        ing.includes(recipeIng.name.toLowerCase()) || recipeIng.name.toLowerCase().includes(ing)
      );
      if (matches) {
        score += 1;
        matchedIngredients++;
      }
    });

    // Bonus for high match percentage
    const matchPercentage = matchedIngredients / Math.max(recipe.ingredients.length, ingredients.length);
    if (matchPercentage > 0.5) score += 2;

    return { ...recipe, matchScore: score, matchedCount: matchedIngredients };
  })
  .filter(recipe => recipe.matchScore > 0)
  .sort((a, b) => b.matchScore - a.matchScore);
}

// Generate smart cooking instructions based on ingredients
function generateSmartInstructions(analysis: any, ingredients: string[]): string[] {
  const { proteins, vegetables, carbs, cookingMethod, cuisineType } = analysis;
  
  let instructions = ["Prepare all ingredients by washing, chopping, and measuring as needed"];

  // Add cooking oil/fat step
  if (analysis.oils.length > 0) {
    instructions.push(`Heat ${analysis.oils[0]} in a large pan over medium heat`);
  } else {
    instructions.push("Heat 2 tbsp olive oil in a large pan over medium heat");
  }

  // Cook proteins first if available
  if (proteins.length > 0) {
    const protein = proteins[0];
    if (protein.includes('chicken') || protein.includes('beef')) {
      instructions.push(`Season and cook ${protein} until golden brown and cooked through, about 6-8 minutes`);
    } else if (protein.includes('fish')) {
      instructions.push(`Gently cook ${protein} until flakes easily, about 4-5 minutes per side`);
    } else {
      instructions.push(`Cook ${protein} until properly done`);
    }
  }

  // Add aromatics (onion, garlic)
  const aromatics = vegetables.filter(v => ['onion', 'garlic'].some(a => v.includes(a)));
  if (aromatics.length > 0) {
    instructions.push(`Add ${aromatics.join(' and ')} and sauté until fragrant, about 2 minutes`);
  }

  // Add other vegetables
  const otherVeggies = vegetables.filter(v => !['onion', 'garlic'].some(a => v.includes(a)));
  if (otherVeggies.length > 0) {
    instructions.push(`Add ${otherVeggies.join(', ')} and cook until tender, about 5-7 minutes`);
  }

  // Handle carbs
  if (carbs.includes('rice')) {
    instructions.push("Add cooked rice and toss to combine with other ingredients");
  } else if (carbs.includes('pasta')) {
    instructions.push("Add cooked pasta and toss gently to combine");
  }

  // Cuisine-specific finishing touches
  if (cuisineType === 'italian' && analysis.dairy.length > 0) {
    instructions.push(`Stir in ${analysis.dairy.join(' and ')} and let melt`);
  } else if (cuisineType === 'asian') {
    instructions.push("Add soy sauce and sesame oil to taste");
  }

  instructions.push("Season with salt and pepper to taste");
  instructions.push("Cook for another 2-3 minutes to meld flavors");
  instructions.push("Taste and adjust seasoning before serving");
  instructions.push("Serve hot and enjoy!");

  return instructions;
}

// Generate smart cooking tips based on analysis
function generateSmartTips(analysis: any, ingredients: string[]): string[] {
  const tips = [];

  if (analysis.proteins.length > 0) {
    tips.push("Don't overcook proteins - they'll become tough and dry");
  }

  if (analysis.vegetables.length > 3) {
    tips.push("Cut vegetables into similar sizes for even cooking");
  }

  if (analysis.cuisineType === 'asian') {
    tips.push("Have all ingredients prepped before you start cooking - Asian dishes cook quickly");
  }

  if (analysis.difficulty === 'Hard') {
    tips.push("Take your time with prep work - it makes cooking much easier");
  }

  tips.push("Taste as you go and adjust seasonings to your preference");
  tips.push("Let the dish rest for a few minutes before serving to allow flavors to settle");

  return tips;
}

// Generate smart suggestions for missing ingredients
function generateSmartSuggestions(analysis: any, ingredients: string[]): string[] {
  const suggestions = [];

  if (analysis.proteins.length === 0) {
    suggestions.push("Add a protein like chicken, beef, or tofu");
  }

  if (analysis.vegetables.length < 2) {
    suggestions.push("Add more vegetables for nutrition and flavor");
  }

  if (!ingredients.some(ing => ['onion', 'garlic'].some(a => ing.toLowerCase().includes(a)))) {
    suggestions.push("Onion and garlic for base flavors");
  }

  if (analysis.cuisineType === 'italian' && !analysis.spices.some(s => s.includes('basil'))) {
    suggestions.push("Fresh basil for authentic Italian flavor");
  }

  if (analysis.cuisineType === 'asian' && !ingredients.some(ing => ing.toLowerCase().includes('ginger'))) {
    suggestions.push("Fresh ginger for authentic Asian taste");
  }

  suggestions.push("Fresh herbs like parsley or cilantro for garnish");
  suggestions.push("Lemon or lime juice for brightness");

  return suggestions.slice(0, 5); // Limit to 5 suggestions
}

// Generate creative recipe name based on analysis
function generateCreativeName(ingredients: string[], analysis: any): string {
  const { cuisineType, proteins, cookingMethod } = analysis;
  
  const cuisineAdjectives = {
    italian: ["Tuscan", "Mediterranean", "Classic", "Rustic"],
    asian: ["Savory", "Aromatic", "Traditional", "Fusion"],
    mexican: ["Spicy", "Zesty", "Authentic", "Fresh"],
    mediterranean: ["Herb-Crusted", "Sun-Dried", "Garden", "Coastal"],
    fusion: ["Gourmet", "Creative", "Chef's", "Signature"]
  };

  const cookingMethodNames = {
    quick: ["Stir Fry", "Sauté", "Pan-Seared"],
    medium: ["Baked", "Roasted", "Braised"],
    slow: ["Slow-Cooked", "Stewed", "Casserole"]
  };

  const adjective = cuisineAdjectives[cuisineType][Math.floor(Math.random() * cuisineAdjectives[cuisineType].length)];
  const method = cookingMethodNames[cookingMethod][Math.floor(Math.random() * cookingMethodNames[cookingMethod].length)];
  const mainIngredient = proteins.length > 0 ? proteins[0] : ingredients[0];

  return `${adjective} ${mainIngredient} ${method}`.replace(/\b\w/g, l => l.toUpperCase());
}

// Main recipe generation function
export async function generateRecipeFromIngredients(
  ingredients: string[], 
  preferences: string = '', 
  apiKey?: string
): Promise<any> {
  
  // If API key is provided, try to use Gemini API for enhanced generation
  if (apiKey && apiKey.trim()) {
    try {
      const systemPrompt = `You are a professional chef assistant. Create a detailed recipe using the given ingredients. Return a JSON object with this exact structure:
{
  "name": "Recipe Name",
  "description": "Brief description",
  "cookTime": "X minutes",
  "servings": "X servings",
  "difficulty": "Easy/Medium/Hard",
  "ingredients": [{"name": "ingredient name", "amount": "measurement"}],
  "instructions": ["step 1", "step 2"],
  "tips": ["tip 1", "tip 2"],
  "suggestions": ["ingredient 1", "ingredient 2"],
  "relatedDishes": ["dish 1", "dish 2"]
}`;

      const userPrompt = `Create a recipe using these ingredients: ${ingredients.join(', ')}. ${preferences ? `Preferences: ${preferences}` : ''}`;
      
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            const recipeText = data.candidates[0].content.parts[0].text;
            try {
              return JSON.parse(recipeText);
            } catch (parseError) {
              console.log('Failed to parse AI response, falling back to offline generation', parseError);
            }
        } else {
            console.log('Gemini API call was ok, but no candidates returned.', await response.text());
        }
      } else {
        const errorData = await response.json();
        console.log('API call failed, falling back to offline generation:', errorData);
      }
    } catch (error) {
      console.log('API call failed, falling back to offline generation:', error);
    }
  }

  // Smart offline generation
  const analysis = analyzeIngredients(ingredients);
  const database = await getRecipeDatabase();
  
  if (database.length > 0) {
    const matchingRecipes = findMatchingRecipes(ingredients, database);
    
    if (matchingRecipes.length > 0) {
      // Use the best matching recipe as a base and enhance it
      const baseRecipe = matchingRecipes[0];
      
      // Customize ingredients with user's ingredients
      const customizedIngredients = baseRecipe.ingredients.filter(ing => {
        return ingredients.some(userIng => 
          userIng.toLowerCase().includes(ing.name.toLowerCase().split(',')[0]) ||
          ing.name.toLowerCase().includes(userIng.toLowerCase())
        );
      });

      // Add user's unique ingredients
      const additionalIngredients = ingredients.filter(userIng => 
        !baseRecipe.ingredients.some(recipeIng => 
          recipeIng.name.toLowerCase().includes(userIng.toLowerCase()) ||
          userIng.toLowerCase().includes(recipeIng.name.toLowerCase().split(',')[0])
        )
      ).map(ing => ({ name: ing, amount: "to taste" }));

      // Add smart seasonings if missing
      if (!customizedIngredients.some(ing => ing.name.toLowerCase().includes('salt'))) {
        customizedIngredients.push({ name: "Salt", amount: "to taste" });
      }
      if (!customizedIngredients.some(ing => ing.name.toLowerCase().includes('pepper'))) {
        customizedIngredients.push({ name: "Black pepper", amount: "to taste" });
      }

      return {
        ...baseRecipe,
        name: generateCreativeName(ingredients, analysis),
        description: `A delicious ${analysis.cuisineType} inspired dish featuring ${ingredients.slice(0, 3).join(', ')} with perfectly balanced flavors.`,
        difficulty: analysis.difficulty,
        ingredients: [...customizedIngredients, ...additionalIngredients],
        instructions: generateSmartInstructions(analysis, ingredients),
        tips: generateSmartTips(analysis, ingredients),
        suggestions: generateSmartSuggestions(analysis, ingredients)
      };
    }
  }

  // Fallback: Create a smart recipe from scratch
  const baseIngredients = ingredients.map(ing => ({ name: ing, amount: "as needed" }));
  
  // Add smart base ingredients based on analysis
  if (!analysis.oils.length) {
    baseIngredients.push({ name: "Olive oil", amount: "2 tbsp" });
  }
  baseIngredients.push({ name: "Salt", amount: "to taste" });
  baseIngredients.push({ name: "Black pepper", amount: "to taste" });

  // Add cuisine-specific seasonings
  if (analysis.cuisineType === 'italian') {
    baseIngredients.push({ name: "Italian herbs", amount: "1 tsp" });
  } else if (analysis.cuisineType === 'asian') {
    baseIngredients.push({ name: "Soy sauce", amount: "2 tbsp" });
  }

  // Calculate smart cooking time based on ingredients
  let cookTime = "20 minutes";
  if (analysis.proteins.length > 0) cookTime = "25 minutes";
  if (analysis.cookingMethod === 'slow') cookTime = "45 minutes";
  if (analysis.cookingMethod === 'quick') cookTime = "15 minutes";

  return {
    name: generateCreativeName(ingredients, analysis),
    description: `A ${analysis.cuisineType} inspired ${analysis.cookingMethod} dish that brings together ${ingredients.join(', ')} in perfect harmony.`,
    cookTime,
    servings: ingredients.length > 6 ? "6 servings" : "4 servings",
    difficulty: analysis.difficulty,
    ingredients: baseIngredients,
    instructions: generateSmartInstructions(analysis, ingredients),
    tips: generateSmartTips(analysis, ingredients),
    suggestions: generateSmartSuggestions(analysis, ingredients),
    relatedDishes: Object.values(cuisinePatterns[analysis.cuisineType] || ['pasta', 'rice', 'stir fry', 'salad']).slice(0, 4)
  };
}

export { recipeDataService };


// Converter for external recipe formats
interface ExternalRecipe {
  _id: { $oid: string };
  name: string;
  ingredients: string;
  url?: string;
  image?: string;
  ts?: { $date: number };
  cookTime?: string;
  source?: string;
  recipeYield?: string;
  datePublished?: string;
  prepTime?: string;
  description?: string;
}

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

// Convert PT30M format to readable time
function convertDuration(ptTime: string): string {
  if (!ptTime) return "30 minutes";
  const match = ptTime.match(/PT(\d+)M/);
  if (match) {
    return `${match[1]} minutes`;
  }
  return ptTime;
}

// Parse ingredient string into structured format
function parseIngredients(ingredientsText: string): Array<{ name: string; amount: string }> {
  const lines = ingredientsText.split('\n').filter(line => line.trim());
  const ingredients: Array<{ name: string; amount: string }> = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.toUpperCase() === trimmed) {
      // Skip section headers like "BISCUITS" or "SAUSAGE GRAVY"
      continue;
    }
    
    // Try to separate amount from ingredient name
    const match = trimmed.match(/^([\d\/\-\s]+(?:cups?|tablespoons?|teaspoons?|tbsp|tsp|pounds?|lbs?|ounces?|oz|sticks?|whole|cloves?)?)\s+(.+)$/i);
    
    if (match) {
      ingredients.push({
        amount: match[1].trim(),
        name: match[2].trim()
      });
    } else {
      // If no clear amount found, treat whole thing as ingredient
      ingredients.push({
        amount: "as needed",
        name: trimmed
      });
    }
  }
  
  return ingredients;
}

// Extract main ingredients for matching
function extractMainIngredients(ingredients: Array<{ name: string; amount: string }>): string[] {
  const mainIngredients: string[] = [];
  
  for (const ingredient of ingredients) {
    const name = ingredient.name.toLowerCase();
    
    // Common main ingredients to extract
    if (name.includes('chicken')) mainIngredients.push('chicken');
    else if (name.includes('beef')) mainIngredients.push('beef');
    else if (name.includes('pork') || name.includes('sausage')) mainIngredients.push('pork');
    else if (name.includes('fish') || name.includes('salmon') || name.includes('tuna')) mainIngredients.push('fish');
    else if (name.includes('pasta') || name.includes('noodle')) mainIngredients.push('pasta');
    else if (name.includes('rice')) mainIngredients.push('rice');
    else if (name.includes('potato')) mainIngredients.push('potato');
    else if (name.includes('cheese')) mainIngredients.push('cheese');
    else if (name.includes('flour') || name.includes('bread')) mainIngredients.push('bread');
    else if (name.includes('egg')) mainIngredients.push('eggs');
  }
  
  return [...new Set(mainIngredients)]; // Remove duplicates
}

// Generate basic instructions from ingredients
function generateInstructions(name: string, ingredients: Array<{ name: string; amount: string }>): string[] {
  const instructions = [
    "Gather and prepare all ingredients according to the measurements listed",
    "Preheat oven or prepare cooking equipment as needed"
  ];
  
  // Add cooking steps based on recipe type
  if (name.toLowerCase().includes('bake') || name.toLowerCase().includes('biscuit')) {
    instructions.push(
      "Mix dry ingredients in a large bowl",
      "Add wet ingredients and combine until just mixed",
      "Bake according to recipe specifications until golden brown"
    );
  } else if (name.toLowerCase().includes('sandwich')) {
    instructions.push(
      "Prepare the filling ingredients",
      "Assemble sandwiches with desired toppings",
      "Heat or serve as directed"
    );
  } else {
    instructions.push(
      "Follow traditional preparation methods for this dish",
      "Cook ingredients according to standard techniques",
      "Combine all components and serve hot"
    );
  }
  
  instructions.push("Taste and adjust seasonings as needed", "Serve immediately while hot");
  
  return instructions;
}

export function convertExternalRecipe(external: ExternalRecipe): RecipeTemplate {
  const ingredients = parseIngredients(external.ingredients);
  const mainIngredients = extractMainIngredients(ingredients);
  
  return {
    name: external.name,
    description: external.description || `A delicious recipe for ${external.name}`,
    cookTime: external.cookTime ? convertDuration(external.cookTime) : "30 minutes",
    servings: external.recipeYield ? `${external.recipeYield} servings` : "4 servings",
    difficulty: "Medium", // Default difficulty
    mainIngredients,
    ingredients,
    instructions: generateInstructions(external.name, ingredients),
    tips: [
      "Read through the entire recipe before starting",
      "Prepare all ingredients before beginning to cook",
      "Adjust cooking times based on your equipment"
    ],
    suggestions: ["salt", "pepper", "herbs", "spices"],
    relatedDishes: [] // Can be populated based on main ingredients
  };
}

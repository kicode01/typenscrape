
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

// Base recipe database (small fallback database)
const recipeDatabase: RecipeTemplate[] = [
  {
    name: "Classic Chicken Stir Fry",
    description: "A quick and healthy chicken stir fry with vegetables",
    cookTime: "15 minutes",
    servings: "4 servings",
    difficulty: "Easy",
    mainIngredients: ["chicken", "vegetables"],
    ingredients: [
      { name: "Chicken breast", amount: "1 lb" },
      { name: "Mixed vegetables", amount: "2 cups" },
      { name: "Soy sauce", amount: "3 tbsp" },
      { name: "Garlic", amount: "2 cloves" },
      { name: "Ginger", amount: "1 tsp" },
      { name: "Oil", amount: "2 tbsp" }
    ],
    instructions: [
      "Cut chicken into bite-sized pieces",
      "Heat oil in a large pan or wok",
      "Cook chicken until golden, about 5-7 minutes",
      "Add vegetables and stir-fry for 3-4 minutes",
      "Add soy sauce, garlic, and ginger",
      "Cook for another 2 minutes until vegetables are tender-crisp",
      "Serve immediately over rice"
    ],
    tips: [
      "Cut chicken against the grain for tenderness",
      "Don't overcrowd the pan",
      "Have all ingredients prepped before cooking"
    ],
    suggestions: ["rice", "noodles", "sesame oil", "green onions"],
    relatedDishes: ["Beef Stir Fry", "Vegetable Stir Fry", "Fried Rice"]
  },
  {
    name: "Simple Pasta Marinara",
    description: "Classic pasta with homemade marinara sauce",
    cookTime: "20 minutes",
    servings: "4 servings",
    difficulty: "Easy",
    mainIngredients: ["pasta", "tomato"],
    ingredients: [
      { name: "Pasta", amount: "1 lb" },
      { name: "Crushed tomatoes", amount: "28 oz can" },
      { name: "Garlic", amount: "4 cloves" },
      { name: "Onion", amount: "1 medium" },
      { name: "Olive oil", amount: "3 tbsp" },
      { name: "Basil", amount: "2 tbsp fresh" },
      { name: "Salt", amount: "to taste" },
      { name: "Black pepper", amount: "to taste" }
    ],
    instructions: [
      "Bring a large pot of salted water to boil",
      "Cook pasta according to package directions",
      "Meanwhile, heat olive oil in a large pan",
      "Sauté diced onion until translucent, about 5 minutes",
      "Add minced garlic and cook for 1 minute",
      "Add crushed tomatoes, salt, and pepper",
      "Simmer for 10-15 minutes",
      "Stir in fresh basil",
      "Drain pasta and toss with sauce"
    ],
    tips: [
      "Save some pasta water to thin sauce if needed",
      "Don't rinse pasta after draining",
      "Add basil at the end to preserve flavor"
    ],
    suggestions: ["parmesan cheese", "red pepper flakes", "oregano"],
    relatedDishes: ["Spaghetti Bolognese", "Penne Arrabbiata", "Pasta Primavera"]
  }
];

// Get combined database (fallback + chunked data)
async function getCombinedRecipeDatabase(): Promise<RecipeTemplate[]> {
  try {
    const chunkedData = await recipeDataService.loadChunkedDatabase();
    const convertedChunkedRecipes = chunkedData.map(convertExternalRecipe);
    return [...recipeDatabase, ...convertedChunkedRecipes];
  } catch (error) {
    console.warn('Failed to load chunked database, using fallback:', error);
    return recipeDatabase;
  }
}

// Additional recipe variations for common ingredients
const recipeVariations = {
  chicken: [
    "Honey Garlic Chicken", "Chicken Parmesan", "Buffalo Chicken", "Lemon Herb Chicken",
    "Chicken Tikka Masala", "BBQ Chicken", "Chicken Fajitas", "Chicken Piccata"
  ],
  beef: [
    "Beef Tacos", "Mongolian Beef", "Beef Stroganoff", "Meatballs", "Beef Chili",
    "Korean Beef Bowl", "Beef and Broccoli", "Shepherd's Pie"
  ],
  fish: [
    "Fish Tacos", "Baked Salmon", "Fish and Chips", "Lemon Garlic Tilapia",
    "Tuna Steaks", "Fish Curry", "Grilled Fish", "Fish Cakes"
  ],
  pasta: [
    "Spaghetti Carbonara", "Penne Arrabbiata", "Lasagna", "Mac and Cheese",
    "Pesto Pasta", "Bolognese", "Cacio e Pepe", "Pasta Primavera"
  ],
  rice: [
    "Fried Rice", "Risotto", "Rice Pilaf", "Spanish Rice", "Coconut Rice",
    "Rice Bowls", "Stuffed Peppers", "Rice Pudding"
  ]
};

// Function to find matching recipes
function findMatchingRecipes(ingredients: string[], database: RecipeTemplate[]): RecipeTemplate[] {
  const normalizedIngredients = ingredients.map(ing => ing.toLowerCase());
  
  return database.filter(recipe => {
    const matchCount = recipe.mainIngredients.filter(mainIng =>
      normalizedIngredients.some(ing => 
        ing.includes(mainIng.toLowerCase()) || mainIng.toLowerCase().includes(ing)
      )
    ).length;
    
    return matchCount >= 1; // At least one main ingredient match
  }).sort((a, b) => {
    // Sort by number of matching ingredients
    const aMatches = a.mainIngredients.filter(mainIng =>
      normalizedIngredients.some(ing => 
        ing.includes(mainIng.toLowerCase()) || mainIng.toLowerCase().includes(ing)
      )
    ).length;
    
    const bMatches = b.mainIngredients.filter(mainIng =>
      normalizedIngredients.some(ing => 
        ing.includes(mainIng.toLowerCase()) || mainIng.toLowerCase().includes(ing)
      )
    ).length;
    
    return bMatches - aMatches;
  });
}

// Function to generate creative recipe name
function generateCreativeName(ingredients: string[]): string {
  const descriptors = ["Delicious", "Savory", "Amazing", "Perfect", "Ultimate", "Classic", "Gourmet", "Fresh"];
  const methods = ["Stir Fry", "Bowl", "Delight", "Fusion", "Medley", "Creation", "Surprise", "Special"];
  
  const mainIngredient = ingredients[0];
  const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
  const method = methods[Math.floor(Math.random() * methods.length)];
  
  return `${descriptor} ${mainIngredient} ${method}`;
}

// Main recipe generation function
export async function generateRecipeFromIngredients(
  ingredients: string[], 
  preferences: string = '', 
  apiKey?: string
): Promise<any> {
  
  // If API key is provided, try to use OpenAI API for enhanced generation
  if (apiKey && apiKey.trim()) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a professional chef assistant. Create a detailed recipe using the given ingredients. Return a JSON object with this exact structure:
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
}`
            },
            {
              role: 'user',
              content: `Create a recipe using these ingredients: ${ingredients.join(', ')}. ${preferences ? `Preferences: ${preferences}` : ''}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const recipeText = data.choices[0].message.content;
        try {
          return JSON.parse(recipeText);
        } catch (parseError) {
          console.log('Failed to parse AI response, falling back to offline generation');
        }
      }
    } catch (error) {
      console.log('API call failed, falling back to offline generation:', error);
    }
  }

  // Offline generation using combined database
  const combinedDatabase = await getCombinedRecipeDatabase();
  const matchingRecipes = findMatchingRecipes(ingredients, combinedDatabase);
  
  if (matchingRecipes.length > 0) {
    // Use the best matching recipe as a base
    const baseRecipe = matchingRecipes[0];
    
    // Customize the recipe with user's ingredients
    const customizedIngredients = baseRecipe.ingredients.map(ing => {
      // Check if user has this ingredient and adjust accordingly
      const userHasIngredient = ingredients.some(userIng => 
        userIng.toLowerCase().includes(ing.name.toLowerCase().split(',')[0]) ||
        ing.name.toLowerCase().includes(userIng.toLowerCase())
      );
      
      if (userHasIngredient) {
        return ing;
      } else {
        // Suggest optional or substitute ingredients
        return { ...ing, name: `${ing.name} (optional)` };
      }
    });

    // Add user's ingredients that aren't in the base recipe
    const additionalIngredients = ingredients.filter(userIng => 
      !baseRecipe.ingredients.some(recipeIng => 
        recipeIng.name.toLowerCase().includes(userIng.toLowerCase()) ||
        userIng.toLowerCase().includes(recipeIng.name.toLowerCase().split(',')[0])
      )
    ).map(ing => ({ name: ing, amount: "to taste" }));

    return {
      ...baseRecipe,
      ingredients: [...customizedIngredients, ...additionalIngredients],
      name: generateCreativeName(ingredients),
      description: `A delicious recipe featuring ${ingredients.slice(0, 3).join(', ')} and more wonderful ingredients.`
    };
  }

  // Fallback: Create a basic recipe from scratch
  return {
    name: generateCreativeName(ingredients),
    description: `A creative dish featuring ${ingredients.join(', ')} with simple, delicious preparation.`,
    cookTime: "25 minutes",
    servings: "4 servings",
    difficulty: "Easy",
    ingredients: ingredients.map(ing => ({ name: ing, amount: "as needed" })).concat([
      { name: "Salt", amount: "to taste" },
      { name: "Black pepper", amount: "to taste" },
      { name: "Olive oil", amount: "2 tbsp" }
    ]),
    instructions: [
      "Prepare all ingredients by washing, chopping, and measuring as needed",
      "Heat olive oil in a large pan over medium heat",
      `Add ${ingredients[0]} and cook until lightly browned`,
      `Add remaining ingredients: ${ingredients.slice(1).join(', ')}`,
      "Season with salt and pepper to taste",
      "Cook until all ingredients are tender and flavors are well combined",
      "Adjust seasoning and serve hot"
    ],
    tips: [
      "Taste and adjust seasonings throughout cooking",
      "Don't overcook - fresh ingredients taste best when not overdone",
      "Feel free to add herbs and spices to enhance flavor"
    ],
    suggestions: ["garlic", "onion", "herbs", "lemon juice"],
    relatedDishes: Object.values(recipeVariations).flat().slice(0, 4)
  };
}

export { recipeVariations, recipeDataService };

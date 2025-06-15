
// Comprehensive offline recipe database and generator
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

// Extensive offline recipe database
const recipeDatabase: RecipeTemplate[] = [
  {
    name: "Classic Chicken Stir Fry",
    description: "A quick and flavorful stir fry with tender chicken and fresh vegetables",
    cookTime: "20 minutes",
    servings: "4 servings",
    difficulty: "Easy",
    mainIngredients: ["chicken", "rice", "vegetables"],
    ingredients: [
      { name: "Chicken breast, sliced", amount: "1 lb" },
      { name: "Cooked rice", amount: "4 cups" },
      { name: "Mixed vegetables", amount: "2 cups" },
      { name: "Soy sauce", amount: "3 tbsp" },
      { name: "Garlic, minced", amount: "3 cloves" },
      { name: "Ginger, minced", amount: "1 tsp" },
      { name: "Vegetable oil", amount: "2 tbsp" }
    ],
    instructions: [
      "Heat oil in a large wok or skillet over high heat",
      "Add chicken and cook until golden brown, about 5-7 minutes",
      "Add garlic and ginger, stir for 30 seconds until fragrant",
      "Add vegetables and stir-fry for 3-4 minutes until crisp-tender",
      "Add soy sauce and toss everything together",
      "Serve hot over cooked rice"
    ],
    tips: [
      "Cut chicken into uniform pieces for even cooking",
      "Have all ingredients prepped before starting as cooking goes quickly",
      "Don't overcrowd the pan - cook in batches if needed"
    ],
    suggestions: ["sesame oil", "green onions", "cashews", "bell peppers"],
    relatedDishes: ["Beef Stir Fry", "Vegetable Fried Rice", "Chicken Teriyaki"]
  },
  {
    name: "Creamy Mushroom Pasta",
    description: "Rich and creamy pasta dish with sautéed mushrooms and herbs",
    cookTime: "25 minutes",
    servings: "4 servings",
    difficulty: "Medium",
    mainIngredients: ["pasta", "mushroom", "cheese"],
    ingredients: [
      { name: "Pasta (penne or fettuccine)", amount: "12 oz" },
      { name: "Mixed mushrooms, sliced", amount: "1 lb" },
      { name: "Heavy cream", amount: "1 cup" },
      { name: "Parmesan cheese, grated", amount: "1/2 cup" },
      { name: "Garlic, minced", amount: "4 cloves" },
      { name: "Butter", amount: "3 tbsp" },
      { name: "Fresh thyme", amount: "2 tsp" }
    ],
    instructions: [
      "Cook pasta according to package directions, reserve 1 cup pasta water",
      "In a large skillet, melt butter over medium-high heat",
      "Add mushrooms and cook until golden brown, about 8 minutes",
      "Add garlic and thyme, cook for 1 minute",
      "Pour in cream and simmer for 3-4 minutes",
      "Add cooked pasta and toss with sauce",
      "Add Parmesan cheese and pasta water as needed",
      "Season with salt and pepper to taste"
    ],
    tips: [
      "Don't wash mushrooms - just wipe clean with paper towel",
      "Let mushrooms brown without stirring for best flavor",
      "Save pasta water before draining - it helps bind the sauce"
    ],
    suggestions: ["white wine", "fresh herbs", "truffle oil", "pancetta"],
    relatedDishes: ["Chicken Alfredo", "Mushroom Risotto", "Carbonara"]
  },
  {
    name: "Mediterranean Quinoa Bowl",
    description: "Healthy and colorful bowl with quinoa, vegetables, and Mediterranean flavors",
    cookTime: "30 minutes",
    servings: "4 servings",
    difficulty: "Easy",
    mainIngredients: ["quinoa", "tomato", "cucumber"],
    ingredients: [
      { name: "Quinoa", amount: "1 cup" },
      { name: "Cherry tomatoes, halved", amount: "2 cups" },
      { name: "Cucumber, diced", amount: "1 large" },
      { name: "Red onion, thinly sliced", amount: "1/2 medium" },
      { name: "Feta cheese, crumbled", amount: "1/2 cup" },
      { name: "Olive oil", amount: "1/4 cup" },
      { name: "Lemon juice", amount: "2 tbsp" },
      { name: "Fresh herbs (parsley, mint)", amount: "1/4 cup" }
    ],
    instructions: [
      "Rinse quinoa and cook according to package directions",
      "Let quinoa cool to room temperature",
      "Combine tomatoes, cucumber, and red onion in a large bowl",
      "Whisk together olive oil, lemon juice, salt, and pepper",
      "Add cooled quinoa to vegetables",
      "Pour dressing over salad and toss gently",
      "Top with feta cheese and fresh herbs",
      "Let sit for 15 minutes before serving"
    ],
    tips: [
      "Rinse quinoa well to remove bitter coating",
      "This salad tastes better after sitting for a while",
      "Can be made ahead and refrigerated for up to 3 days"
    ],
    suggestions: ["olives", "pine nuts", "chickpeas", "avocado"],
    relatedDishes: ["Greek Salad", "Tabbouleh", "Quinoa Stuffed Peppers"]
  },
  {
    name: "Beef and Potato Stew",
    description: "Hearty and comforting stew with tender beef and vegetables",
    cookTime: "2 hours",
    servings: "6 servings",
    difficulty: "Medium",
    mainIngredients: ["beef", "potato", "carrot"],
    ingredients: [
      { name: "Beef chuck, cubed", amount: "2 lbs" },
      { name: "Potatoes, cubed", amount: "4 large" },
      { name: "Carrots, sliced", amount: "3 large" },
      { name: "Onion, diced", amount: "1 large" },
      { name: "Beef broth", amount: "4 cups" },
      { name: "Tomato paste", amount: "2 tbsp" },
      { name: "Fresh thyme", amount: "2 tsp" },
      { name: "Bay leaves", amount: "2" }
    ],
    instructions: [
      "Season beef with salt and pepper, brown in a large pot",
      "Remove beef and sauté onions until soft",
      "Add tomato paste and cook for 1 minute",
      "Return beef to pot, add broth, thyme, and bay leaves",
      "Bring to a boil, then reduce heat and simmer covered for 1 hour",
      "Add potatoes and carrots, continue cooking for 45 minutes",
      "Remove bay leaves and adjust seasoning",
      "Serve hot with crusty bread"
    ],
    tips: [
      "Brown the beef in batches for better color and flavor",
      "Don't skip the browning step - it adds depth to the stew",
      "Stew tastes even better the next day"
    ],
    suggestions: ["red wine", "celery", "mushrooms", "peas"],
    relatedDishes: ["Beef Bourguignon", "Pot Roast", "Shepherd's Pie"]
  },
  {
    name: "Vegetable Curry",
    description: "Aromatic and spicy curry loaded with fresh vegetables",
    cookTime: "35 minutes",
    servings: "4 servings",
    difficulty: "Medium",
    mainIngredients: ["vegetables", "curry", "coconut"],
    ingredients: [
      { name: "Mixed vegetables (cauliflower, bell peppers, etc.)", amount: "4 cups" },
      { name: "Coconut milk", amount: "1 can (14 oz)" },
      { name: "Curry powder", amount: "2 tbsp" },
      { name: "Onion, diced", amount: "1 large" },
      { name: "Garlic, minced", amount: "4 cloves" },
      { name: "Ginger, minced", amount: "1 tbsp" },
      { name: "Tomatoes, diced", amount: "2 medium" },
      { name: "Vegetable oil", amount: "2 tbsp" }
    ],
    instructions: [
      "Heat oil in a large pot over medium heat",
      "Add onion and cook until soft, about 5 minutes",
      "Add garlic, ginger, and curry powder, cook for 1 minute",
      "Add tomatoes and cook until they break down",
      "Add vegetables and stir to coat with spices",
      "Pour in coconut milk and bring to a simmer",
      "Cover and cook for 20 minutes until vegetables are tender",
      "Season with salt and serve over rice"
    ],
    tips: [
      "Toast curry powder briefly for deeper flavor",
      "Add harder vegetables first, softer ones later",
      "Adjust spice level with cayenne pepper or chili flakes"
    ],
    suggestions: ["chickpeas", "spinach", "lime juice", "cilantro"],
    relatedDishes: ["Thai Green Curry", "Chickpea Curry", "Dal"]
  }
];

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
function findMatchingRecipes(ingredients: string[]): RecipeTemplate[] {
  const normalizedIngredients = ingredients.map(ing => ing.toLowerCase());
  
  return recipeDatabase.filter(recipe => {
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

  // Offline generation using local database
  const matchingRecipes = findMatchingRecipes(ingredients);
  
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

export { recipeDatabase, recipeVariations };

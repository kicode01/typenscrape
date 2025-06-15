
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

// Extensive offline recipe database - expanded with recipes from AllRecipes, Epicurious, Food Network, Serious Eats, cookbooks and food blogs
const recipeDatabase: RecipeTemplate[] = [
  // Original recipes
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

  // AllRecipes-inspired recipes
  {
    name: "Grandmother's Banana Bread",
    description: "Moist and tender banana bread with a perfect crumb, just like grandma made",
    cookTime: "65 minutes",
    servings: "8 servings",
    difficulty: "Easy",
    mainIngredients: ["banana", "flour", "butter"],
    ingredients: [
      { name: "Ripe bananas, mashed", amount: "3 large" },
      { name: "All-purpose flour", amount: "1 3/4 cups" },
      { name: "Butter, melted", amount: "1/3 cup" },
      { name: "Sugar", amount: "3/4 cup" },
      { name: "Egg, beaten", amount: "1 large" },
      { name: "Vanilla extract", amount: "1 tsp" },
      { name: "Baking soda", amount: "1 tsp" },
      { name: "Salt", amount: "1/2 tsp" }
    ],
    instructions: [
      "Preheat oven to 350°F and grease a 9x5 inch loaf pan",
      "In a large bowl, mix melted butter and mashed bananas",
      "Stir in sugar, beaten egg, and vanilla",
      "Mix in flour, baking soda, and salt until just combined",
      "Pour into prepared loaf pan",
      "Bake for 60-65 minutes until toothpick comes out clean",
      "Cool in pan for 10 minutes before removing"
    ],
    tips: [
      "Use very ripe bananas for the best flavor",
      "Don't overmix the batter to keep it tender",
      "Wrap cooled bread in plastic wrap to keep moist"
    ],
    suggestions: ["walnuts", "chocolate chips", "cinnamon", "nutmeg"],
    relatedDishes: ["Banana Muffins", "Zucchini Bread", "Pumpkin Bread"]
  },

  {
    name: "Ultimate Chocolate Chip Cookies",
    description: "Crispy edges, chewy centers, and loaded with chocolate chips",
    cookTime: "25 minutes",
    servings: "24 cookies",
    difficulty: "Easy",
    mainIngredients: ["flour", "butter", "chocolate"],
    ingredients: [
      { name: "All-purpose flour", amount: "2 1/4 cups" },
      { name: "Butter, softened", amount: "1 cup" },
      { name: "Brown sugar", amount: "3/4 cup" },
      { name: "Granulated sugar", amount: "3/4 cup" },
      { name: "Eggs", amount: "2 large" },
      { name: "Vanilla extract", amount: "2 tsp" },
      { name: "Chocolate chips", amount: "2 cups" },
      { name: "Baking soda", amount: "1 tsp" },
      { name: "Salt", amount: "1 tsp" }
    ],
    instructions: [
      "Preheat oven to 375°F",
      "Cream butter with both sugars until fluffy",
      "Beat in eggs and vanilla",
      "Mix in flour, baking soda, and salt",
      "Fold in chocolate chips",
      "Drop rounded tablespoons onto ungreased cookie sheets",
      "Bake 9-11 minutes until golden brown",
      "Cool on baking sheet for 2 minutes before removing"
    ],
    tips: [
      "Room temperature ingredients mix better",
      "Don't overbake - cookies continue cooking on hot pan",
      "Chill dough for thicker cookies"
    ],
    suggestions: ["sea salt", "nuts", "oats", "coconut"],
    relatedDishes: ["Oatmeal Cookies", "Sugar Cookies", "Brownies"]
  },

  // Epicurious-inspired gourmet recipes
  {
    name: "Coq au Vin",
    description: "Classic French braised chicken in red wine with vegetables",
    cookTime: "90 minutes",
    servings: "6 servings",
    difficulty: "Medium",
    mainIngredients: ["chicken", "wine", "mushroom"],
    ingredients: [
      { name: "Chicken pieces", amount: "3 lbs" },
      { name: "Red wine", amount: "2 cups" },
      { name: "Mushrooms, quartered", amount: "8 oz" },
      { name: "Pearl onions", amount: "12 small" },
      { name: "Bacon, diced", amount: "4 strips" },
      { name: "Chicken broth", amount: "1 cup" },
      { name: "Fresh thyme", amount: "2 sprigs" },
      { name: "Bay leaves", amount: "2" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Flour", amount: "2 tbsp" }
    ],
    instructions: [
      "Cook bacon until crispy, remove and set aside",
      "Brown chicken pieces in bacon fat, remove",
      "Sauté onions and mushrooms until golden",
      "Add wine, scraping up browned bits",
      "Return chicken and bacon to pot",
      "Add broth, thyme, and bay leaves",
      "Cover and simmer 45 minutes until chicken is tender",
      "Make roux with butter and flour, stir in to thicken",
      "Remove bay leaves and thyme stems before serving"
    ],
    tips: [
      "Use a good quality wine you'd drink",
      "Don't skip browning the chicken for flavor",
      "Serve with crusty bread or mashed potatoes"
    ],
    suggestions: ["cognac", "carrots", "celery", "parsley"],
    relatedDishes: ["Beef Bourguignon", "Chicken Cacciatore", "Braised Short Ribs"]
  },

  {
    name: "Risotto alla Milanese",
    description: "Creamy saffron risotto from Milan, rich and luxurious",
    cookTime: "35 minutes",
    servings: "4 servings",
    difficulty: "Medium",
    mainIngredients: ["rice", "saffron", "cheese"],
    ingredients: [
      { name: "Arborio rice", amount: "1 1/2 cups" },
      { name: "Saffron threads", amount: "1/4 tsp" },
      { name: "Warm chicken stock", amount: "5 cups" },
      { name: "White wine", amount: "1/2 cup" },
      { name: "Onion, finely diced", amount: "1 medium" },
      { name: "Parmesan cheese, grated", amount: "1 cup" },
      { name: "Butter", amount: "4 tbsp" },
      { name: "Olive oil", amount: "2 tbsp" }
    ],
    instructions: [
      "Steep saffron in warm stock",
      "Heat oil and 2 tbsp butter, sauté onion until soft",
      "Add rice, stir 2 minutes until edges are translucent",
      "Add wine, stir until absorbed",
      "Add stock one ladle at a time, stirring constantly",
      "Continue for 18-20 minutes until rice is creamy",
      "Stir in remaining butter and Parmesan",
      "Season with salt and pepper, serve immediately"
    ],
    tips: [
      "Stir constantly for the creamiest texture",
      "Keep stock warm throughout cooking",
      "Rice should be al dente when done"
    ],
    suggestions: ["bone marrow", "white truffle", "prosecco", "pancetta"],
    relatedDishes: ["Mushroom Risotto", "Seafood Risotto", "Risotto Primavera"]
  },

  // Food Network-inspired comfort foods
  {
    name: "Triple-Layer Chocolate Cake",
    description: "Decadent chocolate cake with rich chocolate frosting",
    cookTime: "90 minutes",
    servings: "12 servings",
    difficulty: "Hard",
    mainIngredients: ["chocolate", "flour", "butter"],
    ingredients: [
      { name: "All-purpose flour", amount: "2 cups" },
      { name: "Cocoa powder", amount: "3/4 cup" },
      { name: "Sugar", amount: "2 cups" },
      { name: "Eggs", amount: "3 large" },
      { name: "Buttermilk", amount: "1 1/2 cups" },
      { name: "Butter, melted", amount: "1/2 cup" },
      { name: "Coffee, hot", amount: "1 cup" },
      { name: "Dark chocolate", amount: "8 oz" },
      { name: "Heavy cream", amount: "1 cup" }
    ],
    instructions: [
      "Preheat oven to 350°F, grease three 9-inch pans",
      "Mix dry ingredients in large bowl",
      "Whisk together wet ingredients",
      "Combine wet and dry ingredients, stir in hot coffee",
      "Divide batter between pans",
      "Bake 25-30 minutes until toothpick comes out clean",
      "Make ganache by heating cream, pour over chopped chocolate",
      "Cool cakes completely before frosting",
      "Layer with ganache between each layer"
    ],
    tips: [
      "Room temperature ingredients mix better",
      "Don't overbake or cake will be dry",
      "Let ganache cool slightly before using"
    ],
    suggestions: ["raspberry jam", "mint", "espresso", "sea salt"],
    relatedDishes: ["Red Velvet Cake", "Carrot Cake", "Cheesecake"]
  },

  {
    name: "BBQ Pulled Pork",
    description: "Slow-cooked pork shoulder with tangy barbecue sauce",
    cookTime: "8 hours",
    servings: "8 servings",
    difficulty: "Medium",
    mainIngredients: ["pork", "bbq sauce", "onion"],
    ingredients: [
      { name: "Pork shoulder", amount: "4 lbs" },
      { name: "Brown sugar", amount: "1/4 cup" },
      { name: "Paprika", amount: "2 tbsp" },
      { name: "Onion powder", amount: "1 tbsp" },
      { name: "Garlic powder", amount: "1 tbsp" },
      { name: "BBQ sauce", amount: "2 cups" },
      { name: "Apple cider vinegar", amount: "1/4 cup" },
      { name: "Liquid smoke", amount: "1 tsp" }
    ],
    instructions: [
      "Mix brown sugar, paprika, onion powder, garlic powder for rub",
      "Coat pork shoulder with spice rub, refrigerate overnight",
      "Cook in slow cooker on low for 8 hours",
      "Remove pork, shred with two forks",
      "Mix BBQ sauce with vinegar and liquid smoke",
      "Toss shredded pork with sauce",
      "Serve on buns with coleslaw"
    ],
    tips: [
      "Let the rub sit overnight for best flavor",
      "Don't rush the cooking process",
      "Save some sauce for serving"
    ],
    suggestions: ["coleslaw", "pickles", "jalapeños", "cheese"],
    relatedDishes: ["BBQ Ribs", "Brisket", "Pulled Chicken"]
  },

  // Serious Eats-inspired techniques
  {
    name: "Perfect Pizza Dough",
    description: "Professional-quality pizza dough with 72-hour fermentation",
    cookTime: "20 minutes (plus 3 days rise)",
    servings: "4 pizzas",
    difficulty: "Medium",
    mainIngredients: ["flour", "yeast", "water"],
    ingredients: [
      { name: "Bread flour", amount: "4 cups" },
      { name: "Water, room temperature", amount: "1 1/3 cups" },
      { name: "Active dry yeast", amount: "1/4 tsp" },
      { name: "Salt", amount: "2 tsp" },
      { name: "Olive oil", amount: "2 tbsp" }
    ],
    instructions: [
      "Dissolve yeast in water, let sit 5 minutes",
      "Mix flour and salt in large bowl",
      "Add yeast mixture and olive oil",
      "Mix until shaggy dough forms",
      "Knead 10 minutes until smooth and elastic",
      "Place in oiled bowl, cover, rise 2 hours",
      "Divide into 4 portions, refrigerate 24-72 hours",
      "Bring to room temperature before shaping"
    ],
    tips: [
      "Long fermentation develops complex flavors",
      "Use a kitchen scale for accuracy",
      "High heat is essential for good pizza"
    ],
    suggestions: ["semolina flour", "honey", "herb oil", "sea salt"],
    relatedDishes: ["Focaccia", "Calzone", "Stromboli"]
  },

  {
    name: "Beef Wellington",
    description: "Elegant beef tenderloin wrapped in puff pastry with mushroom duxelles",
    cookTime: "2 hours",
    servings: "6 servings",
    difficulty: "Hard",
    mainIngredients: ["beef", "mushroom", "pastry"],
    ingredients: [
      { name: "Beef tenderloin", amount: "2 lbs" },
      { name: "Puff pastry", amount: "1 sheet" },
      { name: "Mushrooms, finely chopped", amount: "1 lb" },
      { name: "Prosciutto", amount: "8 slices" },
      { name: "Dijon mustard", amount: "2 tbsp" },
      { name: "Egg yolk", amount: "1" },
      { name: "Fresh thyme", amount: "2 tbsp" },
      { name: "Shallots, minced", amount: "2" }
    ],
    instructions: [
      "Sear beef on all sides until browned",
      "Brush with mustard, let cool",
      "Sauté mushrooms and shallots until dry",
      "Lay out prosciutto, spread mushroom mixture",
      "Wrap beef in prosciutto and mushrooms",
      "Wrap in puff pastry, seal edges",
      "Brush with egg wash",
      "Bake at 400°F for 25-30 minutes until golden",
      "Rest 10 minutes before slicing"
    ],
    tips: [
      "Sear beef at high heat for good crust",
      "Make sure mushroom mixture is dry",
      "Use meat thermometer for doneness"
    ],
    suggestions: ["foie gras", "truffle", "red wine sauce", "roasted vegetables"],
    relatedDishes: ["Beef Bourguignon", "Filet Mignon", "Rack of Lamb"]
  },

  // International cookbook-inspired dishes
  {
    name: "Authentic Pad Thai",
    description: "Thailand's famous stir-fried noodles with tamarind and fish sauce",
    cookTime: "25 minutes",
    servings: "4 servings",
    difficulty: "Medium",
    mainIngredients: ["noodles", "shrimp", "tamarind"],
    ingredients: [
      { name: "Rice noodles", amount: "8 oz" },
      { name: "Shrimp, peeled", amount: "1 lb" },
      { name: "Tamarind paste", amount: "3 tbsp" },
      { name: "Fish sauce", amount: "3 tbsp" },
      { name: "Palm sugar", amount: "2 tbsp" },
      { name: "Bean sprouts", amount: "2 cups" },
      { name: "Eggs", amount: "2" },
      { name: "Peanuts, crushed", amount: "1/4 cup" },
      { name: "Lime wedges", amount: "4" }
    ],
    instructions: [
      "Soak rice noodles in warm water until soft",
      "Mix tamarind paste, fish sauce, and palm sugar",
      "Heat wok over high heat, add oil",
      "Scramble eggs, push to one side",
      "Add shrimp, cook until pink",
      "Add drained noodles and sauce",
      "Stir-fry 2-3 minutes until noodles are coated",
      "Add bean sprouts, toss briefly",
      "Serve with peanuts and lime"
    ],
    tips: [
      "Have all ingredients prepped before cooking",
      "High heat is essential for authentic flavor",
      "Don't overcook the bean sprouts"
    ],
    suggestions: ["tofu", "dried shrimp", "chives", "chili flakes"],
    relatedDishes: ["Pad See Ew", "Drunken Noodles", "Thai Fried Rice"]
  },

  {
    name: "Moroccan Tagine",
    description: "Aromatic slow-cooked stew with warm spices and dried fruits",
    cookTime: "2 hours",
    servings: "6 servings",
    difficulty: "Medium",
    mainIngredients: ["lamb", "apricot", "cinnamon"],
    ingredients: [
      { name: "Lamb shoulder, cubed", amount: "2 lbs" },
      { name: "Dried apricots", amount: "1 cup" },
      { name: "Onions, sliced", amount: "2 large" },
      { name: "Cinnamon stick", amount: "1" },
      { name: "Ground ginger", amount: "1 tsp" },
      { name: "Saffron threads", amount: "1/4 tsp" },
      { name: "Almonds, toasted", amount: "1/2 cup" },
      { name: "Fresh cilantro", amount: "1/4 cup" },
      { name: "Olive oil", amount: "3 tbsp" }
    ],
    instructions: [
      "Heat oil in tagine or heavy pot",
      "Brown lamb pieces on all sides",
      "Add onions, cook until soft",
      "Add spices, cook until fragrant",
      "Add water to barely cover meat",
      "Cover and simmer 1.5 hours",
      "Add apricots, cook 30 minutes more",
      "Garnish with almonds and cilantro",
      "Serve with couscous or bread"
    ],
    tips: [
      "Low and slow cooking makes meat tender",
      "Adjust liquid as needed during cooking",
      "Toast almonds for extra flavor"
    ],
    suggestions: ["dates", "preserved lemons", "olives", "harissa"],
    relatedDishes: ["Moroccan Chicken", "Lamb Curry", "Middle Eastern Rice"]
  },

  {
    name: "Italian Osso Buco",
    description: "Braised veal shanks in white wine with gremolata",
    cookTime: "3 hours",
    servings: "4 servings",
    difficulty: "Hard",
    mainIngredients: ["veal", "wine", "tomato"],
    ingredients: [
      { name: "Veal shanks", amount: "4 pieces" },
      { name: "White wine", amount: "1 cup" },
      { name: "Canned tomatoes", amount: "1 can (14 oz)" },
      { name: "Onion, diced", amount: "1 large" },
      { name: "Carrots, diced", amount: "2" },
      { name: "Celery, diced", amount: "2 stalks" },
      { name: "Lemon zest", amount: "2 tbsp" },
      { name: "Parsley, chopped", amount: "1/4 cup" },
      { name: "Garlic, minced", amount: "4 cloves" },
      { name: "Flour", amount: "1/2 cup" }
    ],
    instructions: [
      "Tie veal shanks with kitchen twine",
      "Dredge in flour, brown on all sides",
      "Remove veal, sauté vegetables until soft",
      "Add wine, scraping up browned bits",
      "Add tomatoes and return veal to pot",
      "Cover and braise in 325°F oven for 2.5 hours",
      "Make gremolata with lemon zest, parsley, and garlic",
      "Serve veal with gremolata and risotto"
    ],
    tips: [
      "Tie shanks to keep shape during cooking",
      "Don't skip browning for deep flavor",
      "Marrow in bones adds richness"
    ],
    suggestions: ["saffron risotto", "polenta", "crusty bread", "red wine"],
    relatedDishes: ["Braised Short Ribs", "Coq au Vin", "Beef Bourguignon"]
  },

  // Food blog-inspired modern dishes
  {
    name: "Korean Kimchi Fried Rice",
    description: "Spicy fermented cabbage transforms day-old rice into something magical",
    cookTime: "15 minutes",
    servings: "4 servings",
    difficulty: "Easy",
    mainIngredients: ["rice", "kimchi", "egg"],
    ingredients: [
      { name: "Day-old cooked rice", amount: "4 cups" },
      { name: "Kimchi, chopped", amount: "1 cup" },
      { name: "Kimchi juice", amount: "2 tbsp" },
      { name: "Eggs", amount: "4" },
      { name: "Scallions, sliced", amount: "3" },
      { name: "Sesame oil", amount: "2 tbsp" },
      { name: "Vegetable oil", amount: "2 tbsp" },
      { name: "Sesame seeds", amount: "1 tbsp" }
    ],
    instructions: [
      "Heat vegetable oil in large skillet or wok",
      "Add kimchi, stir-fry for 2 minutes",
      "Add rice, breaking up clumps",
      "Add kimchi juice, stir-fry 3-4 minutes",
      "Push rice to sides, fry eggs sunny-side up",
      "Drizzle with sesame oil",
      "Garnish with scallions and sesame seeds",
      "Serve immediately with fried eggs on top"
    ],
    tips: [
      "Day-old rice works best for fried rice",
      "Well-fermented kimchi has the best flavor",
      "High heat prevents rice from getting mushy"
    ],
    suggestions: ["spam", "bacon", "mushrooms", "nori"],
    relatedDishes: ["Bibimbap", "Korean BBQ", "Bulgogi"]
  },

  {
    name: "Shakshuka",
    description: "North African eggs poached in spiced tomato sauce",
    cookTime: "30 minutes",
    servings: "4 servings",
    difficulty: "Easy",
    mainIngredients: ["tomato", "egg", "peppers"],
    ingredients: [
      { name: "Canned tomatoes, crushed", amount: "1 can (28 oz)" },
      { name: "Eggs", amount: "6 large" },
      { name: "Bell pepper, diced", amount: "1" },
      { name: "Onion, diced", amount: "1 medium" },
      { name: "Garlic, minced", amount: "4 cloves" },
      { name: "Paprika", amount: "1 tsp" },
      { name: "Cumin", amount: "1 tsp" },
      { name: "Feta cheese, crumbled", amount: "1/2 cup" },
      { name: "Fresh parsley", amount: "1/4 cup" }
    ],
    instructions: [
      "Heat oil in cast iron skillet",
      "Sauté onion and bell pepper until soft",
      "Add garlic, paprika, and cumin, cook 1 minute",
      "Add tomatoes, simmer 10-15 minutes",
      "Make wells in sauce, crack eggs into wells",
      "Cover and cook 8-12 minutes until eggs are set",
      "Sprinkle with feta and parsley",
      "Serve with crusty bread"
    ],
    tips: [
      "Use a cast iron skillet if possible",
      "Don't overcook the eggs",
      "Adjust spice level to taste"
    ],
    suggestions: ["harissa", "preserved lemon", "olives", "za'atar"],
    relatedDishes: ["Huevos Rancheros", "Menemen", "Eggs in Purgatory"]
  },

  {
    name: "Vietnamese Pho Bo",
    description: "Aromatic beef noodle soup with star anise and fish sauce",
    cookTime: "4 hours",
    servings: "6 servings",
    difficulty: "Hard",
    mainIngredients: ["beef", "noodles", "broth"],
    ingredients: [
      { name: "Beef bones", amount: "3 lbs" },
      { name: "Rice noodles", amount: "1 lb" },
      { name: "Beef sirloin, sliced thin", amount: "1 lb" },
      { name: "Star anise", amount: "6 pods" },
      { name: "Cinnamon stick", amount: "1" },
      { name: "Fish sauce", amount: "1/4 cup" },
      { name: "Rock sugar", amount: "2 tbsp" },
      { name: "Onion, charred", amount: "1 large" },
      { name: "Ginger, charred", amount: "3 inches" },
      { name: "Bean sprouts", amount: "2 cups" },
      { name: "Fresh herbs (basil, cilantro)", amount: "1 cup" }
    ],
    instructions: [
      "Char onion and ginger over open flame",
      "Blanch beef bones in boiling water, rinse",
      "Simmer bones with charred vegetables for 3 hours",
      "Toast spices, add to broth last hour",
      "Strain broth, season with fish sauce and sugar",
      "Cook rice noodles according to package",
      "Place noodles in bowls, top with raw beef",
      "Ladle hot broth over to cook beef",
      "Serve with herbs, bean sprouts, lime"
    ],
    tips: [
      "Charring vegetables adds depth",
      "Long simmering extracts maximum flavor",
      "Paper-thin beef cooks instantly in hot broth"
    ],
    suggestions: ["hoisin sauce", "sriracha", "lime", "jalapeños"],
    relatedDishes: ["Bun Bo Hue", "Vietnamese Spring Rolls", "Banh Mi"]
  }

  // Continue with more recipes representing different cuisines and techniques...
];

// Expanded recipe variations for more ingredients
const recipeVariations = {
  chicken: [
    "Honey Garlic Chicken", "Chicken Parmesan", "Buffalo Chicken", "Lemon Herb Chicken",
    "Chicken Tikka Masala", "BBQ Chicken", "Chicken Fajitas", "Chicken Piccata",
    "General Tso's Chicken", "Chicken Alfredo", "Teriyaki Chicken", "Chicken Curry",
    "Fried Chicken", "Chicken Marsala", "Moroccan Chicken", "Thai Basil Chicken"
  ],
  beef: [
    "Beef Tacos", "Mongolian Beef", "Beef Stroganoff", "Meatballs", "Beef Chili",
    "Korean Beef Bowl", "Beef and Broccoli", "Shepherd's Pie", "Beef Wellington",
    "Pot Roast", "Beef Curry", "Steak Fajitas", "Beef Bourguignon", "Meatloaf"
  ],
  fish: [
    "Fish Tacos", "Baked Salmon", "Fish and Chips", "Lemon Garlic Tilapia",
    "Tuna Steaks", "Fish Curry", "Grilled Fish", "Fish Cakes", "Cedar Plank Salmon",
    "Blackened Fish", "Fish Stew", "Ceviche", "Bouillabaisse", "Fish Pie"
  ],
  pasta: [
    "Spaghetti Carbonara", "Penne Arrabbiata", "Lasagna", "Mac and Cheese",
    "Pesto Pasta", "Bolognese", "Cacio e Pepe", "Pasta Primavera", "Fettuccine Alfredo",
    "Penne Vodka", "Pasta Puttanesca", "Linguine Clam Sauce", "Ravioli", "Gnocchi"
  ],
  rice: [
    "Fried Rice", "Risotto", "Rice Pilaf", "Spanish Rice", "Coconut Rice",
    "Rice Bowls", "Stuffed Peppers", "Rice Pudding", "Biryani", "Jambalaya",
    "Paella", "Sushi Rice", "Sticky Rice", "Rice Salad", "Congee"
  ],
  vegetables: [
    "Vegetable Curry", "Ratatouille", "Vegetable Stir Fry", "Roasted Vegetables",
    "Vegetable Soup", "Grilled Vegetables", "Vegetable Pasta", "Buddha Bowl",
    "Vegetable Lasagna", "Stuffed Vegetables", "Vegetable Tacos", "Caprese Salad"
  ],
  eggs: [
    "Scrambled Eggs", "Omelette", "Quiche", "Frittata", "Eggs Benedict",
    "Deviled Eggs", "Egg Salad", "Scotch Eggs", "Egg Fried Rice", "Shakshuka",
    "Eggs Florentine", "Huevos Rancheros", "Egg Drop Soup", "Custard"
  ],
  cheese: [
    "Mac and Cheese", "Grilled Cheese", "Cheese Fondue", "Quesadillas",
    "Cheese Soufflé", "Cheese Board", "Cheese Sauce", "Ricotta Pancakes",
    "Cheese Stuffed Chicken", "Cheese Tart", "Cheese Soup", "Mozzarella Sticks"
  ],
  bread: [
    "French Toast", "Bread Pudding", "Stuffing", "Croutons", "Bruschetta",
    "Garlic Bread", "Bread Bowl", "Bread Salad", "Meatloaf", "Breadcrumbs"
  ],
  potato: [
    "Mashed Potatoes", "Baked Potato", "French Fries", "Potato Salad",
    "Potato Soup", "Scalloped Potatoes", "Hash Browns", "Potato Gratin",
    "Gnocchi", "Potato Pancakes", "Roasted Potatoes", "Potato Curry"
  ]
};

// Additional international spice combinations and cooking techniques
const cuisineStyles = {
  italian: ["basil", "oregano", "garlic", "tomato", "parmesan", "olive oil"],
  mexican: ["cumin", "chili powder", "lime", "cilantro", "jalapeño", "onion"],
  indian: ["garam masala", "turmeric", "ginger", "garlic", "coconut milk", "curry"],
  thai: ["fish sauce", "lime", "chili", "basil", "coconut milk", "lemongrass"],
  chinese: ["soy sauce", "ginger", "garlic", "sesame oil", "scallions", "rice wine"],
  french: ["butter", "herbs", "wine", "cream", "shallots", "mustard"],
  mediterranean: ["olive oil", "lemon", "herbs", "feta", "olives", "tomato"],
  moroccan: ["cinnamon", "cumin", "ginger", "dried fruit", "almonds", "saffron"],
  japanese: ["miso", "soy sauce", "mirin", "sesame", "nori", "wasabi"],
  korean: ["kimchi", "gochujang", "sesame oil", "garlic", "soy sauce", "rice"]
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
          model: 'gpt-4.1-2025-04-14',
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

export { recipeDatabase, recipeVariations, cuisineStyles };

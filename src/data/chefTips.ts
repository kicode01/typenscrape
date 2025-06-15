
export interface ChefTip {
  id: string;
  category: 'technique' | 'ingredient' | 'kitchen-hack' | 'fun-fact' | 'history' | 'encouragement';
  tip: string;
  context?: 'generating' | 'adding-ingredients' | 'viewing-recipe' | 'general';
}

export const chefTips: ChefTip[] = [
  // Technique Tips
  {
    id: 'salt-pasta-water',
    category: 'technique',
    tip: "Always salt your pasta water! It should taste like the sea. This is your only chance to season the pasta itself.",
    context: 'general'
  },
  {
    id: 'knife-skills',
    category: 'technique',
    tip: "Keep your knives sharp! A dull knife is more dangerous than a sharp one because it requires more pressure and can slip.",
    context: 'general'
  },
  {
    id: 'mise-en-place',
    category: 'technique',
    tip: "Mise en place - have everything in its place! Prep all ingredients before you start cooking.",
    context: 'adding-ingredients'
  },

  // Ingredient Tips
  {
    id: 'garlic-tip',
    category: 'ingredient',
    tip: "To remove garlic smell from your hands, rub them on stainless steel under cold water!",
    context: 'adding-ingredients'
  },
  {
    id: 'onion-tears',
    category: 'ingredient',
    tip: "To avoid tears when cutting onions, chill them in the fridge for 30 minutes first!",
    context: 'adding-ingredients'
  },
  {
    id: 'tomato-storage',
    category: 'ingredient',
    tip: "Store tomatoes stem-side down to keep them fresh longer and prevent moisture loss!",
    context: 'adding-ingredients'
  },

  // Kitchen Hacks
  {
    id: 'ice-cube-grease',
    category: 'kitchen-hack',
    tip: "Drop an ice cube in your soup to easily remove excess grease - it will solidify and stick to the cube!",
    context: 'general'
  },
  {
    id: 'lemon-microwave',
    category: 'kitchen-hack',
    tip: "Microwave a lemon for 10 seconds before juicing to get twice as much juice out of it!",
    context: 'general'
  },

  // Fun Facts
  {
    id: 'honey-immortal',
    category: 'fun-fact',
    tip: "Honey never spoils! Archaeologists have found edible honey in ancient Egyptian tombs over 3000 years old.",
    context: 'general'
  },
  {
    id: 'banana-berry',
    category: 'fun-fact',
    tip: "Bananas are berries, but strawberries aren't! Botanically speaking, berries must have seeds inside their flesh.",
    context: 'general'
  },
  {
    id: 'chocolate-deadly',
    category: 'fun-fact',
    tip: "Chocolate was once used as currency by the Aztecs! Cacao beans were so valuable they were used in trade.",
    context: 'general'
  },

  // Food History
  {
    id: 'sandwich-origin',
    category: 'history',
    tip: "The sandwich was invented by the Earl of Sandwich in 1762 because he didn't want to leave his card game to eat!",
    context: 'general'
  },
  {
    id: 'ketchup-medicine',
    category: 'history',
    tip: "Ketchup was sold as medicine in the 1830s! Dr. John Cook Bennett claimed it could cure indigestion.",
    context: 'general'
  },

  // Encouragement
  {
    id: 'cooking-love',
    category: 'encouragement',
    tip: "Cooking is love made visible! Every meal you prepare is a gift to those who share it with you.",
    context: 'generating'
  },
  {
    id: 'mistakes-learning',
    category: 'encouragement',
    tip: "Every great chef has burned something! Mistakes in the kitchen are just lessons in disguise.",
    context: 'generating'
  },
  {
    id: 'fresh-ingredients',
    category: 'encouragement',
    tip: "You're building something amazing! Fresh ingredients are the foundation of incredible flavors.",
    context: 'adding-ingredients'
  },
  {
    id: 'recipe-success',
    category: 'encouragement',
    tip: "Wonderful choice of ingredients! This recipe is going to be absolutely delicious.",
    context: 'viewing-recipe'
  }
];

export const getRandomTip = (context?: ChefTip['context'], category?: ChefTip['category']): ChefTip => {
  let filteredTips = chefTips;
  
  if (context) {
    filteredTips = filteredTips.filter(tip => tip.context === context || tip.context === 'general');
  }
  
  if (category) {
    filteredTips = filteredTips.filter(tip => tip.category === category);
  }
  
  const randomIndex = Math.floor(Math.random() * filteredTips.length);
  return filteredTips[randomIndex];
};

export const getTipsByCategory = (category: ChefTip['category']): ChefTip[] => {
  return chefTips.filter(tip => tip.category === category);
};

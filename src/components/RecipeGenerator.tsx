import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, X, Utensils, Flame, WifiOff, ChefHat, Hammer, Shield, Zap, Coins, Drumstick, Beef, Fish, Box, UtensilsCrossed, Soup, Salad, Bone } from 'lucide-react';
import { generateRecipeFromIngredients } from '@/utils/recipeGenerator';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const LOADING_TEXTS = [
  "Forging the base ingredients...",
  "Equipping spices and modifiers...",
  "Calculating flavor synergies...",
  "Rolling for critical taste...",
  "Consulting the Recipe Master...",
  "Plating your legendary build..."
];

const BASES = [
  { name: 'Chicken', icon: Drumstick, type: 'Balanced', color: 'text-orange-500' },
  { name: 'Beef', icon: Beef, type: 'STR Build', color: 'text-red-500' },
  { name: 'Pork', icon: Bone, type: 'Flavor Build', color: 'text-rose-400' },
  { name: 'Seafood', icon: Fish, type: 'AGI Build', color: 'text-blue-500' },
  { name: 'Tofu', icon: Box, type: 'DEF Build', color: 'text-emerald-400' },
  { name: 'Pasta', icon: UtensilsCrossed, type: 'Speed Build', color: 'text-yellow-500' },
  { name: 'Rice', icon: Soup, type: 'Budget Build', color: 'text-amber-600' },
  { name: 'Vegetables', icon: Salad, type: 'Health Build', color: 'text-green-500' }
];

const MODIFIER_CATEGORIES = [
  {
    title: 'Spices & Aromatics',
    items: ['Garlic', 'Onion', 'Ginger', 'Chili', 'Black Pepper', 'Star Anise', 'Bay Leaf', 'Cumin', 'Paprika', 'Coriander', 'Turmeric', 'Cinnamon']
  },
  {
    title: 'Sauces & Liquids',
    items: ['Soy Sauce', 'Vinegar', 'Coconut Milk', 'Tomato Sauce', 'Peanut Butter', 'Fish Sauce', 'Oyster Sauce', 'Teriyaki', 'Chicken Broth', 'Wine', 'Sesame Oil']
  },
  {
    title: 'Extras',
    items: ['Egg', 'Cheese', 'Potatoes', 'Carrots', 'Bell Pepper', 'Mushroom', 'Pineapple', 'Bacon Bits', 'Scallions', 'Sesame Seeds', 'Honey', 'Lime', 'Nuts']
  }
];

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: any) => void;
}

export const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onRecipeGenerated }) => {
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const toggleModifier = (mod: string) => {
    if (selectedModifiers.includes(mod)) {
      setSelectedModifiers(selectedModifiers.filter(m => m !== mod));
    } else {
      if (selectedModifiers.length >= 5) {
        toast.error("Max loadout reached! You can only equip up to 5 modifiers.", {
          duration: 3000
        });
        return;
      }
      setSelectedModifiers([...selectedModifiers, mod]);
    }
  };

  const generateRecipe = async () => {
    if (!selectedBase) {
      toast.error('Please select a Base Hero for your recipe!');
      return;
    }

    setIsGenerating(true);
    setLoadingTextIndex(0);
    try {
      const ingredients = [selectedBase, ...selectedModifiers];
      
      const preferences = `Make it a gamified RPG recipe loadout based on the chosen class/base. Emphasize stats and synergy!`;
      const recipe = await generateRecipeFromIngredients(ingredients, preferences);
      
      // Fire confetti on success!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#f59e0b', '#fbbf24', '#ffffff']
      });

      onRecipeGenerated(recipe);
    } catch (error: any) {
      if (error.message === 'INVALID_INGREDIENTS') {
        toast.error('Those don\'t look like real edible ingredients! Please enter actual food items to compile a recipe.', {
          duration: 5000
        });
      } else if (error.message === 'MISSING_API_KEY') {
        toast.error('Smart Engine Offline: Missing Gemini API Key. Please restart your dev server!', {
          duration: 5000
        });
      } else {
        toast.error(`The Smart Compiler failed: ${error.message}`, {
          duration: 4000
        });
        console.error('Recipe generation error:', error);
      }
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <Card className="neo-card rounded-2xl h-[400px] flex flex-col items-center justify-center relative bg-theme-bg">
        <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 mb-6 relative">
            <div className="relative w-full h-full bg-theme-primary rounded-full flex items-center justify-center border-4 border-theme-border shadow-[4px_4px_0px_var(--theme-shadow)] animate-bounce-subtle">
              <ChefHat className="h-10 w-10 text-theme-panel" />
            </div>
          </div>
          
          <h3 className="text-xl font-extrabold text-theme-text mb-2 uppercase tracking-wide">
            Compiling Build
          </h3>
          
          <div className="h-6 overflow-hidden text-center">
            <p className="text-sm font-bold text-theme-primary animate-fade-up" key={loadingTextIndex}>
              {LOADING_TEXTS[loadingTextIndex]}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="neo-card rounded-2xl overflow-hidden font-runde">
      <CardHeader className="bg-theme-primary border-b-4 border-theme-border p-5 relative overflow-hidden">
        <CardTitle className="flex items-center space-x-2 text-sm font-extrabold text-theme-panel tracking-widest uppercase relative z-10">
          <Hammer className="h-4 w-4 text-theme-panel" />
          <span>Recipe Builder</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 space-y-6 relative">
        {!isOnline && (
          <div className="absolute inset-0 z-20 backdrop-blur-sm bg-theme-panel/90 rounded-b-3xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-theme-bg rounded-full flex items-center justify-center mb-4 shadow-sm animate-float">
              <WifiOff className="h-8 w-8 text-theme-icon" />
            </div>
            <h3 className="text-lg font-extrabold text-theme-text mb-2">
              Offline Mode
            </h3>
            <p className="text-sm font-medium text-theme-text opacity-70 max-w-[250px]">
              The Recipe Builder requires an internet connection. Please connect to Wi-Fi.
            </p>
          </div>
        )}

        {/* Step 1: Base Selection */}
        <div className={!isOnline ? 'opacity-30 pointer-events-none' : ''}>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[12px] font-black uppercase tracking-wider text-theme-text flex items-center space-x-1.5">
              <Shield className="h-4 w-4 text-theme-primary" />
              <span>Step 1: Choose Your Hero (Base)</span>
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BASES.map((base) => {
              const Icon = base.icon;
              return (
                <button
                  key={base.name}
                  onClick={() => setSelectedBase(base.name)}
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 neo-shape-sm transition-all duration-200 ${
                    selectedBase === base.name
                      ? 'border-theme-primary bg-theme-bg shadow-[4px_4px_0px_var(--theme-shadow)] scale-105 z-10 active:scale-100 active:translate-y-[4px] active:shadow-none'
                      : 'border-theme-border bg-theme-panel shadow-[2px_2px_0px_var(--theme-shadow)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--theme-shadow)] active:translate-y-[2px] active:shadow-none'
                  }`}
                >
                  <div className="mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-theme-panel border border-theme-border opacity-90">
                    <Icon className={`w-6 h-6 stroke-[2.5] ${base.color}`} />
                  </div>
                  <span className="font-extrabold text-[11px] sm:text-xs text-theme-text tracking-wider mb-0.5 uppercase">{base.name}</span>
                  <span className="text-[9px] sm:text-[10px] font-black text-theme-icon uppercase opacity-80">{base.type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Modifiers */}
        <div className={!isOnline ? 'opacity-30 pointer-events-none' : ''}>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[12px] font-black uppercase tracking-wider text-theme-text flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-theme-primary" />
              <span>Step 2: Equip Modifiers ({selectedModifiers.length}/5)</span>
            </label>
          </div>

          <div className="space-y-4">
            {MODIFIER_CATEGORIES.map(category => (
              <div key={category.title}>
                <h4 className="text-[10px] font-bold uppercase text-theme-icon mb-2 tracking-widest opacity-80">{category.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.items.map(item => {
                    const isSelected = selectedModifiers.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleModifier(item)}
                        className={`px-3 py-1.5 text-xs font-black transition-all ${
                          isSelected
                            ? 'btn-neo -translate-y-0.5 active:translate-y-[2px] active:shadow-none'
                            : 'btn-neo-sm -translate-y-0.5 active:translate-y-[2px] active:shadow-none'
                        }`}
                      >
                        {item} {isSelected && <X className="inline w-3 h-3 ml-1 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => setTimeout(generateRecipe, 150)}
          disabled={!selectedBase || !isOnline}
          className={`w-full hover:brightness-110 font-black text-sm py-0 h-14 flex items-center justify-center tracking-wider uppercase ${selectedBase ? 'btn-neo' : 'bg-theme-bg text-theme-icon border-theme-border border-[length:var(--theme-border-width)] border-solid opacity-50 rounded-[var(--theme-radius)]'}`}
        >
          <Flame className="h-5 w-5 mr-2" />
          Compile Loadout
        </button>
      </CardContent>
    </Card>
  );
};

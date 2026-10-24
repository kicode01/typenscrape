import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Clock, Users, ChefHat, Utensils, CheckCircle2,
  Plus, Minus, Flame, ArrowLeft, ExternalLink, Heart, Tag, Languages, Loader2
} from 'lucide-react';
import { FilipinoDish } from '@/services/filipinoRecipeService';
import { CATEGORY_COLORS } from '@/utils/colors';
import { useSettings } from '@/hooks/useSettings';
import { translateRecipeToFilipino } from '@/services/geminiService';
import { toast } from 'sonner';

interface RecipeCardProps {
  recipe: FilipinoDish;
  isFavorite: boolean;
  onToggleFavorite: (recipe: FilipinoDish) => void;
  onBack: () => void;
  onGainXp?: (amount: number, reason: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe: initialRecipe, isFavorite, onToggleFavorite, onBack, onGainXp
}) => {
  const { settings } = useSettings();
  const [translatedRecipe, setTranslatedRecipe] = useState<FilipinoDish | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [servingMultiplier, setServingMultiplier] = useState(1);

  const recipe = translatedRecipe || initialRecipe;

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const translated = await translateRecipeToFilipino(initialRecipe);
      setTranslatedRecipe(translated);
      toast.success('Translated to Filipino!');
    } catch (e) {
      toast.error('Failed to translate recipe. Check your connection or API key.');
    } finally {
      setIsTranslating(false);
    }
  };

  // In the new dataset, ingredients and instructions are always arrays
  const safeIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const safeInstructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];

  const toggleStep = (index: number) => {
    const isCurrentlyCompleted = completedSteps.includes(index);
    let newSteps;
    
    if (isCurrentlyCompleted) {
      newSteps = completedSteps.filter(i => i !== index);
      
      // If they unchecked a step after already completing it, we revert the XP
      if (completedSteps.length === safeInstructions.length && onGainXp) {
         let xpGained = 50;
         if (recipe.rarity === 'Epic') xpGained = 100;
         if (recipe.rarity === 'Legendary') xpGained = 250;
         onGainXp(-xpGained, 'Recipe Unfinished');
      }
    } else {
      newSteps = [...completedSteps, index];
      
      // Check if this action completed the recipe!
      if (newSteps.length === safeInstructions.length && onGainXp) {
         let xpGained = 50;
         if (recipe.rarity === 'Epic') xpGained = 100;
         if (recipe.rarity === 'Legendary') xpGained = 250;
         onGainXp(xpGained, 'Recipe Completed!');
      }
    }
    
    setCompletedSteps(newSteps);
  };

  const progress = safeInstructions.length > 0
    ? (completedSteps.length / safeInstructions.length) * 100
    : 0;

  return (
    <div className="flex flex-col h-full animate-fade-up font-runde">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div 
        className="bg-theme-primary px-4 pt-4 pb-6 relative overflow-hidden shrink-0 neo-panel"
        style={{ borderBottomWidth: 'var(--theme-border-width)' }}
      >

        <div className="flex items-center justify-between mb-4 relative z-10">
          <button
            onClick={() => setTimeout(onBack, 150)}
            className="flex items-center space-x-1.5 text-theme-panel hover:opacity-80 active:opacity-50 transition-opacity text-sm font-black uppercase tracking-wider"
          >
            <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
            <span>Back</span>
          </button>

          <button
            onClick={() => setTimeout(() => onToggleFavorite(recipe), 150)}
            className="p-2 neo-shape-sm flex items-center justify-center bg-theme-panel hover:-translate-y-0.5 active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-theme-primary text-theme-primary' : 'text-theme-text opacity-70'}`} />
          </button>
        </div>

        {/* Category & Rarity badges */}
        <div className="relative z-10 mb-2 flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-black neo-shape-sm ${CATEGORY_COLORS[recipe.category] || CATEGORY_COLORS['Others']}`}>
            <Tag className="w-3 h-3 stroke-[2.5]" />
            <span>{recipe.category}</span>
          </span>
          {recipe.rarity && (
            <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-black neo-card ${
              recipe.rarity === 'Legendary' ? 'bg-yellow-400 text-yellow-900' :
              recipe.rarity === 'Epic' ? 'bg-purple-400 text-purple-900' :
              recipe.rarity === 'Rare' ? 'bg-blue-400 text-blue-900' :
              'bg-theme-panel text-theme-text border-[length:var(--theme-border-width)] border-theme-border'
            }`}>
              {recipe.rarity}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-theme-panel tracking-tight leading-tight relative z-10 mb-2 drop-shadow-[2px_2px_0px_var(--theme-shadow)]">
          {recipe.name}
        </h2>

        {/* Translate Button */}
        {settings.language === 'fil' && !translatedRecipe && (
          <div className="relative z-10 mb-4">
            <Button 
              onClick={handleTranslate} 
              disabled={isTranslating}
              className="btn-neo-sm h-8 bg-theme-panel text-theme-text hover:bg-theme-bg text-xs font-black px-3 py-0"
            >
              {isTranslating ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin stroke-[3]" />
              ) : (
                <Languages className="w-3.5 h-3.5 mr-1.5 stroke-[3] text-blue-500" />
              )}
              {isTranslating ? 'Translating...' : 'Translate to Filipino'}
            </Button>
          </div>
        )}

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 relative z-10">
          {recipe.cookTime && (
            <div className="flex items-center space-x-1.5 neo-card px-2.5 py-1.5 text-xs font-bold text-theme-text">
              <Clock className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>{recipe.cookTime}</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center space-x-1.5 neo-card px-2.5 py-1.5 text-xs font-bold text-theme-text">
              <Users className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>{recipe.servings} servings</span>
            </div>
          )}
          {recipe.prepTime && (
            <div className="flex items-center space-x-1.5 neo-card px-2.5 py-1.5 text-xs font-bold text-theme-text">
              <ChefHat className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Prep: {recipe.prepTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Scrollable Content ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 pb-24">

        {/* RPG Stats */}
        {recipe.stats && (
          <div className="neo-card p-4">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-theme-icon mb-3 flex items-center opacity-80">
              <Flame className="w-3.5 h-3.5 mr-1" /> Meal Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Prep Speed', value: recipe.stats.prepSpeed, color: 'bg-blue-500' },
                { label: 'Health', value: recipe.stats.health, color: 'bg-green-500' },
                { label: 'Flavor', value: recipe.stats.flavor, color: 'bg-theme-primary' },
                { label: 'Budget', value: recipe.stats.budget, color: 'bg-yellow-500' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[10px] font-extrabold uppercase mb-1 text-theme-text">
                    <span>{stat.label}</span>
                    <span>{stat.value}</span>
                  </div>
                  <div className="h-2 w-full bg-theme-bg rounded-full overflow-hidden border border-theme-border">
                    <div className={`h-full ${stat.color}`} style={{ width: `${stat.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients */}
        {safeIngredients.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="flex items-center text-sm font-black text-theme-text uppercase tracking-wider">
              <Utensils className="h-4 w-4 mr-2 text-theme-primary stroke-[3]" />
              Ingredients
            </h3>
            {/* Portion scaler */}
            <div className="flex items-center space-x-1.5 neo-card px-2 py-1">
              <span className="text-[10px] font-black text-theme-icon">PORTIONS:</span>
              <Button variant="ghost" size="icon"
                onClick={() => setServingMultiplier(m => Math.max(0.5, m - 0.5))}
                className="h-5 w-5 rounded-[calc(var(--theme-radius)/2)] text-theme-text hover:bg-theme-bg transition-all"
              >
                <Minus className="h-3 w-3 stroke-[3]" />
              </Button>
              <span className="text-xs font-black text-theme-primary">{servingMultiplier}x</span>
              <Button variant="ghost" size="icon"
                onClick={() => setServingMultiplier(m => m + 0.5)}
                className="h-5 w-5 rounded-[calc(var(--theme-radius)/2)] text-theme-text hover:bg-theme-bg transition-all"
              >
                <Plus className="h-3 w-3 stroke-[3]" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {safeIngredients.map((ingredient, i) => (
              <div
                key={i}
                className="px-2.5 py-1.5 neo-card text-xs font-bold text-theme-text"
              >
                {ingredient}
              </div>
            ))}
          </div>
        </div>
        )}

        {safeInstructions.length > 0 && safeIngredients.length > 0 && (
          <Separator className="bg-theme-border opacity-30" />
        )}

        {/* Instructions */}
        {safeInstructions.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="flex items-center text-sm font-black text-theme-text uppercase tracking-wider">
              <ChefHat className="h-4 w-4 mr-2 text-theme-primary stroke-[3]" />
              Instructions
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black text-theme-icon">
                {completedSteps.length}/{safeInstructions.length}
              </span>
              <div className="w-16 h-2.5 rounded-[var(--theme-radius)] border-[length:var(--theme-border-width)] border-theme-border bg-theme-panel overflow-hidden shadow-[var(--theme-box-shadow)]">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {safeInstructions.map((step, i) => {
              const isDone = completedSteps.includes(i);
              return (
                <div
                  key={i}
                  onClick={() => setTimeout(() => toggleStep(i), 150)}
                  className={`flex items-start space-x-3 p-3 cursor-pointer transition-all duration-200 neo-card active:translate-y-[2px] active:shadow-none ${
                    isDone
                      ? 'bg-emerald-400 opacity-90'
                      : 'hover:-translate-y-0.5'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 stroke-[3] text-theme-panel" />
                    ) : (
                      <span className="flex items-center justify-center w-5 h-5 bg-theme-primary text-theme-panel text-[10px] font-black neo-shape-sm" style={{ borderRadius: 'calc(var(--theme-radius)/2)' }}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-bold leading-relaxed ${isDone ? 'line-through text-theme-panel opacity-90' : 'text-theme-text'}`}>
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Source link */}
        {recipe.url && (
          <>
            <Separator className="bg-theme-border opacity-50" />
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View original recipe</span>
            </a>
          </>
        )}

        {/* Dataset source */}
        <div className="pb-2">
          <Badge variant="outline" className="text-[10px] text-theme-icon border-theme-border">
            Source: {recipe.source.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>
    </div>
  );
};

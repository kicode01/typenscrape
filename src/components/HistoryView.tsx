import React, { useState } from 'react';
import { Bookmark, Clock, Users, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilipinoDish } from '@/services/filipinoRecipeService';
import { RecipeCard } from '@/components/RecipeCard';
import { CATEGORY_ICONS } from '@/components/ExploreView';
import { CATEGORY_TEXT_COLORS } from '@/utils/colors';

interface HistoryViewProps {
  history: FilipinoDish[];
  onSelectRecipe: (recipe: FilipinoDish) => void;
  favorites: FilipinoDish[];
  onToggleFavorite: (recipe: FilipinoDish) => void;
  onClearHistory: () => void;
  onGainXp?: (amount: number, reason: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelectRecipe, favorites, onToggleFavorite, onClearHistory, onGainXp }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<FilipinoDish | null>(null);

  // Show recipe detail inline
  if (selectedRecipe) {
    return (
      <div className="flex flex-col h-full">
        <RecipeCard
          recipe={selectedRecipe}
          isFavorite={favorites.some(f => f.id === selectedRecipe.id)}
          onToggleFavorite={onToggleFavorite}
          onBack={() => setSelectedRecipe(null)}
          onGainXp={onGainXp}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full font-runde animate-fade-up">
      <div className="shrink-0 px-4 py-3.5 border-b-4 border-theme-border bg-theme-panel">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-theme-primary" />
            <h2 className="text-xl font-black text-theme-text tracking-tight leading-none mt-0.5">Recent Recipes</h2>
          </div>
          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="flex items-center justify-center w-8 h-8 btn-neo-sm disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="Clear History"
          >
            <Trash2 className="w-4 h-4 stroke-[2.5] text-theme-text" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
        {history.length === 0 ? (
          <div className="text-center py-14 neo-card bg-theme-panel">
            <div className="w-14 h-14 bg-theme-primary flex items-center justify-center mx-auto mb-3 neo-shape-sm" style={{ borderRadius: 'calc(var(--theme-radius) / 2)' }}>
              <Clock className="h-7 w-7 text-theme-panel stroke-[2.5]" />
            </div>
            <h3 className="font-black text-base text-theme-text mb-1 tracking-tight">No History Yet</h3>
            <p className="text-xs text-theme-icon font-bold max-w-xs mx-auto leading-relaxed px-4">
              Your generated AI recipes will appear here so you never lose track of a masterpiece.
            </p>
          </div>
        ) : (
          history.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setTimeout(() => setSelectedRecipe(recipe), 150)}
              className="neo-card rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden game-card"
            >
              <div className="p-4 flex justify-between items-center">
                <div className="flex-1 min-w-0 mr-3">
                  <h3 className="font-black text-theme-text text-base leading-tight mb-1 line-clamp-1 group-hover:text-theme-primary transition-colors">
                    {recipe.name}
                  </h3>
                  <div className={`flex items-center space-x-1 text-[11px] font-black mb-1.5 ${CATEGORY_TEXT_COLORS[recipe.category] || CATEGORY_TEXT_COLORS['Others']}`}>
                    {React.createElement(CATEGORY_ICONS[recipe.category] || CATEGORY_ICONS['Others'], { className: "w-3 h-3 stroke-[2.5]" })}
                    <span>{recipe.category}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-bold text-theme-text opacity-90">
                    {recipe.cookTime && (
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 stroke-[2.5]" />
                        <span>{recipe.cookTime}</span>
                      </span>
                    )}
                    {recipe.servings && (
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3 stroke-[2.5]" />
                        <span>{recipe.servings}</span>
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(recipe);
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full text-theme-icon hover:bg-theme-bg hover:text-theme-primary transition-all border-none shadow-none active:scale-90"
                >
                  <Heart className={`h-3.5 w-3.5 ${favorites.some(f => f.id === recipe.id) ? 'fill-theme-primary text-theme-primary' : ''}`} />
                </Button>
              </div>
            </div>
          ))
        )}
        <div className="h-2" />
      </div>
    </div>
  );
};

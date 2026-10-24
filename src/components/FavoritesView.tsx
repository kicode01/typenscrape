import React, { useState } from 'react';
import { Bookmark, Clock, Users, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilipinoDish } from '@/services/filipinoRecipeService';
import { RecipeCard } from '@/components/RecipeCard';
import { CATEGORY_ICONS } from '@/components/ExploreView';
import { CATEGORY_TEXT_COLORS } from '@/utils/colors';

interface FavoritesViewProps {
  favorites: FilipinoDish[];
  onSelectRecipe: (recipe: FilipinoDish) => void;
  onRemoveFavorite: (recipe: FilipinoDish) => void;
  onGainXp?: (amount: number, reason: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, onSelectRecipe, onRemoveFavorite, onGainXp }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<FilipinoDish | null>(null);

  // Show recipe detail inline
  if (selectedRecipe) {
    return (
      <div className="flex flex-col h-full">
        <RecipeCard
          recipe={selectedRecipe}
          isFavorite={true}
          onToggleFavorite={(r) => { onRemoveFavorite(r); setSelectedRecipe(null); }}
          onBack={() => setSelectedRecipe(null)}
          onGainXp={onGainXp}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full font-runde animate-fade-up">
      <div className="shrink-0 px-4 py-3.5 border-b-4 border-theme-border bg-theme-panel z-20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Bookmark className="h-6 w-6 text-theme-primary" />
            <h2 className="text-xl font-black text-theme-text tracking-tight leading-none mt-0.5">Saved Recipes</h2>
          </div>
          <span className={`text-xs font-bold text-theme-text opacity-70 transition-opacity ${favorites.length > 0 ? 'opacity-70' : 'opacity-0'}`}>
            {favorites.length} saved
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
        {favorites.length === 0 ? (
          <div className="text-center py-14 neo-card bg-theme-panel">
            <div className="w-14 h-14 bg-theme-primary flex items-center justify-center mx-auto mb-3 neo-shape-sm" style={{ borderRadius: 'calc(var(--theme-radius) / 2)' }}>
              <Heart className="h-7 w-7 text-theme-panel stroke-[2.5]" />
            </div>
            <h3 className="font-black text-base text-theme-text mb-1 tracking-tight">No Saved Recipes Yet</h3>
            <p className="text-xs text-theme-icon font-bold max-w-xs mx-auto leading-relaxed px-4">
              Browse recipes in <span className="font-black text-theme-primary">Explore</span> and tap <span className="text-theme-primary font-black">♥</span> to save them here.
            </p>
          </div>
        ) : (
          favorites.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setTimeout(() => setSelectedRecipe(recipe), 150)}
              className="neo-card rounded-2xl hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden game-card"
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
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); onRemoveFavorite(recipe); }}
                  className="shrink-0 text-theme-icon hover:text-theme-primary hover:bg-theme-bg p-2 transition-all btn-neo-sm"
                >
                  <Trash2 className="h-4 w-4 stroke-[2.5]" />
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

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Users, Heart, ChefHat, Wifi, RefreshCw, LayoutGrid, Coffee, Drumstick, Beef, Fish, Soup, Salad, CakeSlice, UtensilsCrossed, Tag } from 'lucide-react';
import { FilipinoDish } from '@/services/filipinoRecipeService';
import { recipeDataService } from '@/services/recipeDataService';
import { RecipeCard } from '@/components/RecipeCard';
import { CATEGORY_COLORS, CATEGORY_TEXT_COLORS } from '@/utils/colors';
import { generateRecipeWithGemini } from '@/services/geminiService';
import { searchSpoonacular } from '@/services/spoonacularService';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface ExploreViewProps {
  onToggleFavorite: (recipe: FilipinoDish) => void;
  favorites: FilipinoDish[];
  onGainXp?: (amount: number, reason: string) => void;
  onViewRecipe?: (recipe: FilipinoDish) => void;
}

// ─── Skeleton Card ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="neo-card p-4 animate-pulse">
    <div className="flex justify-between items-start mb-2">
      <div className="h-4 bg-theme-border rounded-lg w-3/4 opacity-30" />
      <div className="h-6 w-6 bg-theme-border rounded-full opacity-30" />
    </div>
    <div className="h-3 bg-theme-panel opacity-50 rounded w-1/2 mb-3" />
    <div className="flex space-x-2">
      <div className="h-5 w-20 bg-theme-panel opacity-50 rounded-full" />
      <div className="h-5 w-16 bg-theme-panel opacity-50 rounded-full" />
    </div>
  </div>
);

// ─── Category mapping ─────────────────────────────────────────────────────
export const CATEGORIES = ['All', 'Breakfast', 'Chicken', 'Beef', 'Pork', 'Seafood', 'Pasta', 'Soup', 'Salad', 'Dessert', 'Others'];

export const CATEGORY_ICONS: Record<string, React.FC<any>> = {
  All: LayoutGrid, Breakfast: Coffee, Chicken: Drumstick, Beef: Beef, Pork: Beef,
  Seafood: Fish, Pasta: UtensilsCrossed, Soup: Soup, Salad: Salad, Dessert: CakeSlice, Others: UtensilsCrossed,
};

function inferCategory(name: string, ingredients: string): string {
  const text = (name + ' ' + ingredients).toLowerCase();
  if (/breakfast|pancake|waffle|omelet|scramble|cereal|toast/.test(text)) return 'Breakfast';
  if (/cake|cookie|brownie|pie|ice cream|chocolate|dessert|sweet|pudding/.test(text)) return 'Dessert';
  if (/soup|stew|chowder|chili|broth/.test(text)) return 'Soup';
  if (/salad|lettuce|vinaigrette|greens/.test(text)) return 'Salad';
  if (/pasta|spaghetti|macaroni|noodle|fettuccine|penne|lasagna/.test(text)) return 'Pasta';
  if (/shrimp|fish|salmon|tuna|crab|lobster|scallop|seafood|clam/.test(text)) return 'Seafood';
  if (/chicken|turkey|poultry/.test(text)) return 'Chicken';
  if (/beef|steak|hamburger|burger|meatball/.test(text)) return 'Beef';
  if (/pork|bacon|sausage|ham/.test(text)) return 'Pork';
  return 'Others';
}

function getPopularity(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 100);
}

// ─── Main Component ─────────────────────────────────────────────────────────
export const ExploreView: React.FC<ExploreViewProps> = ({ 
  onToggleFavorite, favorites, onGainXp, onViewRecipe 
}) => {
  const [recipes, setRecipes] = useState<FilipinoDish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<FilipinoDish | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isFav = (id: string) => favorites.some(f => f.id === id);

  // ── Load recipes on mount ─────────────────────────────────────────────────
  const loadRecipes = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      if (forceRefresh) {
        recipeDataService.clearData();
      }
      const data = await recipeDataService.loadChunkedDatabase();
      
      const mappedRecipes: FilipinoDish[] = data.map((item: any) => ({
        id: item.id || '',
        name: item.name || '',
        prepTime: item.prepTime !== 'N/A' ? item.prepTime : '',
        cookTime: item.cookTime !== 'N/A' ? item.cookTime : '',
        totalTime: '',
        servings: '',
        ingredients: item.ingredients || [],
        ingredientNames: [], 
        instructions: item.instructions || [],
        description: undefined,
        source: 'TypenScrape Dataset',
        category: inferCategory(item.name || '', item.ingredients || ''),
      }));
      
      // Sort by deterministic popularity (descending)
      mappedRecipes.sort((a, b) => getPopularity(b.id) - getPopularity(a.id));
      
      setRecipes(mappedRecipes);
    } catch (err) {
      console.error('Failed to load recipes:', err);
      setError('Could not load offline database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRecipes(); }, []);

  // ── Client-side filtering ─────────────────────────────────────────────────
  const filteredRecipes = useMemo(() => {
    let result = recipes;

    if (activeCategory !== 'All') {
      result = result.filter(r => r.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.ingredientNames.some(i => i.includes(q)) ||
        r.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [recipes, searchTerm, activeCategory]);

  const handleOnlineSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsGeneratingAi(true);
    let toastId = toast.loading(`Searching Web for "${searchTerm}"...`);
    
    try {
      // 1. Try Spoonacular first
      let generated;
      try {
        generated = await searchSpoonacular(searchTerm);
        toast.success("Found on Spoonacular!", { id: toastId });
        if (onGainXp) onGainXp(15, 'Web Recipe Discovered');
      } catch (spoonErr: any) {
        console.warn('Spoonacular failed/empty, falling back to AI:', spoonErr.message);
        toast.loading(`Not on the web. AI is inventing "${searchTerm}"...`, { id: toastId });
        
        // 2. Fallback to Gemini
        generated = await generateRecipeWithGemini(
          [searchTerm], 
          "Make it exactly what the user searched for. Authentic and detailed."
        );
        toast.success("AI Chef invented it!", { id: toastId });
        if (onGainXp) onGainXp(25, 'AI Recipe Discovered');
      }

      if (generated) {
        setSelectedRecipe(generated);
        if (onViewRecipe) onViewRecipe(generated);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to search online', { id: toastId });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const parentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when filter changes
  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.scrollTop = 0;
    }
  }, [searchTerm, activeCategory]);

  const rowVirtualizer = useVirtualizer({
    count: filteredRecipes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140, // Estimated height of a recipe card
    overscan: 5,
  });

  // Recipe Detail View
  if (selectedRecipe) {
    return (
      <RecipeCard
        recipe={selectedRecipe}
        isFavorite={isFav(selectedRecipe.id)}
        onToggleFavorite={onToggleFavorite}
        onBack={() => setSelectedRecipe(null)}
        onGainXp={onGainXp}
      />
    );
  }

  // Browse View
  return (
    <div className="flex flex-col h-full font-runde animate-fade-up">
      {/* Sticky Search + Filter Header */}
      <div 
        className="shrink-0 px-4 pt-4 pb-3 space-y-3 bg-theme-panel z-20 neo-panel"
        style={{ borderBottomWidth: 'var(--theme-border-width)' }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LayoutGrid className="h-6 w-6 text-theme-primary" />
            <h2 className="text-xl font-black text-theme-text tracking-tight leading-none mt-0.5">
              Explore Recipes
            </h2>
          </div>
          <button
            onClick={() => loadRecipes(true)}
            disabled={loading}
            className="flex items-center justify-center w-8 h-8 btn-neo-sm disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 stroke-[2.5] ${loading ? 'animate-spin text-theme-primary' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-theme-icon opacity-70" />
          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isOnline && searchTerm.trim()) {
                handleOnlineSearch();
              }
            }}
            className="pl-10 pr-12 neo-card text-theme-text placeholder:text-theme-text placeholder:opacity-50 h-11 w-full focus-visible:ring-0 transition-all font-bold"
          />
          {searchTerm.trim() && isOnline && (
            <button
              onClick={handleOnlineSearch}
              disabled={isGeneratingAi}
              title="Search Online / Ask AI"
              className="absolute right-2 top-1.5 bottom-1.5 px-2 bg-theme-primary text-theme-panel border-[length:var(--theme-border-width)] border-theme-border rounded-[calc(var(--theme-radius)/2)] active:translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin stroke-[3]" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 stroke-[3]" />
              )}
            </button>
          )}
        </div>

        {/* Category filter pills - increased padding to prevent scaled buttons from being cut off by overflow */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-none py-2 px-1 -mx-1">
          {CATEGORIES.map(cat => {
            const Icon = CATEGORY_ICONS[cat] || CATEGORY_ICONS['Others'];
            const colorClass = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Others'];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-extrabold transition-all duration-200 neo-shape-sm ${colorClass} ${
                  activeCategory === cat
                    ? 'translate-x-[2px] translate-y-[2px] !shadow-none opacity-100 z-10'
                    : 'hover:-translate-y-0.5 opacity-60 hover:opacity-100 active:translate-x-[2px] active:translate-y-[2px] active:!shadow-none'
                }`}
              >
                <Icon className={`w-3.5 h-3.5`} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Recipe List ──────────────────────────────────────────── */}
      <div ref={parentRef} className="flex-1 overflow-y-auto px-4 pt-4 pb-24">

        {/* Loading skeletons */}
        {loading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-12 neo-card bg-red-50/10">
            <Wifi className="h-8 w-8 text-theme-primary mx-auto mb-2" />
            <p className="text-sm font-bold text-theme-text">{error}</p>
            <button
              onClick={() => loadRecipes()}
              className="mt-3 text-xs font-semibold text-theme-primary hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state & AI Fallback */}
        {!loading && !error && filteredRecipes.length === 0 && (
          <div className="text-center py-14 neo-card bg-theme-panel">
            <div className="w-14 h-14 bg-theme-bg flex items-center justify-center mx-auto mb-3 shadow-inner" style={{ borderRadius: 'calc(var(--theme-radius) / 2)' }}>
              <ChefHat className="h-7 w-7 text-theme-primary" />
            </div>
            <h3 className="text-sm font-extrabold text-theme-text tracking-tight mb-2">No local recipes found</h3>
            
            {isOnline && searchTerm.trim() ? (
              <p className="text-xs text-theme-text opacity-80 mt-1.5 px-4 font-bold">
                Tap the <Sparkles className="inline-block w-3.5 h-3.5 text-theme-primary mx-0.5 mb-0.5" /> button in the search bar to invent it with AI!
              </p>
            ) : (
              <p className="text-xs text-theme-text opacity-60 mt-1.5 px-4 font-bold">
                {searchTerm.trim() ? "You are currently offline. Connect to the internet to ask the AI Chef!" : "Try a different search or category"}
              </p>
            )}
          </div>
        )}

        {/* Recipe cards */}
        {!loading && !error && filteredRecipes.length > 0 && (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const recipe = filteredRecipes[virtualRow.index];
              const favoriteActive = isFav(recipe.id);
              return (
                <div
                  key={virtualRow.key}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                    paddingBottom: '16px', // Replacement for space-y-4
                  }}
                >
                  <div
                    onClick={() => {
                      setTimeout(() => {
                        setSelectedRecipe(recipe);
                        if (onViewRecipe) onViewRecipe(recipe);
                      }, 150);
                    }}
                    className="neo-card cursor-pointer overflow-hidden game-card h-full"
                  >
              <div className="p-4 pb-0">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="font-black text-theme-text text-base leading-tight mb-1 line-clamp-1 group-hover:text-theme-primary transition-colors">
                    {recipe.name}
                  </h3>
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setTimeout(() => onToggleFavorite(recipe), 150); 
                    }}
                    className="shrink-0 p-1.5 hover:bg-theme-bg rounded-full transition-colors flex items-center justify-center active:scale-90"
                  >
                    <Heart className={`h-4 w-4 stroke-[2.5] ${favoriteActive ? 'fill-theme-primary text-theme-primary' : 'text-theme-icon opacity-50'}`} />
                  </button>
                </div>

                <div className="flex items-center space-x-1.5 mt-2 mb-3">
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 neo-shape-sm text-[10px] uppercase font-black ${CATEGORY_COLORS[recipe.category] || CATEGORY_COLORS['Others']}`}>
                    <Tag className="w-3 h-3 stroke-[3]" />
                    <span>{recipe.category}</span>
                  </span>
                </div>
              </div>

              <div 
                className="flex items-center space-x-3 text-[11px] font-bold text-theme-text opacity-90 mt-3 p-3 bg-theme-bg"
                style={{ borderTopWidth: 'var(--theme-border-width)', borderTopStyle: 'solid', borderTopColor: 'var(--theme-border)' }}
              >
                {recipe.cookTime && (
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>{recipe.cookTime}</span>
                  </span>
                )}
                {recipe.servings && (
                  <span className="flex items-center space-x-1">
                    <Users className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>{recipe.servings} servings</span>
                  </span>
                )}
                <Badge variant="outline" className="ml-auto text-[10px] px-2 py-0 border-[length:var(--theme-border-width)] border-theme-border text-theme-text font-black bg-theme-panel rounded-[calc(var(--theme-radius)/2)]">
                  {recipe.ingredients.length} ingredients
                </Badge>
              </div>
            </div>
            </div>
            );
          })}
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-2" />
      </div>
    </div>
  );
};

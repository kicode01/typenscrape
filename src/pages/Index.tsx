import React, { useState, useEffect } from 'react';
import { MobileContainer } from '@/components/MobileContainer';
import { BottomNav, NavTab } from '@/components/BottomNav';
import { ExploreView } from '@/components/ExploreView';
import { FavoritesView } from '@/components/FavoritesView';
import { RecipeGenerator } from '@/components/RecipeGenerator';
import { RecipeCard } from '@/components/RecipeCard';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/contexts/AuthContext';
import { HistoryView } from '@/components/HistoryView';
import { AuthModal } from '@/components/AuthModal';
import { RoadmapModal } from '@/components/RoadmapModal';
import { ProfileModal } from '@/components/ProfileModal';
import ThemeEnvironment from '@/components/ThemeEnvironment';
import { FilipinoDish } from '@/services/filipinoRecipeService';
import { firebaseRecipeService } from '@/services/firebaseRecipeService';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Star } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const auth = useAuth();
  const user = auth.user;
  const { signInWithGoogle, signOut } = auth;
  const [activeTab, setActiveTab] = useState<NavTab>('explore');
  const [generatedRecipe, setGeneratedRecipe] = useState<FilipinoDish | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [history, setHistory] = useState<FilipinoDish[]>(() => {
    try {
      const saved = localStorage.getItem('typenscrape_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState<FilipinoDish[]>(() => {
    try {
      const saved = localStorage.getItem('typenscrape_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Gamification State
  const [userXp, setUserXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('typenscrape_xp');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const level = Math.floor(userXp / 100) + 1;
  const currentLevelXp = userXp % 100;

  useEffect(() => {
    try {
      localStorage.setItem('typenscrape_xp', userXp.toString());
    } catch (err) {
      console.warn('Failed to save xp:', err);
    }
  }, [userXp]);

  useEffect(() => {
    try {
      localStorage.setItem('typenscrape_favorites', JSON.stringify(favorites));
    } catch (err) {
      console.warn('Failed to save favorites:', err);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('typenscrape_history', JSON.stringify(history));
    } catch (err) {
      console.warn('Failed to save history:', err);
    }
  }, [history]);

  // Sync with Firestore when logged in
  useEffect(() => {
    let mounted = true;
    if (user) {
      // First load from cloud
      firebaseRecipeService.getUserData(user.uid).then(cloudData => {
        if (!mounted) return;
        if (cloudData) {
          // Merge local and cloud data to prevent losing either
          setHistory(prev => {
            const merged = [...prev];
            cloudData.history.forEach((cloudItem: any) => {
              if (!merged.some(i => i.id === cloudItem.id)) merged.push(cloudItem);
            });
            return merged;
          });
          setFavorites(prev => {
            const merged = [...prev];
            cloudData.favorites.forEach((cloudItem: any) => {
              if (!merged.some(i => i.id === cloudItem.id)) merged.push(cloudItem);
            });
            return merged;
          });

          if (cloudData.theme && cloudData.theme !== theme) {
            setTheme(cloudData.theme as any);
          }
          if (cloudData.settings) {
            updateSettings(cloudData.settings);
          }
          if (typeof cloudData.xp === 'number') {
            setUserXp(prev => Math.max(prev, cloudData.xp || 0));
          }

          toast.success('Synced with Cloud!');
        }
      });
    } else if (!auth.loading) {
      // User is explicitly logged out (not just loading)
      // Clear sensitive/account-bound data from local state
      setFavorites([]);
      setUserXp(0);
      localStorage.removeItem('typenscrape_favorites');
      localStorage.removeItem('typenscrape_xp');
    }
    return () => { mounted = false; };
  }, [user, auth.loading]);

  // Backup to cloud when data changes
  useEffect(() => {
    if (user) {
      // Debounce saving to cloud
      const timeout = setTimeout(() => {
        firebaseRecipeService.syncUserData(user.uid, history, favorites, theme, settings, userXp);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [history, favorites, user, theme, settings, userXp]);

  const handleGainXp = (amount: number, reason: string) => {
    if (!user) return; // Only allow XP gain if signed in
    setUserXp(prev => prev + amount);
    const prefix = amount > 0 ? '+' : '';
    toast.success(`${prefix}${amount} XP! ${reason}`, {
      icon: '⭐',
      duration: 3000,
    });
  };

  const handleToggleFavorite = (recipe: FilipinoDish) => {
    if (!user) {
      toast.info('Sign in to save recipes and earn XP!');
      setIsAuthModalOpen(true);
      return;
    }

    const exists = favorites.some(f => f.id === recipe.id);
    if (exists) {
      setFavorites(prev => prev.filter(f => f.id !== recipe.id));
      toast.info('Removed from saved recipes');
      handleGainXp(-10, 'Recipe Removed');
    } else {
      setFavorites(prev => [...prev, recipe]);
      toast.success('Recipe saved!');
      handleGainXp(10, 'Recipe Saved');
    }
  };

  const handleSelectFavoriteRecipe = (recipe: FilipinoDish) => {
    // Switch to explore tab — ExploreView handles its own detail view
    // For favorites, we'll handle selection within FavoritesView
    setActiveTab('explore');
  };

  return (
    <MobileContainer>
      <ThemeEnvironment />
      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="neo-panel shrink-0 z-40 px-4 py-2.5 font-runde">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-extrabold tracking-tight leading-none">
              <span className="text-theme-text">typenscrape</span>
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {user ? (
              <Button onClick={() => setTimeout(() => setIsProfileModalOpen(true), 150)} variant="ghost" size="icon" className="h-8 w-8 btn-neo-sm p-0 overflow-hidden">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email || 'User'}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
              </Button>
            ) : (
              <Button onClick={() => setTimeout(() => setIsAuthModalOpen(true), 150)} size="sm" className="h-8 text-xs font-black btn-neo-sm px-3 py-0 hover:bg-theme-primary-hover">
                <LogIn className="w-3.5 h-3.5 mr-1.5 stroke-[3]" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* XP Bar or Sign In Prompt */}
        <div className="relative h-[34px] mt-1 cursor-pointer hover:opacity-90 transition-opacity">
          {user ? (
            <div
              onClick={() => setTimeout(() => setIsRoadmapModalOpen(true), 150)}
              className="absolute inset-0 flex items-center space-x-2 neo-card game-card p-1.5 animate-in slide-in-from-top-4 fade-in duration-300"
            >
              <div className="bg-theme-primary text-theme-panel text-[10px] font-black px-1.5 py-0.5 rounded-[calc(var(--theme-radius)/2)] flex items-center shrink-0">
                <Star className="w-2.5 h-2.5 mr-0.5 fill-current" />
                LVL {level}
              </div>
              <div className="flex-1 h-2 bg-theme-bg rounded-[var(--theme-radius)] overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all duration-500 ease-out" style={{ width: `${currentLevelXp}%` }} />
              </div>
              <div className="text-[10px] font-black text-theme-icon shrink-0 min-w-[32px] text-right">
                {currentLevelXp}/100
              </div>
            </div>
          ) : (
            <div
              onClick={() => setTimeout(() => setIsAuthModalOpen(true), 150)}
              className="absolute inset-0 flex items-center justify-center space-x-2 neo-card game-card hover:bg-theme-bg cursor-pointer p-1.5 transition-colors animate-in slide-in-from-bottom-4 fade-in duration-300"
            >
              <Star className="w-3.5 h-3.5 fill-theme-primary text-theme-primary" />
              <span className="text-xs font-bold text-theme-text opacity-80">Sign in to earn XP & rewards!</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden font-runde flex flex-col">
        {activeTab === 'explore' && (
          <ExploreView
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onGainXp={handleGainXp}
            onViewRecipe={(recipe) => {
              // Add to history, removing duplicates
              setHistory(prev => {
                const filtered = prev.filter(r => r.id !== recipe.id);
                return [recipe, ...filtered].slice(0, 50); // keep last 50
              });
            }}
          />
        )}

        {activeTab === 'create' && (
          <div className="flex-1 overflow-y-auto bg-transparent">
            <div className="p-4 space-y-6">
              {!generatedRecipe ? (
                <RecipeGenerator
                  onRecipeGenerated={(recipe) => {
                    setGeneratedRecipe(recipe);
                    setHistory(prev => [recipe, ...prev]);
                  }}
                />
              ) : (
                <div className="animate-fade-up">
                  <div className="neo-card overflow-hidden h-full">
                    <RecipeCard
                      recipe={generatedRecipe}
                      isFavorite={favorites.some(f => f.id === generatedRecipe.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onBack={() => setGeneratedRecipe(null)}
                      onGainXp={handleGainXp}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            favorites={favorites}
            onSelectRecipe={handleSelectFavoriteRecipe}
            onToggleFavorite={handleToggleFavorite}
            onClearHistory={() => setHistory([])}
            onGainXp={handleGainXp}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            onSelectRecipe={handleSelectFavoriteRecipe}
            onRemoveFavorite={handleToggleFavorite}
            onGainXp={handleGainXp}
          />
        )}
      </main>

      {/* ── Bottom Nav ───────────────────────────────────────────── */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoriteCount={favorites.length}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <RoadmapModal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
        currentLevel={level}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentLevel={level}
        currentXp={currentLevelXp}
        history={history}
        stats={{
          favoritesCount: favorites.length,
          historyCount: history.length,
        }}
      />
    </MobileContainer>
  );
};

export default Index;

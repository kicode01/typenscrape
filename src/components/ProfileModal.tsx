import React, { useState } from 'react';
import { X, User as UserIcon, Star, LogOut, Bookmark, Clock, Utensils, Flame, Trophy, Award, Lock, Languages, Type, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLiteMode } from '@/hooks/useLiteMode';
import { useTheme } from '@/hooks/useTheme';
import { useSettings, CustomFont } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FilipinoDish } from '@/services/filipinoRecipeService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  currentXp: number;
  history: FilipinoDish[];
  stats: {
    favoritesCount: number;
    historyCount: number;
  };
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, onClose, currentLevel, currentXp, history, stats 
}) => {
  const { user, signOut } = useAuth();
  const { isLiteMode, setIsLiteMode } = useLiteMode();
  const { theme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const [render, setRender] = useState(isOpen);
  const [xpWidth, setXpWidth] = useState(0);
  const [pendingFont, setPendingFont] = useState<CustomFont>(settings.customFont);
  const [isSavingFont, setIsSavingFont] = useState(false);

  React.useEffect(() => {
    setPendingFont(settings.customFont);
  }, [settings.customFont]);

  const getThemeDefaultFont = () => {
    switch (theme) {
      case 'carinderia': return 'Nunito';
      case 'palengke': return 'Zilla Slab';
      case 'ihawan': return 'Space Grotesk';
      case 'fiesta': return 'Nunito';
      case 'heritage': return 'Playfair Display';
      case 'michelin': return 'Inter';
      default: return 'Nunito';
    }
  };

  const handleSaveFont = () => {
    setIsSavingFont(true);
    setTimeout(() => {
      updateSettings({ customFont: pendingFont });
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }, 500);
  };

  React.useEffect(() => {
    if (isOpen) {
      setRender(true);
      const timer = setTimeout(() => setXpWidth(currentXp), 100);
      return () => clearTimeout(timer);
    } else {
      setXpWidth(0);
      const timeout = setTimeout(() => setRender(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, currentXp]);

  if (!render) return null;

  const hasLegendary = history.some(r => r.rarity === 'Legendary');
  
  const BADGES = [
    { id: 'first_blood', name: 'First Blood', desc: 'Generated your first recipe', Icon: Utensils, unlocked: stats.historyCount > 0, color: 'text-amber-500' },
    { id: 'hoarder', name: 'Hoarder', desc: 'Saved 10 recipes', Icon: Bookmark, unlocked: stats.favoritesCount >= 10, color: 'text-blue-500' },
    { id: 'alchemist', name: 'The Alchemist', desc: 'Crafted a Legendary recipe', Icon: Flame, unlocked: hasLegendary, color: 'text-orange-500' },
    { id: 'dedicated', name: 'Dedicated', desc: 'Reached Level 10', Icon: Award, unlocked: currentLevel >= 10, color: 'text-emerald-500' },
    { id: 'master', name: 'Master Chef', desc: 'Reached Level 25', Icon: Trophy, unlocked: currentLevel >= 25, color: 'text-purple-500' },
  ];

  return (
    <div 
      className={`fixed top-0 left-0 w-full h-[100dvh] z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-sm flex flex-col overflow-y-auto max-h-[85dvh] scrollbar-none neo-card transform ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        style={{ transition: 'opacity 0.25s ease-out, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Background */}
        <div 
          className="h-24 bg-theme-primary relative shrink-0"
          style={{ borderBottomWidth: 'var(--theme-border-width)', borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}
        >
          <button 
            onClick={() => {
              setTimeout(() => onClose(), 150);
            }}
            className="absolute top-4 right-4 p-2 btn-neo-sm flex items-center justify-center text-theme-icon hover:text-theme-text transition-colors z-10"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 relative font-runde text-center flex flex-col items-center -mt-12">
          {/* Avatar */}
          <div className="w-24 h-24 neo-card flex items-center justify-center mb-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-10 h-10 text-theme-icon" />
            )}
          </div>

          {/* User Info */}
          <h2 className="text-xl font-black text-theme-text truncate w-full px-4 mb-0.5">
            {user?.displayName || 'Chef'}
          </h2>
          <div className="text-[10px] font-black uppercase tracking-widest text-theme-primary mb-1">
            {currentLevel < 5 ? 'Novice Cook' : currentLevel < 10 ? 'Line Cook' : currentLevel < 15 ? 'Sous Chef' : currentLevel < 20 ? 'Master Chef' : 'Culinary Legend'}
          </div>
          <p className="text-xs font-bold text-theme-icon mb-6 truncate w-full px-4">
            {user?.email || 'No email attached'}
          </p>

          {/* XP & Level Panel */}
          <div className="w-full neo-card p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-1.5">
                <div className="bg-theme-primary text-theme-panel text-[10px] font-black px-1.5 py-0.5 rounded border border-theme-border flex items-center shrink-0">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  LVL {currentLevel}
                </div>
              </div>
              <span className="text-[10px] font-black text-theme-icon">{currentXp}/100 XP</span>
            </div>
            <div className="w-full h-2.5 bg-theme-bg rounded-[var(--theme-radius)] border-[length:var(--theme-border-width)] border-theme-border overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-700 ease-out" 
                style={{ width: `${xpWidth}%` }} 
              />
            </div>
            <p className="text-[10px] font-bold text-theme-text opacity-70 mt-3 text-center">
              Click the XP bar on the home screen to unlock themes!
            </p>
          </div>

          {/* Stats */}
          <div className="w-full grid grid-cols-2 gap-3 mb-6">
            <div className="neo-card p-3 flex flex-col items-center">
              <Bookmark className="w-5 h-5 text-theme-primary mb-1 stroke-[2.5]" />
              <span className="text-[10px] font-bold text-theme-icon uppercase tracking-wider mb-0.5">Saved</span>
              <span className="text-lg font-black text-theme-text">{stats.favoritesCount}</span>
            </div>
            <div className="neo-card p-3 flex flex-col items-center">
              <Clock className="w-5 h-5 text-theme-primary mb-1 stroke-[2.5]" />
              <span className="text-[10px] font-bold text-theme-icon uppercase tracking-wider mb-0.5">History</span>
              <span className="text-lg font-black text-theme-text">{stats.historyCount}</span>
            </div>
          </div>

          {/* Badges Section */}
          <div className="w-full mb-6 text-left">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-theme-icon mb-3 px-1">Badges</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory px-1">
              {BADGES.map(badge => (
                <div 
                  key={badge.id}
                  className={`shrink-0 w-24 flex flex-col items-center justify-center p-3 neo-shape-sm snap-center transition-all ${
                    badge.unlocked 
                      ? 'bg-theme-panel border-theme-border opacity-100' 
                      : 'bg-theme-bg border-theme-icon border-dashed opacity-50 grayscale'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center mb-2 ${badge.unlocked ? 'bg-theme-bg' : ''}`} style={{ borderRadius: 'calc(var(--theme-radius) / 2)' }}>
                    {badge.unlocked ? (
                      <badge.Icon className={`w-5 h-5 stroke-[2.5] ${badge.color}`} />
                    ) : (
                      <Lock className="w-5 h-5 stroke-[2.5] text-theme-icon" />
                    )}
                  </div>
                  <span className="text-[10px] font-black text-theme-text text-center leading-tight mb-1">{badge.name}</span>
                  <span className="text-[8px] font-bold text-theme-icon text-center leading-tight">{badge.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Section */}
          <div className="w-full neo-card p-4 mb-6 flex flex-col gap-4 text-left relative z-20">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-theme-icon px-1">Settings</h3>
            
            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <h4 className="text-xs font-black text-theme-text uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-blue-500" />
                  Language
                </h4>
                <p className="text-[10px] text-theme-icon font-bold leading-tight">
                  English or Tagalog for AI recipes.
                </p>
              </div>
              <Switch 
                checked={settings.language === 'fil'} 
                onCheckedChange={(checked) => updateSettings({ language: checked ? 'fil' : 'en' })} 
                className="data-[state=checked]:bg-theme-primary data-[state=unchecked]:bg-theme-border shrink-0"
              />
            </div>

            {/* Custom Font */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between w-full">
                <div>
                  <h4 className="text-xs font-black text-theme-text uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-emerald-500" />
                    Custom Font
                  </h4>
                  <p className="text-[10px] text-theme-icon font-bold leading-tight">
                    Override current theme font.
                  </p>
                </div>
                {pendingFont !== settings.customFont && (
                  <Button 
                    onClick={handleSaveFont}
                    disabled={isSavingFont}
                    className="h-7 px-3 bg-theme-primary text-theme-panel hover:opacity-90 active:scale-95 text-[10px] font-black neo-shape-sm shrink-0"
                  >
                    {isSavingFont ? <Loader2 className="w-3 h-3 animate-spin stroke-[3]" /> : 'Save & Reload'}
                  </Button>
                )}
              </div>
              <div className="w-full relative">
                <select
                  value={pendingFont}
                  onChange={(e) => setPendingFont(e.target.value as CustomFont)}
                  className="w-full h-9 px-3 appearance-none bg-theme-bg border-[length:var(--theme-border-width)] border-theme-border text-xs font-bold text-theme-text rounded focus:outline-none focus:ring-2 focus:ring-theme-primary cursor-pointer relative"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  <option value="theme-default">Theme Default ({getThemeDefaultFont()})</option>
                  <option value="Inter">Inter</option>
                  <option value="Nunito">Nunito</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Space Grotesk">Space Grotesk</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Orbitron">Orbitron</option>
                  <option value="Zilla Slab">Zilla Slab</option>
                </select>
                
                {/* Font Preview Box */}
                <div 
                  className="mt-3 p-3 rounded bg-theme-panel border border-dashed border-theme-border flex flex-col gap-1 overflow-hidden"
                >
                  <span className="text-[9px] font-black uppercase text-theme-icon tracking-widest">Preview</span>
                  <p 
                    className="text-sm text-theme-text truncate"
                    style={{ 
                      fontFamily: pendingFont === 'theme-default' 
                        ? 'var(--theme-font)' 
                        : `"${pendingFont}", sans-serif` 
                    }}
                  >
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
              </div>
            </div>

            {/* Lite Mode Toggle */}
            <div className="flex items-center justify-between pt-2 border-t-[length:var(--theme-border-width)] border-theme-border/30">
              <div className="pr-4">
                <h4 className="text-xs font-black text-theme-text uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  Lite Mode
                </h4>
                <p className="text-[10px] text-theme-icon font-bold leading-tight">
                  Reduces animations and blurs.
                </p>
              </div>
              <Switch 
                checked={isLiteMode} 
                onCheckedChange={setIsLiteMode} 
                className="data-[state=checked]:bg-theme-primary data-[state=unchecked]:bg-theme-border shrink-0"
              />
            </div>
          </div>


          {/* Log Out */}
          <button 
            onClick={() => {
              setTimeout(() => {
                signOut();
                onClose();
              }, 150);
            }}
            className="w-full h-11 font-black btn-neo-sm flex items-center justify-center uppercase tracking-wider text-theme-text"
          >
            <LogOut className="w-4 h-4 mr-2 stroke-[3]" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

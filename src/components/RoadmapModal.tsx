import React, { useState } from 'react';
import { X, Star, Map, Lock, CheckCircle2, Palette } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
}

const TIERS = [
  { level: 1, name: 'The Carinderia', theme: 'carinderia', description: 'Warm, local, and bustling starter kitchen.' },
  { level: 4, name: 'The Palengke', theme: 'palengke', description: 'Vibrant, earthy, and chaotic fresh market.' },
  { level: 8, name: 'Midnight Ihawan', theme: 'ihawan', description: 'Smoky, neon-lit street barbecue stand.' },
  { level: 12, name: 'Barrio Fiesta', theme: 'fiesta', description: 'Bright, festive, and colorful town celebration.' },
  { level: 16, name: 'Heritage Kitchen', theme: 'heritage', description: 'Classic mahogany, ancestral heirlooms, and rich spices.' },
  { level: 20, name: 'Michelin Manila', theme: 'michelin', description: 'Sleek, minimalist, and ultra-modern fine dining.' },
];

const THEME_PREVIEWS: Record<string, { bg: string; panel: string; border: string; primary: string; text: string; font: string; radius: string }> = {
  carinderia: { bg: '#FAFAF9', panel: '#FFFFFF', border: '#1C1917', primary: '#F97316', text: '#292524', font: '"Nunito", sans-serif', radius: '12px' },
  palengke: { bg: '#F0F4EC', panel: '#FFFFFF', border: '#2C5234', primary: '#10B981', text: '#1F3824', font: '"Zilla Slab", serif', radius: '16px' },
  ihawan: { bg: '#1C1917', panel: '#292524', border: '#44403C', primary: '#D97706', text: '#FAFAF9', font: '"Space Grotesk", sans-serif', radius: '12px' },
  fiesta: { bg: '#FEF9C3', panel: '#FFFFFF', border: '#0F766E', primary: '#EC4899', text: '#1E3A8A', font: '"Nunito", sans-serif', radius: '28px' },
  heritage: { bg: '#FDFBF7', panel: '#FFFDF9', border: 'rgba(69, 26, 3, 0.1)', primary: '#451A03', text: '#291002', font: '"Playfair Display", serif', radius: '4px' },
  michelin: { bg: '#FAFAFA', panel: '#F5F5F5', border: 'rgba(0, 0, 0, 0.1)', primary: '#000000', text: '#000000', font: '"Inter", sans-serif', radius: '24px' },
};


export const RoadmapModal: React.FC<RoadmapModalProps> = ({ isOpen, onClose, currentLevel }) => {
  const { setTheme, theme: activeTheme } = useTheme();
  const [render, setRender] = useState(isOpen);

  React.useEffect(() => {
    if (isOpen) {
      setRender(true);
    } else {
      const timeout = setTimeout(() => setRender(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!render) return null;

  const handleEquip = (themeKey: string, levelReq: number) => {
    if (currentLevel >= levelReq) {
      setTheme(themeKey as any);
      toast.success(`Equipped ${themeKey} theme!`);
    } else {
      toast.error(`You need to reach Level ${levelReq} to unlock this theme.`);
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 w-full h-[100dvh] z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md max-h-[85dvh] flex flex-col overflow-hidden neo-card transform ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        style={{ transition: 'opacity 0.25s ease-out, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="shrink-0 relative z-10 pt-6 px-6 pb-4 text-center"
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
          
          <div className="w-12 h-12 mx-auto bg-theme-primary flex items-center justify-center mb-4 neo-shape-sm">
            <Palette className="w-6 h-6 text-theme-panel stroke-[2.5]" />
          </div>
          
          <h2 className="text-2xl font-black text-theme-text tracking-tight">
            typenthemes
          </h2>
          <p className="text-sm font-bold text-theme-icon mt-1">
            Current Level: <span className="text-theme-primary">LVL {currentLevel}</span>
          </p>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-runde">
          {TIERS.map((tier, index) => {
            const isUnlocked = currentLevel >= tier.level;
            const isEquipped = activeTheme === tier.theme;

            return (
              <div 
                key={tier.theme}
                className={`relative p-4 neo-card transition-all ${
                  isUnlocked 
                    ? '' 
                    : 'opacity-80 border-opacity-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 text-[10px] font-black neo-card ${
                      isUnlocked 
                        ? 'bg-theme-primary text-theme-panel' 
                        : 'bg-theme-bg text-theme-icon border-opacity-50'
                    }`}>
                      LVL {tier.level}
                    </span>
                    <h3 className={`font-extrabold text-lg leading-none ${isUnlocked ? 'text-theme-text' : 'text-theme-icon'}`}>
                      {tier.name}
                    </h3>
                  </div>
                  {!isUnlocked && <Lock className="w-5 h-5 text-theme-icon opacity-50" />}
                </div>
                <p className={`text-xs font-semibold mb-4 ${isUnlocked ? 'text-theme-text opacity-80' : 'text-theme-icon'}`}>
                  {tier.description}
                </p>

                {/* Preview Box */}
                {!isEquipped && (
                  <div 
                    className={`mb-4 overflow-hidden flex flex-col relative ${isUnlocked ? '' : 'grayscale opacity-60'}`}
                    style={{
                      backgroundColor: THEME_PREVIEWS[tier.theme]?.bg || '#FAFAF9',
                      color: THEME_PREVIEWS[tier.theme]?.text || '#292524',
                      borderRadius: THEME_PREVIEWS[tier.theme]?.radius || '12px',
                      border: `1px solid ${THEME_PREVIEWS[tier.theme]?.border || '#1C1917'}`,
                      fontFamily: THEME_PREVIEWS[tier.theme]?.font || '"Nunito", sans-serif',
                    }}
                  >
                    <div className="px-3 py-1.5 text-[9px] font-black opacity-80 uppercase tracking-widest border-b flex items-center justify-between" style={{ borderColor: THEME_PREVIEWS[tier.theme]?.border, backgroundColor: THEME_PREVIEWS[tier.theme]?.panel }}>
                      <span>Preview</span>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex flex-col pr-2">
                        <span className="text-sm font-extrabold leading-tight tracking-tight mb-0.5">Sample Recipe</span>
                        <span className="text-[10px] font-semibold opacity-70 leading-tight">Visual style for this theme.</span>
                      </div>
                      <div className="px-2 py-1 text-[10px] font-black rounded shrink-0 uppercase" style={{ backgroundColor: THEME_PREVIEWS[tier.theme]?.primary, color: THEME_PREVIEWS[tier.theme]?.bg }}>
                        Cook
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  {isUnlocked ? (
                    <button 
                      onClick={() => {
                        setTimeout(() => handleEquip(tier.theme, tier.level), 150);
                      }}
                      className={`h-9 px-4 font-black uppercase tracking-wider transition-all neo-shape-sm flex items-center justify-center ${
                        isEquipped 
                          ? 'bg-theme-bg text-theme-text shadow-none opacity-80' 
                          : 'btn-neo'
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1.5 stroke-[3]" /> Equipped
                        </>
                      ) : (
                        'Equip Theme'
                      )}
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="h-9 px-4 font-black uppercase tracking-wider bg-theme-bg text-theme-icon opacity-50 neo-shape-sm border-opacity-50 cursor-not-allowed flex items-center justify-center"
                    >
                      Locked
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

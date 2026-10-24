import React from 'react';
import { Compass, Bookmark, Sparkles, Clock } from 'lucide-react';

export type NavTab = 'explore' | 'create' | 'favorites' | 'history';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  favoriteCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, favoriteCount = 0 }) => {
  const navItems = [
    { id: 'explore'   as NavTab, label: 'Explore',  icon: Compass },
    { id: 'create'    as NavTab, label: 'Create',   icon: Sparkles },
    { id: 'history'   as NavTab, label: 'History',  icon: Clock },
    { id: 'favorites' as NavTab, label: 'Saved',    icon: Bookmark },
  ];

  return (
    <nav 
      className="shrink-0 z-50 bg-theme-panel pb-safe"
      style={{ borderTopWidth: 'var(--theme-border-width)', borderTopStyle: 'solid', borderTopColor: 'var(--theme-border)' }}
    >
      <div className="px-2 h-16 flex items-center justify-around font-runde">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-12 transition-all duration-200 touch-active border-[length:var(--theme-border-width)] rounded-[var(--theme-radius)] mx-1 ${
                isActive
                  ? 'bg-theme-primary border-theme-border shadow-[var(--theme-box-shadow)] text-theme-panel translate-y-[-2px]'
                  : 'border-transparent text-theme-icon hover:text-theme-text hover:bg-theme-bg opacity-70 hover:opacity-100'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-all duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[2.5]'}`} />

              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight font-black ${isActive ? 'text-theme-panel' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

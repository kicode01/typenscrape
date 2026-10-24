import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label="Toggle Theme"
      className="h-8 w-8 rounded-xl text-theme-icon hover:bg-theme-panel hover:text-theme-text transition-all duration-200 touch-active border border-theme-border/50"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-orange-600 transition-transform duration-300 hover:-rotate-12" />
      )}
    </Button>
  );
};

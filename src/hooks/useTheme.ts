import { useState, useEffect } from 'react';

export type ThemeMode = 'carinderia' | 'palengke' | 'ihawan' | 'fiesta' | 'heritage' | 'michelin';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('typenscrape_theme') as ThemeMode;
      // Map old 'hearth' theme to 'carinderia' to avoid breaking existing setups
      if (saved === 'hearth' as any) return 'carinderia';
      return saved || 'carinderia';
    } catch {
      return 'carinderia';
    }
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('typenscrape_theme', newTheme);
      window.dispatchEvent(new Event('typenscrape_themechange'));

      // Also reset custom font when theme changes
      const settingsStr = localStorage.getItem('typenscrape_settings');
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        if (settings.customFont !== 'theme-default') {
          settings.customFont = 'theme-default';
          localStorage.setItem('typenscrape_settings', JSON.stringify(settings));
          window.dispatchEvent(new Event('typenscrape_settingschange'));
        }
      }
    } catch (e) {
      console.warn('Failed to save theme', e);
    }
  };

  useEffect(() => {
    const handleThemeChange = () => {
      try {
        const saved = localStorage.getItem('typenscrape_theme') as ThemeMode;
        if (saved && saved !== theme) {
          setThemeState(saved);
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('typenscrape_themechange', handleThemeChange);
    return () => {
      window.removeEventListener('typenscrape_themechange', handleThemeChange);
    };
  }, [theme]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, setTheme, isDark: false };
}

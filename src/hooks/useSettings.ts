import { useState, useEffect } from 'react';

export type Language = 'en' | 'fil';
export type CustomFont = 'theme-default' | 'Inter' | 'Nunito' | 'Playfair Display' | 'Space Grotesk' | 'Roboto' | 'Orbitron' | 'Zilla Slab';

interface SettingsState {
  language: Language;
  customFont: CustomFont;
}

export function useSettings() {
  const [settings, setSettingsState] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem('typenscrape_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return { language: 'en', customFont: 'theme-default' };
  });

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettingsState(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('typenscrape_settings', JSON.stringify(updated));
        window.dispatchEvent(new Event('typenscrape_settingschange'));
      } catch (e) {
        console.warn('Failed to save settings', e);
      }
      return updated;
    });
  };

  // Sync state across tabs / hooks
  useEffect(() => {
    const handleSettingsChange = () => {
      try {
        const saved = localStorage.getItem('typenscrape_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettingsState(prev => {
            if (prev.language !== parsed.language || prev.customFont !== parsed.customFont) {
              return parsed;
            }
            return prev;
          });
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('typenscrape_settingschange', handleSettingsChange);
    return () => {
      window.removeEventListener('typenscrape_settingschange', handleSettingsChange);
    };
  }, []);

  // Apply custom font to document body
  useEffect(() => {
    if (settings.customFont && settings.customFont !== 'theme-default') {
      document.body.style.setProperty('--theme-font', `"${settings.customFont}", sans-serif`);
    } else {
      document.body.style.removeProperty('--theme-font');
    }
  }, [settings.customFont]);

  return { settings, updateSettings };
}

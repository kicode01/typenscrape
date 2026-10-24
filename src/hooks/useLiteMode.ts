import { useState, useEffect } from 'react';

export function useLiteMode() {
  const [isLiteMode, setIsLiteModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('typenscrape_litemode') === 'true';
    } catch {
      return false;
    }
  });

  const setIsLiteMode = (enabled: boolean) => {
    setIsLiteModeState(enabled);
    try {
      localStorage.setItem('typenscrape_litemode', String(enabled));
      window.dispatchEvent(new Event('typenscrape_litemodechange'));
    } catch (e) {
      console.warn('Failed to save lite mode', e);
    }
  };

  useEffect(() => {
    const handleLiteModeChange = () => {
      try {
        const saved = localStorage.getItem('typenscrape_litemode') === 'true';
        if (saved !== isLiteMode) {
          setIsLiteModeState(saved);
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('typenscrape_litemodechange', handleLiteModeChange);
    return () => {
      window.removeEventListener('typenscrape_litemodechange', handleLiteModeChange);
    };
  }, [isLiteMode]);

  useEffect(() => {
    if (isLiteMode) {
      document.body.classList.add('lite-mode');
    } else {
      document.body.classList.remove('lite-mode');
    }
  }, [isLiteMode]);

  return { isLiteMode, setIsLiteMode };
}

import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Theme } from '../types';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('focusflow-theme', 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}
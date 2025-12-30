import { useState, useEffect } from 'react';
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('vilanow_theme');
    // Default to dark mode for luxury brand
    return stored ? stored === 'dark' : true;
  });
  useEffect(() => {
    const root = document.documentElement;

    // Add transition disable class to prevent flash
    root.classList.add('theme-transition-disable');
    if (isDark) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('vilanow_theme', isDark ? 'dark' : 'light');

    // Re-enable transitions after a brief delay
    setTimeout(() => {
      root.classList.remove('theme-transition-disable');
    }, 50);
  }, [isDark]);
  const toggleTheme = () => setIsDark(!isDark);
  return {
    isDark,
    toggleTheme
  };
}
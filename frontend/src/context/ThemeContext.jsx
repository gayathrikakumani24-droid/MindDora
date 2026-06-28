import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('minddora_theme');
    if (saved) return saved;
    // Default to dark theme for premium aesthetics
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0b0f19'; // Slick premium deep slate dark bg
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '';
    }
    localStorage.setItem('minddora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

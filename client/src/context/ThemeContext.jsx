import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState('light');

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    setIsDarkMode(initialTheme === 'dark');
    
    // Apply theme to document
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (themeMode) => {
    const htmlElement = document.documentElement;
    
    if (themeMode === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const newIsDarkMode = newTheme === 'dark';
    
    setTheme(newTheme);
    setIsDarkMode(newIsDarkMode);
    
    // Persist to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Apply to document
    applyTheme(newTheme);
  };

  const setLightMode = () => {
    setTheme('light');
    setIsDarkMode(false);
    localStorage.setItem('theme', 'light');
    applyTheme('light');
  };

  const setDarkMode = () => {
    setTheme('dark');
    setIsDarkMode(true);
    localStorage.setItem('theme', 'dark');
    applyTheme('dark');
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        theme,
        toggleTheme,
        setLightMode,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
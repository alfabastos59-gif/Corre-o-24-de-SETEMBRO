import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'emerald' | 'dark' | 'ocean' | 'kinetic' | 'purple' | 'light';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isKinetic: boolean;
  isClassicDark: boolean;
  isOcean: boolean;
  isPurple: boolean;
  isEmerald: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Tema único e padronizado em ROXO (Creative Purple)
  const theme: AppTheme = 'purple';

  useEffect(() => {
    localStorage.setItem('bmq_theme', 'purple');
    const root = document.documentElement;
    root.classList.remove('light', 'kinetic', 'ocean', 'emerald');
    root.classList.add('purple', 'dark');
    document.body.style.backgroundColor = '#13072b';
    document.body.style.color = '#f5f3ff';
  }, []);

  const toggleTheme = () => {
    // Tema fixo em roxo
  };

  const setTheme = () => {
    // Tema fixo em roxo
  };

  // Tema fixo: Roxo Escuro Criativo
  const isDark = true;
  const isEmerald = false;
  const isPurple = true;
  const isKinetic = false;
  const isClassicDark = false;
  const isOcean = false;
  const isLight = false;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark,
        isKinetic,
        isClassicDark,
        isOcean,
        isPurple,
        isEmerald,
        isLight,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const defaultThemeValue: ThemeContextType = {
  theme: 'purple',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: true,
  isKinetic: false,
  isClassicDark: false,
  isOcean: false,
  isPurple: true,
  isEmerald: false,
  isLight: false,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultThemeValue;
  }
  return context;
};


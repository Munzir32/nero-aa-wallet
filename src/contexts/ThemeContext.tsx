import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BusinessTheme, BUSINESS_THEMES } from '@/types/Pos';

interface ThemeContextType {
  currentTheme: BusinessTheme;
  businessType: string;
  setBusinessType: (type: string) => void;
  getTheme: (type: string) => BusinessTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultBusinessType?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultBusinessType = 'market' 
}) => {
  const [businessType, setBusinessType] = useState(defaultBusinessType);

  const getTheme = (type: string): BusinessTheme => {
    return BUSINESS_THEMES[type] || BUSINESS_THEMES.market;
  };

  const currentTheme = getTheme(businessType);

  const value: ThemeContextType = {
    currentTheme,
    businessType,
    setBusinessType,
    getTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 
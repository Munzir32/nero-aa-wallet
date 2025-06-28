import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { BUSINESS_THEMES } from '@/types/Pos';
import { ThemedCard } from './ThemedCard';

export const ThemeSwitcher: React.FC = () => {
  const { businessType, setBusinessType, currentTheme } = useTheme();

  const businessTypes = Object.keys(BUSINESS_THEMES);

  return (
    <ThemedCard variant="outlined" className="mb-4">
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900 dark:text-white">
          Business Theme
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {businessTypes.map((type) => {
            const theme = BUSINESS_THEMES[type];
            const isActive = businessType === type;
            
            return (
              <button
                key={type}
                onClick={() => setBusinessType(type)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                  isActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                style={isActive ? { borderColor: currentTheme.primaryColor } : {}}
              >
                <span className="text-xl">{theme.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Current theme: {currentTheme.name}
        </div>
      </div>
    </ThemedCard>
  );
}; 
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { ThemeSwitcher } from '../components/ui/ThemeSwitcher';
import { ThemedCard } from '../components/ui/ThemedCard';
import { ThemedButton } from '../components/ui/ThemedButton';
import { ThemedHeader } from '../components/ui/ThemedHeader';
import { ThemedStatus } from '../components/ui/ThemedStatus';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeDemoPage: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <ThemedHeader
          title="Theme Demo"
          subtitle="Test different business themes"
          showBusinessIcon={true}
          size="lg"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Theme Switcher */}
          <ThemedCard variant="elevated" padding="lg">
            <h2 className="text-xl font-bold mb-4">Theme Selection</h2>
            <ThemeSwitcher />
          </ThemedCard>

          {/* Theme Preview */}
          <ThemedCard variant="outlined" padding="lg">
            <h2 className="text-xl font-bold mb-4">Current Theme Preview</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Theme: {currentTheme.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{currentTheme.icon}</span>
                  <div className="flex space-x-2">
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: currentTheme.primaryColor }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: currentTheme.secondaryColor }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: currentTheme.accentColor }}
                    ></div>
                  </div>
                </div>
              </div>

              <ThemedButton variant="primary" fullWidth>
                Primary Button
              </ThemedButton>

              <ThemedButton variant="secondary" fullWidth>
                Secondary Button
              </ThemedButton>

              <ThemedButton variant="outline" fullWidth>
                Outline Button
              </ThemedButton>

              <ThemedStatus
                type="info"
                message="This is an info message with the current theme"
              />

              <ThemedStatus
                type="success"
                message="Success message with theme colors"
              />
            </div>
          </ThemedCard>
        </div>

        {/* Instructions */}
        <ThemedCard className="mt-6">
          <h2 className="text-xl font-bold mb-4">How to Set Your Theme</h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>1. Go to <strong>Settings</strong> page</p>
            <p>2. Select your preferred <strong>Business Theme</strong></p>
            <p>3. Save your settings</p>
            <p>4. Your theme will be stored in IPFS and automatically loaded when you log in</p>
          </div>
        </ThemedCard>
      </div>
    </Layout>
  );
}; 
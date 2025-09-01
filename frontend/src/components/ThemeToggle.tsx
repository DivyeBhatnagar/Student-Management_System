import { useState } from 'react';
import { NeuButton } from './ui/NeumorphismComponents';

interface ThemeToggleProps {
  onThemeChange: (theme: 'regular' | 'neumorphic') => void;
}

function ThemeToggle({ onThemeChange }: ThemeToggleProps) {
  const [currentTheme, setCurrentTheme] = useState<'regular' | 'neumorphic'>('regular');

  const handleToggle = () => {
    const newTheme = currentTheme === 'regular' ? 'neumorphic' : 'regular';
    setCurrentTheme(newTheme);
    onThemeChange(newTheme);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {currentTheme === 'neumorphic' ? (
        <NeuButton onClick={handleToggle} className="flex items-center space-x-2">
          <span>🎨</span>
          <span>Switch to Regular</span>
        </NeuButton>
      ) : (
        <button
          onClick={handleToggle}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <span>✨</span>
          <span>Try Neumorphism</span>
        </button>
      )}
    </div>
  );
}

export default ThemeToggle;

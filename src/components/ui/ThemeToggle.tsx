// src/components/ui/ThemeToggle.tsx
import React from 'react';
import { Button, Tooltip } from 'antd';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleMode, isDark } = useTheme();

  return (
    <Tooltip title={`Alternar para modo ${isDark ? 'claro' : 'escuro'}`}>
      <Button
        type="text"
        icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
        onClick={toggleMode}
        className="flex items-center justify-center hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
        size="large"
      />
    </Tooltip>
  );
};
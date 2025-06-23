// src/components/ui/ThemeToggle.tsx
import React from 'react';
import { Button, Tooltip } from 'antd';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { toggleMode, isDark } = useTheme();

  return (
    <Tooltip title={`Alternar para modo ${isDark ? "claro" : "escuro"}`}>
      {" "}
      <Button
        type="text"
        icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
        onClick={toggleMode}
        className={`flex items-center justify-center transition-colors ${
          isDark
            ? "text-gray-400 hover:text-green-400 hover:bg-gray-800"
            : "text-gray-500 hover:text-green-500 hover:bg-gray-100"
        }`}
        size="large"
      />
    </Tooltip>
  );
};
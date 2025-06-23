// src/hooks/useThemeColors.ts
import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeColors, type ThemeColors } from '@/libs/theme';

export const useThemeColors = (): ThemeColors => {
  const { isDark } = useTheme();
  
  return useMemo(() => getThemeColors(isDark), [isDark]);
};

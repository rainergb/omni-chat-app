// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  isDark: boolean;
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
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme-mode", mode);
    document.documentElement.setAttribute("data-theme", mode);

    // Apply theme class to body for better CSS variable support
    if (mode === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const antdTheme = {
    algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: "#3b82f6",
      colorSuccess: "#10b981",
      colorWarning: "#f59e0b",
      colorError: "#ef4444",
      borderRadius: 8,
      borderRadiusLG: 12,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: 14,
      lineHeight: 1.6,
      controlHeight: 40,
      controlHeightLG: 48,
      wireframe: false
    },
    components: {
      Layout: {
        bodyBg: mode === "dark" ? "#0f172a" : "#ffffff",
        headerBg: mode === "dark" ? "#1e293b" : "#ffffff",
        siderBg: mode === "dark" ? "#1e293b" : "#ffffff"
      },
      Card: {
        borderRadius: 12,
        paddingLG: 24,
        boxShadowTertiary:
          mode === "dark"
            ? "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.4)"
            : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
      },
      Button: {
        borderRadius: 8,
        controlHeight: 40,
        controlHeightLG: 48,
        fontWeight: 500
      },
      Modal: {
        borderRadius: 12,
        paddingLG: 24
      },
      Input: {
        borderRadius: 8,
        controlHeight: 40,
        controlHeightLG: 48
      },
      Select: {
        borderRadius: 8,
        controlHeight: 40,
        controlHeightLG: 48
      },
      Tabs: {
        borderRadius: 8,
        horizontalMargin: "0 0 16px 0"
      },
      Badge: {
        borderRadius: 10
      },
      Alert: {
        borderRadius: 8,
        paddingContentHorizontalLG: 20
      },
      Segmented: {
        borderRadius: 8,
        controlPaddingHorizontal: 16
      }
    }
  };

  const value = {
    mode,
    toggleMode,
    isDark: mode === "dark"
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antdTheme}>
        <div
          className={`min-h-screen transition-all duration-300 ${
            mode === "dark" ? "dark" : "light"
          }`}
        >
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
// src/components/layout/MainLayout.tsx
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import MainTabs from "./MainTabs";

export const MainLayout: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {" "}
      {/* Header */}
      <header
        className={`transition-colors duration-300 border-b sticky top-0 z-10 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Controles do header */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
              <ThemeToggle />

              <div
                className={`hidden sm:block h-6 sm:h-8 w-px ${
                  isDark ? "bg-gray-600" : "bg-gray-200"
                }`}
              />

              <div
                className={`hidden xl:block px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                  isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                v1.0.0
              </div>
            </div>
          </div>
        </div>
      </header>{" "}
      {/* Main Content */}
      <main className="h-[calc(100vh-73px)] sm:h-[calc(100vh-81px)] overflow-hidden">
        <div className="h-full max-w-7xl mx-auto">
          <MainTabs />
        </div>
      </main>
    </div>
  );
};
// src/components/layout/StatsBar.tsx
import React from "react";
import { Clock } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

interface StatsBarProps {
  stats: StatItem[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const { isDark } = useTheme();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 overflow-x-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <span className={stat.color}>{stat.icon}</span>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {stat.label}:
              </span>
              <span
                className={`font-semibold ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
        <div
          className={`text-xs px-2 py-1 rounded-full ${
            isDark
              ? "bg-gray-800 text-gray-400"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <Clock size={12} className="inline mr-1" />
          Atualizado agora
        </div>
      </div>
    </div>
  );
};

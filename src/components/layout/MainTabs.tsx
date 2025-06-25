import React from "react";
import { TabContent } from "./TabContent";
import { useInstancesData } from "@/hooks/useInstancesData";
import { useTheme } from "@/contexts/ThemeContext";

const MainTabs: React.FC = () => {
  const { isDark } = useTheme();

  const { content } = useInstancesData();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:to-gray-800">
      <div
        className={`
        border-b backdrop-blur-sm sticky top-0 z-40
        ${
          isDark
            ? "bg-gray-900/95 border-gray-800"
            : "bg-white/95 border-gray-200"
        }
      `}
      ></div>

      <TabContent>{content}</TabContent>
    </div>
  );
};

export default MainTabs;

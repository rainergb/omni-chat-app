// src/components/layout/TabContent.tsx
import React from "react";

interface TabContentProps {
  children: React.ReactNode;
}

export const TabContent: React.FC<TabContentProps> = ({ children }) => {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full animate-fade-in">{children}</div>
    </div>
  );
};

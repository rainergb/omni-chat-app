// src/components/layout/MainLayout.tsx
import React from "react";
import { Layout } from "antd";
import MainTabs from "./MainTabs";

const { Content } = Layout;

export const MainLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      {/* Main Content */}
      <Content className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto">
          <MainTabs />
        </div>
      </Content>
    </Layout>
  );
};
// src/components/layout/MainLayout.tsx
import React from "react";
import { Layout } from "antd";
import { useNavigation } from "@/contexts/NavigationContext";
import { Chatpage } from "@/components/chatpage/Chatpage";
import { InstancesPage } from "@/components/instances/Instance";

const { Content } = Layout;

export const MainLayout: React.FC = () => {
  const { activeTab } = useNavigation();

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <Chatpage />;
      case "instances":
        return <InstancesPage />;
      default:
        return <InstancesPage />;
    }
  };
  return (
    <Layout
      className="flex-1"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      {/* Main Content */}
      <Content className="flex-1 overflow-hidden">
        <div className="h-full w-full">{renderContent()}</div>
      </Content>
    </Layout>
  );
};
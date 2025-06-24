// src/components/layout/MainLayout.tsx
import React from "react";
import { Layout } from "antd";
import { useNavigation } from "@/contexts/NavigationContext";
import { Chatpage } from "@/components/chatpage/Chatpage";
import { InstancesPage } from "@/components/instances/Instance";
import { Footer } from "./Footer";

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
      className="min-h-screen"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Main Content */}
      <Content
        className="flex-1 overflow-hidden"
        style={{
          height: activeTab === "chat" ? "100%" : "auto",
          padding: activeTab === "chat" ? "0" : "1.5rem",
          flex: 1
        }}
      >
        <div
          className={
            activeTab === "chat" ? "h-full" : "h-full max-w-7xl mx-auto"
          }
          style={{ height: "100%" }}
        >
          {renderContent()}
        </div>
      </Content>

      {/* Footer apenas aparece quando não está no chat */}
      {activeTab !== "chat" && <Footer />}
    </Layout>
  );
};
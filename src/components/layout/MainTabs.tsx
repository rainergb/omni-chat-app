import React, { useState } from "react";
import { Tabs, Badge } from "antd";
import { AppstoreOutlined, MessageOutlined } from "@ant-design/icons";
import { InstanceList } from "@/components/instances/InstanceList";
import { useInstanceStore } from "@/store/instanceStore";

const { TabPane } = Tabs;

export const MainTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("instances");
  const { instances } = useInstanceStore();

  const connectedInstances = instances.filter(
    (i) => i.status === "connected"
  ).length;
  const totalMessages = instances.reduce((acc, i) => acc + i.messagesCount, 0);

  const handleOpenChat = (instanceId: string) => {
    setActiveTab("chat");
    // Aqui implementaremos a lógica para abrir o chat específico
    console.log("Abrindo chat para instância:", instanceId);
  };

  const tabItems = [
    {
      key: "instances",
      label: (
        <span className="flex items-center space-x-2">
          <AppstoreOutlined />
          <span>Instâncias</span>
          <Badge
            count={connectedInstances}
            size="small"
            color="green"
            title={`${connectedInstances} instância(s) conectada(s)`}
          />
        </span>
      ),
      children: <InstanceList onOpenChat={handleOpenChat} />
    },
    {
      key: "chat",
      label: (
        <span className="flex items-center space-x-2">
          <MessageOutlined />
          <span>Chat</span>
          <Badge
            count={totalMessages > 999 ? "999+" : totalMessages}
            size="small"
            title={`${totalMessages} mensagem(s) total`}
          />
        </span>
      ),
      children: (
        <div className="p-6 text-center">
          <div className="bg-gray-50 rounded-lg p-12">
            <MessageOutlined className="text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chat em Desenvolvimento
            </h3>
            <p className="text-gray-500">
              A funcionalidade de chat será implementada em breve.
              <br />
              Por enquanto, gerencie suas instâncias na aba "Instâncias".
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="h-full">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        className="h-full"
        tabBarStyle={{
          margin: 0,
          padding: "0 24px",
          background: "white",
          borderBottom: "1px solid #f0f0f0"
        }}
      />
    </div>
  );
};

// src/components/layout/MainTabs.tsx
import React, { useState } from "react";
import { Badge } from "antd";
import { Server, MessageCircle, Settings, BarChart3 } from "lucide-react";
import { InstanceList } from "@/components/instances/InstanceList";
import { useInstanceStore } from "@/store/instanceStore";
import { useTheme } from "@/contexts/ThemeContext";

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  badgeColor?: string;
  content: React.ReactNode;
}

const MainTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("instances");
  const { instances } = useInstanceStore();
  const { isDark } = useTheme();

  const connectedInstances = instances.filter(
    (i) => i.status === "connected"
  ).length;
  const totalMessages = instances.reduce((acc, i) => acc + i.messagesCount, 0);

  const handleOpenChat = (instanceId: string) => {
    setActiveTab("chat");
    console.log("Abrindo chat para instância:", instanceId);
  };

  const tabItems: TabItem[] = [
    {
      key: "instances",
      label: "Instâncias",
      icon: <Server size={18} />,
      badge: connectedInstances,
      badgeColor: "green",
      content: <InstanceList onOpenChat={handleOpenChat} />
    },
    {
      key: "chat",
      label: "Conversas",
      icon: <MessageCircle size={18} />,
      badge: totalMessages > 999 ? 999 : totalMessages,
      badgeColor: "blue",
      content: (
        <div className="flex items-center justify-center h-full p-4">
          <div
            className={`text-center p-6 sm:p-8 md:p-12 rounded-xl ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-lg max-w-sm sm:max-w-md mx-4`}
          >
            <MessageCircle
              size={48}
              className={`mx-auto mb-4 sm:mb-6 ${
                isDark ? "text-gray-400" : "text-gray-300"
              } sm:w-16 sm:h-16`}
            />
            <h3
              className={`text-lg sm:text-xl font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Chat em Desenvolvimento
            </h3>{" "}
            <p
              className={`text-sm sm:text-base ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              A funcionalidade de chat será implementada em breve.
              <br className="hidden sm:block" />
              <span className="block sm:inline">
                Por enquanto, gerencie suas instâncias na aba
                &quot;Instâncias&quot;.
              </span>
            </p>
          </div>
        </div>
      )
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: <BarChart3 size={18} />,
      content: (
        <div className="flex items-center justify-center h-full p-4">
          <div
            className={`text-center p-6 sm:p-8 md:p-12 rounded-xl ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-lg max-w-sm sm:max-w-md mx-4`}
          >
            <BarChart3
              size={48}
              className={`mx-auto mb-4 sm:mb-6 ${
                isDark ? "text-gray-400" : "text-gray-300"
              } sm:w-16 sm:h-16`}
            />
            <h3
              className={`text-lg sm:text-xl font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Analytics em Breve
            </h3>
            <p
              className={`text-sm sm:text-base ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Relatórios e métricas detalhadas sobre suas conversas.
            </p>
          </div>
        </div>
      )
    },
    {
      key: "settings",
      label: "Configurações",
      icon: <Settings size={18} />,
      content: (
        <div className="flex items-center justify-center h-full p-4">
          <div
            className={`text-center p-6 sm:p-8 md:p-12 rounded-xl ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-lg max-w-sm sm:max-w-md mx-4`}
          >
            <Settings
              size={48}
              className={`mx-auto mb-4 sm:mb-6 ${
                isDark ? "text-gray-400" : "text-gray-300"
              } sm:w-16 sm:h-16`}
            />
            <h3
              className={`text-lg sm:text-xl font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Configurações
            </h3>
            <p
              className={`text-sm sm:text-base ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Personalize seu sistema e gerencie preferências.
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentTab = tabItems.find((tab) => tab.key === activeTab);

  return (
    <div className="h-full flex flex-col">
      {" "}
      {/* Custom Tab Navigation */}
      <div
        className={`border-b transition-colors ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {" "}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  relative flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm lg:text-base
                  transition-all duration-200 border-b-2 hover:scale-105 whitespace-nowrap flex-shrink-0
                  ${
                    activeTab === tab.key
                      ? `border-blue-500 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`
                      : `border-transparent ${
                          isDark
                            ? "text-gray-400 hover:text-gray-200"
                            : "text-gray-500 hover:text-gray-700"
                        }`
                  }
                `}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                <span className="hidden sm:block">{tab.label}</span>
                <span className="block sm:hidden text-xs">
                  {tab.label.slice(0, 4)}
                </span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <Badge
                    count={tab.badge}
                    size="small"
                    color={tab.badgeColor}
                    className="ml-1 flex-shrink-0"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">{currentTab?.content}</div>{" "}
    </div>
  );
};

export default MainTabs;

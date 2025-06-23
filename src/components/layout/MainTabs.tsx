// src/components/layout/MainTabs.tsx
import React, { useState } from "react";
import { Badge, Button } from "antd";
import {
  Server,
  MessageCircle,
  Settings,
  BarChart3,
  Activity,
  Clock
} from "lucide-react";
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
  description?: string;
}

const MainTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("instances");
  const { instances } = useInstanceStore();
  const { isDark } = useTheme();

  const connectedInstances = instances.filter(
    (i) => i.status === "connected"
  ).length;
  const totalMessages = instances.reduce((acc, i) => acc + i.messagesCount, 0);
  const totalInstances = instances.length;

  const handleOpenChat = (instanceId: string) => {
    setActiveTab("chat");
    console.log("Abrindo chat para instância:", instanceId);
  };

  const EmptyState: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
  }> = ({ icon, title, description, action }) => (
    <div className="flex items-center justify-center h-full p-6">
      <div
        className={`
        text-center p-8 sm:p-12 rounded-2xl border-2 border-dashed max-w-md mx-auto
        transition-all duration-300 animate-fade-in
        ${
          isDark
            ? "border-gray-700 bg-gray-800/50"
            : "border-gray-200 bg-gray-50/50"
        }
      `}
      >
        <div
          className={`
          w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center
          ${isDark ? "bg-gray-700" : "bg-white"}
        `}
        >
          {icon}
        </div>
        <h3
          className={`text-xl font-semibold mb-3 ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm mb-6 leading-relaxed ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description}
        </p>
        {action}
      </div>
    </div>
  );

  const tabItems: TabItem[] = [
    {
      key: "instances",
      label: "Instâncias",
      icon: <Server size={20} />,
      badge: connectedInstances,
      badgeColor: "green",
      description: "Gerencie suas conexões",
      content: <InstanceList onOpenChat={handleOpenChat} />
    },
    {
      key: "chat",
      label: "Conversas",
      icon: <MessageCircle size={20} />,
      badge:
        totalMessages > 0
          ? totalMessages > 999
            ? 999
            : totalMessages
          : undefined,
      badgeColor: "blue",
      description: "Centralize seus chats",
      content: (
        <EmptyState
          icon={
            <MessageCircle
              size={32}
              className={isDark ? "text-blue-400" : "text-blue-500"}
            />
          }
          title="Central de Conversas"
          description="Visualize e gerencie todas as suas conversas em um só lugar. Esta funcionalidade será implementada em breve."
          action={
            <Button
              type="primary"
              size="large"
              onClick={() => setActiveTab("instances")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
            >
              Ver Instâncias
            </Button>
          }
        />
      )
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: <BarChart3 size={20} />,
      description: "Métricas e relatórios",
      content: (
        <EmptyState
          icon={
            <BarChart3
              size={32}
              className={isDark ? "text-green-400" : "text-green-500"}
            />
          }
          title="Analytics & Relatórios"
          description="Acompanhe métricas detalhadas, gráficos de performance e relatórios de suas conversas."
        />
      )
    },
    {
      key: "settings",
      label: "Configurações",
      icon: <Settings size={20} />,
      description: "Personalize o sistema",
      content: (
        <EmptyState
          icon={
            <Settings
              size={32}
              className={isDark ? "text-purple-400" : "text-purple-500"}
            />
          }
          title="Configurações do Sistema"
          description="Personalize preferências, configurações de notificação, integrações e muito mais."
        />
      )
    }
  ];

  const currentTab = tabItems.find((tab) => tab.key === activeTab);

  // Statistics for header
  const stats = [
    {
      label: "Instâncias",
      value: totalInstances,
      icon: <Server size={16} />,
      color: isDark ? "text-blue-400" : "text-blue-600"
    },
    {
      label: "Conectadas",
      value: connectedInstances,
      icon: <Activity size={16} />,
      color: "text-green-500"
    },
    {
      label: "Mensagens",
      value: totalMessages.toLocaleString(),
      icon: <MessageCircle size={16} />,
      color: isDark ? "text-purple-400" : "text-purple-600"
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced Header with Stats */}
      <div
        className={`
        border-b backdrop-blur-sm sticky top-0 z-40
        ${
          isDark
            ? "bg-gray-900/95 border-gray-800"
            : "bg-white/95 border-gray-200"
        }
      `}
      >
        {/* Stats Bar */}
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

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  group relative flex items-center space-x-3 px-4 sm:px-6 py-4 font-medium text-sm
                  transition-all duration-300 border-b-2 hover:scale-105 whitespace-nowrap
                  ${
                    activeTab === tab.key
                      ? `border-blue-500 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`
                      : `border-transparent ${
                          isDark
                            ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`
                  }
                `}
              >
                <span
                  className={`
                  transition-transform duration-300 group-hover:scale-110
                  ${activeTab === tab.key ? "text-current" : "text-current"}
                `}
                >
                  {tab.icon}
                </span>

                <div className="flex flex-col items-start">
                  <span className="font-semibold">{tab.label}</span>
                  {tab.description && (
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {tab.description}
                    </span>
                  )}
                </div>

                {tab.badge !== undefined && tab.badge > 0 && (
                  <Badge
                    count={tab.badge}
                    size="small"
                    color={tab.badgeColor}
                    className="ml-2"
                  />
                )}

                {/* Active indicator */}
                {activeTab === tab.key && (
                  <div className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full animate-fade-in">{currentTab?.content}</div>
      </div>
    </div>
  );
};

export default MainTabs;
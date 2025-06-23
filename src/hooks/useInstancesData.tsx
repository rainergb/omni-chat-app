// src/hooks/useInstancesData.tsx
import React from "react";
import { Server, Activity, MessageCircle } from "lucide-react";
import { InstanceList } from "@/components/instances/InstanceList";
import { useInstanceStore } from "@/store/instanceStore";
import { useTheme } from "@/contexts/ThemeContext";

interface UseInstancesDataProps {
  onOpenChat: (instanceId: string) => void;
}

export const useInstancesData = ({ onOpenChat }: UseInstancesDataProps) => {
  const { instances } = useInstanceStore();
  const { isDark } = useTheme();

  const connectedInstances = instances.filter(
    (i) => i.status === "connected"
  ).length;
  const totalMessages = instances.reduce((acc, i) => acc + i.messagesCount, 0);
  const totalInstances = instances.length;

  const content = <InstanceList onOpenChat={onOpenChat} />;

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

  return {
    content,
    stats,
    totalInstances,
    connectedInstances,
    totalMessages
  };
};

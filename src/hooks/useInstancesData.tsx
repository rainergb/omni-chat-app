import React from "react";
import { Server, Activity, MessageCircle } from "lucide-react";
import { InstancesPage } from "@/components/instances/Instance";
import { useInstances } from "@/hooks/useInstances";
import { useTheme } from "@/contexts/ThemeContext";

export const useInstancesData = () => {
  const { isDark } = useTheme();
  const { instances } = useInstances();

  const CONNECTEDInstances = instances.filter(
    (i) => i.status === "CONNECTED"
  ).length;
  const totalMessages = instances.reduce((acc, i) => acc + i.messagesCount, 0);
  const totalInstances = instances.length;

  const content = <InstancesPage />;

  const stats = [
    {
      label: "Instâncias",
      value: totalInstances,
      icon: <Server size={16} />,
      color: isDark ? "text-blue-400" : "text-blue-600"
    },
    {
      label: "Conectadas",
      value: CONNECTEDInstances,
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
    CONNECTEDInstances,
    totalMessages
  };
};

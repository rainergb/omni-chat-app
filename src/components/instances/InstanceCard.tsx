// src/components/instances/InstanceCard.tsx
import React from "react";
import { Card, Badge, Button, Dropdown, Tooltip, Avatar } from "antd";
import {
  MoreVertical,
  Power,
  RotateCw,
  Trash2,
  MessageCircle,
  Settings,
  QrCode,
  Wifi,
  WifiOff,
  AlertCircle,
  Clock
} from "lucide-react";
import type { MenuProps } from "antd";
import { Instance } from "@/libs/types";
import {
  formatDate,
  getStatusColor,
  getStatusText,
  getPlatformIcon
} from "@/libs/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface InstanceCardProps {
  instance: Instance;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onDelete: (id: string) => void;
  onShowQR: (id: string) => void;
  onOpenChat: (id: string) => void;
  loading?: boolean;
}

export const InstanceCard: React.FC<InstanceCardProps> = ({
  instance,
  onConnect,
  onDisconnect,
  onDelete,
  onShowQR,
  onOpenChat,
  loading = false
}) => {
  const { isDark } = useTheme();
  const isConnected = instance.status === "connected";
  const isConnecting = instance.status === "connecting";
  const hasError = instance.status === "error";

  const getStatusIcon = () => {
    switch (instance.status) {
      case "connected":
        return <Wifi size={16} className="text-green-500" />;
      case "connecting":
        return <RotateCw size={16} className="text-yellow-500 animate-spin" />;
      case "error":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <WifiOff size={16} className="text-gray-500" />;
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "qr",
      label: "Ver QR Code",
      icon: <QrCode size={16} />,
      onClick: () => onShowQR(instance.id),
      disabled: isConnected
    },
    {
      key: "settings",
      label: "Configurações",
      icon: <Settings size={16} />
    },
    {
      type: "divider"
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <Trash2 size={16} />,
      danger: true,
      onClick: () => onDelete(instance.id)
    }
  ];

  const handleConnectionToggle = () => {
    if (isConnected) {
      onDisconnect(instance.id);
    } else {
      onConnect(instance.id);
    }
  };

  return (
    <Card
      className={`
        h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl 
        border-0 overflow-hidden group relative
        ${
          isDark ? "bg-gray-800 shadow-gray-900/20" : "bg-white shadow-gray-100"
        }
      `}
      loading={loading}
      styles={{
        body: { padding: 0 }
      }}
    >
      {/* Status indicator line */}
      <div
        className={`h-1 w-full ${
          isConnected
            ? "bg-green-500"
            : isConnecting
            ? "bg-yellow-500"
            : hasError
            ? "bg-red-500"
            : "bg-gray-300"
        }`}
      />{" "}
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <Avatar
                size={48}
                src={instance.avatar}
                className={`
                  ring-2 transition-all
                  ${
                    isConnected
                      ? "ring-green-200"
                      : isConnecting
                      ? "ring-yellow-200"
                      : hasError
                      ? "ring-red-200"
                      : "ring-gray-200"
                  }
                `}
                style={{
                  backgroundColor: isDark ? "#374151" : "#f3f4f6",
                  fontSize: "20px"
                }}
              >
                {getPlatformIcon(instance.type)}
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                {getStatusIcon()}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className={`font-semibold text-base sm:text-lg mb-1 truncate ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {instance.name}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge
                  color={getStatusColor(instance.status)}
                  text={getStatusText(instance.status)}
                  className={`text-xs sm:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                />
              </div>
            </div>
          </div>

          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreVertical size={16} />}
              className={`opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
              }`}
            />
          </Dropdown>
        </div>{" "}
        {/* Stats */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div
            className={`flex justify-between items-center p-3 sm:p-4 rounded-lg ${
              isDark ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <MessageCircle
                size={16}
                className={`flex-shrink-0 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs sm:text-sm truncate ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Mensagens
              </span>
            </div>
            <span
              className={`font-semibold text-sm sm:text-base flex-shrink-0 ${
                isDark ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {instance.messagesCount.toLocaleString()}
            </span>
          </div>

          <div
            className={`flex justify-between items-center p-3 sm:p-4 rounded-lg ${
              isDark ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Clock
                size={16}
                className={`flex-shrink-0 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs sm:text-sm truncate ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Última atividade
              </span>
            </div>
            <span
              className={`text-xs sm:text-sm flex-shrink-0 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {formatDate(instance.lastActivity)}
            </span>
          </div>
        </div>{" "}
        {/* Actions */}
        <div className="flex gap-2 sm:gap-3">
          <Tooltip title={isConnected ? "Desconectar" : "Conectar"}>
            <Button
              type={isConnected ? "default" : "primary"}
              icon={
                isConnecting ? (
                  <RotateCw size={16} className="animate-spin" />
                ) : (
                  <Power size={16} />
                )
              }
              onClick={handleConnectionToggle}
              loading={isConnecting}
              className={`flex-1 sm:flex-initial ${
                isConnected
                  ? isDark
                    ? "border-gray-600 text-gray-300"
                    : "border-gray-300"
                  : ""
              }`}
              size="large"
            >
              <span className="hidden sm:inline">
                {isConnected
                  ? "Desconectar"
                  : isConnecting
                  ? "Conectando..."
                  : "Conectar"}
              </span>
            </Button>
          </Tooltip>

          <Tooltip title="Abrir Chat">
            <Button
              type="text"
              icon={<MessageCircle size={16} />}
              onClick={() => onOpenChat(instance.id)}
              disabled={!isConnected}
              className={`
                flex-shrink-0 ${
                  isConnected
                    ? "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    : "text-gray-400"
                } transition-colors
              `}
              size="large"
            />
          </Tooltip>
        </div>
        {/* Webhook indicator */}
        {instance.webhook && (
          <div
            className={`mt-4 pt-4 border-t ${
              isDark ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <span
              className={`text-xs flex items-center space-x-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Webhook configurado</span>
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

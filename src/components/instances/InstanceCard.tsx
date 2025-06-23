import React from "react";
import { Card, Badge, Button, Dropdown, Space, Tooltip, Avatar } from "antd";
import {
  MoreOutlined,
  PoweroffOutlined,
  SyncOutlined,
  DeleteOutlined,
  MessageOutlined,
  SettingOutlined,
  QrcodeOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Instance } from "@/libs/types";
import {
  formatDate,
  getStatusColor,
  getStatusText,
  getPlatformIcon
} from "@/libs/utils";

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
  const isConnected = instance.status === "connected";
  const isConnecting = instance.status === "connecting";

  const menuItems: MenuProps["items"] = [
    {
      key: "qr",
      label: "Ver QR Code",
      icon: <QrcodeOutlined />,
      onClick: () => onShowQR(instance.id),
      disabled: isConnected
    },
    {
      key: "settings",
      label: "Configurações",
      icon: <SettingOutlined />
    },
    {
      type: "divider"
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <DeleteOutlined />,
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
      className="instance-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      loading={loading}
      actions={[
        <Tooltip
          title={isConnected ? "Desconectar" : "Conectar"}
          key="connection"
        >
          <Button
            type="text"
            icon={isConnecting ? <SyncOutlined spin /> : <PoweroffOutlined />}
            onClick={handleConnectionToggle}
            loading={isConnecting}
            className={isConnected ? "text-green-600" : "text-gray-400"}
          />
        </Tooltip>,
        <Tooltip title="Abrir Chat" key="chat">
          <Button
            type="text"
            icon={<MessageOutlined />}
            onClick={() => onOpenChat(instance.id)}
            disabled={!isConnected}
            className={isConnected ? "text-blue-600" : "text-gray-400"}
          />
        </Tooltip>,
        <Dropdown menu={{ items: menuItems }} trigger={["click"]} key="menu">
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ]}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar
            size={48}
            src={instance.avatar}
            style={{
              backgroundColor: getStatusColor(instance.status),
              fontSize: "20px"
            }}
          >
            {getPlatformIcon(instance.type)}
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">
              {instance.name}
            </h3>
            <Badge
              color={getStatusColor(instance.status)}
              text={getStatusText(instance.status)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Mensagens:</span>
          <span className="font-medium">
            {instance.messagesCount.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Última atividade:</span>
          <span className="text-sm">{formatDate(instance.lastActivity)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Criado em:</span>
          <span className="text-sm">{formatDate(instance.createdAt)}</span>
        </div>

        {instance.webhook && (
          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">Webhook configurado</span>
          </div>
        )}
      </div>
    </Card>
  );
};

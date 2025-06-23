// src/components/instances/Components/InstanceCard/InstanceCard.tsx
import React from "react";
import { Badge, Dropdown, Tooltip } from "antd";
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
  getStatusColor as getStatusBadgeColor,
  getStatusText,
  getPlatformIcon
} from "@/libs/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { Card } from "@/components/ui";
import {
  CardContainer,
  CardContent,
  Header,
  HeaderLeft,
  AvatarContainer,
  Avatar,
  StatusIconContainer,
  InstanceInfo,
  InstanceName,
  StatusContainer,
  DropdownButton,
  StatsSection,
  StatItem,
  StatLeft,
  StatIcon,
  StatLabel,
  StatValue,
  StatValueSmall,
  ActionsSection,
  ConnectButton,
  ChatButton,
  WebhookIndicator,
  WebhookText,
  WebhookDot
} from "./InstanceCard.styles";

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
  const getStatusColor = () => {
    switch (instance.status) {
      case "connected":
        return "#10b981"; // green-500
      case "connecting":
        return "#f59e0b"; // yellow-500
      case "error":
        return "#ef4444"; // red-500
      default:
        return "#d1d5db"; // gray-300
    }
  };
  return (
    <Card
      hover
      loading={loading}
      padding="0"
      statusColor={getStatusColor()}
      statusHeight="4px"
    >
      <CardContainer>
        <CardContent>
          {/* Header */}
          <Header>
            <HeaderLeft>
              <AvatarContainer>
                <Avatar
                  size={48}
                  src={instance.avatar}
                  $isDark={isDark}
                  $isConnected={isConnected}
                  $isConnecting={isConnecting}
                  $hasError={hasError}
                >
                  {getPlatformIcon(instance.type)}
                </Avatar>
                <StatusIconContainer>
                  {getStatusIcon()}
                </StatusIconContainer>
              </AvatarContainer>

              <InstanceInfo>
                <InstanceName $isDark={isDark}>
                  {instance.name}
                </InstanceName>
                <StatusContainer>
                  <Badge
                    color={getStatusBadgeColor(instance.status)}
                    text={getStatusText(instance.status)}
                    style={{
                      fontSize: '0.75rem',
                      color: isDark ? '#d1d5db' : '#4b5563'
                    }}
                  />
                </StatusContainer>
              </InstanceInfo>
            </HeaderLeft>

            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <DropdownButton
                type="text"
                icon={<MoreVertical size={16} />}
                $isDark={isDark}
                className="dropdown-button"
              />
            </Dropdown>
          </Header>

          {/* Stats */}
          <StatsSection>
            <StatItem $isDark={isDark}>
              <StatLeft>
                <StatIcon $isDark={isDark}>
                  <MessageCircle size={16} />
                </StatIcon>
                <StatLabel $isDark={isDark}>
                  Mensagens
                </StatLabel>
              </StatLeft>
              <StatValue $isDark={isDark}>
                {instance.messagesCount.toLocaleString()}
              </StatValue>
            </StatItem>

            <StatItem $isDark={isDark}>
              <StatLeft>
                <StatIcon $isDark={isDark}>
                  <Clock size={16} />
                </StatIcon>
                <StatLabel $isDark={isDark}>
                  Última atividade
                </StatLabel>
              </StatLeft>
              <StatValueSmall $isDark={isDark}>
                {formatDate(instance.lastActivity)}
              </StatValueSmall>
            </StatItem>
          </StatsSection>

          {/* Actions */}
          <ActionsSection>
            <Tooltip title={isConnected ? "Desconectar" : "Conectar"}>
              <ConnectButton
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
                $isConnected={isConnected}
                $isDark={isDark}
                size="large"
              >
                <span className="hidden-sm">
                  {isConnected
                    ? "Desconectar"
                    : isConnecting
                    ? "Conectando..."
                    : "Conectar"}
                </span>
              </ConnectButton>
            </Tooltip>

            <Tooltip title="Abrir Chat">
              <ChatButton
                type="text"
                icon={<MessageCircle size={16} />}
                onClick={() => onOpenChat(instance.id)}
                disabled={!isConnected}
                $isConnected={isConnected}
                size="large"
              />
            </Tooltip>
          </ActionsSection>

          {/* Webhook indicator */}
          {instance.webhook && (
            <WebhookIndicator $isDark={isDark}>
              <WebhookText $isDark={isDark}>
                <WebhookDot />
                <span>Webhook configurado</span>
              </WebhookText>
            </WebhookIndicator>
          )}
        </CardContent>
      </CardContainer>
    </Card>
  );
};

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
  Clock,
  Instagram,
  Send,
  Facebook
} from "lucide-react";
import type { MenuProps } from "antd";
import { Instance } from "@/libs/types";
import {
  formatDate,
  getStatusColor as getStatusBadgeColor,
  getStatusText
} from "@/libs/utils";
import { getStatusColor } from "@/libs/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card } from "@/components/ui";
import {
  CardContainer,
  CardContent,
  Header,
  HeaderLeft,
  AvatarContainer,
  Avatar,
  InstanceInfo,
  InstanceName,
  StatusContainer,
  DropdownButton,
  StatsSection,
  StatItem,
  StatLeft,
  StatIcon,
  StatLabel,
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
  const colors = useThemeColors();
  const isConnected = instance.status === "CONNECTED";
  const isConnecting = instance.status === "CONNECTING";
  const hasError = instance.status === "error";

  // Helper function to render platform icons
  const renderPlatformIcon = (platformType: string) => {
    const iconProps = { size: 20 };

    switch (platformType) {
      case "whatsapp":
        return <MessageCircle {...iconProps} />;
      case "instagram":
        return <Instagram {...iconProps} />;
      case "facebook":
        return <Facebook {...iconProps} />;
      case "telegram":
        return <Send {...iconProps} />;
      default:
        return <MessageCircle {...iconProps} />;
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
      hover
      loading={loading}
      padding="0"
      statusColor={getStatusColor(instance.status)}
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
                  $colors={colors}
                  $isConnected={isConnected}
                  $isConnecting={isConnecting}
                  $hasError={hasError}
                >
                  {renderPlatformIcon(instance.type)}
                </Avatar>
              </AvatarContainer>
              <InstanceInfo>
                <InstanceName $colors={colors}>{instance.name}</InstanceName>
                <StatusContainer>
                  <Badge
                    color={getStatusBadgeColor(instance.status)}
                    text={getStatusText(instance.status)}
                    style={{
                      fontSize: "0.75rem",
                      color: colors.textSecondary
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
                $colors={colors}
                className="dropdown-button"
              />
            </Dropdown>
          </Header>
          {/* Stats */}
          <StatsSection $isDark={isDark}>
            <StatItem $colors={colors} $isDark={isDark}>
              <StatLeft>
                <StatIcon $colors={colors} $isDark={isDark}>
                  <Clock size={16} />
                </StatIcon>
                <StatLabel $colors={colors} $isDark={isDark}>
                  Última atividade
                </StatLabel>
              </StatLeft>
              <StatValueSmall $colors={colors} $isDark={isDark}>
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
            </Tooltip>{" "}
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

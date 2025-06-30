// src/components/instances/Components/InstanceList/InstanceList.tsx
import React, { useState } from "react";
import { Badge, Dropdown, Tooltip, Avatar } from "antd";
import {
  MoreVertical,
  Power,
  RotateCw,
  Trash2,
  MessageCircle,
  Settings,
  QrCode,
  Clock,
  Plus,
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
import { useTheme } from "@/contexts/ThemeContext";
import {
  ListContainer,
  ListHeader,
  HeaderCell,
  ListContent,
  ListRow,
  ListCell,
  InstanceInfo,
  InstanceAvatar,
  InstanceDetails,
  InstanceName,
  InstanceType,
  StatusContainer,
  ActionsContainer,
  ActionButton,
  ConnectButton,
  DropdownButton,
  EmptyContainer,
  EmptyContent,
  EmptyIconContainer,
  EmptyTitle,
  EmptyDescription,
  CreateButton,
  WebhookIndicator,
  WebhookDot
} from "./InstanceList.styles";
import QRCodeModal from "../QRCodeModal/QRCodeModal";

interface InstanceListProps {
  instances: Instance[];
  filteredInstances: Instance[];
  loading: boolean;
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenChat?: (instanceId: string) => void;
  onCreateInstance: () => void;
}

export const InstanceList: React.FC<InstanceListProps> = ({
  filteredInstances = [],
  loading,
  searchTerm,
  statusFilter,
  typeFilter,
  onConnect,
  onDisconnect,
  onDelete,
  onOpenChat,
  onCreateInstance
}) => {
  const { isDark } = useTheme();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>("");

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

  const handleShowQR = (instanceId: string) => {
    setSelectedInstanceId(instanceId);
    setTimeout(() => setQrModalOpen(true), 100); // Delay para evitar conflito com Dropdown
  };

  const handleOpenChat = (instanceId: string) => {
    onOpenChat?.(instanceId);
  };

  const getMenuItems = (instance: Instance): MenuProps["items"] => [
    {
      key: "qr",
      label: "Ver QR Code",
      icon: <QrCode size={16} />,
      onClick: () => handleShowQR(instance.id),
      disabled: instance.status === "connected"
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

  const handleConnectionToggle = (instance: Instance) => {
    if (instance.status === "connected") {
      onDisconnect(instance.id);
    } else {
      onConnect(instance.id);
    }
  };

  if (loading) {
    return (
      <ListContainer $isDark={isDark}>
        <ListHeader $isDark={isDark}>
          <HeaderCell>Instância</HeaderCell>
          <HeaderCell>Status</HeaderCell>
          <HeaderCell>Última Atividade</HeaderCell>
          <HeaderCell>Ações</HeaderCell>
        </ListHeader>
        <ListContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <ListRow key={index} $isDark={isDark} $loading>
              <ListCell>
                <div className="animate-pulse flex items-center space-x-3">
                  <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              </ListCell>
              <ListCell>
                <div className="animate-pulse h-6 bg-gray-300 rounded w-20"></div>
              </ListCell>
              <ListCell>
                <div className="animate-pulse h-4 bg-gray-300 rounded w-24"></div>
              </ListCell>
              <ListCell>
                <div className="animate-pulse flex space-x-2">
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-8"></div>
                </div>
              </ListCell>
            </ListRow>
          ))}
        </ListContent>
      </ListContainer>
    );
  }

  if (filteredInstances.length === 0) {
    return (
      <EmptyContainer>
        <EmptyContent>
          <EmptyIconContainer $isDark={isDark}>
            <MessageCircle
              size={40}
              className={isDark ? "text-gray-600" : "text-gray-400"}
            />
          </EmptyIconContainer>
          <EmptyTitle $isDark={isDark}>
            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
              ? "Nenhuma instância encontrada"
              : "Nenhuma instância criada"}
          </EmptyTitle>
          <EmptyDescription $isDark={isDark}>
            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
              ? "Tente ajustar os filtros para encontrar suas instâncias"
              : "Crie sua primeira instância para começar a gerenciar seus chats"}
          </EmptyDescription>
          {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
            <CreateButton
              type="primary"
              icon={<Plus size={16} />}
              onClick={onCreateInstance}
              size="large"
            >
              Nova Instância
            </CreateButton>
          )}
        </EmptyContent>
      </EmptyContainer>
    );
  }

  return (
    <>
      <ListContainer $isDark={isDark}>
        <ListHeader $isDark={isDark}>
          <HeaderCell>Instância</HeaderCell>
          <HeaderCell>Status</HeaderCell>
          <HeaderCell>Última Atividade</HeaderCell>
          <HeaderCell>Ações</HeaderCell>
        </ListHeader>

        <ListContent>
          {filteredInstances.map((instance) => {
            const isConnected = instance.status === "connected";
            const isConnecting = instance.status === "connecting";

            return (
              <ListRow key={instance.id} $isDark={isDark}>
                <ListCell>
                  <InstanceInfo>
                    <InstanceAvatar $isDark={isDark}>
                      <Avatar
                        size={40}
                        src={instance.avatar}
                        style={{
                          backgroundColor: isDark ? "#374151" : "#f3f4f6"
                        }}
                      >
                        {renderPlatformIcon(instance.type)}
                      </Avatar>
                    </InstanceAvatar>

                    <InstanceDetails>
                      <InstanceName $isDark={isDark}>
                        {instance.name}
                        {instance.webhook && (
                          <WebhookIndicator>
                            <WebhookDot />
                          </WebhookIndicator>
                        )}
                      </InstanceName>
                      <InstanceType $isDark={isDark}>
                        {instance.type.charAt(0).toUpperCase() +
                          instance.type.slice(1)}
                      </InstanceType>
                    </InstanceDetails>
                  </InstanceInfo>
                </ListCell>

                <ListCell>
                  <StatusContainer>
                    <Badge
                      color={getStatusBadgeColor(instance.status)}
                      text={getStatusText(instance.status)}
                      style={{
                        fontSize: "0.875rem",
                        color: isDark ? "#d1d5db" : "#4b5563"
                      }}
                    />
                  </StatusContainer>
                </ListCell>

                <ListCell>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock
                      size={14}
                      className={isDark ? "text-gray-400" : "text-gray-500"}
                    />
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      {formatDate(instance.lastActivity)}
                    </span>
                  </div>
                </ListCell>

                <ListCell>
                  <ActionsContainer>
                    <Tooltip title={isConnected ? "Desconectar" : "Conectar"}>
                      <ConnectButton
                        type={isConnected ? "default" : "primary"}
                        size="small"
                        icon={
                          isConnecting ? (
                            <RotateCw size={14} className="animate-spin" />
                          ) : (
                            <Power size={14} />
                          )
                        }
                        onClick={() => handleConnectionToggle(instance)}
                        loading={isConnecting}
                        $isConnected={isConnected}
                        $isDark={isDark}
                      >
                        {isConnected ? "Desconectar" : "Conectar"}
                      </ConnectButton>
                    </Tooltip>

                    <Tooltip title="Abrir Chat">
                      <ActionButton
                        type="text"
                        size="small"
                        icon={<MessageCircle size={14} />}
                        onClick={() => handleOpenChat(instance.id)}
                        disabled={!isConnected}
                        $isConnected={isConnected}
                        $isDark={isDark}
                      />
                    </Tooltip>

                    <Dropdown
                      menu={{ items: getMenuItems(instance) }}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <DropdownButton
                        type="text"
                        size="small"
                        icon={<MoreVertical size={14} />}
                        $isDark={isDark}
                      />
                    </Dropdown>
                  </ActionsContainer>
                </ListCell>
              </ListRow>
            );
          })}
        </ListContent>
      </ListContainer>

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        id={selectedInstanceId}
        loading={false}
      />
    </>
  );
};
// src/components/chatpage/components/ChatWindow/ChatHeader.tsx
import React from "react";
import { Avatar, Dropdown, Tooltip } from "antd";
import { ArrowLeft, Phone, Video, MoreVertical, Users } from "lucide-react";
import type { MenuProps } from "antd";
import { useTheme } from "@/contexts/ThemeContext";
import { ChatHeaderProps } from "@/components/chatpage/types/chat.types";
import {
  HeaderContainer,
  HeaderContent,
  BackButton,
  ContactInfo,
  ContactAvatar,
  ContactDetails,
  ContactName,
  ContactStatus,
  ActionsContainer,
  ActionButton,
  OnlineIndicator,
} from "./ChatHeader.styles";

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onBack,
  onCall,
  onVideoCall,
  onInfo,
}) => {
  const { isDark } = useTheme();

  const menuItems: MenuProps["items"] = [
    {
      key: "info",
      label: "Informações do contato",
      onClick: onInfo,
    },
    {
      key: "search",
      label: "Buscar mensagens",
    },
    {
      key: "mute",
      label: chat.isMuted ? "Reativar notificações" : "Silenciar notificações",
    },
    {
      type: "divider",
    },
    {
      key: "clear",
      label: "Limpar conversa",
      danger: true,
    },
    {
      key: "block",
      label: "Bloquear contato",
      danger: true,
    },
  ];

  const getContactInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusText = () => {
    if (chat.isOnline) {
      return "online";
    }
    return "visto por último recentemente";
  };

  return (
    <HeaderContainer $isDark={isDark}>
      <HeaderContent>
        {/* Botão Voltar (Mobile) */}
        {onBack && (
          <BackButton $isDark={isDark} onClick={onBack}>
            <ArrowLeft size={20} />
          </BackButton>
        )}

        {/* Informações do Contato */}
        <ContactInfo>
          <ContactAvatar>
            <Avatar
              size={40}
              src={chat.contactAvatar}
              style={{
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                color: isDark ? "#d1d5db" : "#6b7280",
                fontWeight: 600,
              }}
            >
              {!chat.contactAvatar && getContactInitials(chat.contactName)}
            </Avatar>
            
            {/* Indicador online */}
            {chat.isOnline && <OnlineIndicator $isDark={isDark} />}
          </ContactAvatar>

          <ContactDetails>
            <ContactName $isDark={isDark}>
              {chat.contactName}
              {chat.isGroup && (
                <Tooltip title="Grupo">
                  <Users size={14} style={{ marginLeft: "0.5rem", opacity: 0.7 }} />
                </Tooltip>
              )}
            </ContactName>
            <ContactStatus $isDark={isDark}>
              {chat.isGroup 
                ? `${chat.participants?.length || 0} participantes`
                : getStatusText()
              }
            </ContactStatus>
          </ContactDetails>
        </ContactInfo>

        {/* Ações */}
        <ActionsContainer>
          {!chat.isGroup && (
            <>
              <Tooltip title="Chamada de áudio">
                <ActionButton
                  type="text"
                  icon={<Phone size={18} />}
                  onClick={onCall}
                  $isDark={isDark}
                />
              </Tooltip>

              <Tooltip title="Chamada de vídeo">
                <ActionButton
                  type="text"
                  icon={<Video size={18} />}
                  onClick={onVideoCall}
                  $isDark={isDark}
                />
              </Tooltip>
            </>
          )}

          <Tooltip title="Mais opções">
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <ActionButton
                type="text"
                icon={<MoreVertical size={18} />}
                $isDark={isDark}
              />
            </Dropdown>
          </Tooltip>
        </ActionsContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};
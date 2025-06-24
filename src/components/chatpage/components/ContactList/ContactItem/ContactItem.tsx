// src/components/chatpage/components/ContactList/ContactItem.tsx
import React from "react";
import { Avatar, Badge, Tooltip } from "antd";
import { Pin, VolumeX, Users } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDate } from "@/libs/utils";
import { ContactItemProps } from "../../types/chat.types";
import {
  ContactItemContainer,
  ContactContent,
  ContactAvatar,
  ContactInfo,
  ContactName,
  LastMessage,
  ContactMeta,
  TimeStamp,
  UnreadBadge,
  StatusIndicators,
  OnlineIndicator,
} from "./ContactItem.styles";

export const ContactItem: React.FC<ContactItemProps> = ({
  chat,
  isSelected,
  onClick,
}) => {
  const { isDark } = useTheme();

  const handleClick = () => {
    onClick(chat);
  };

  const formatLastMessage = (message: string, maxLength = 35) => {
    if (message.length <= maxLength) return message;
    return message.slice(0, maxLength) + "...";
  };

  const getContactInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ContactItemContainer
      $isDark={isDark}
      $isSelected={isSelected}
      onClick={handleClick}
    >
      <ContactContent>
        {/* Avatar com indicador online */}
        <ContactAvatar>
          <Avatar
            size={48}
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

        {/* Informações do contato */}
        <ContactInfo>
          <ContactName $isDark={isDark} $isSelected={isSelected}>
            {chat.contactName}
            
            {/* Indicadores (grupo, fixado, silenciado) */}
            <StatusIndicators>
              {chat.isGroup && (
                <Tooltip title="Grupo">
                  <Users size={12} />
                </Tooltip>
              )}
              {chat.isPinned && (
                <Tooltip title="Fixado">
                  <Pin size={12} />
                </Tooltip>
              )}
              {chat.isMuted && (
                <Tooltip title="Silenciado">
                  <VolumeX size={12} />
                </Tooltip>
              )}
            </StatusIndicators>
          </ContactName>

          <LastMessage $isDark={isDark} $isSelected={isSelected} $hasUnread={chat.unreadCount > 0}>
            {formatLastMessage(chat.lastMessage)}
          </LastMessage>
        </ContactInfo>

        {/* Meta informações (tempo e badge) */}
        <ContactMeta>
          <TimeStamp $isDark={isDark} $isSelected={isSelected}>
            {formatDate(chat.lastMessageTime)}
          </TimeStamp>
          
          {chat.unreadCount > 0 && (
            <UnreadBadge>
              <Badge
                count={chat.unreadCount}
                size="small"
                style={{
                  backgroundColor: chat.isMuted ? "#9ca3af" : "#00b9ae",
                  color: "white",
                  fontSize: "10px",
                  minWidth: "16px",
                  height: "16px",
                  lineHeight: "16px",
                }}
              />
            </UnreadBadge>
          )}
        </ContactMeta>
      </ContactContent>
    </ContactItemContainer>
  );
};
// src/components/chatpage/components/ChatWindow/MessageBubble.tsx
import React from "react";
import { Avatar } from "antd";
import { Check, CheckCheck } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { MessageBubbleProps } from "@/components/chatpage/types/chat.types";
import {
  MessageContainer,
  MessageWrapper,
  AvatarContainer,
  BubbleContainer,
  MessageBubble as Bubble,
  MessageContent,
  MessageText,
  MessageMeta,
  MessageTime,
  MessageStatus,
  SenderName
} from "./MessageBubble.styles";

export const MessageBubble: React.FC<
  MessageBubbleProps & { isGrouped?: boolean }
> = ({
  message,
  showAvatar = false,
  showTimestamp = true,
  isGrouped = false
}) => {
  const { isDark } = useTheme();
  const isMe = message.sender.isMe;

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case "sending":
        return <Check size={14} style={{ opacity: 0.5 }} />;
      case "sent":
        return <Check size={14} />;
      case "delivered":
        return <CheckCheck size={14} />;
      case "read":
        return <CheckCheck size={14} style={{ color: "#00b9ae" }} />;
      case "failed":
        return <span style={{ color: "#ef4444", fontSize: "12px" }}>!</span>;
      default:
        return null;
    }
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
    <MessageContainer $isMe={isMe} $isGrouped={isGrouped}>
      <MessageWrapper $isMe={isMe}>
        {/* Avatar (apenas para mensagens de outros em grupos) */}
        {!isMe && showAvatar && (
          <AvatarContainer>
            <Avatar
              size={32}
              src={message.sender.avatar}
              style={{
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                color: isDark ? "#d1d5db" : "#6b7280",
                fontSize: "12px",
                fontWeight: 600
              }}
            >
              {!message.sender.avatar &&
                getContactInitials(message.sender.name)}
            </Avatar>
          </AvatarContainer>
        )}

        {/* Espaçador quando não há avatar mas deveria ter */}
        {!isMe && !showAvatar && <div style={{ width: "40px" }} />}

        {/* Bubble da mensagem */}
        <BubbleContainer $isMe={isMe}>
          <Bubble $isMe={isMe} $isDark={isDark} $isGrouped={isGrouped}>
            <MessageContent>
              {/* Nome do remetente (apenas em grupos quando não sou eu) */}
              {!isMe && !isGrouped && (
                <SenderName $isDark={isDark}>{message.sender.name}</SenderName>
              )}

              {/* Conteúdo da mensagem */}
              <MessageText $isMe={isMe} $isDark={isDark}>
                {message.content}
              </MessageText>

              {/* Meta informações (hora e status) */}
              {showTimestamp && (
                <MessageMeta $isMe={isMe}>
                  <MessageTime $isMe={isMe} $isDark={isDark}>
                    {formatTime(message.timestamp)}
                  </MessageTime>

                  {/* Status apenas para mensagens enviadas por mim */}
                  {isMe && (
                    <MessageStatus $isDark={isDark}>
                      {getStatusIcon()}
                    </MessageStatus>
                  )}
                </MessageMeta>
              )}
            </MessageContent>
          </Bubble>
        </BubbleContainer>
      </MessageWrapper>
    </MessageContainer>
  );
};

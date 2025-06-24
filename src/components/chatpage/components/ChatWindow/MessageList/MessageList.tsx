// src/components/chatpage/components/ChatWindow/MessageList.tsx
import React, { useEffect, useRef } from "react";
import { Spin } from "antd";
import { MessageCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Message } from "@/components/chatpage/types/chat.types";
import { MessageBubble } from "../MessageBuble/MessageBubble";
import {
  MessageListContainer,
  MessageListContent,
  LoadingContainer,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  DateSeparator,
  DateText,
} from "./MessageList.styles";

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  chatId: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
}) => {
  const { isDark } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Agrupar mensagens por data
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach((message) => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  // Formatar data para exibição
  const formatDateSeparator = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <MessageListContainer $isDark={isDark}>
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      </MessageListContainer>
    );
  }

  if (messages.length === 0) {
    return (
      <MessageListContainer $isDark={isDark}>
        <EmptyState>
          <EmptyIcon $isDark={isDark}>
            <MessageCircle size={48} />
          </EmptyIcon>
          <EmptyTitle $isDark={isDark}>Nenhuma mensagem ainda</EmptyTitle>
          <EmptyDescription $isDark={isDark}>
            Envie uma mensagem para começar a conversa
          </EmptyDescription>
        </EmptyState>
      </MessageListContainer>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <MessageListContainer $isDark={isDark}>
      <MessageListContent>
        {Object.entries(messageGroups).map(([dateString, dayMessages]) => (
          <div key={dateString}>
            {/* Separador de data */}
            <DateSeparator>
              <DateText $isDark={isDark}>
                {formatDateSeparator(dateString)}
              </DateText>
            </DateSeparator>

            {/* Mensagens do dia */}
            {dayMessages.map((message, index) => {
              const prevMessage = dayMessages[index - 1];
              const nextMessage = dayMessages[index + 1];
              
              // Verificar se deve mostrar avatar (primeira mensagem do remetente ou remetente diferente)
              const showAvatar = !nextMessage || nextMessage.sender.id !== message.sender.id;
              
              // Verificar se deve agrupar com mensagem anterior (mesmo remetente, intervalo < 2 min)
              const shouldGroup = prevMessage && 
                prevMessage.sender.id === message.sender.id &&
                (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) < 2 * 60 * 1000;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  showAvatar={showAvatar}
                  showTimestamp={!shouldGroup}
                  isGrouped={shouldGroup}
                />
              );
            })}
          </div>
        ))}
        
        {/* Elemento para scroll automático */}
        <div ref={messagesEndRef} />
      </MessageListContent>
    </MessageListContainer>
  );
};
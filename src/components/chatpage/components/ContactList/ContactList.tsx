// src/components/chatpage/components/ContactList/ContactList.tsx
import React from "react";
import { Spin } from "antd";
import { useTheme } from "@/contexts/ThemeContext";
import { useChat } from "@/hooks/useChat";
import { ContactHeader } from "./ContactHeader/ContactHeader";
import { ContactItem } from "./ContactItem/ContactItem";
import {
  ContactListContainer,
  ContactsContainer,
  LoadingContainer,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from "./ContactList.styles";
import { MessageCircle } from "lucide-react";

export const ContactList: React.FC = () => {
  const { isDark } = useTheme();
  const {
    chats,
    selectedChat,
    loading,
    selectChat,
    hasChats,
    filter,
  } = useChat();

  const renderEmptyState = () => {
    if (filter.searchTerm) {
      return (
        <EmptyState>
          <EmptyIcon $isDark={isDark}>
            <MessageCircle size={48} />
          </EmptyIcon>
          <EmptyTitle $isDark={isDark}>Nenhum chat encontrado</EmptyTitle>
          <EmptyDescription $isDark={isDark}>
            Tente ajustar sua busca ou verificar se há chats disponíveis
          </EmptyDescription>
        </EmptyState>
      );
    }

    if (filter.unreadOnly) {
      return (
        <EmptyState>
          <EmptyIcon $isDark={isDark}>
            <MessageCircle size={48} />
          </EmptyIcon>
          <EmptyTitle $isDark={isDark}>Nenhuma mensagem não lida</EmptyTitle>
          <EmptyDescription $isDark={isDark}>
            Todas as suas conversas estão em dia! 🎉
          </EmptyDescription>
        </EmptyState>
      );
    }

    return (
      <EmptyState>
        <EmptyIcon $isDark={isDark}>
          <MessageCircle size={48} />
        </EmptyIcon>
        <EmptyTitle $isDark={isDark}>Nenhum chat disponível</EmptyTitle>
        <EmptyDescription $isDark={isDark}>
          Conecte uma instância para ver suas conversas
        </EmptyDescription>
      </EmptyState>
    );
  };

  return (
    <ContactListContainer $isDark={isDark}>
      {/* Header com busca e filtros */}
      <ContactHeader />

      {/* Lista de contatos */}
      <ContactsContainer $isDark={isDark}>
        {loading ? (
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        ) : hasChats ? (
          <div className="space-y-1">
            {chats.map((chat) => (
              <ContactItem
                key={chat.id}
                chat={chat}
                isSelected={selectedChat?.id === chat.id}
                onClick={selectChat}
              />
            ))}
          </div>
        ) : (
          renderEmptyState()
        )}
      </ContactsContainer>
    </ContactListContainer>
  );
};
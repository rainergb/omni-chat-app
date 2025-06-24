// src/components/chatpage/components/ChatWindow/ChatWindow.tsx
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "./ChatHeader/ChatHeader";
import { MessageList } from "./MessageList/MessageList";
import { MessageInput } from "./MessageInput/MessageInput";
import {
  ChatWindowContainer,
  ChatContent,
  InputContainer
} from "./ChatWindow.styles";

export const ChatWindow: React.FC = () => {
  const { isDark } = useTheme();
  const {
    selectedChat,
    currentMessages,
    loadingMessages,
    sendMessage,
    clearSelection
  } = useChat();

  if (!selectedChat) {
    return null;
  }

  return (
    <ChatWindowContainer $isDark={isDark}>
      {/* Header do Chat */}
      <ChatHeader chat={selectedChat} onBack={clearSelection} />

      {/* Conteúdo Principal */}
      <ChatContent>
        <MessageList
          messages={currentMessages}
          loading={loadingMessages}
          chatId={selectedChat.id}
        />
      </ChatContent>

      {/* Input de Mensagem */}
      <InputContainer $isDark={isDark}>
        <MessageInput
          onSendMessage={sendMessage}
          placeholder="Type a message..."
          disabled={loadingMessages}
        />
      </InputContainer>
    </ChatWindowContainer>
  );
};

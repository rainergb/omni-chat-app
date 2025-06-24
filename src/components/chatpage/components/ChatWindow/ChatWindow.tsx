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

  // Se não há chat selecionado, não renderizar nada
  if (!selectedChat) {
    console.log("ChatWindow: Nenhum chat selecionado");
    return null;
  }

  console.log("ChatWindow: Renderizando com chat:", selectedChat.contactName);

  const handleCall = () => {
    console.log("Iniciando chamada de áudio para:", selectedChat.contactName);
  };

  const handleVideoCall = () => {
    console.log("Iniciando chamada de vídeo para:", selectedChat.contactName);
  };

  const handleInfo = () => {
    console.log("Abrindo informações do contato:", selectedChat.contactName);
  };

  return (
    <ChatWindowContainer $isDark={isDark}>
      {/* Header do Chat - sempre presente quando há chat selecionado */}
      <ChatHeader
        chat={selectedChat}
        onBack={clearSelection}
        onCall={!selectedChat.isGroup ? handleCall : undefined}
        onVideoCall={!selectedChat.isGroup ? handleVideoCall : undefined}
        onInfo={handleInfo}
      />

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

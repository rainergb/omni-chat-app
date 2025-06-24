// src/components/chatpage/components/ChatLayout/ChatLayout.tsx
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useChat } from "@/hooks/useChat";
import { ContactList } from "../ContactList/ContactList";
import { ChatWindow } from "../ChatWindow/ChatWindow";
import { ChatEmpty } from "../ChatEmpty/ChatEmpty";
import { ChatSelector } from "../ChatSelector/ChatSelector";
import {
  LayoutContainer,
  LeftPanel,
  RightPanel,
  MobileOverlay,
  NoInstanceContainer,
} from "./ChatLayout.styles";

export const ChatLayout: React.FC = () => {
  const { isDark } = useTheme();
  const { selectedChat, hasAvailableInstances, selectInstance } = useChat();

  // Se não há instâncias conectadas, mostrar seletor
  if (!hasAvailableInstances) {
    return (
      <LayoutContainer $isDark={isDark}>
        <NoInstanceContainer>
          <ChatSelector onSelectInstance={selectInstance} />
        </NoInstanceContainer>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer $isDark={isDark}>
      {/* Painel Esquerdo - Lista de Contatos */}
      <LeftPanel $isDark={isDark} $hasSelectedChat={!!selectedChat}>
        <ContactList />
      </LeftPanel>

      {/* Painel Direito - Janela de Chat */}
      <RightPanel $isDark={isDark} $hasSelectedChat={!!selectedChat}>
        {selectedChat ? <ChatWindow /> : <ChatEmpty />}
      </RightPanel>

      {/* Overlay para mobile quando um chat está selecionado */}
      {selectedChat && (
        <MobileOverlay $isDark={isDark}>
          <ChatWindow />
        </MobileOverlay>
      )}
    </LayoutContainer>
  );
};
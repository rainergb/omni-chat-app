// src/components/chatpage/components/ChatEmpty/ChatEmpty.tsx
import React from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  EmptyContainer,
  EmptyContent,
  EmptyIcon,
  EmptyTitle,
  EmptySubtitle,
  EmptyDescription,
  EmptyImage,
} from "./ChatEmpty.styles";

export const ChatEmpty: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <EmptyContainer $isDark={isDark}>
      <EmptyContent>
        {/* Ilustração */}
        <EmptyImage $isDark={isDark}>
          <EmptyIcon $isDark={isDark}>
            <MessageCircle size={80} />
          </EmptyIcon>
        </EmptyImage>

        {/* Conteúdo */}
        <EmptyTitle $isDark={isDark}>
          Selecione uma conversa
        </EmptyTitle>
        
        <EmptySubtitle $isDark={isDark}>
          Escolha um chat para começar a conversar
        </EmptySubtitle>

        <EmptyDescription $isDark={isDark}>
          <div className="flex items-center gap-2 text-sm">
            <ArrowLeft size={16} />
            <span>Selecione um contato da lista ao lado</span>
          </div>
        </EmptyDescription>
      </EmptyContent>
    </EmptyContainer>
  );
};
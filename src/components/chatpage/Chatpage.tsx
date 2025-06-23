// src/components/chatpage/Chatpage.tsx
import React from "react";
import { MessageOutlined, ToolOutlined } from "@ant-design/icons";
import { useTheme } from "@/contexts/ThemeContext";
import styled from "styled-components";

const ChatPageContainer = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
  background: ${(props) =>
    props.$isDark
      ? "linear-gradient(135deg, #374151 0%, #1f2937 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"};
  border-radius: 16px;
  margin: 1rem;
`;

const IconContainer = styled.div<{ $isDark: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: ${(props) =>
    props.$isDark
      ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
      : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  .anticon {
    font-size: 36px;
    color: white;
  }
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#1f2937")};

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p<{ $isDark: boolean }>`
  font-size: 1.125rem;
  color: ${(props) => (props.$isDark ? "#d1d5db" : "#6b7280")};
  margin-bottom: 2rem;
  max-width: 500px;
  line-height: 1.6;
`;

const StatusBadge = styled.div<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 24px;
  background: ${(props) =>
    props.$isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.1)"};
  border: 1px solid
    ${(props) =>
      props.$isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"};
  color: ${(props) => (props.$isDark ? "#60a5fa" : "#3b82f6")};
  font-weight: 500;

  .anticon {
    font-size: 16px;
  }
`;

export const Chatpage: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <ChatPageContainer $isDark={isDark}>
      <IconContainer $isDark={isDark}>
        <MessageOutlined />
      </IconContainer>

      <Title $isDark={isDark}>Chat em Desenvolvimento</Title>

      <Subtitle $isDark={isDark}>
        Estamos trabalhando para trazer uma experiência incrível de chat para
        você. Esta funcionalidade estará disponível em breve com recursos
        avançados de mensagens.
      </Subtitle>

      <StatusBadge $isDark={isDark}>
        <ToolOutlined />
        Em desenvolvimento - Disponível em breve
      </StatusBadge>
    </ChatPageContainer>
  );
};

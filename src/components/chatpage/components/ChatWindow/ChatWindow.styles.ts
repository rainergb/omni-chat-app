// src/components/chatpage/components/ChatWindow/ChatWindow.styles.ts
import styled from "styled-components";

interface StyledProps {
  $isDark?: boolean;
}

export const ChatWindowContainer = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${(props) => (props.$isDark ? "#030712" : "#f8fafc")};
  position: relative;
`;

export const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

export const InputContainer = styled.div<StyledProps>`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;
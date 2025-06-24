// src/components/chatpage/components/ChatWindow/MessageList.styles.ts
import styled from "styled-components";

interface StyledProps {
  $isDark?: boolean;
}

export const MessageListContainer = styled.div<StyledProps>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${(props) => (props.$isDark ? "#030712" : "#f8fafc")};
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => (props.$isDark ? "#4b5563" : "#d1d5db")};
    border-radius: 3px;
    
    &:hover {
      background: ${(props) => (props.$isDark ? "#6b7280" : "#9ca3af")};
    }
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: ${(props) =>
    props.$isDark ? "#4b5563 transparent" : "#d1d5db transparent"};
`;

export const MessageListContent = styled.div`
  padding: 1rem 1.5rem;
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 3rem 1rem;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 3rem 2rem;
  text-align: center;
`;

export const EmptyIcon = styled.div<StyledProps>`
  margin-bottom: 1.5rem;
  color: ${(props) => (props.$isDark ? "#6b7280" : "#9ca3af")};
  opacity: 0.6;
`;

export const EmptyTitle = styled.h3<StyledProps>`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${(props) => (props.$isDark ? "#e5e7eb" : "#374151")};
`;

export const EmptyDescription = styled.p<StyledProps>`
  font-size: 0.875rem;
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  line-height: 1.5;
  max-width: 280px;
`;

export const DateSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      rgba(156, 163, 175, 0.3) 20%,
      rgba(156, 163, 175, 0.3) 80%,
      transparent
    );
  }
`;

export const DateText = styled.div<StyledProps>`
  background: ${(props) => (props.$isDark ? "#030712" : "#f8fafc")};
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  border-radius: 12px;
  position: relative;
  z-index: 1;
`;
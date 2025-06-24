// src/components/chatpage/components/ContactList/ContactList.styles.ts
import styled from "styled-components";

interface StyledProps {
  $isDark?: boolean;
}

export const ContactListContainer = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
`;

export const ContactsContainer = styled.div<StyledProps>`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => (props.$isDark ? "#1f2937" : "#f3f4f6")};
    border-radius: 3px;
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
    props.$isDark ? "#4b5563 #1f2937" : "#d1d5db #f3f4f6"};
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  height: 100%;
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
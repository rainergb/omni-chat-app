// src/components/chatpage/components/ChatEmpty/ChatEmpty.styles.ts
import styled from "styled-components";

interface StyledProps {
  $isDark?: boolean;
}

export const EmptyContainer = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  background: ${(props) => (props.$isDark ? "#030712" : "#f8fafc")};
  padding: 2rem;
`;

export const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

export const EmptyImage = styled.div<StyledProps>`
  margin-bottom: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: ${(props) =>
      props.$isDark
        ? "linear-gradient(135deg, rgba(0, 185, 174, 0.1) 0%, rgba(31, 41, 55, 0.3) 100%)"
        : "linear-gradient(135deg, rgba(0, 185, 174, 0.1) 0%, rgba(248, 250, 252, 0.8) 100%)"};
    border-radius: 50%;
    z-index: 0;
  }
`;

export const EmptyIcon = styled.div<StyledProps>`
  position: relative;
  z-index: 1;
  color: ${(props) => (props.$isDark ? "#00b9ae" : "#00b9ae")};
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const EmptyTitle = styled.h2<StyledProps>`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
`;

export const EmptySubtitle = styled.h3<StyledProps>`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: ${(props) => (props.$isDark ? "#d1d5db" : "#6b7280")};
`;

export const EmptyDescription = styled.div<StyledProps>`
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#9ca3af")};
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;
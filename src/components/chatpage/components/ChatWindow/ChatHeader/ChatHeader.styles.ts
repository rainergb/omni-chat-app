// src/components/chatpage/components/ChatWindow/ChatHeader.styles.ts
import styled from "styled-components";
import { Button } from "antd";

interface StyledProps {
  $isDark?: boolean;
}

export const HeaderContainer = styled.div<StyledProps>`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
`;

export const BackButton = styled(Button)<StyledProps>`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    color: ${(props) => (props.$isDark ? "#d1d5db" : "#374151")};
    
    &:hover {
      background: ${(props) => (props.$isDark ? "#374151" : "#f3f4f6")} !important;
      color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")} !important;
    }
  }
`;

export const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
`;

export const ContactAvatar = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const OnlineIndicator = styled.div<StyledProps>`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #00b9ae;
  border: 2px solid ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  border-radius: 50%;
  z-index: 1;
`;

export const ContactDetails = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

export const ContactName = styled.h3<StyledProps>`
  font-weight: 600;
  font-size: 1rem;
  margin: 0 0 0.125rem 0;
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
`;

export const ContactStatus = styled.p<StyledProps>`
  font-size: 0.75rem;
  margin: 0;
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
`;

export const ActionButton = styled(Button)<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  
  &:hover {
    background: ${(props) => (props.$isDark ? "#374151" : "#f3f4f6")} !important;
    color: ${(props) => (props.$isDark ? "#d1d5db" : "#374151")} !important;
  }
  
  &:focus {
    background: ${(props) => (props.$isDark ? "#374151" : "#f3f4f6")} !important;
    color: ${(props) => (props.$isDark ? "#d1d5db" : "#374151")} !important;
  }
`;
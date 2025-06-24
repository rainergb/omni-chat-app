// src/components/chatpage/components/ContactList/ContactItem.styles.ts
import styled from "styled-components";

interface StyledProps {
  $isDark?: boolean;
  $isSelected?: boolean;
  $hasUnread?: boolean;
}

export const ContactItemContainer = styled.div<StyledProps>`
  padding: 0.75rem;
  margin: 0.25rem 0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  background: ${(props) => {
    if (props.$isSelected) {
      return props.$isDark
        ? "linear-gradient(135deg, rgba(0, 185, 174, 0.15) 0%, rgba(31, 41, 55, 0.3) 100%)"
        : "linear-gradient(135deg, rgba(0, 185, 174, 0.1) 0%, rgba(248, 250, 252, 0.8) 100%)";
    }
    return "transparent";
  }};

  border-color: ${(props) => {
    if (props.$isSelected) {
      return props.$isDark ? "rgba(0, 185, 174, 0.3)" : "rgba(0, 185, 174, 0.2)";
    }
    return "transparent";
  }};

  &:hover {
    background: ${(props) => {
      if (props.$isSelected) {
        return props.$isDark
          ? "linear-gradient(135deg, rgba(0, 185, 174, 0.2) 0%, rgba(31, 41, 55, 0.4) 100%)"
          : "linear-gradient(135deg, rgba(0, 185, 174, 0.15) 0%, rgba(248, 250, 252, 0.9) 100%)";
      }
      return props.$isDark ? "#1f2937" : "#f8fafc";
    }};
    
    transform: translateY(-1px);
    box-shadow: ${(props) =>
      props.$isDark
        ? "0 4px 12px rgba(0, 0, 0, 0.3)"
        : "0 4px 12px rgba(0, 0, 0, 0.1)"};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ContactContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ContactAvatar = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const OnlineIndicator = styled.div<StyledProps>`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #00b9ae;
  border: 2px solid ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  border-radius: 50%;
  z-index: 1;
`;

export const ContactInfo = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

export const ContactName = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: ${(props) => {
    if (props.$isSelected) {
      return props.$isDark ? "#f9fafb" : "#111827";
    }
    return props.$isDark ? "#e5e7eb" : "#374151";
  }};
  
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StatusIndicators = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  margin-left: 0.5rem;
  
  svg {
    opacity: 0.6;
  }
`;

export const LastMessage = styled.div<StyledProps>`
  font-size: 0.75rem;
  color: ${(props) => {
    if (props.$hasUnread) {
      return props.$isDark ? "#d1d5db" : "#4b5563";
    }
    return props.$isDark ? "#9ca3af" : "#6b7280";
  }};
  
  font-weight: ${(props) => (props.$hasUnread ? "500" : "400")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
`;

export const ContactMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
`;

export const TimeStamp = styled.div<StyledProps>`
  font-size: 0.6875rem;
  color: ${(props) => {
    if (props.$isSelected) {
      return props.$isDark ? "#d1d5db" : "#6b7280";
    }
    return props.$isDark ? "#9ca3af" : "#9ca3af";
  }};
  
  white-space: nowrap;
  font-weight: 400;
`;

export const UnreadBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
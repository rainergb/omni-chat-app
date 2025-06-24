// src/components/chatpage/components/ChatWindow/MessageBubble.styles.ts
import styled from "styled-components";

interface StyledProps {
  $isDark?: boolean;
  $isMe?: boolean;
  $isGrouped?: boolean;
}

export const MessageContainer = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => (props.$isGrouped ? "0.125rem" : "0.5rem")};
  width: 100%;
`;

export const MessageWrapper = styled.div<StyledProps>`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  justify-content: ${(props) => (props.$isMe ? "flex-end" : "flex-start")};
  max-width: 100%;
`;

export const AvatarContainer = styled.div`
  flex-shrink: 0;
  margin-bottom: 0.25rem;
`;

export const BubbleContainer = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  max-width: 70%;
  min-width: 0;
  
  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

export const MessageBubble = styled.div<StyledProps>`
  position: relative;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  word-wrap: break-word;
  word-break: break-word;
  
  background: ${(props) => {
    if (props.$isMe) {
      return "linear-gradient(135deg, #00b9ae 0%, #00a69b 100%)";
    }
    return props.$isDark ? "#1f2937" : "#ffffff";
  }};
  
  color: ${(props) => {
    if (props.$isMe) {
      return "#ffffff";
    }
    return props.$isDark ? "#f9fafb" : "#111827";
  }};
  
  box-shadow: ${(props) => 
    props.$isDark 
      ? "0 1px 3px rgba(0, 0, 0, 0.3)"
      : "0 1px 3px rgba(0, 0, 0, 0.1)"
  };
  
  border: ${(props) => {
    if (props.$isMe) return "none";
    return props.$isDark ? "1px solid #374151" : "1px solid #e5e7eb";
  }};
  
  /* Bordas específicas para agrupamento */
  ${(props) => {
    if (props.$isGrouped) {
      if (props.$isMe) {
        return `
          border-bottom-right-radius: 6px;
          margin-bottom: 0.125rem;
        `;
      } else {
        return `
          border-bottom-left-radius: 6px;
          margin-bottom: 0.125rem;
        `;
      }
    }
    return "";
  }}
  
  /* Cauda da mensagem */
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 0;
    height: 0;
    border: 8px solid transparent;
    
    ${(props) => {
      if (props.$isGrouped) return "display: none;";
      
      if (props.$isMe) {
        return `
          right: -6px;
          border-left-color: #00b9ae;
          border-bottom: none;
        `;
      } else {
        const color = props.$isDark ? "#1f2937" : "#ffffff";
        return `
          left: -6px;
          border-right-color: ${color};
          border-bottom: none;
        `;
      }
    }}
  }
  
  /* Cauda externa (borda) para mensagens recebidas */
  &::after {
    ${(props) => {
      if (props.$isGrouped || props.$isMe) return "display: none;";
      
      const borderColor = props.$isDark ? "#374151" : "#e5e7eb";
      return `
        content: '';
        position: absolute;
        bottom: -1px;
        left: -7px;
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-right-color: ${borderColor};
        border-bottom: none;
        z-index: -1;
      `;
    }}
  }
`;

export const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const SenderName = styled.div<StyledProps>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => (props.$isDark ? "#00b9ae" : "#00a69b")};
  margin-bottom: 0.125rem;
`;

export const MessageText = styled.div<StyledProps>`
  font-size: 0.875rem;
  line-height: 1.4;
  white-space: pre-wrap;
  color: ${(props) => {
    if (props.$isMe) return "#ffffff";
    return props.$isDark ? "#f9fafb" : "#111827";
  }};
`;

export const MessageMeta = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$isMe ? "flex-end" : "flex-start")};
  gap: 0.25rem;
  margin-top: 0.25rem;
`;

export const MessageTime = styled.span<StyledProps>`
  font-size: 0.6875rem;
  color: ${(props) => {
    if (props.$isMe) return "rgba(255, 255, 255, 0.8)";
    return props.$isDark ? "#9ca3af" : "#6b7280";
  }};
  user-select: none;
`;

export const MessageStatus = styled.span<StyledProps>`
  display: flex;
  align-items: center;
  color: ${() => {
    return "rgba(255, 255, 255, 0.8)";
  }};
  margin-left: 0.25rem;
`;
// src/components/chatpage/components/ChatWindow/MessageInput.styles.ts
import styled from "styled-components";
import { Button } from "antd";

interface StyledProps {
  $isDark?: boolean;
  $hasMessage?: boolean;
  $isRecording?: boolean;
}

export const InputContainer = styled.div<StyledProps>`
  width: 100%;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  width: 100%;
`;

export const AttachButton = styled(Button)<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  
  &:hover {
    background: ${(props) => (props.$isDark ? "#374151" : "#f3f4f6")} !important;
    color: ${(props) => (props.$isDark ? "#d1d5db" : "#374151")} !important;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TextInputContainer = styled.div<StyledProps>`
  flex: 1;
  display: flex;
  align-items: flex-end;
  background: ${(props) => (props.$isDark ? "#1f2937" : "#ffffff")};
  border: 1px solid ${(props) => (props.$isDark ? "#374151" : "#d1d5db")};
  border-radius: 22px;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: #00b9ae;
    box-shadow: 0 0 0 3px rgba(0, 185, 174, 0.1);
  }
`;

export const TextInput = styled.textarea<StyledProps>`
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
  font-size: 0.875rem;
  line-height: 1.4;
  padding: 0.25rem 0;
  min-height: 20px;
  max-height: 120px;
  overflow-y: auto;
  font-family: inherit;
  
  &::placeholder {
    color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => (props.$isDark ? "#4b5563" : "#d1d5db")};
    border-radius: 2px;
  }
`;

export const EmojiButton = styled(Button)<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  margin-left: 0.25rem;
  
  &:hover {
    background: ${(props) => (props.$isDark ? "#374151" : "#f3f4f6")} !important;
    color: ${(props) => (props.$isDark ? "#d1d5db" : "#374151")} !important;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const SendButton = styled(Button)<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #00b9ae 0%, #00a69b 100%);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 185, 174, 0.3);
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #00a69b 0%, #008a82 100%) !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 185, 174, 0.4) !important;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const MicButton = styled(Button)<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: ${(props) => {
    if (props.$isRecording) {
      return "#ef4444";
    }
    return "transparent";
  }};
  color: ${(props) => {
    if (props.$isRecording) {
      return "#ffffff";
    }
    return props.$isDark ? "#9ca3af" : "#6b7280";
  }};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props) => {
      if (props.$isRecording) {
        return "#dc2626 !important";
      }
      return props.$isDark ? "#374151 !important" : "#f3f4f6 !important";
    }};
    color: ${(props) => {
      if (props.$isRecording) {
        return "#ffffff !important";
      }
      return props.$isDark ? "#d1d5db !important" : "#374151 !important";
    }};
  }
  
  ${(props) => props.$isRecording && `
    animation: pulse 1.5s infinite;
    
    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
      }
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
// src/components/chatpage/components/ChatWindow/MessageInput.tsx
import React, { useState, useRef, KeyboardEvent } from "react";
import { Tooltip } from "antd";
import { Send, Smile, Paperclip, Mic } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { MessageInputProps } from "@/components/chatpage/types/chat.types";
import {
  InputContainer,
  InputWrapper,
  AttachButton,
  TextInputContainer,
  TextInput,
  EmojiButton,
  SendButton,
  MicButton,
  ActionsContainer
} from "./MessageInput.styles";

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message..."
}) => {
  const { isDark } = useTheme();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage("");

      // Reset altura do textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  const handleAttachment = () => {
    // TODO: Implementar upload de arquivos
    console.log("Anexar arquivo");
  };

  const handleEmoji = () => {
    // TODO: Implementar seletor de emoji
    console.log("Abrir seletor de emoji");
  };

  const handleVoiceMessage = () => {
    if (isRecording) {
      // Parar gravação
      setIsRecording(false);
      console.log("Parar gravação de áudio");
    } else {
      // Iniciar gravação
      setIsRecording(true);
      console.log("Iniciar gravação de áudio");
    }
  };

  const hasMessage = message.trim().length > 0;

  return (
    <InputContainer $isDark={isDark}>
      <InputWrapper>
        {/* Botão de anexo */}
        <Tooltip title="Anexar arquivo">
          <AttachButton
            type="text"
            icon={<Paperclip size={20} />}
            onClick={handleAttachment}
            disabled={disabled}
            $isDark={isDark}
          />
        </Tooltip>

        {/* Campo de texto */}
        <TextInputContainer $isDark={isDark} $hasMessage={hasMessage}>
          <TextInput
            ref={textareaRef}
            $isDark={isDark}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
          />

          {/* Botão de emoji */}
          <Tooltip title="Emoji">
            <EmojiButton
              type="text"
              icon={<Smile size={18} />}
              onClick={handleEmoji}
              disabled={disabled}
              $isDark={isDark}
            />
          </Tooltip>
        </TextInputContainer>

        {/* Ações (enviar ou áudio) */}
        <ActionsContainer>
          {hasMessage ? (
            <Tooltip title="Enviar mensagem">
              <SendButton
                type="primary"
                icon={<Send size={18} />}
                onClick={handleSendMessage}
                disabled={disabled}
                $isDark={isDark}
              />
            </Tooltip>
          ) : (
            <Tooltip title={isRecording ? "Parar gravação" : "Gravar áudio"}>
              <MicButton
                type="text"
                icon={<Mic size={20} />}
                onClick={handleVoiceMessage}
                disabled={disabled}
                $isDark={isDark}
                $isRecording={isRecording}
              />
            </Tooltip>
          )}
        </ActionsContainer>
      </InputWrapper>
    </InputContainer>
  );
};

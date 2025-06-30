"use client";

import React from "react";
import { Spin, Button as AntButton } from "antd";
import { QrCode, X, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInstanceQRCode } from "@/hooks/useInstance";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal/Modal";
import {
  TitleContainer,
  FooterContainer,
  StyledChatButton,
  MainContainer,
  LoadingContainer,
  LoadingText,
  ErrorContainer,
  ErrorIconContainer,
  ErrorTitle,
  ErrorMessage,
  QRContainer,
  QRImageContainer,
  InstructionsContainer,
  InstructionTitle,
  InstructionSubtitle,
  EmptyContainer,
  EmptyIconContainer,
  EmptyText
} from "./QRCodeModal.styles";

interface QrCodeModalProps {
  id: string | null;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

export default function QrCodeModal({
  id,
  isOpen,
  onClose,
  loading: externalLoading = false
}: QrCodeModalProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const { data, isLoading, error } = useInstanceQRCode(id || "");

  const handleGoToChatPage = () => {
    router.push("/chatpage");
    onClose();
  };

  const isLoadingQR = externalLoading || isLoading;

  console.log(
    "QRCodeModal - isOpen:",
    isOpen,
    "id:",
    id,
    "data:",
    data,
    "isLoading:",
    isLoading,
    "error:",
    error
  );

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={
        <TitleContainer>
          <QrCode size={20} color="#3b82f6" />
        </TitleContainer>
      }
      footer={
        <FooterContainer>
          <StyledChatButton>
            <AntButton
              type="primary"
              icon={<MessageCircle size={16} />}
              onClick={handleGoToChatPage}
              size="large"
            >
              Ir para Chat
            </AntButton>
          </StyledChatButton>
        </FooterContainer>
      }
      width="90%"
      maxWidth="400px"
      destroyOnHidden={true}
    >
      <MainContainer>
        {isLoadingQR ? (
          <LoadingContainer>
            <Spin size="large" />
            <LoadingText $isDark={isDark}>Gerando QR Code...</LoadingText>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorIconContainer $isDark={isDark}>
              <X size={32} color="#ef4444" />
            </ErrorIconContainer>
            <ErrorTitle>Erro ao gerar QR Code</ErrorTitle>
            <ErrorMessage $isDark={isDark}>
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </ErrorMessage>
          </ErrorContainer>
        ) : data ? (
          <QRContainer>
            <QRImageContainer>
              <Image
                src={data}
                alt="QR Code"
                width={200}
                height={200}
                style={{ borderRadius: "4px" }}
                unoptimized
              />
            </QRImageContainer>
            <InstructionsContainer $isDark={isDark}>
              <InstructionTitle>
                Escaneie o código com seu celular
              </InstructionTitle>
              <InstructionSubtitle>
                Abra o WhatsApp &gt; Menu &gt; Dispositivos conectados
              </InstructionSubtitle>
            </InstructionsContainer>
          </QRContainer>
        ) : (
          <EmptyContainer>
            <EmptyIconContainer $isDark={isDark}>
              <QrCode size={32} color={isDark ? "#9ca3af" : "#6b7280"} />
            </EmptyIconContainer>
            <EmptyText $isDark={isDark}>Nenhum QR Code disponível</EmptyText>
          </EmptyContainer>
        )}
      </MainContainer>
    </Modal>
  );
}

// src/components/instances/Components/QRCodeModal/QRCodeModal.tsx (Adaptado)
import React, { useState, useEffect } from "react";
import { QRCode, Button, Alert, Spin, Progress } from "antd";
import {
  ReloadOutlined,
  CheckCircleOutlined,
  WifiOutlined
} from "@ant-design/icons";
import { Smartphone } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useInstanceStore } from "@/store/instanceStore";
import { useGetQRCode } from "@/hooks/useWhatsAppInstances";

interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  instanceId: string;
  isWhatsApp?: boolean; // Nova prop para determinar se é WhatsApp real
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  open,
  onClose,
  instanceId,
  isWhatsApp = false // Por padrão é false para manter compatibilidade
}) => {
  const { instances, updateInstance } = useInstanceStore();
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Aguardando QR Code...");

  const instance = instances.find((i) => i.id === instanceId);

  // Hook para WhatsApp real - só ativa se isWhatsApp = true
  const {
    data: whatsappQrData,
    isLoading: whatsappQrLoading,
    error: whatsappQrError,
    refetch: refetchWhatsAppQR
  } = useGetQRCode(instanceId, open && isWhatsApp);

  // WebSocket para WhatsApp real - só conecta se isWhatsApp = true


  // Função para gerar QR Code mock (sistema antigo)
  const generateMockQRCode = React.useCallback(async () => {
    setLoading(true);
    setConnected(false);
    setStatusMessage("Gerando QR Code...");

    // Simula geração do QR Code
    setTimeout(() => {
      const mockQR = `omnichat-${instanceId}-${Date.now()}`;
      setQrCode(mockQR);
      setLoading(false);
      setStatusMessage("QR Code gerado. Escaneie para conectar!");
      setConnectionProgress(25);

      // Simula conexão automática após 5 segundos
      setTimeout(() => {
        setConnected(true);
        setStatusMessage("Conectado com sucesso!");
        setConnectionProgress(100);

        updateInstance(instanceId, {
          status: "connected",
          lastActivity: new Date().toISOString()
        });

        // Fecha o modal após 2 segundos
        setTimeout(() => {
          onClose();
        }, 2000);
      }, 5000);
    }, 1500);
  }, [instanceId, updateInstance, onClose]);

  // Effect para inicializar QR Code baseado no tipo
  useEffect(() => {
    if (open && instanceId) {
      if (isWhatsApp) {
        // Para WhatsApp, o hook useGetQRCode já faz o fetch automaticamente
        setStatusMessage("Carregando QR Code WhatsApp...");
        setConnectionProgress(0);
      } else {
        // Para outras plataformas, usar sistema mock
        generateMockQRCode();
      }
    }
  }, [open, instanceId, isWhatsApp, generateMockQRCode]);

  // Effect para atualizar estado baseado no QR do WhatsApp
  useEffect(() => {
    if (isWhatsApp && whatsappQrData?.qrcode && !whatsappQrLoading) {
      setQrCode(whatsappQrData.qrcode);
      setStatusMessage("QR Code WhatsApp gerado. Escaneie com seu WhatsApp!");
      setConnectionProgress(25);
      setLoading(false);
    }
  }, [isWhatsApp, whatsappQrData, whatsappQrLoading]);

  // Effect para reset quando modal fecha
  useEffect(() => {
    if (!open) {
      setQrCode("");
      setLoading(false);
      setConnected(false);
      setConnectionProgress(0);
      setStatusMessage("Aguardando QR Code...");
    }
  }, [open]);

  const handleRefresh = () => {
    if (isWhatsApp) {
      refetchWhatsAppQR();
      setConnectionProgress(0);
      setStatusMessage("Gerando novo QR Code WhatsApp...");
    } else {
      generateMockQRCode();
    }
  };

  const getQRCodeDisplay = () => {
    const isLoadingQR = isWhatsApp ? whatsappQrLoading : loading;
    const hasError = isWhatsApp ? whatsappQrError : false;
    const currentQrCode = qrCode;

    if (isLoadingQR) {
      return (
        <div className="flex flex-col items-center space-y-4 py-8">
          <Spin size="large" />
          <p className="text-sm text-gray-500">
            {isWhatsApp ? "Gerando QR Code WhatsApp..." : "Gerando QR Code..."}
          </p>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="flex flex-col items-center space-y-4 py-8">
          <WifiOutlined style={{ fontSize: 48 }} className="text-red-500" />
          <p className="text-sm text-red-500">
            {isWhatsApp
              ? "Erro ao gerar QR Code WhatsApp"
              : "Erro ao gerar QR Code"}
          </p>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            className={isWhatsApp ? "bg-green-500 hover:bg-green-600" : ""}
          >
            Tentar Novamente
          </Button>
        </div>
      );
    }

    if (currentQrCode) {
      return (
        <div className="space-y-4">
          <QRCode
            value={currentQrCode}
            size={window.innerWidth < 640 ? 200 : 250}
            errorLevel="H"
            className="mx-auto"
          />
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              QR Code válido por 2 minutos
            </p>
            <div className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
              ID: {isWhatsApp ? instanceId : currentQrCode.slice(-10)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-sm text-gray-500 py-8 text-center">
        Erro ao gerar QR Code
      </div>
    );
  };

  const getInstructions = () => {
    if (isWhatsApp) {
      return (
        <ol className="text-left text-sm mt-2 space-y-1 list-decimal list-inside">
          <li>Abra o WhatsApp no seu celular</li>
          <li>Vá em Menu (⋮) → Aparelhos conectados</li>
          <li>Toque em Conectar um aparelho</li>
          <li>Escaneie o QR Code abaixo</li>
        </ol>
      );
    }

    return (
      <ol className="text-left text-sm mt-2 space-y-1 list-decimal list-inside">
        <li>Abra o aplicativo no seu dispositivo</li>
        <li>Vá em Configurações → Dispositivos Conectados</li>
        <li>Escaneie o QR Code abaixo</li>
        <li>Aguarde a confirmação da conexão</li>
      </ol>
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <Smartphone
            className={isWhatsApp ? "text-green-500" : "text-blue-500"}
          />
          <span>Conectar {instance?.name || "Instância"}</span>
          {isWhatsApp && (
            <span className="text-sm text-green-500">(WhatsApp)</span>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between">


          <div className="flex gap-2">
            <Button onClick={onClose}>Fechar</Button>
            {!connected && qrCode && (
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={isWhatsApp ? whatsappQrLoading : loading}
                className={isWhatsApp ? "bg-green-500 hover:bg-green-600" : ""}
                style={
                  isWhatsApp
                    ? {
                      background:
                        "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                      borderColor: "transparent",
                      boxShadow: "0 4px 14px 0 rgba(37, 211, 102, 0.3)"
                    }
                    : {
                      background:
                        "linear-gradient(135deg, #00b9ae 0%, #1f2937 100%)",
                      borderColor: "transparent",
                      boxShadow: "0 4px 14px 0 rgba(0, 185, 174, 0.3)"
                    }
                }
              >
                {isWhatsApp ? "Atualizar QR WhatsApp" : "Gerar Novo QR"}
              </Button>
            )}
          </div>
        </div>
      }
      destroyOnHidden={true}
      width="95%"
      maxWidth="500px"
      className={`${isWhatsApp ? "whatsapp-qr-modal" : "qr-modal"}`}
    >
      <div className="space-y-6">
        {(isWhatsApp || connectionProgress > 0) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status da Conexão</span>
              <span className="text-xs text-gray-500">
                {connectionProgress}%
              </span>
            </div>
            <Progress
              percent={connectionProgress}
              status={
                connected
                  ? "success"
                  : connectionProgress > 0
                    ? "active"
                    : "normal"
              }
              showInfo={false}
              strokeColor={isWhatsApp ? "#25D366" : "#00b9ae"}
            />
            <p className="text-sm text-center text-gray-600">{statusMessage}</p>
          </div>
        )}

        {connected ? (
          <div className="text-center space-y-4 py-6">
            <CheckCircleOutlined
              className={`text-6xl animate-pulse ${isWhatsApp ? "text-green-500" : "text-blue-500"
                }`}
            />
            <div>
              <h3
                className={`text-lg font-semibold mb-2 ${isWhatsApp ? "text-green-600" : "text-blue-600"
                  }`}
              >
                Conectado com sucesso!
              </h3>
              <p className="text-sm text-gray-600">
                {isWhatsApp
                  ? "A instância WhatsApp está agora conectada e funcionando."
                  : "A instância está agora conectada e funcionando."}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Este modal será fechado automaticamente...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Instruções */}
            <Alert
              message={
                isWhatsApp
                  ? "Como conectar sua instância WhatsApp"
                  : "Como conectar"
              }
              description={getInstructions()}
              type="info"
              showIcon
              className="text-left"
            />

            {/* QR Code */}
            <div
              className={`bg-white dark:bg-gray-800 p-6 rounded-lg border text-center ${isWhatsApp
                ? "border-green-200 dark:border-green-800"
                : "border-gray-200 dark:border-gray-700"
                }`}
            >
              {getQRCodeDisplay()}
            </div>

            {isWhatsApp && whatsappQrError && (
              <Alert
                message="Erro na API WhatsApp"
                description={`Não foi possível gerar o QR Code: ${whatsappQrError.message}`}
                type="error"
                showIcon
                closable
              />
            )}

            {/* Status de aguardo */}
            <Alert
              message="Aguardando conexão..."
              description={`O QR Code foi gerado. Escaneie com ${isWhatsApp ? "seu WhatsApp" : "seu dispositivo"
                } para conectar a instância.`}
              type="warning"
              showIcon
              className="animate-pulse"
            />
          </>
        )}
      </div>
    </Modal>
  );
};

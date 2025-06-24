import React, { useState, useEffect } from "react";
import { QRCode, Button, Alert, Spin } from "antd";
import { ReloadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Modal } from "@/components/ui/Modal";
import { useInstanceStore } from "@/store/instanceStore";

interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  instanceId: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  open,
  onClose,
  instanceId
}) => {
  const { instances, updateInstance } = useInstanceStore();
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const instance = instances.find((i) => i.id === instanceId);
  const generateQRCode = React.useCallback(async () => {
    setLoading(true);
    setConnected(false);

    // Simula geração do QR Code
    setTimeout(() => {
      const mockQR = `omnichat-${instanceId}-${Date.now()}`;
      setQrCode(mockQR);
      setLoading(false);

      // Simula conexão automática após 5 segundos
      setTimeout(() => {
        setConnected(true);
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

  useEffect(() => {
    if (open && instanceId) {
      generateQRCode();
    }
  }, [open, instanceId, generateQRCode]);

  useEffect(() => {
    if (!open) {
      setQrCode("");
      setLoading(false);
      setConnected(false);
    }
  }, [open]);

  const handleRefresh = () => {
    generateQRCode();
  };  return (
    <Modal
      title={`Conectar ${instance?.name || "Instância"}`}
      open={open}
      onCancel={onClose}
      footer={
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Fechar
          </Button>{" "}
          {!connected && (
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              className="w-full sm:w-auto order-1 sm:order-2 sm:ml-2"
              style={{
                background: "linear-gradient(135deg, #00b9ae 0%, #1f2937 100%)",
                borderColor: "transparent",
                boxShadow: "0 4px 14px 0 rgba(0, 185, 174, 0.3)"
              }}
            >
              Gerar Novo QR
            </Button>
          )}
        </div>
      }
      destroyOnHidden={true}
      width="95%"
      maxWidth="500px"
      className="responsive-modal"
      showFooter={true}
      showOk={false}
    >
      <div className="text-center py-2 sm:py-4 px-2 sm:px-0">
        {connected ? (
          <div className="space-y-3 sm:space-y-4">
            <CheckCircleOutlined className="text-4xl sm:text-6xl text-green-500 animate-pulse" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-green-600 mb-2">
                Conectado com sucesso!
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                A instância está agora conectada e funcionando.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <Alert
              message="Como conectar"
              description={
                <ol className="text-left text-xs sm:text-sm mt-2 space-y-1">
                  <li>1. Abra o aplicativo no seu dispositivo</li>
                  <li>2. Vá em Configurações → Dispositivos Conectados</li>
                  <li>3. Escaneie o QR Code abaixo</li>
                  <li>4. Aguarde a confirmação da conexão</li>
                </ol>
              }
              type="info"
              showIcon
              className="text-left"
            />

            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200">
              {loading ? (
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <Spin size="large" />
                  <p className="text-sm sm:text-base text-gray-600">
                    Gerando QR Code...
                  </p>
                </div>
              ) : qrCode ? (
                <div className="space-y-3 sm:space-y-4">
                  <QRCode
                    value={qrCode}
                    size={window.innerWidth < 640 ? 160 : 200}
                    errorLevel="H"
                    className="mx-auto"
                  />
                  <p className="text-xs sm:text-sm text-gray-500">
                    QR Code válido por 2 minutos
                  </p>
                  <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                    ID: {qrCode.slice(-10)}
                  </div>
                </div>
              ) : (
                <div className="text-sm sm:text-base text-gray-500">
                  Erro ao gerar QR Code
                </div>
              )}
            </div>

            <Alert
              message="Aguardando conexão..."
              description="O QR Code foi gerado. Escaneie com seu dispositivo para conectar a instância."
              type="warning"
              showIcon
              className="animate-pulse"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

import React, { useState, useEffect } from "react";
import { Modal, QRCode, Button, Space, Alert, Spin } from "antd";
import { ReloadOutlined, CheckCircleOutlined } from "@ant-design/icons";
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

  const generateQRCode = async () => {
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
  };

  useEffect(() => {
    if (open && instanceId) {
      generateQRCode();
    }
  }, [open, instanceId]);

  useEffect(() => {
    if (!open) {
      setQrCode("");
      setLoading(false);
      setConnected(false);
    }
  }, [open]);

  const handleRefresh = () => {
    generateQRCode();
  };

  return (
    <Modal
      title={`Conectar ${instance?.name || "Instância"}`}
      open={open}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>Fechar</Button>
          {!connected && (
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Gerar Novo QR
            </Button>
          )}
        </Space>
      }
      centered
      destroyOnClose
    >
      <div className="text-center py-4">
        {connected ? (
          <div className="space-y-4">
            <CheckCircleOutlined className="text-6xl text-green-500 animate-pulse" />
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Conectado com sucesso!
              </h3>
              <p className="text-gray-600">
                A instância está agora conectada e funcionando.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Alert
              message="Como conectar"
              description={
                <ol className="text-left text-sm mt-2 space-y-1">
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

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              {loading ? (
                <div className="flex flex-col items-center space-y-4">
                  <Spin size="large" />
                  <p className="text-gray-600">Gerando QR Code...</p>
                </div>
              ) : qrCode ? (
                <div className="space-y-4">
                  <QRCode
                    value={qrCode}
                    size={200}
                    errorLevel="H"
                    className="mx-auto"
                  />
                  <p className="text-sm text-gray-500">
                    QR Code válido por 2 minutos
                  </p>
                  <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
                    ID: {qrCode.slice(-10)}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Erro ao gerar QR Code</div>
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

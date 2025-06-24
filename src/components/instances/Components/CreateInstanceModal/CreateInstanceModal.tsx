// src/components/instances/Components/CreateInstanceModal/CreateInstanceModal.tsx (Adaptado)
import React, { useState } from "react";
import { Form, Input, Select, message, InputNumber } from "antd";
import {
  MessageSquare,
  Instagram,
  Facebook,
  Send,
  Link,
  Info,
  Clock,
  Webhook
} from "lucide-react";
import { Instance } from "@/libs/types";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal";
import { useCreateWhatsAppInstance } from "@/hooks/useWhatsAppInstances";
import { whatsappConfig } from "@/config/whatsapp.config";

const platformOptions = [
  {
    value: "whatsapp",
    label: "WhatsApp",
    icon: <MessageSquare size={16} />,
    color: "#25D366"
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: <Instagram size={16} />,
    color: "#E4405F"
  },
  {
    value: "facebook",
    label: "Facebook",
    icon: <Facebook size={16} />,
    color: "#1877F2"
  },
  {
    value: "telegram",
    label: "Telegram",
    icon: <Send size={16} />,
    color: "#0088CC"
  }
];

interface CreateInstanceModalProps {
  open: boolean;
  onCancel: () => void;
  onCreateInstance: (
    instance: Omit<Instance, "id" | "createdAt">
  ) => Promise<void>;
  onWhatsAppInstanceCreated?: (instanceId: string) => void; // Nova prop para WhatsApp
}

export const CreateInstanceModal: React.FC<CreateInstanceModalProps> = ({
  open,
  onCancel,
  onCreateInstance,
  onWhatsAppInstanceCreated
}) => {
  const { isDark } = useTheme();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");

  // Hook para criar instância WhatsApp real
  const createWhatsAppMutation = useCreateWhatsAppInstance();

  const handleCreateInstance = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Se for WhatsApp, usar API real
      if (values.type === "whatsapp") {
        const result = await createWhatsAppMutation.mutateAsync({
          canal: "whatsapp",
          tempoEnvio: values.tempoEnvio || 3000
        });

        form.resetFields();
        message.success("Instância WhatsApp criada com sucesso!");

        // Callback específico para WhatsApp com o ID da instância
        if (onWhatsAppInstanceCreated) {
          onWhatsAppInstanceCreated(result.id);
        }

        onCancel();
        return;
      }

      // Para outras plataformas, usar sistema mock existente
      const newInstance: Omit<Instance, "id" | "createdAt"> = {
        name: values.name,
        type: values.type,
        status: "disconnected",
        lastActivity: new Date().toISOString(),
        messagesCount: 0,
        webhook: values.webhook || undefined,
        avatar: undefined
      };

      await onCreateInstance(newInstance);

      form.resetFields();
      message.success("Instância criada com sucesso!");
      onCancel();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedPlatform("");
    onCancel();
  };

  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value);
  };

  const isWhatsApp = selectedPlatform === "whatsapp";
  const isLoading = submitting || createWhatsAppMutation.isPending;

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          {isWhatsApp && <MessageSquare size={20} className="text-green-500" />}
          <span>Criar Nova Instância{isWhatsApp ? " WhatsApp" : ""}</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      okText="Criar Instância"
      okButtonProps={{
        loading: isLoading,
        onClick: handleCreateInstance,
        className: isWhatsApp
          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          : "bg-gradient-to-r from-teal-500 to-slate-800 hover:from-teal-600 hover:to-slate-900 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
      }}
      width="90%"
      maxWidth="600px"
    >
      <Form form={form} layout="vertical" className="mt-6">
        {/* Seleção de Plataforma */}
        <Form.Item
          name="type"
          label={
            <span className={isDark ? "text-gray-200" : "text-gray-700"}>
              Plataforma
            </span>
          }
          rules={[{ required: true, message: "Selecione uma plataforma" }]}
        >
          <Select
            placeholder="Selecione a plataforma"
            size="large"
            className={isDark ? "dark-select" : ""}
            onChange={handlePlatformChange}
          >
            {platformOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <span style={{ color: option.color }}>{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Campo de Nome - apenas para outras plataformas */}
        {!isWhatsApp && (
          <Form.Item
            name="name"
            label={
              <span className={isDark ? "text-gray-200" : "text-gray-700"}>
                Nome da Instância
              </span>
            }
            rules={[
              { required: true, message: "Nome é obrigatório" },
              { min: 3, message: "Nome deve ter pelo menos 3 caracteres" },
              { max: 50, message: "Nome deve ter no máximo 50 caracteres" }
            ]}
          >
            <Input
              placeholder="Ex: Instagram Principal"
              autoFocus
              size="large"
              className={
                isDark ? "bg-gray-700 border-gray-600 text-gray-100" : ""
              }
            />
          </Form.Item>
        )}

        {/* Tempo de envio - apenas para WhatsApp */}
        {isWhatsApp && (
          <Form.Item
            name="tempoEnvio"
            label={
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span className={isDark ? "text-gray-200" : "text-gray-700"}>
                  Tempo de Envio (ms)
                </span>
              </div>
            }
            rules={[
              { required: true, message: "Tempo de envio é obrigatório" },
              { type: "number", min: 1000, message: "Mínimo de 1000ms" },
              { type: "number", max: 30000, message: "Máximo de 30000ms" }
            ]}
            initialValue={3000}
          >
            <InputNumber
              placeholder="3000"
              size="large"
              className="w-full"
              min={1000}
              max={30000}
              step={500}
              addonAfter="ms"
            />
          </Form.Item>
        )}

        {/* Webhook - apenas para outras plataformas */}
        {!isWhatsApp && (
          <Form.Item
            name="webhook"
            label={
              <span className={isDark ? "text-gray-200" : "text-gray-700"}>
                Webhook URL (Opcional)
              </span>
            }
            rules={[{ type: "url", message: "Digite uma URL válida" }]}
          >
            <Input
              placeholder="https://seu-webhook.com/endpoint"
              addonBefore={<Link size={16} />}
              size="large"
              className={
                isDark ? "bg-gray-700 border-gray-600 text-gray-100" : ""
              }
            />
          </Form.Item>
        )}

        {/* Informações específicas do WhatsApp */}
        {isWhatsApp && (
          <>
            {/* Informações sobre webhooks automáticos */}
            <div
              className={`p-4 rounded-lg border ${
                isDark
                  ? "bg-blue-900/20 border-blue-700 text-blue-300"
                  : "bg-blue-50 border-blue-200 text-blue-700"
              }`}
            >
              <div className="flex items-start space-x-3">
                <Webhook size={16} className="mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-medium">Webhooks Automáticos:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside ml-2">
                    <li>Mensagens recebidas</li>
                    <li>Status de chat</li>
                    <li>Eventos de conexão</li>
                    <li>Eventos de desconexão</li>
                  </ul>
                  <p className="text-xs opacity-75">
                    Os webhooks serão configurados automaticamente para:{" "}
                    {whatsappConfig.apiUrl}
                  </p>
                </div>
              </div>
            </div>

            {/* Próximos passos para WhatsApp */}
            <div
              className={`p-4 rounded-lg border ${
                isDark
                  ? "bg-green-900/20 border-green-700 text-green-300"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              <div className="flex items-start space-x-3">
                <MessageSquare size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-2">Próximos passos:</p>
                  <ol className="text-sm space-y-1 list-decimal list-inside ml-2">
                    <li>A instância será criada no servidor</li>
                    <li>Um QR Code será gerado automaticamente</li>
                    <li>Escaneie o QR Code com seu WhatsApp</li>
                    <li>A instância estará pronta para uso!</li>
                  </ol>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Informações gerais para outras plataformas */}
        {!isWhatsApp && selectedPlatform && (
          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? "bg-teal-900/20 border-teal-700 text-teal-300"
                : "bg-teal-50 border-teal-200 text-teal-700"
            }`}
          >
            <div className="flex items-start space-x-3">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-2">Informações importantes:</p>
                <ul className="text-sm space-y-1">
                  <li>• A instância será criada no status Desconectado</li>
                  <li>• Você precisará configurar a conexão</li>
                  <li>• O webhook é opcional e pode ser configurado depois</li>
                  <li>• Cada instância permite conexão com uma conta única</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Mostrar erro se houver */}
        {createWhatsAppMutation.error && (
          <div className="mt-4">
            <div
              className={`p-3 rounded-lg border ${
                isDark
                  ? "bg-red-900/20 border-red-700 text-red-300"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <p className="text-sm">
                <strong>Erro ao criar instância WhatsApp:</strong>{" "}
                {createWhatsAppMutation.error.message}
              </p>
            </div>
          </div>
        )}
      </Form>
    </Modal>
  );
};

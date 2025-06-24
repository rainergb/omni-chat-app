// src/components/instances/CreateInstanceModal.tsx
import React, { useState } from "react";
import { Form, Input, Select, message } from "antd";
import {
  MessageSquare,
  Instagram,
  Facebook,
  Send,
  Link,
  Info
} from "lucide-react";
import { Instance } from "@/libs/types";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal";

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
}

export const CreateInstanceModal: React.FC<CreateInstanceModalProps> = ({
  open,
  onCancel,
  onCreateInstance
}) => {
  const { isDark } = useTheme();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleCreateInstance = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

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
    onCancel();
  };
  return (
    <Modal
      title="Criar Nova Instância"
      open={open}
      onCancel={handleCancel}
      okText="Criar Instância"
      okButtonProps={{
        loading: submitting,
        onClick: handleCreateInstance,
        className:
          "bg-gradient-to-r from-teal-500 to-slate-800 hover:from-teal-600 hover:to-slate-900 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
      }}
    >
      <Form form={form} layout="vertical" className="mt-6">
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
            placeholder="Ex: WhatsApp Principal"
            autoFocus
            size="large"
            className={
              isDark ? "bg-gray-700 border-gray-600 text-gray-100" : ""
            }
          />
        </Form.Item>
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
        </Form.Item>{" "}
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
                <li>• Você precisará escanear o QR Code para conectar</li>
                <li>• O webhook é opcional e pode ser configurado depois</li>
                <li>• Cada instância permite conexão com uma conta única</li>
              </ul>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

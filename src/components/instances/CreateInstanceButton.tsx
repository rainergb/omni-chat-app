// src/components/instances/CreateInstanceButton.tsx
import React, { useState } from "react";
import { Button, Modal, Form, Input, Select, Space, message } from "antd";
import {
  Plus,
  MessageSquare,
  Instagram,
  Facebook,
  Send,
  Link,
  Info
} from "lucide-react";
import { Instance } from "@/libs/types";
import { useTheme } from "@/contexts/ThemeContext";

interface CreateInstanceButtonProps {
  onCreate: (instance: Omit<Instance, "id" | "createdAt">) => void;
  loading?: boolean;
}

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

export const CreateInstanceButton: React.FC<CreateInstanceButtonProps> = ({
  onCreate,
  loading = false
}) => {
  const { isDark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
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
        avatar: null
      };

      await onCreate(newInstance);

      setIsModalOpen(false);
      form.resetFields();
      message.success("Instância criada com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button
        type="primary"
        icon={<Plus size={16} />}
        onClick={() => setIsModalOpen(true)}
        size="large"
        loading={loading}
        className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg"
      >
        Nova Instância
      </Button>{" "}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Plus size={16} className="text-white" />
            </div>
            <span className={isDark ? "text-gray-100" : "text-gray-800"}>
              Criar Nova Instância
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <Space className="w-full flex flex-col sm:flex-row justify-end gap-2">
            <Button
              onClick={handleCancel}
              className={`w-full sm:w-auto ${
                isDark ? "border-gray-600 text-gray-300" : ""
              }`}
              size="large"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              onClick={handleCreate}
              loading={submitting}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 border-0"
              size="large"
            >
              Criar Instância
            </Button>
          </Space>
        }
        destroyOnClose
        className={isDark ? "dark-modal" : ""}
        width="100%"
        style={{ maxWidth: "500px", top: "10vh" }}
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
          </Form.Item>

          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? "bg-blue-900/20 border-blue-700 text-blue-300"
                : "bg-blue-50 border-blue-200 text-blue-700"
            }`}
          >
            <div className="flex items-start space-x-3">
              <Info size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-2">Informações importantes:</p>{" "}
                <ul className="text-sm space-y-1">
                  <li>
                    • A instância será criada no status &quot;Desconectado&quot;
                  </li>
                  <li>• Você precisará escanear o QR Code para conectar</li>
                  <li>• O webhook é opcional e pode ser configurado depois</li>
                  <li>• Cada instância permite conexão com uma conta única</li>
                </ul>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

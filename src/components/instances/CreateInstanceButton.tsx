import React, { useState } from "react";
import { Button, Modal, Form, Input, Select, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Instance } from "@/libs/types";

interface CreateInstanceButtonProps {
  onCreate: (instance: Omit<Instance, "id" | "createdAt">) => void;
  loading?: boolean;
}

const platformOptions = [
  { value: "whatsapp", label: "💬 WhatsApp" },
  { value: "instagram", label: "📷 Instagram" },
  { value: "facebook", label: "📘 Facebook" },
  { value: "telegram", label: "✈️ Telegram" }
];

export const CreateInstanceButton: React.FC<CreateInstanceButtonProps> = ({
  onCreate,
  loading = false
}) => {
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
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
        size="large"
        className="mb-4"
        loading={loading}
      >
        Nova Instância
      </Button>

      <Modal
        title="Criar Nova Instância"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <Space>
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button type="primary" onClick={handleCreate} loading={submitting}>
              Criar Instância
            </Button>
          </Space>
        }
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Nome da Instância"
            rules={[
              { required: true, message: "Nome é obrigatório" },
              { min: 3, message: "Nome deve ter pelo menos 3 caracteres" },
              { max: 50, message: "Nome deve ter no máximo 50 caracteres" }
            ]}
          >
            <Input placeholder="Ex: WhatsApp Principal" autoFocus />
          </Form.Item>

          <Form.Item
            name="type"
            label="Plataforma"
            rules={[{ required: true, message: "Selecione uma plataforma" }]}
          >
            <Select
              placeholder="Selecione a plataforma"
              options={platformOptions}
            />
          </Form.Item>

          <Form.Item
            name="webhook"
            label="Webhook URL (Opcional)"
            rules={[{ type: "url", message: "Digite uma URL válida" }]}
          >
            <Input
              placeholder="https://seu-webhook.com/endpoint"
              addonBefore="🔗"
            />
          </Form.Item>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600 mb-2">
              ℹ️ <strong>Informações importantes:</strong>
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• A instância será criada no status "Desconectado"</li>
              <li>• Você precisará escanear o QR Code para conectar</li>
              <li>• O webhook é opcional e pode ser configurado depois</li>
            </ul>
          </div>
        </Form>
      </Modal>
    </>
  );
};

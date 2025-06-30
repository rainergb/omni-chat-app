import React, { useState } from "react";
import { Form, Input, Select, message, InputNumber } from "antd";
import {
  MessageSquare,
  Instagram,
  Facebook,
  Send,
  Link,
  Clock
} from "lucide-react";
import { Instance } from "@/libs/types";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal/Modal";
import { useCreateWhatsAppInstance } from "@/hooks/useWhatsAppInstances";
import {
  TitleContainer,
  StyledForm,
  FormLabel,
  PlatformOptionContainer,
  StyledInput,
  StyledSelect,
  StyledInputNumber,
  TimeInputLabel,
  WebhookInputContainer,
  GlobalButtonStyles
} from "./CreateInstanceModal.styles";

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
  onWhatsAppInstanceCreated?: (instanceId: string) => void;
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

  const createWhatsAppMutation = useCreateWhatsAppInstance();

  const handleCreateInstance = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (values.type === "whatsapp") {
        const result = await createWhatsAppMutation.mutateAsync({
          canal: "whatsapp",
          tempoEnvio: values.tempoEnvio || 3000
        });

        form.resetFields();
        message.success("Instância WhatsApp criada com sucesso!");

        if (onWhatsAppInstanceCreated) {
          onWhatsAppInstanceCreated(result.id);
        }

        onCancel();
        return;
      }

      const newInstance: Omit<Instance, "id" | "createdAt"> = {
        name: values.name,
        type: values.type,
        status: "DISCONNECTED",
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
    <GlobalButtonStyles>
      <Modal
        title={
          <TitleContainer>
            {isWhatsApp && <MessageSquare size={20} color="#22c55e" />}
            <span>Criar Nova Instância{isWhatsApp ? " WhatsApp" : ""}</span>
          </TitleContainer>
        }
        open={open}
        onCancel={handleCancel}
        showFooter={false}
        width="90%"
        maxWidth="600px"
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "16px 0"
            }}
          >
            <button
              className={`ant-btn ant-btn-primary ant-btn-lg ${
                isWhatsApp ? "whatsapp-button" : "default-button"
              }`}
              onClick={handleCreateInstance}
              disabled={isLoading}
              style={{
                background: isWhatsApp
                  ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                  : "linear-gradient(135deg, #00b9ae 0%, #1f2937 100%)",
                border: "0",
                boxShadow: isWhatsApp
                  ? "0 4px 14px 0 rgba(34, 197, 94, 0.3)"
                  : "0 4px 14px 0 rgba(0, 185, 174, 0.3)",
                borderColor: "transparent",
                color: "white",
                fontWeight: "500"
              }}
            >
              {isLoading ? "Criando..." : "Criar Instância"}
            </button>
          </div>
        }
      >
        <StyledForm>
          <Form form={form} layout="vertical">
            <Form.Item
              name="type"
              label={<FormLabel $isDark={isDark}>Plataforma</FormLabel>}
              rules={[{ required: true, message: "Selecione uma plataforma" }]}
            >
              <StyledSelect $isDark={isDark}>
                <Select
                  placeholder="Selecione a plataforma"
                  size="large"
                  onChange={handlePlatformChange}
                >
                  {platformOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      <PlatformOptionContainer>
                        <span style={{ color: option.color }}>
                          {option.icon}
                        </span>
                        <span>{option.label}</span>
                      </PlatformOptionContainer>
                    </Select.Option>
                  ))}
                </Select>
              </StyledSelect>
            </Form.Item>

            {!isWhatsApp && (
              <Form.Item
                name="name"
                label={
                  <FormLabel $isDark={isDark}>Nome da Instância</FormLabel>
                }
                rules={[
                  { required: true, message: "Nome é obrigatório" },
                  { min: 3, message: "Nome deve ter pelo menos 3 caracteres" },
                  { max: 50, message: "Nome deve ter no máximo 50 caracteres" }
                ]}
              >
                <StyledInput $isDark={isDark}>
                  <Input
                    placeholder="Ex: Instagram Principal"
                    autoFocus
                    size="large"
                  />
                </StyledInput>
              </Form.Item>
            )}

            {isWhatsApp && (
              <Form.Item
                name="tempoEnvio"
                label={
                  <TimeInputLabel>
                    <Clock size={16} />
                    <FormLabel $isDark={isDark}>Tempo de Envio (ms)</FormLabel>
                  </TimeInputLabel>
                }
                rules={[
                  { required: true, message: "Tempo de envio é obrigatório" },
                  { type: "number", min: 1000, message: "Mínimo de 1000ms" },
                  { type: "number", max: 30000, message: "Máximo de 30000ms" }
                ]}
                initialValue={3000}
              >
                <StyledInputNumber>
                  <InputNumber
                    placeholder="3000"
                    size="large"
                    min={1000}
                    max={30000}
                    step={500}
                    addonAfter="ms"
                  />
                </StyledInputNumber>
              </Form.Item>
            )}

            {!isWhatsApp && (
              <Form.Item
                name="webhook"
                label={
                  <FormLabel $isDark={isDark}>Webhook URL (Opcional)</FormLabel>
                }
                rules={[{ type: "url", message: "Digite uma URL válida" }]}
              >
                <WebhookInputContainer $isDark={isDark}>
                  <Input
                    placeholder="https://seu-webhook.com/endpoint"
                    addonBefore={<Link size={16} />}
                    size="large"
                  />
                </WebhookInputContainer>
              </Form.Item>
            )}
          </Form>
        </StyledForm>
      </Modal>
    </GlobalButtonStyles>
  );
};

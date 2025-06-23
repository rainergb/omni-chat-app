// src/components/instances/InstanceHeader.tsx
import React, { useState } from "react";
import {
  Button,
  Segmented,
  Input,
  Select,
  Tooltip,
  Modal,
  Form,
  message
} from "antd";
import {
  Grid3X3,
  List,
  RefreshCw,
  Search,
  Filter,
  Plus,
  MessageSquare,
  Instagram,
  Facebook,
  Send,
  Link,
  Info
} from "lucide-react";
import { ViewMode, Instance } from "@/libs/types";
import { useTheme } from "@/contexts/ThemeContext";

const { Search: SearchInput } = Input;
const { Option } = Select;

// Opções de plataforma para o formulário
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

interface InstanceHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateInstance: (instance: Omit<Instance, "id" | "createdAt">) => Promise<void>;
  onRefresh: () => void;
  loading?: boolean;
}

export const InstanceHeader: React.FC<InstanceHeaderProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  viewMode,
  onViewModeChange,
  onCreateInstance,
  onRefresh,
  loading = false
}) => {
  const { isDark } = useTheme();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Função para criar nova instância
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

      setIsCreateModalOpen(false);
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

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <div
        className={`p-4 rounded-xl ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-lg border ${isDark ? "border-gray-700" : "border-gray-100"}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Lado esquerdo - Botões de ação */}
          <div className="flex items-center gap-3">
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => setIsCreateModalOpen(true)}
              size="large"
              loading={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg"
            >
              Nova Instância
            </Button>

            <Tooltip title="Atualizar lista">
              <Button
                icon={<RefreshCw size={16} />}
                onClick={onRefresh}
                loading={loading}
                size="large"
                className={isDark ? "border-gray-600" : ""}
              />
            </Tooltip>
          </div>

          {/* Lado direito - Busca, filtros e visualização */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Campo de pesquisa */}
            <div className="min-w-[200px] max-w-md">
              <SearchInput
                placeholder="Buscar instâncias..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                allowClear
                size="large"
                prefix={<Search size={16} />}
                className="w-full"
              />
            </div>

            {/* Filtros */}
            <Select
              value={statusFilter}
              onChange={onStatusFilterChange}
              className="w-40"
              size="large"
              suffixIcon={<Filter size={16} />}
            >
              <Option value="all">Todos status</Option>
              <Option value="connected">Conectado</Option>
              <Option value="disconnected">Desconectado</Option>
              <Option value="connecting">Conectando</Option>
              <Option value="error">Erro</Option>
            </Select>

            <Select
              value={typeFilter}
              onChange={onTypeFilterChange}
              className="w-44"
              size="large"
              suffixIcon={<Filter size={16} />}
            >
              <Option value="all">Todas plataformas</Option>
              <Option value="whatsapp">WhatsApp</Option>
              <Option value="instagram">Instagram</Option>
              <Option value="facebook">Facebook</Option>
              <Option value="telegram">Telegram</Option>
            </Select>

            {/* Segmented Control para visualização */}
            <Segmented
              value={viewMode}
              onChange={(value) => onViewModeChange(value as ViewMode)}
              size="large"
              options={[
                {
                  label: "Cards",
                  value: "cards",
                  icon: <Grid3X3 size={16} />
                },
                {
                  label: "Lista",
                  value: "list",
                  icon: <List size={16} />
                }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Modal de Criação de Instância */}
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
        open={isCreateModalOpen}
        onCancel={handleCancelCreate}
        footer={
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              onClick={handleCancelCreate}
              className={`w-full sm:w-auto ${
                isDark ? "border-gray-600 text-gray-300" : ""
              }`}
              size="large"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              onClick={handleCreateInstance}
              loading={submitting}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 border-0"
              size="large"
            >
              Criar Instância
            </Button>
          </div>
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
                <p className="font-medium mb-2">Informações importantes:</p>
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
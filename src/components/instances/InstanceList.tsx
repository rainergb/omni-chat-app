// src/components/instances/InstanceList.tsx
import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  Space,
  Segmented,
  Skeleton,
  Input,
  Select,
  Tooltip
} from "antd";
import {
  Grid3X3,
  List,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  Wifi,
  WifiOff
} from "lucide-react";
import { ViewMode } from "@/libs/types";
import { InstanceCard } from "./InstanceCard";
import { CreateInstanceButton } from "./CreateInstanceButton";
import { QRCodeModal } from "./QRCodeModal";
import { useInstances } from "@/hooks/useInstances";
import { useTheme } from "@/contexts/ThemeContext";

const { Search: SearchInput } = Input;
const { Option } = Select;

interface InstanceListProps {
  onOpenChat?: (instanceId: string) => void;
}

export const InstanceList: React.FC<InstanceListProps> = ({ onOpenChat }) => {
  const { isDark } = useTheme();
  const {
    instances,
    viewMode,
    loading,
    setViewMode,
    createInstance,
    deleteInstance,
    connectInstance,
    disconnectInstance,
    refreshInstances
  } = useInstances();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>("");

  // Filtros
  const filteredInstances = instances.filter((instance) => {
    const matchesSearch = instance.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || instance.status === statusFilter;
    const matchesType = typeFilter === "all" || instance.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Estatísticas
  const stats = {
    total: instances.length,
    connected: instances.filter((i) => i.status === "connected").length,
    disconnected: instances.filter((i) => i.status === "disconnected").length,
    totalMessages: instances.reduce((acc, i) => acc + i.messagesCount, 0)
  };

  const handleShowQR = (instanceId: string) => {
    setSelectedInstanceId(instanceId);
    setQrModalOpen(true);
  };

  const handleOpenChat = (instanceId: string) => {
    onOpenChat?.(instanceId);
  };

  const renderSkeleton = () => (
    <Row gutter={[24, 24]}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Col xs={24} sm={12} lg={8} xl={6} key={index}>
          <div
            className={`p-6 rounded-xl ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        </Col>
      ))}
    </Row>
  );

  const renderEmpty = () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div
          className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <Grid3X3
            size={40}
            className={isDark ? "text-gray-600" : "text-gray-400"}
          />
        </div>
        <h3
          className={`text-xl font-semibold mb-2 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {searchTerm || statusFilter !== "all" || typeFilter !== "all"
            ? "Nenhuma instância encontrada"
            : "Nenhuma instância criada"}
        </h3>
        <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {searchTerm || statusFilter !== "all" || typeFilter !== "all"
            ? "Tente ajustar os filtros para encontrar suas instâncias"
            : "Crie sua primeira instância para começar a gerenciar seus chats"}
        </p>
        {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
          <CreateInstanceButton onCreate={createInstance} loading={loading} />
        )}
      </div>
    </div>
  );

  const renderInstances = () => {
    if (viewMode === "cards") {
      return (
        <Row gutter={[24, 24]}>
          {filteredInstances.map((instance) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={instance.id}>
              <InstanceCard
                instance={instance}
                onConnect={connectInstance}
                onDisconnect={disconnectInstance}
                onDelete={deleteInstance}
                onShowQR={handleShowQR}
                onOpenChat={handleOpenChat}
              />
            </Col>
          ))}
        </Row>
      );
    }

    return (
      <div
        className={`rounded-xl ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-lg p-6`}
      >
        <div className="text-center py-12">
          <List
            size={48}
            className={`mx-auto mb-4 ${
              isDark ? "text-gray-400" : "text-gray-300"
            }`}
          />
          <h3
            className={`text-lg font-semibold ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Visualização em Lista
          </h3>
          <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Esta visualização será implementada em breve
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Instâncias
          </h1>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Gerencie suas conexões com diferentes plataformas de chat
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <CreateInstanceButton onCreate={createInstance} loading={loading} />
          <Tooltip title="Atualizar lista">
            <Button
              icon={<RefreshCw size={16} />}
              onClick={refreshInstances}
              loading={loading}
              className={isDark ? "border-gray-600" : ""}
            />
          </Tooltip>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-xl ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {stats.total}
              </p>
            </div>
            <Grid3X3
              size={24}
              className={isDark ? "text-gray-500" : "text-gray-400"}
            />
          </div>
        </div>

        <div
          className={`p-4 rounded-xl ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Conectadas
              </p>
              <p className="text-2xl font-bold text-green-500">
                {stats.connected}
              </p>
            </div>
            <Wifi size={24} className="text-green-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-xl ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Desconectadas
              </p>
              <p className="text-2xl font-bold text-red-500">
                {stats.disconnected}
              </p>
            </div>
            <WifiOff size={24} className="text-red-500" />
          </div>
        </div>

        <div
          className={`p-4 rounded-xl ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Mensagens
              </p>
              <p
                className={`text-2xl font-bold ${
                  isDark ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {stats.totalMessages.toLocaleString()}
              </p>
            </div>
            <TrendingUp
              size={24}
              className={isDark ? "text-gray-500" : "text-gray-400"}
            />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div
        className={`p-6 rounded-xl ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-lg`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Buscar instâncias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="max-w-md"
              prefix={<Search size={16} />}
            />
          </div>

          <Space wrap>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-36"
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
              onChange={setTypeFilter}
              className="w-40"
              suffixIcon={<Filter size={16} />}
            >
              <Option value="all">Todas plataformas</Option>
              <Option value="whatsapp">WhatsApp</Option>
              <Option value="instagram">Instagram</Option>
              <Option value="facebook">Facebook</Option>
              <Option value="telegram">Telegram</Option>
            </Select>

            <Segmented
              value={viewMode}
              onChange={(value) => setViewMode(value as ViewMode)}
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
          </Space>
        </div>
      </div>

      {/* Content */}
      {loading
        ? renderSkeleton()
        : filteredInstances.length === 0
        ? renderEmpty()
        : renderInstances()}

      {/* QR Modal */}
      <QRCodeModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        instanceId={selectedInstanceId}
      />
    </div>
  );
};

import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  Space,
  Segmented,
  Skeleton,
  Empty,
  Input,
  Select,
  Tooltip
} from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { Instance, ViewMode } from "@/libs/types";
import { InstanceCard } from "./InstanceCard";
import { CreateInstanceButton } from "./CreateInstanceButton";
import { QRCodeModal } from "./QRCodeModal";
import { useInstances } from "@/hooks/useInstances";

const { Search } = Input;
const { Option } = Select;

interface InstanceListProps {
  onOpenChat?: (instanceId: string) => void;
}

export const InstanceList: React.FC<InstanceListProps> = ({ onOpenChat }) => {
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

  const handleShowQR = (instanceId: string) => {
    setSelectedInstanceId(instanceId);
    setQrModalOpen(true);
  };

  const handleOpenChat = (instanceId: string) => {
    onOpenChat?.(instanceId);
  };

  const renderSkeleton = () => (
    <Row gutter={[16, 16]}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Col xs={24} sm={12} lg={8} xl={6} key={index}>
          <Skeleton active paragraph={{ rows: 4 }} />
        </Col>
      ))}
    </Row>
  );

  const renderEmpty = () => (
    <div className="text-center py-12">
      <Empty
        description={
          searchTerm || statusFilter !== "all" || typeFilter !== "all"
            ? "Nenhuma instância encontrada com os filtros aplicados"
            : "Nenhuma instância encontrada"
        }
        className="mb-6"
      />
      {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
        <CreateInstanceButton onCreate={createInstance} loading={loading} />
      )}
    </div>
  );

  const renderInstances = () => {
    if (viewMode === "cards") {
      return (
        <Row gutter={[16, 16]}>
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

    // Lista view será implementada posteriormente
    return <div>Visualização em lista será implementada em breve</div>;
  };

  return (
    <div className="p-6">
      {/* Header com controles */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Instâncias do OmniChat
          </h1>
          <p className="text-gray-600">
            Gerencie suas conexões com diferentes plataformas de chat
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <CreateInstanceButton onCreate={createInstance} loading={loading} />

          <Tooltip title="Atualizar lista">
            <Button
              icon={<ReloadOutlined />}
              onClick={refreshInstances}
              loading={loading}
            />
          </Tooltip>
        </div>
      </div>

      {/* Filtros e controles de visualização */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <Search
              placeholder="Buscar instâncias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              className="max-w-md"
            />
          </div>

          <Space wrap>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-32"
            >
              <Option value="all">Todos</Option>
              <Option value="connected">Conectado</Option>
              <Option value="disconnected">Desconectado</Option>
              <Option value="connecting">Conectando</Option>
              <Option value="error">Erro</Option>
            </Select>

            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              className="w-36"
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
                  icon: <AppstoreOutlined />
                },
                {
                  label: "Lista",
                  value: "list",
                  icon: <UnorderedListOutlined />
                }
              ]}
            />
          </Space>
        </div>

        {/* Estatísticas rápidas */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm">
            <span className="text-gray-500">Total: </span>
            <span className="font-medium">{instances.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Conectadas: </span>
            <span className="font-medium text-green-600">
              {instances.filter((i) => i.status === "connected").length}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Desconectadas: </span>
            <span className="font-medium text-red-600">
              {instances.filter((i) => i.status === "disconnected").length}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Mensagens hoje: </span>
            <span className="font-medium">
              {instances
                .reduce((acc, i) => acc + i.messagesCount, 0)
                .toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      {loading
        ? renderSkeleton()
        : filteredInstances.length === 0
        ? renderEmpty()
        : renderInstances()}

      {/* Modal do QR Code */}
      <QRCodeModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        instanceId={selectedInstanceId}
      />
    </div>
  );
};

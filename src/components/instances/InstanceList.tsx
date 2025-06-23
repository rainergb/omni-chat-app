// src/components/instances/InstanceList.tsx
import React, { useState } from "react";
import { Row, Col, Button, Skeleton } from "antd";
import { Grid3X3, List, Plus } from "lucide-react";
import { ViewMode, Instance } from "@/libs/types";
import { InstanceCard } from "./InstanceCard";
import { QRCodeModal } from "./QRCodeModal";
import { useTheme } from "@/contexts/ThemeContext";

interface InstanceListProps {
  instances: Instance[];
  filteredInstances: Instance[];
  viewMode: ViewMode;
  loading: boolean;
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenChat?: (instanceId: string) => void;
  onCreateInstance: () => void;
}

export const InstanceList: React.FC<InstanceListProps> = ({
  filteredInstances = [],
  viewMode,
  loading,
  searchTerm,
  statusFilter,
  typeFilter,
  onConnect,
  onDisconnect,
  onDelete,
  onOpenChat,
  onCreateInstance
}) => {
  const { isDark } = useTheme();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>("");

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
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={onCreateInstance}
            size="large"
            loading={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg"
          >
            Nova Instância
          </Button>
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
                onConnect={onConnect}
                onDisconnect={onDisconnect}
                onDelete={onDelete}
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
    <div className="space-y-6">
      {/* Conteúdo */}
      {loading
        ? renderSkeleton()
        : filteredInstances.length === 0
        ? renderEmpty()
        : renderInstances()}

      {/* Modal QR Code */}
      <QRCodeModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        instanceId={selectedInstanceId}
      />
    </div>
  );
};
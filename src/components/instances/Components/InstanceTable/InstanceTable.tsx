// src/components/instances/Components/InstanceTable/InstanceTable.tsx
import React, { useState } from "react";
import { Row, Col, Skeleton } from "antd";
import { Grid3X3, Plus } from "lucide-react";
import { ViewMode, Instance } from "@/libs/types";
import { InstanceCard } from "../InstanceCard/InstanceCard";
import { InstanceList } from "../InstanceList/InstanceList";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Container,
  ContentWrapper,
  SkeletonCard,
  EmptyContainer,
  EmptyContent,
  EmptyIconContainer,
  EmptyTitle,
  EmptyDescription,
  CreateButton
} from "./InstanceTable.styles";
import QRCodeModal from "../QRCodeModal/QRCodeModal";

interface InstanceTableProps {
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

export const InstanceTable: React.FC<InstanceTableProps> = ({
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
          <SkeletonCard $isDark={isDark}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </SkeletonCard>
        </Col>
      ))}
    </Row>
  );
  const renderEmpty = () => (
    <EmptyContainer>
      <EmptyContent>
        <EmptyIconContainer $isDark={isDark}>
          <Grid3X3
            size={40}
            className={isDark ? "text-gray-600" : "text-gray-400"}
          />
        </EmptyIconContainer>
        <EmptyTitle $isDark={isDark}>
          {searchTerm || statusFilter !== "all" || typeFilter !== "all"
            ? "Nenhuma instância encontrada"
            : "Nenhuma instância criada"}
        </EmptyTitle>
        <EmptyDescription $isDark={isDark}>
          {searchTerm || statusFilter !== "all" || typeFilter !== "all"
            ? "Tente ajustar os filtros para encontrar suas instâncias"
            : "Crie sua primeira instância para começar a gerenciar seus chats"}
        </EmptyDescription>
        {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
          <CreateButton
            type="primary"
            icon={<Plus size={16} />}
            onClick={onCreateInstance}
            size="large"
            loading={loading}
          >
            Nova Instância
          </CreateButton>
        )}
      </EmptyContent>
    </EmptyContainer>
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
      <InstanceList
        instances={filteredInstances}
        filteredInstances={filteredInstances}
        loading={false}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        onDelete={onDelete}
        onOpenChat={handleOpenChat}
        onCreateInstance={onCreateInstance}
      />
    );
  };
  return (
    <Container>
      <ContentWrapper>
        {/* Conteúdo */}
        {loading
          ? renderSkeleton()
          : filteredInstances.length === 0
          ? renderEmpty()
          : renderInstances()}
      </ContentWrapper>

      {/* Modal QR Code */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        id={selectedInstanceId}
        loading={false}
      />
    </Container>
  );
};
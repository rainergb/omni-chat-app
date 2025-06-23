// src/components/instances/Components/InstanceTable/InstanceTable.tsx
import React, { useState } from "react";
import { Row, Col, Skeleton } from "antd";
import { Grid3X3, List, Plus } from "lucide-react";
import { ViewMode, Instance } from "@/libs/types";
import { InstanceCard } from "../InstanceCard/InstanceCard";
import { QRCodeModal } from "../../QRCodeModal";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Container,
  SkeletonCard,
  EmptyContainer,
  EmptyContent,
  EmptyIconContainer,
  EmptyTitle,
  EmptyDescription,
  CreateButton,
  ListViewContainer,
  ListViewContent,
  ListViewTitle,
  ListViewDescription
} from "./InstanceTable.styles";

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
    }    return (
      <ListViewContainer $isDark={isDark}>
        <ListViewContent>
          <List
            size={48}
            className={`mx-auto mb-4 ${
              isDark ? "text-gray-400" : "text-gray-300"
            }`}
          />
          <ListViewTitle $isDark={isDark}>
            Visualização em Lista
          </ListViewTitle>
          <ListViewDescription $isDark={isDark}>
            Esta visualização será implementada em breve
          </ListViewDescription>
        </ListViewContent>
      </ListViewContainer>
    );
  };
  return (
    <Container>
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
    </Container>
  );
};
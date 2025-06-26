import React, { useState } from "react";
import { message } from "antd";
import { InstanceTable } from "@/components/instances/Components/InstanceTable/InstanceTable";
import { InstanceHeader } from "./Components/InstanceHeader/InstanceHeader";
import { CreateInstanceModal } from "./Components/CreateInstanceModal/CreateInstanceModal";
import { QRCodeModal } from "./Components/QRCodeModal/QRCodeModal";
import { useInstances } from "@/hooks/useInstances";
import {
  useUnifiedInstances,
  useDisconnectInstance,
  useDeleteInstance
} from "@/hooks/useWhatsAppInstances";
import { Instance } from "@/libs/types";

export const InstancesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedInstanceForQR, setSelectedInstanceForQR] = useState<{
    id: string;
    name: string;
    isWhatsApp: boolean;
  } | null>(null);

  const {
    instances: mockInstances,
    viewMode,
    loading: mockLoading,
    setViewMode,
    createInstance: createMockInstance,
    deleteInstance: deleteMockInstance,
    connectInstance: connectMockInstance,
    disconnectInstance: disconnectMockInstance,
    refreshInstances: refreshMockInstances
  } = useInstances();

  const {
    instances: whatsappInstances,
    isLoading: whatsappLoading,
    error: whatsappError,
  } = useUnifiedInstances();

  const disconnectWhatsAppMutation = useDisconnectInstance();
  const deleteWhatsAppMutation = useDeleteInstance();

  const allInstances = [...mockInstances, ...whatsappInstances];

  const isLoading = mockLoading || whatsappLoading;



  const filteredInstances = allInstances.filter((instance) => {
    const matchesSearch = instance.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || instance.status === statusFilter;
    const matchesType = typeFilter === "all" || instance.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Verificar se é instância WhatsApp
  const isWhatsAppInstance = (instance: Instance): boolean => {
    return (
      instance.type === "whatsapp" &&
      whatsappInstances.some((wInstance) => wInstance.id === instance.id)
    );
  };

  const handleCreateInstance = async (
    instanceData: Omit<Instance, "id" | "createdAt">
  ) => {
    await createMockInstance(instanceData);
  };

  const handleWhatsAppInstanceCreated = (instanceId: string) => {
    message.success("Instância WhatsApp criada! Gerando QR Code...");

    setSelectedInstanceForQR({
      id: instanceId,
      name: `WhatsApp ${instanceId}`,
      isWhatsApp: true
    });
    setQrModalOpen(true);

  };

  const handleConnect = async (instanceId: string) => {
    const instance = allInstances.find((i) => i.id === instanceId);
    if (!instance) return;

    try {
      if (isWhatsAppInstance(instance)) {
        setSelectedInstanceForQR({
          id: instanceId,
          name: instance.name,
          isWhatsApp: true
        });
        setQrModalOpen(true);
      } else {
        // Para outras plataformas, usar sistema mock
        await connectMockInstance(instanceId);

        // Abrir modal de QR Code mock
        setSelectedInstanceForQR({
          id: instanceId,
          name: instance.name,
          isWhatsApp: false
        });
        setQrModalOpen(true);
      }
    } catch {
      message.error("Erro ao conectar instância");
    }
  };

  const handleDisconnect = async (instanceId: string) => {
    const instance = allInstances.find((i) => i.id === instanceId);
    if (!instance) return;

    try {
      if (isWhatsAppInstance(instance)) {
        await disconnectWhatsAppMutation.mutateAsync(instanceId);
      } else {
        await disconnectMockInstance(instanceId);
      }
    } catch {
      // Erro já tratado nos hooks
    }
  };

  const handleDelete = async (instanceId: string) => {
    const instance = allInstances.find((i) => i.id === instanceId);
    if (!instance) return;

    try {
      if (isWhatsAppInstance(instance)) {
        await deleteWhatsAppMutation.mutateAsync(instanceId);
      } else {
        await deleteMockInstance(instanceId);
      }
    } catch {
      // Erro já tratado nos hooks
    }
  };

  const handleOpenChat = (instanceId: string) => {
    const instance = allInstances.find((i) => i.id === instanceId);
    if (!instance) return;

    if (instance.status === "connected") {
      message.info(`Abrindo chat para ${instance.name}`);
      // Aqui você implementaria a navegação para o chat
      // Por exemplo: router.push(`/chat/${instanceId}`) ou setActiveTab('chat')
    } else {
      message.warning("Instância deve estar conectada para abrir chat");
    }
  };

  const handleRefresh = () => {
    refreshMockInstances();
    message.info("Atualizando lista de instâncias...");
  };

  // Mostrar erro do WhatsApp se houver
  if (whatsappError) {
    console.error("Erro ao carregar instâncias WhatsApp:", whatsappError);
  }

  return (
    <div className="space-y-6">
      <InstanceHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateInstance={async () => {
          setCreateModalOpen(true);
          return Promise.resolve();
        }}
        onRefresh={handleRefresh}
        loading={isLoading}
      />

      <InstanceTable
        instances={allInstances}
        filteredInstances={filteredInstances}
        viewMode={viewMode}
        loading={isLoading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onDelete={handleDelete}
        onOpenChat={handleOpenChat}
        onCreateInstance={() => setCreateModalOpen(true)}
      />

      <CreateInstanceModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onCreateInstance={handleCreateInstance}
        onWhatsAppInstanceCreated={handleWhatsAppInstanceCreated}
      />

      {selectedInstanceForQR && (
        <QRCodeModal
          open={qrModalOpen}
          onClose={() => {
            setQrModalOpen(false);
            setSelectedInstanceForQR(null);
          }}
          instanceId={selectedInstanceForQR.id}
          isWhatsApp={selectedInstanceForQR.isWhatsApp}
        />
      )}
    </div>
  );
};

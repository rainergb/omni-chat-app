import React, { useState } from "react";
import { message } from "antd";
import { InstanceTable } from "@/components/instances/Components/InstanceTable/InstanceTable";
import { InstanceHeader } from "./Components/InstanceHeader/InstanceHeader";
import { CreateInstanceModal } from "./Components/CreateInstanceModal/CreateInstanceModal";
import QRCodeModal from "./Components/QRCodeModal/QRCodeModal";
import {
  useWhatsAppInstances,
  useCreateWhatsAppInstance,
  useDisconnectInstance,
  useDeleteInstance
} from "@/hooks/useWhatsAppInstances";
import { ViewMode, Instance } from "@/libs/types";
import {
  WhatsAppInstance,
  CreateInstanceRequest
} from "@/types/whatsapp.types";

const mapWhatsAppToInstance = (whatsapp: WhatsAppInstance): Instance => ({
  id: whatsapp.id,
  name: whatsapp.canal,
  type: "whatsapp",
  status:
    whatsapp.status === "open"
      ? "connected"
      : whatsapp.status === "connecting"
      ? "connecting"
      : "disconnected",
  lastActivity: whatsapp.updatedAt
    ? typeof whatsapp.updatedAt === "string"
      ? whatsapp.updatedAt
      : new Date(whatsapp.updatedAt).toISOString()
    : new Date().toISOString(),
  messagesCount: 0,
  createdAt: whatsapp.createdAt
    ? typeof whatsapp.createdAt === "string"
      ? whatsapp.createdAt
      : new Date(whatsapp.createdAt).toISOString()
    : new Date().toISOString(),
  webhook: whatsapp.webHookMensagem,
  avatar: whatsapp.foto || undefined
});

export const InstancesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedInstanceForQR, setSelectedInstanceForQR] = useState<{
    id: string;
    name: string;
    isWhatsApp: boolean;
  } | null>(null);

  const {
    data: whatsappInstances,
    isLoading: whatsappLoading,
    error: whatsappError,
    refetch: refetchWhatsApp
  } = useWhatsAppInstances();

  const createWhatsAppMutation = useCreateWhatsAppInstance();
  const disconnectWhatsAppMutation = useDisconnectInstance();
  const deleteWhatsAppMutation = useDeleteInstance();

  // Garantir que whatsappInstances seja sempre um array
  const safeInstances = Array.isArray(whatsappInstances)
    ? whatsappInstances
    : [];
  const mappedInstances = safeInstances.map(mapWhatsAppToInstance);

  const filteredInstances = mappedInstances.filter((instance) => {
    const matchesSearch = instance.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || instance.status === statusFilter;
    const matchesType = typeFilter === "all" || instance.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateInstance = async (
    instanceData: Omit<Instance, "id" | "createdAt">
  ) => {
    try {
      const whatsappData: CreateInstanceRequest = {
        canal: instanceData.name,
        tempoEnvio: 1000,
        webHookMensagem: instanceData.webhook,
        webHookStatusChat: instanceData.webhook,
        webHookConectado: instanceData.webhook,
        webHookDesconectado: instanceData.webhook
      };

      const result = await createWhatsAppMutation.mutateAsync(whatsappData);
      message.success("Instância WhatsApp criada com sucesso!");
      setCreateModalOpen(false);

      if (result.id) {
        handleWhatsAppInstanceCreated(result.id);
      }
    } catch {
      message.error("Erro ao criar instância WhatsApp");
    }
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
    const instance = mappedInstances.find((i) => i.id === instanceId);
    if (!instance) return;

    try {
      setSelectedInstanceForQR({
        id: instanceId,
        name: instance.name,
        isWhatsApp: true
      });
      setQrModalOpen(true);
    } catch {
      message.error("Erro ao conectar instância");
    }
  };

  const handleDisconnect = async (instanceId: string) => {
    try {
      await disconnectWhatsAppMutation.mutateAsync(instanceId);
      message.success("Instância desconectada com sucesso!");
    } catch {
      message.error("Erro ao desconectar instância");
    }
  };

  const handleDelete = async (instanceId: string) => {
    try {
      await deleteWhatsAppMutation.mutateAsync(instanceId);
      message.success("Instância deletada com sucesso!");
    } catch {
      message.error("Erro ao deletar instância");
    }
  };

  const handleOpenChat = (instanceId: string) => {
    const instance = mappedInstances.find((i) => i.id === instanceId);
    if (!instance) return;

    if (instance.status === "connected") {
      message.info(`Abrindo chat para ${instance.name}`);
    } else {
      message.warning("Instância deve estar conectada para abrir chat");
    }
  };

  const handleRefresh = () => {
    try {
      refetchWhatsApp();
      message.info("Atualizando lista de instâncias...");
    } catch (error) {
      console.error("Erro ao atualizar instâncias:", error);
      message.error("Erro ao atualizar lista de instâncias");
    }
  };

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
        loading={whatsappLoading}
      />

      <InstanceTable
        instances={mappedInstances}
        filteredInstances={filteredInstances}
        viewMode={viewMode}
        loading={whatsappLoading}
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
          isOpen={qrModalOpen}
          onClose={() => {
            setQrModalOpen(false);
            setSelectedInstanceForQR(null);
          }}
          id={selectedInstanceForQR.id}
          loading={false}
        />
      )}
    </div>
  );
};

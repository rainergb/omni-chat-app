// src/components/instances/Instance.tsx (trecho relevante corrigido)
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

const mapWhatsAppToInstance = (whatsapp: WhatsAppInstance): Instance => {
  // Normaliza o status para minúsculo para comparação
  const normalizedStatus = whatsapp.status?.toLowerCase?.() || "";

  let mappedStatus: string;
  switch (normalizedStatus) {
    case "open":
    case "connected":
      mappedStatus = "CONNECTED";
      break;
    case "CONNECTING":
      mappedStatus = "CONNECTING";
      break;
    case "error":
      mappedStatus = "error";
      break;
    default:
      mappedStatus = "DISCONNECTED";
  }

  return {
    id: whatsapp.id,
    name: whatsapp.canal,
    type: "whatsapp",
    status: mappedStatus,
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
  };
};

export const InstancesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Estados do QR Modal - simplificados
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>("");

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

    // Abrir o modal QR imediatamente
    setSelectedInstanceId(instanceId);
    setQrModalOpen(true);
  };

  const handleConnect = async (instanceId: string) => {
    console.log("handleConnect called with instanceId:", instanceId);

    const instance = mappedInstances.find((i) => i.id === instanceId);
    if (!instance) {
      console.log("Instance not found:", instanceId);
      message.error("Instância não encontrada");
      return;
    }

    console.log("Opening QR modal for instance:", instance);

    try {
      // Definir o ID da instância e abrir o modal
      setSelectedInstanceId(instanceId);
      setQrModalOpen(true);

      console.log(
        "QR Modal should be open now - qrModalOpen:",
        true,
        "selectedInstanceId:",
        instanceId
      );
    } catch (error) {
      console.error("Error in handleConnect:", error);
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

    if (instance.status === "CONNECTED") {
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

  const handleCloseQRModal = () => {
    console.log("Closing QR Modal");
    setQrModalOpen(false);
    setSelectedInstanceId("");
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

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={handleCloseQRModal}
        id={selectedInstanceId}
        loading={false}
      />
    </div>
  );
};

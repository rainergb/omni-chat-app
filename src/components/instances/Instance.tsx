// src/pages/InstancesPage.tsx (ou onde você usa os componentes)
import React, { useState } from "react";
import { InstanceList } from "@/components/instances/InstanceList";
import { useInstances } from "@/hooks/useInstances";
import { InstanceHeader } from "./Components/InstanceHeader/InstanceHeader";

export const InstancesPage: React.FC = () => {
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

  const handleOpenCreateModal = () => {
    // Esta função é chamada quando clica no botão "Nova Instância" no estado empty
    // Você pode passar uma referência para abrir o modal do InstanceHeader
  };

  const handleOpenChat = (instanceId: string) => {
    // Lógica para abrir o chat
    console.log("Abrir chat para instância:", instanceId);
  };

  return (
    <div className="p-6 space-y-6">
      <InstanceHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateInstance={createInstance}
        onRefresh={refreshInstances}
        loading={loading}
      />

      <InstanceList
        instances={instances}
        filteredInstances={filteredInstances}
        viewMode={viewMode}
        loading={loading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onConnect={connectInstance}
        onDisconnect={disconnectInstance}
        onDelete={deleteInstance}
        onOpenChat={handleOpenChat}
        onCreateInstance={handleOpenCreateModal}
      />
    </div>
  );
};
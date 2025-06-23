import { useCallback, useEffect } from "react";
import { message } from "antd";
import { useInstanceStore } from "@/store/instanceStore";
import { Instance } from "@/libs/types";

export const useInstances = () => {
  const {
    instances,
    viewMode,
    loading,
    selectedInstance,
    setInstances,
    addInstance,
    updateInstance,
    deleteInstance,
    setViewMode,
    setLoading,
    setSelectedInstance,
    loadMockInstances
  } = useInstanceStore();

  // Carrega instâncias na inicialização
  useEffect(() => {
    if (instances.length === 0) {
      loadMockInstances();
    }
  }, [instances.length, loadMockInstances]);

  const handleCreateInstance = useCallback(
    async (instanceData: Omit<Instance, "id" | "createdAt">) => {
      try {
        setLoading(true);

        // Simula delay da API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        addInstance(instanceData);
        message.success("Instância criada com sucesso!");
      } catch (error) {
        message.error("Erro ao criar instância. Tente novamente.");
        console.error("Erro ao criar instância:", error);
      } finally {
        setLoading(false);
      }
    },
    [addInstance, setLoading]
  );

  const handleUpdateInstance = useCallback(
    async (id: string, updates: Partial<Instance>) => {
      try {
        setLoading(true);

        // Simula delay da API
        await new Promise((resolve) => setTimeout(resolve, 800));

        updateInstance(id, updates);
        message.success("Instância atualizada com sucesso!");
      } catch (error) {
        message.error("Erro ao atualizar instância. Tente novamente.");
        console.error("Erro ao atualizar instância:", error);
      } finally {
        setLoading(false);
      }
    },
    [updateInstance, setLoading]
  );

  const handleDeleteInstance = useCallback(
    async (id: string) => {
      try {
        setLoading(true);

        // Simula delay da API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        deleteInstance(id);
        message.success("Instância removida com sucesso!");
      } catch (error) {
        message.error("Erro ao remover instância. Tente novamente.");
        console.error("Erro ao remover instância:", error);
      } finally {
        setLoading(false);
      }
    },
    [deleteInstance, setLoading]
  );

  const handleConnectInstance = useCallback(
    async (id: string) => {
      try {
        const instance = instances.find((i) => i.id === id);
        if (!instance) return;

        await handleUpdateInstance(id, {
          status: "connecting",
          lastActivity: new Date().toISOString()
        });

        // Simula processo de conexão
        setTimeout(async () => {
          const success = Math.random() > 0.3; // 70% de chance de sucesso

          if (success) {
            await handleUpdateInstance(id, {
              status: "connected",
              lastActivity: new Date().toISOString()
            });
            message.success("Instância conectada com sucesso!");
          } else {
            await handleUpdateInstance(id, {
              status: "error",
              lastActivity: new Date().toISOString()
            });
            message.error("Falha na conexão. Verifique as configurações.");
          }
        }, 3000);
      } catch (error) {
        message.error("Erro ao conectar instância.");
        console.error("Erro ao conectar instância:", error);
      }
    },
    [instances, handleUpdateInstance]
  );

  const handleDisconnectInstance = useCallback(
    async (id: string) => {
      try {
        await handleUpdateInstance(id, {
          status: "disconnected",
          lastActivity: new Date().toISOString()
        });
        message.info("Instância desconectada.");
      } catch (error) {
        message.error("Erro ao desconectar instância.");
        console.error("Erro ao desconectar instância:", error);
      }
    },
    [handleUpdateInstance]
  );

  const refreshInstances = useCallback(() => {
    loadMockInstances();
    message.info("Lista de instâncias atualizada.");
  }, [loadMockInstances]);

  return {
    instances,
    viewMode,
    loading,
    selectedInstance,
    setViewMode,
    setSelectedInstance,
    createInstance: handleCreateInstance,
    updateInstance: handleUpdateInstance,
    deleteInstance: handleDeleteInstance,
    connectInstance: handleConnectInstance,
    disconnectInstance: handleDisconnectInstance,
    refreshInstances
  };
};

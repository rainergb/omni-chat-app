import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { whatsappApiService } from "@/services/whatsapp.api";
import { whatsappConfig } from "@/config/whatsapp.config";
import {
  WhatsAppInstance,
  CreateInstanceRequest,
  mapWhatsAppStatusToFrontend
} from "@/types/whatsapp.types";
import { Instance } from "@/libs/types";

// Query keys
export const WHATSAPP_QUERY_KEYS = {
  instances: ["whatsapp", "instances"] as const,
  qrcode: (instanceId: string) => ["whatsapp", "qrcode", instanceId] as const
};

export const useWhatsAppInstances = () => {
  return useQuery({
    queryKey: WHATSAPP_QUERY_KEYS.instances,
    queryFn: whatsappApiService.listInstances,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: false,
    retry: 0,
    select: (data) => {
      return Array.isArray(data) ? data : [];
    }
  });
};

export const useCreateWhatsAppInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Omit<
        CreateInstanceRequest,
        | "webHookMensagem"
        | "webHookStatusChat"
        | "webHookConectado"
        | "webHookDesconectado"
      >
    ) => {
      const instanceData: CreateInstanceRequest = {
        ...data,
        webHookMensagem: `${whatsappConfig.apiUrl}/mensagem`,
        webHookStatusChat: `${whatsappConfig.apiUrl}/statuschat`,
        webHookConectado: `${whatsappConfig.apiUrl}/conectado`,
        webHookDesconectado: `${whatsappConfig.apiUrl}/desconectado`
      };

      return whatsappApiService.createInstance(instanceData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: WHATSAPP_QUERY_KEYS.instances
      });
      message.success(`Instância ${data?.id || "nova"} criada com sucesso!`);
    },
    onError: (error: unknown) => {
      console.error("Erro ao criar instância:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao criar instância";
      message.error(`Erro ao criar instância: ${errorMessage}`);
    }
  });
};

export const useGetQRCode = (instanceId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: WHATSAPP_QUERY_KEYS.qrcode(instanceId),
    queryFn: () => whatsappApiService.getQRCode(instanceId),
    enabled: enabled && !!instanceId,
    staleTime: 20000,
    retry: 2
  });
};

export const useDisconnectInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappApiService.disconnectInstance,
    onSuccess: (data, instanceId) => {
      queryClient.invalidateQueries({
        queryKey: WHATSAPP_QUERY_KEYS.instances
      });
      message.info(`Instância ${instanceId} desconectada.`);
    },
    onError: (error: Error) => {
      message.error(`Erro ao desconectar: ${error.message}`);
    }
  });
};

export const useReloadInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappApiService.reloadInstance,
    onSuccess: (data, instanceId) => {
      queryClient.invalidateQueries({
        queryKey: WHATSAPP_QUERY_KEYS.instances
      });
      message.success(`Instância ${instanceId} recarregada!`);
    },
    onError: (error: Error) => {
      message.error(`Erro ao recarregar: ${error.message}`);
    }
  });
};

export const useDeleteInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: whatsappApiService.deleteInstance,
    onSuccess: (data, instanceId) => {
      queryClient.invalidateQueries({
        queryKey: WHATSAPP_QUERY_KEYS.instances
      });
      message.success(`Instância ${instanceId} removida!`);
    },
    onError: (error: Error) => {
      message.error(`Erro ao remover: ${error.message}`);
    }
  });
};

export const useUpdateInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      instanceId,
      data
    }: {
      instanceId: string;
      data: Partial<WhatsAppInstance>;
    }) => whatsappApiService.updateInstance(instanceId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: WHATSAPP_QUERY_KEYS.instances
      });
      message.success(`Instância ${variables.instanceId} atualizada!`);
    },
    onError: (error: Error) => {
      message.error(`Erro ao atualizar: ${error.message}`);
    }
  });
};

export const mapWhatsAppInstanceToFrontend = (
  whatsappInstance: WhatsAppInstance
): Instance => {
  return {
    id: whatsappInstance.id,
    name: `WhatsApp ${whatsappInstance.id}`,
    type: "whatsapp",
    status: mapWhatsAppStatusToFrontend(whatsappInstance.statusSession),
    lastActivity:
      whatsappInstance.updatedAt?.toString() || new Date().toISOString(),
    messagesCount: 0,
    createdAt:
      whatsappInstance.createdAt?.toString() || new Date().toISOString(),
    webhook: whatsappInstance.webHookMensagem,
    avatar: whatsappInstance.foto || undefined
  };
};

export const useUnifiedInstances = () => {
  const { isLoading, error } = useWhatsAppInstances();

  return {
    isLoading,
    error
  };
};

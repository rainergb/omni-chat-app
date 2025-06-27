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

// Hook para listar instâncias
export const useWhatsAppInstances = () => {
  return useQuery({
    queryKey: WHATSAPP_QUERY_KEYS.instances,
    queryFn: whatsappApiService.listInstances,
    staleTime: 5 * 60 * 1000, // 5 minutos - dados considerados frescos por mais tempo
    gcTime: 10 * 60 * 1000, // 10 minutos - cache mantido por mais tempo
    refetchOnWindowFocus: false, // Não refetch ao focar na janela
    refetchOnMount: false, // Não refetch desnecessário no mount
    refetchOnReconnect: true, // Manter refetch apenas na reconexão
    refetchInterval: false, // Desabilitar refetch automático por intervalo
    retry: 0,
    select: (data) => {
      // Garantir que sempre retornamos um array
      return Array.isArray(data) ? data : [];
    }
  });
};

// Hook para criar instância
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
      message.success(`Instância ${data.id} criada com sucesso!`);
    },
    onError: (error: Error) => {
      message.error(`Erro ao criar instância: ${error.message}`);
    }
  });
};

// Hook para obter QR Code
export const useGetQRCode = (instanceId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: WHATSAPP_QUERY_KEYS.qrcode(instanceId),
    queryFn: () => whatsappApiService.getQRCode(instanceId),
    enabled: enabled && !!instanceId,
    staleTime: 20000, // QR Code é válido por 20 segundos
    retry: 2
  });
};

// Hook para desconectar instância
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

// Hook para recarregar instância
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

// Hook para deletar instância
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

// Hook para atualizar instância
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

// Função helper para converter WhatsAppInstance para Instance (frontend)
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
    messagesCount: 0, // Será atualizado via WebSocket ou API separada
    createdAt:
      whatsappInstance.createdAt?.toString() || new Date().toISOString(),
    webhook: whatsappInstance.webHookMensagem,
    avatar: whatsappInstance.foto || undefined
  };
};

// Hook principal que combina dados WhatsApp com dados mock
export const useUnifiedInstances = () => {
  const { isLoading, error } = useWhatsAppInstances();

  return {
    isLoading,
    error
  };
};

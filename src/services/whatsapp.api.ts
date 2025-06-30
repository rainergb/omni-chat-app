import axios from "axios";
import { whatsappConfig } from "@/config/whatsapp.config";
import {
  WhatsAppInstance,
  CreateInstanceRequest,
  CreateInstanceResponse,
  QRCodeResponse
} from "@/types/whatsapp.types";

const whatsappApi = axios.create({
  baseURL: whatsappConfig.apiUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

whatsappApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("❌ WhatsApp API Request Error:", error);
    return Promise.reject(error);
  }
);

whatsappApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "❌ WhatsApp API Response Error:",
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export const whatsappApiService = {
  async listInstances(): Promise<WhatsAppInstance[]> {
    try {
      const response = await whatsappApi.get<WhatsAppInstance[]>(
        whatsappConfig.endpoints.instances
      );

      // Garantir que sempre retornamos um array
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === "object") {
        // Se a API retorna um objeto com uma propriedade que contém o array
        const possibleArrays = Object.values(data).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          return possibleArrays[0] as WhatsAppInstance[];
        }
      }

      console.warn("API não retornou um array válido:", data);
      return [];
    } catch (error) {
      console.error("Erro ao listar instâncias:", error);
      throw new Error("Falha ao carregar instâncias WhatsApp");
    }
  },

  async createInstance(
    data: CreateInstanceRequest
  ): Promise<CreateInstanceResponse> {
    try {
      const response = await whatsappApi.post<CreateInstanceResponse>(
        whatsappConfig.endpoints.instances,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao criar instância:", error);
      throw new Error("Falha ao criar instância WhatsApp");
    }
  },

  async getQRCode(instanceId: string): Promise<QRCodeResponse> {
    try {
      const response = await whatsappApi.get<QRCodeResponse>(
        `${whatsappConfig.endpoints.qrcode}/${instanceId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao obter QR Code:", error);
      throw new Error("Falha ao gerar QR Code");
    }
  },

  async disconnectInstance(
    instanceId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await whatsappApi.patch(
        `${whatsappConfig.endpoints.disconnect}/${instanceId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao desconectar instância:", error);
      throw new Error("Falha ao desconectar instância");
    }
  },

  async reloadInstance(
    instanceId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await whatsappApi.patch(
        `${whatsappConfig.endpoints.reload}/${instanceId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao recarregar instância:", error);
      throw new Error("Falha ao recarregar instância");
    }
  },

  async updateInstance(
    instanceId: string,
    data: Partial<WhatsAppInstance>
  ): Promise<WhatsAppInstance> {
    try {
      const response = await whatsappApi.put<WhatsAppInstance>(
        `${whatsappConfig.endpoints.update}/${instanceId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar instância:", error);
      throw new Error("Falha ao atualizar instância");
    }
  },

  async deleteInstance(
    instanceId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await whatsappApi.delete(
        `${whatsappConfig.endpoints.delete}/${instanceId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar instância:", error);
      throw new Error("Falha ao deletar instância");
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      await whatsappApi.get("/health");
      return true;
    } catch {
      return false;
    }
  }
};

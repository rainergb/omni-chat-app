// src/services/whatsapp.api.ts
import axios from 'axios';
import { whatsappConfig } from '@/config/whatsapp.config';
import {
  WhatsAppInstance,
  CreateInstanceRequest,
  CreateInstanceResponse,
  QRCodeResponse
} from '@/types/whatsapp.types';

// Criar instância do axios para WhatsApp API
const whatsappApi = axios.create({
  baseURL: whatsappConfig.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para logs
whatsappApi.interceptors.request.use(
  (config) => {
    console.log(`🚀 WhatsApp API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ WhatsApp API Request Error:', error);
    return Promise.reject(error);
  }
);

whatsappApi.interceptors.response.use(
  (response) => {
    console.log(`✅ WhatsApp API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ WhatsApp API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const whatsappApiService = {
  // Listar todas as instâncias
  async listInstances(): Promise<WhatsAppInstance[]> {
    try {
      const response = await whatsappApi.get<WhatsAppInstance[]>(whatsappConfig.endpoints.instances);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar instâncias:', error);
      throw new Error('Falha ao carregar instâncias WhatsApp');
    }
  },

  // Criar nova instância
  async createInstance(data: CreateInstanceRequest): Promise<CreateInstanceResponse> {
    try {
      const response = await whatsappApi.post<CreateInstanceResponse>(
        whatsappConfig.endpoints.instances,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      throw new Error('Falha ao criar instância WhatsApp');
    }
  },

  // Obter QR Code da instância
  async getQRCode(instanceId: string): Promise<QRCodeResponse> {
    try {
      const response = await whatsappApi.get<QRCodeResponse>(
        `${whatsappConfig.endpoints.qrcode}/${instanceId}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      throw new Error('Falha ao gerar QR Code');
    }
  },

  // Desconectar instância
  async disconnectInstance(instanceId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await whatsappApi.patch(`${whatsappConfig.endpoints.disconnect}/${instanceId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao desconectar instância:', error);
      throw new Error('Falha ao desconectar instância');
    }
  },

  // Recarregar instância
  async reloadInstance(instanceId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await whatsappApi.patch(`${whatsappConfig.endpoints.reload}/${instanceId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao recarregar instância:', error);
      throw new Error('Falha ao recarregar instância');
    }
  },

  // Atualizar instância
  async updateInstance(instanceId: string, data: Partial<WhatsAppInstance>): Promise<WhatsAppInstance> {
    try {
      const response = await whatsappApi.put<WhatsAppInstance>(
        `${whatsappConfig.endpoints.update}/${instanceId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar instância:', error);
      throw new Error('Falha ao atualizar instância');
    }
  },

  // Deletar instância
  async deleteInstance(instanceId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await whatsappApi.delete(`${whatsappConfig.endpoints.delete}/${instanceId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar instância:', error);
      throw new Error('Falha ao deletar instância');
    }
  },

  // Verificar status da API
  async healthCheck(): Promise<boolean> {
    try {
      await whatsappApi.get('/health');
      return true;
    } catch {
      return false;
    }
  }
};
// src/config/whatsapp.config.ts
export const whatsappConfig = {
  apiUrl: process.env.NEXT_PUBLIC_WHATSAPP_API,
  endpoints: {
    instances: '/instancia',
    qrcode: '/instancia/qrcode',
    disconnect: '/instancia/disconnect',
    reload: '/instancia/reload',
    delete: '/instancia',
    update: '/instancia',
  },
  websocket: {
    transports: ['websocket', 'polling'] as const,
    timeout: 20000,
    forceNew: true,
  }
} as const;

// Helper para construir URLs das APIs
export const buildApiUrl = (endpoint: string, params?: string) => {
  const baseUrl = whatsappConfig.apiUrl + endpoint;
  return params ? `${baseUrl}/${params}` : baseUrl;
};
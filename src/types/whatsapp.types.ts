export interface WhatsAppInstance {
  id: string;
  canal: string;
  chave?: string | null;
  statusSession?: string;
  webHookMensagem?: string;
  webHookStatusChat?: string;
  webHookConectado?: string;
  webHookDesconectado?: string;
  status?: string | null;
  tempoEnvio: number;
  foto?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateInstanceRequest {
  canal: string;
  tempoEnvio: number;
  webHookMensagem?: string;
  webHookStatusChat?: string;
  webHookConectado?: string;
  webHookDesconectado?: string;
}

export interface CreateInstanceResponse {
  id: string;
  message: string;
  success: boolean;
}

export interface QRCodeResponse {
  qrcode: string;
  success: boolean;
  message?: string;
}

export interface WhatsAppMessage {
  id: string;
  instanceId: string;
  from: string;
  to: string;
  body: string;
  type: "text" | "image" | "audio" | "video" | "document";
  timestamp: number;
  messageId: string;
}

export interface ConnectionStatus {
  instanceId: string;
  status: "CONNECTED" | "DISCONNECTED" | "CONNECTING" | "error";
  timestamp: number;
}

export interface WebSocketEvents {
  mensagem: WhatsAppMessage;
  conectado: ConnectionStatus;
  desconectado: ConnectionStatus;
  statusSession: ConnectionStatus;
}

export const mapWhatsAppStatusToFrontend = (
  status?: string
): "CONNECTED" | "DISCONNECTED" | "CONNECTING" | "error" => {
  switch (status?.toLowerCase()) {
    case "CONNECTED":
    case "open":
      return "CONNECTED";
    case "CONNECTING":
    case "initializing":
      return "CONNECTING";
    case "DISCONNECTED":
    case "closed":
      return "DISCONNECTED";
    case "error":
    case "failed":
      return "error";
    default:
      return "DISCONNECTED";
  }
};

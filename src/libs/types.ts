export interface Instance {
  id: string;
  name: string;
  type: "whatsapp" | "instagram" | "facebook" | "telegram";
  status: "CONNECTED" | "DISCONNECTED" | "connecting" | "error";
  lastActivity: string;
  messagesCount: number;
  createdAt: string;
  qrCode?: string;
  webhook?: string;
  avatar?: string;
}

export interface Chat {
  id: string;
  instanceId: string;
  contactName: string;
  contactPhone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
  isGroup: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  type: "text" | "image" | "audio" | "video" | "document";
  timestamp: string;
  sender: "user" | "contact";
  status: "sending" | "sent" | "delivered" | "read";
}

export type ViewMode = "cards" | "list";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

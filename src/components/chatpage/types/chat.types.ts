// src/components/chatpage/types/chat.types.ts

export interface Chat {
  id: string;
  instanceId: string;
  contactName: string;
  contactPhone: string;
  contactAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
  isOnline: boolean;
  participants?: string[]; // Para grupos
  isPinned?: boolean;
  isMuted?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  type: MessageType;
  timestamp: string;
  sender: MessageSender;
  status: MessageStatus;
  replyTo?: string; // ID da mensagem respondida
  metadata?: MessageMetadata;
}

export type MessageType = 
  | "text" 
  | "image" 
  | "audio" 
  | "video" 
  | "document" 
  | "location" 
  | "contact"
  | "sticker";

export interface MessageSender {
  id: string;
  name: string;
  avatar?: string;
  isMe: boolean;
}

export type MessageStatus = 
  | "sending" 
  | "sent" 
  | "delivered" 
  | "read" 
  | "failed";

export interface MessageMetadata {
  fileName?: string;
  fileSize?: number;
  duration?: number; // Para áudio/vídeo
  coordinates?: { lat: number; lng: number }; // Para localização
  thumbnail?: string; // Para imagens/vídeos
}

export interface ChatFilter {
  instanceId?: string;
  platform?: string;
  unreadOnly?: boolean;
  searchTerm?: string;
}

export interface TypingIndicator {
  chatId: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface ChatState {
  chats: Chat[];
  messages: Record<string, Message[]>;
  selectedChat: Chat | null;
  selectedInstance: string | null;
  loading: boolean;
  loadingMessages: boolean;
  typingIndicators: TypingIndicator[];
  filter: ChatFilter;
}

// Props dos componentes
export interface ContactItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: (chat: Chat) => void;
}

export interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  showTimestamp?: boolean;
}

export interface ChatHeaderProps {
  chat: Chat;
  onBack?: () => void; 
  onCall?: () => void;
  onVideoCall?: () => void;
  onInfo?: () => void;
}

export interface MessageInputProps {
  onSendMessage: (content: string, type?: MessageType) => void;
  disabled?: boolean;
  placeholder?: string;
}
// src/store/chatStore.ts
import { create } from "zustand";
import {
  Chat,
  Message,
  ChatFilter,
  TypingIndicator,
  MessageType
} from "@/components/chatpage/types/chat.types";
import { generateId } from "@/libs/utils";

interface ChatStore {
  // Estado
  chats: Chat[];
  messages: Record<string, Message[]>;
  selectedChat: Chat | null;
  selectedInstance: string | null;
  loading: boolean;
  loadingMessages: boolean;
  typingIndicators: TypingIndicator[];
  filter: ChatFilter;

  // Ações para chats
  setChats: (chats: Chat[]) => void;
  setSelectedChat: (chat: Chat | null) => void;
  setSelectedInstance: (instanceId: string | null) => void;
  setFilter: (filter: Partial<ChatFilter>) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMessages: (loading: boolean) => void;

  // Ações para mensagens
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (
    chatId: string,
    message: Omit<Message, "id" | "timestamp">
  ) => void;
  markAsRead: (chatId: string) => void;
  updateMessageStatus: (messageId: string, status: Message["status"]) => void;

  // Ações para indicadores de digitação
  addTypingIndicator: (indicator: TypingIndicator) => void;
  removeTypingIndicator: (chatId: string, userId: string) => void;

  // Ações de mock data
  loadMockChats: (instanceId?: string) => void;
  loadMockMessages: (chatId: string) => Promise<void>;
  sendMockMessage: (
    chatId: string,
    content: string,
    type?: MessageType
  ) => Promise<void>;
}

// Mock data
const mockChats: Chat[] = [
  {
    id: "chat-1",
    instanceId: "1", // WhatsApp Principal
    contactName: "Darshan Zalavadiya",
    contactPhone: "+55 11 99999-0001",
    contactAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    lastMessage: "Good",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 0,
    isGroup: false,
    isOnline: true,
    isPinned: false,
    isMuted: false
  },
  {
    id: "chat-2",
    instanceId: "1",
    contactName: "School App Client",
    contactPhone: "+55 11 99999-0002",
    lastMessage: "Thanks for the update on the project...",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 2,
    isGroup: false,
    isOnline: false,
    isPinned: true,
    isMuted: false
  },
  {
    id: "chat-3",
    instanceId: "1",
    contactName: "UI/UX Teams",
    contactPhone: "+55 11 99999-0003",
    lastMessage: "I have done my work 👍",
    lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    unreadCount: 5,
    isGroup: true,
    isOnline: true,
    isPinned: false,
    isMuted: false,
    participants: ["user1", "user2", "user3", "user4"]
  },
  {
    id: "chat-4",
    instanceId: "1",
    contactName: "Friends",
    contactPhone: "+55 11 99999-0004",
    lastMessage: "Jon is Talking...",
    lastMessageTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
    isGroup: true,
    isOnline: true,
    isPinned: false,
    isMuted: true,
    participants: ["user1", "user2", "user3"]
  },
  {
    id: "chat-5",
    instanceId: "2", // Instagram Business
    contactName: "Cliente Instagram",
    contactPhone: "@cliente_insta",
    lastMessage: "Adorei os produtos!",
    lastMessageTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    unreadCount: 3,
    isGroup: false,
    isOnline: false,
    isPinned: false,
    isMuted: false
  }
];

const mockMessages: Record<string, Message[]> = {
  "chat-1": [
    {
      id: "msg-1",
      chatId: "chat-1",
      content: "Hello, Darshan",
      type: "text",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      sender: {
        id: "me",
        name: "Eu",
        isMe: true
      },
      status: "read"
    },
    {
      id: "msg-2",
      chatId: "chat-1",
      content: "How are you",
      type: "text",
      timestamp: new Date(Date.now() - 58 * 60 * 1000).toISOString(),
      sender: {
        id: "me",
        name: "Eu",
        isMe: true
      },
      status: "read"
    },
    {
      id: "msg-3",
      chatId: "chat-1",
      content: "I am good",
      type: "text",
      timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      sender: {
        id: "darshan",
        name: "Darshan Zalavadiya",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        isMe: false
      },
      status: "delivered"
    },
    {
      id: "msg-4",
      chatId: "chat-1",
      content: "What about You",
      type: "text",
      timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
      sender: {
        id: "darshan",
        name: "Darshan Zalavadiya",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        isMe: false
      },
      status: "delivered"
    },
    {
      id: "msg-5",
      chatId: "chat-1",
      content: "Same for this side",
      type: "text",
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      sender: {
        id: "me",
        name: "Eu",
        isMe: true
      },
      status: "read"
    },
    {
      id: "msg-6",
      chatId: "chat-1",
      content: "Good",
      type: "text",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      sender: {
        id: "darshan",
        name: "Darshan Zalavadiya",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        isMe: false
      },
      status: "delivered"
    }
  ]
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: {},
  selectedChat: null,
  selectedInstance: null,
  loading: false,
  loadingMessages: false,
  typingIndicators: [],
  filter: {},

  setChats: (chats) => set({ chats }),

  setSelectedChat: (chat) => {
    set({ selectedChat: chat });
    if (chat) {
      get().markAsRead(chat.id);
    }
  },

  setSelectedInstance: (instanceId) => {
    set({ selectedInstance: instanceId, selectedChat: null });
    if (instanceId) {
      get().loadMockChats(instanceId);
    }
  },

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  setLoading: (loading) => set({ loading }),

  setLoadingMessages: (loading) => set({ loadingMessages: loading }),

  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages }
    })),

  addMessage: (chatId, messageData) => {
    const message: Message = {
      ...messageData,
      id: generateId(),
      timestamp: new Date().toISOString()
    };

    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: [...chatMessages, message]
        },
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: message.content,
                lastMessageTime: message.timestamp,
                unreadCount: message.sender.isMe ? 0 : chat.unreadCount + 1
              }
            : chat
        )
      };
    });
  },

  markAsRead: (chatId) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    })),

  updateMessageStatus: (messageId, status) =>
    set((state) => {
      const newMessages = { ...state.messages };
      Object.keys(newMessages).forEach((chatId) => {
        newMessages[chatId] = newMessages[chatId].map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg
        );
      });
      return { messages: newMessages };
    }),

  // Ações para indicadores de digitação
  addTypingIndicator: (indicator) =>
    set((state) => ({
      typingIndicators: [
        ...state.typingIndicators.filter(
          (t) =>
            !(t.chatId === indicator.chatId && t.userId === indicator.userId)
        ),
        indicator
      ]
    })),

  removeTypingIndicator: (chatId, userId) =>
    set((state) => ({
      typingIndicators: state.typingIndicators.filter(
        (t) => !(t.chatId === chatId && t.userId === userId)
      )
    })),

  loadMockChats: (instanceId) => {
    set({ loading: true });
    setTimeout(() => {
      const filteredChats = instanceId
        ? mockChats.filter((chat) => chat.instanceId === instanceId)
        : mockChats;
      set({ chats: filteredChats, loading: false });
    }, 500);
  },

  loadMockMessages: async (chatId) => {
    set({ loadingMessages: true });
    return new Promise((resolve) => {
      setTimeout(() => {
        const messages = mockMessages[chatId] || [];
        set((state) => ({
          messages: { ...state.messages, [chatId]: messages },
          loadingMessages: false
        }));
        resolve();
      }, 300);
    });
  },

  sendMockMessage: async (chatId, content, type = "text") => {
    const message = {
      chatId,
      content,
      type,
      sender: {
        id: "me",
        name: "Eu",
        isMe: true
      },
      status: "sending" as const
    };

    get().addMessage(chatId, message);

    setTimeout(() => {
      const messages = get().messages[chatId];
      const sentMessage = messages[messages.length - 1];
      get().updateMessageStatus(sentMessage.id, "sent");

      setTimeout(() => {
        get().updateMessageStatus(sentMessage.id, "delivered");
      }, 1000);
    }, 500);

    return Promise.resolve();
  }
}));

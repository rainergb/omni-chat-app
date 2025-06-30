import { create } from "zustand";
import {
  Chat,
  Message,
  ChatFilter,
  TypingIndicator
} from "@/components/chatpage/types/chat.types";
import { generateId } from "@/libs/utils";

interface ChatStore {
  chats: Chat[];
  messages: Record<string, Message[]>;
  selectedChat: Chat | null;
  selectedInstance: string | null;
  loading: boolean;
  loadingMessages: boolean;
  typingIndicators: TypingIndicator[];
  filter: ChatFilter;

  setChats: (chats: Chat[]) => void;
  setSelectedChat: (chat: Chat | null) => void;
  setSelectedInstance: (instanceId: string | null) => void;
  setFilter: (filter: Partial<ChatFilter>) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMessages: (loading: boolean) => void;

  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (
    chatId: string,
    message: Omit<Message, "id" | "timestamp">
  ) => void;
  markAsRead: (chatId: string) => void;
  updateMessageStatus: (messageId: string, status: Message["status"]) => void;

  addTypingIndicator: (indicator: TypingIndicator) => void;
  removeTypingIndicator: (chatId: string, userId: string) => void;
}

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
    }))
}));

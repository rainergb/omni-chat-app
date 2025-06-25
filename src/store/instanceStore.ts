import { create } from "zustand";
import { Instance, ViewMode } from "@/libs/types";
import { generateId } from "@/libs/utils";

interface InstanceStore {
  instances: Instance[];
  viewMode: ViewMode;
  loading: boolean;
  selectedInstance: Instance | null;

  setInstances: (instances: Instance[]) => void;
  addInstance: (instance: Omit<Instance, "id" | "createdAt">) => void;
  updateInstance: (id: string, updates: Partial<Instance>) => void;
  deleteInstance: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setLoading: (loading: boolean) => void;
  setSelectedInstance: (instance: Instance | null) => void;

  loadMockInstances: () => void;
}

const mockInstances: Instance[] = [
  {
    id: "1",
    name: "WhatsApp Principal",
    type: "whatsapp",
    status: "connected",
    lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    messagesCount: 147,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    webhook: "https://api.exemplo.com/webhook/wpp1"
  },
  {
    id: "2",
    name: "Instagram Business",
    type: "instagram",
    status: "connecting",
    lastActivity: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    messagesCount: 89,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    webhook: "https://api.exemplo.com/webhook/ig1"
  },
  {
    id: "3",
    name: "Facebook Page",
    type: "facebook",
    status: "disconnected",
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    messagesCount: 23,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    webhook: "https://api.exemplo.com/webhook/fb1"
  },
  {
    id: "4",
    name: "Telegram Bot",
    type: "telegram",
    status: "error",
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    messagesCount: 12,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    webhook: "https://api.exemplo.com/webhook/tg1"
  },
  {
    id: "5",
    name: "WhatsApp Suporte",
    type: "whatsapp",
    status: "connected",
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    messagesCount: 301,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    webhook: "https://api.exemplo.com/webhook/wpp2"
  }
];

export const useInstanceStore = create<InstanceStore>((set) => ({
  instances: [],
  viewMode: "cards",
  loading: false,
  selectedInstance: null,

  setInstances: (instances) => set({ instances }),

  addInstance: (instanceData) => {
    const newInstance: Instance = {
      ...instanceData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    set((state) => ({
      instances: [...state.instances, newInstance]
    }));
  },

  updateInstance: (id, updates) => {
    set((state) => ({
      instances: state.instances.map((instance) =>
        instance.id === id ? { ...instance, ...updates } : instance
      )
    }));
  },

  deleteInstance: (id) => {
    set((state) => ({
      instances: state.instances.filter((instance) => instance.id !== id),
      selectedInstance:
        state.selectedInstance?.id === id ? null : state.selectedInstance
    }));
  },

  setViewMode: (mode) => set({ viewMode: mode }),

  setLoading: (loading) => set({ loading }),

  setSelectedInstance: (instance) => set({ selectedInstance: instance }),

  loadMockInstances: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ instances: mockInstances, loading: false });
    }, 1000);
  }
}));

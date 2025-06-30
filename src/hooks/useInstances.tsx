// src/hooks/useInstance.ts
import { useQuery } from "@tanstack/react-query";
import { whatsappApiService } from "@/services/whatsapp.api";

const INSTANCE_KEYS = {
  qrcode: (id: string) => ["instance", "qrcode", id] as const
};

export const useInstanceQRCode = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: INSTANCE_KEYS.qrcode(id),
    queryFn: async () => {
      console.log("Fetching QR Code for instance:", id);
      const response = await whatsappApiService.getQRCode(id);
      console.log("QR Code response:", response);
      return response;
    },
    enabled: Boolean(id) && enabled,
    select: (data) => {
      console.log("Selecting QR Code data:", data);
      return data?.qrcode || data;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 0, // Sempre buscar dados frescos
    gcTime: 0, // Não cachear
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
};

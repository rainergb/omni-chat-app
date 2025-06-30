import { useQuery } from "@tanstack/react-query";
import { whatsappApiService } from "@/services/whatsapp.api";

const INSTANCE_KEYS = {
  qrcode: (id: string) => ["instance", "qrcode", id] as const,
};

export const useInstanceQRCode = (id: string) => {
  return useQuery({
    queryKey: INSTANCE_KEYS.qrcode(id),
    queryFn: async () => whatsappApiService.getQRCode(id),
    enabled: Boolean(id),
    select: (data) => data.qrcode,
  });
};

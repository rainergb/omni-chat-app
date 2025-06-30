// src/components/instances/Components/QRCodeModal/QRCodeModal.tsx
"use client";

import { useInstanceQRCode } from "@/hooks/useInstance";
import { Button } from "@/components/ui";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface QrCodeModalProps {
  id: string | null;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export default function QrCodeModal({
  id,
  isOpen,
  onClose
}: // loading: _loading, // intentionally unused
QrCodeModalProps) {
  const router = useRouter();
  const { data, isLoading } = useInstanceQRCode(id!);

  useEffect(() => {
    console.log("QRCODE DATA;", data);
  }, [data]);
  const handleGoToChatPage = () => {
    router.push("/chatpage");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full space-y-4 text-center">
          <Dialog.Title className="text-xl font-bold text-black">
            QR Code para Conectar
          </Dialog.Title>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="text-gray-600">Carregando QR Code...</span>
            </div>
          ) : data ? (
            <Image
              src={data}
              alt="QR Code"
              className="mx-auto"
              width={200}
              height={200}
            />
          ) : (
            <p className="text-red-500">Falha ao gerar o QR Code.</p>
          )}
          <div className="flex gap-3 justify-center mt-4">
            <Button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Fechar
            </Button>
            <Button
              onClick={handleGoToChatPage}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Ir para Chat
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

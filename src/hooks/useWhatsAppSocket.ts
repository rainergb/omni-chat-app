// src/hooks/useWhatsAppSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { message } from 'antd';
import { whatsappConfig } from '@/config/whatsapp.config';
import { WhatsAppMessage, ConnectionStatus } from '@/types/whatsapp.types';

interface UseWhatsAppSocketProps {
  onMessage?: (message: WhatsAppMessage) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export const useWhatsAppSocket = ({
  onMessage,
  onStatusChange,
  onConnect,
  onDisconnect,
  onError
}: UseWhatsAppSocketProps = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Criar conexão WebSocket
    const socket = io(whatsappConfig.apiUrl);
    socketRef.current = socket;

    // Event listeners
    socket.on('connect', () => {
      console.log('🔌 WebSocket conectado ao WhatsApp API');
      setIsConnected(true);
      setConnectionError(null);
      onConnect?.();
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket desconectado:', reason);
      setIsConnected(false);
      onDisconnect?.();
      
      if (reason === 'io server disconnect') {
        // Servidor desconectou, tentar reconectar
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão WebSocket:', error);
      setConnectionError(error.message);
      onError?.(error);
    });

    // Eventos específicos do WhatsApp
    socket.on('mensagem', (data: WhatsAppMessage) => {
      console.log('📨 Nova mensagem recebida:', data);
      onMessage?.(data);
    });

    socket.on('conectado', (data: ConnectionStatus) => {
      console.log('🟢 Instância conectada:', data);
      onStatusChange?.(data);
      message.success(`Instância ${data.instanceId} conectada!`);
    });

    socket.on('desconectado', (data: ConnectionStatus) => {
      console.log('🔴 Instância desconectada:', data);
      onStatusChange?.(data);
      message.warning(`Instância ${data.instanceId} desconectada!`);
    });

    socket.on('statusSession', (data: ConnectionStatus) => {
      console.log('📊 Status da sessão alterado:', data);
      onStatusChange?.(data);
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [onMessage, onStatusChange, onConnect, onDisconnect, onError]);

  // Métodos para controlar a conexão
  const connect = () => {
    if (socketRef.current && !isConnected) {
      socketRef.current.connect();
    }
  };

  const disconnect = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.disconnect();
    }
  };

  const reconnect = () => {
    disconnect();
    setTimeout(connect, 1000);
  };

  // Enviar evento personalizado
  const emit = <T>(event: string, data: T) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('🚨 WebSocket não conectado. Evento não enviado:', event);
    }
  };

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    reconnect,
    emit,
    socket: socketRef.current
  };
};
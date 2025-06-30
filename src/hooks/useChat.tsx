import { useCallback, useEffect, useMemo } from "react";
import { message } from "antd";
import { useChatStore } from "@/store/chatStore";
import { useInstanceStore } from "@/store/instanceStore";
import { Chat, ChatFilter } from "@/components/chatpage/types/chat.types";

export const useChat = () => {
  const {
    chats,
    messages,
    selectedChat,
    selectedInstance,
    loading,
    loadingMessages,
    typingIndicators,
    filter,
    setChats,
    setSelectedChat,
    setSelectedInstance,
    setFilter,
    markAsRead,
    addTypingIndicator,
    removeTypingIndicator
  } = useChatStore();

  const { instances } = useInstanceStore();

  const availableInstances = useMemo(() => {
    return instances.filter((instance) => instance.status === "connected");
  }, [instances]);

  // Chats filtrados
  const filteredChats = useMemo(() => {
    let filtered = chats;

    // Filtrar por termo de busca
    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (chat) =>
          chat.contactName.toLowerCase().includes(searchTerm) ||
          chat.lastMessage.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar apenas não lidas
    if (filter.unreadOnly) {
      filtered = filtered.filter((chat) => chat.unreadCount > 0);
    }

    // Ordenar por: fixados primeiro, depois por última mensagem
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
      );
    });
  }, [chats, filter]);

  // Mensagens do chat selecionado
  const currentMessages = useMemo(() => {
    return selectedChat ? messages[selectedChat.id] || [] : [];
  }, [selectedChat, messages]);

  // Indicadores de digitação para o chat atual
  const currentTypingIndicators = useMemo(() => {
    return selectedChat
      ? typingIndicators.filter(
          (indicator) => indicator.chatId === selectedChat.id
        )
      : [];
  }, [selectedChat, typingIndicators]);

  // Total de mensagens não lidas
  const totalUnreadCount = useMemo(() => {
    return filteredChats.reduce((total, chat) => total + chat.unreadCount, 0);
  }, [filteredChats]); // Selecionar chat
  const handleSelectChat = useCallback(
    async (chat: Chat) => {
      setSelectedChat(chat);
    },
    [setSelectedChat]
  );

  // Enviar mensagem
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedChat || !content.trim()) {
        message.warning("Digite uma mensagem válida");
        return;
      }

      message.info("Função de envio real não implementada");
    },
    [selectedChat]
  );

  // Buscar chats
  const handleSearch = useCallback(
    (searchTerm: string) => {
      setFilter({ searchTerm });
    },
    [setFilter]
  );

  // Filtrar apenas não lidas
  const handleToggleUnreadFilter = useCallback(() => {
    setFilter({ unreadOnly: !filter.unreadOnly });
  }, [filter.unreadOnly, setFilter]);

  // Selecionar instância
  const handleSelectInstance = useCallback(
    (instanceId: string | null) => {
      if (instanceId === selectedInstance) return;

      setSelectedInstance(instanceId);
    },
    [selectedInstance, setSelectedInstance]
  );

  // Marcar chat como lido
  const handleMarkAsRead = useCallback(
    (chatId: string) => {
      markAsRead(chatId);
    },
    [markAsRead]
  );

  // Fixar/desfixar chat
  const handleTogglePin = useCallback(
    (chatId: string) => {
      const updatedChats = chats.map((chat) =>
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
      );
      setChats(updatedChats);
      message.success("Chat atualizado!");
    },
    [chats, setChats]
  );

  // Silenciar/desilenciar chat
  const handleToggleMute = useCallback(
    (chatId: string) => {
      const updatedChats = chats.map((chat) =>
        chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat
      );
      setChats(updatedChats);
      message.success("Chat atualizado!");
    },
    [chats, setChats]
  );

  // Simular indicador de digitação
  const handleStartTyping = useCallback(
    (chatId: string) => {
      addTypingIndicator({
        chatId,
        userId: "other-user",
        userName: "Usuário",
        timestamp: new Date().toISOString()
      });

      // Remover após 3 segundos
      setTimeout(() => {
        removeTypingIndicator(chatId, "other-user");
      }, 3000);
    },
    [addTypingIndicator, removeTypingIndicator]
  );

  // Atualizar filtro
  const handleUpdateFilter = useCallback(
    (newFilter: Partial<ChatFilter>) => {
      setFilter(newFilter);
    },
    [setFilter]
  );

  // Limpar seleção de chat (útil para mobile)
  const handleClearSelection = useCallback(() => {
    setSelectedChat(null);
  }, [setSelectedChat]);

  // Inicializar com primeira instância conectada se não houver seleção
  useEffect(() => {
    if (!selectedInstance && availableInstances.length > 0) {
      handleSelectInstance(availableInstances[0].id);
    }
  }, [selectedInstance, availableInstances, handleSelectInstance]);

  return {
    // Estado
    chats: filteredChats,
    currentMessages,
    selectedChat,
    selectedInstance,
    loading,
    loadingMessages,
    currentTypingIndicators,
    totalUnreadCount,
    availableInstances,
    filter,

    // Ações
    selectChat: handleSelectChat,
    sendMessage: handleSendMessage,
    search: handleSearch,
    toggleUnreadFilter: handleToggleUnreadFilter,
    selectInstance: handleSelectInstance,
    markAsRead: handleMarkAsRead,
    togglePin: handleTogglePin,
    toggleMute: handleToggleMute,
    startTyping: handleStartTyping,
    updateFilter: handleUpdateFilter,
    clearSelection: handleClearSelection,

    // Utilidades
    hasChats: filteredChats.length > 0,
    hasSelectedChat: !!selectedChat,
    hasAvailableInstances: availableInstances.length > 0
  };
};

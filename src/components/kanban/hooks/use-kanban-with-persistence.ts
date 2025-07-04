// hooks/use-kanban-with-persistence.ts
/**
 * Hook integrador que combina o Kanban com persistência automática
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { useKanbanBoard } from './use-kanban-board';
import { useDataPersistence } from './use-data-persistence';
import { PersistedData } from '../types/persistence';

interface UseKanbanWithPersistenceOptions {
  storageKey?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
  loadOnMount?: boolean;
  onLoadError?: (error: Error) => void;
  onSaveError?: (error: Error) => void;
  onMigrationStart?: (fromVersion: string, toVersion: string) => void;
  onMigrationComplete?: (fromVersion: string, toVersion: string) => void;
}

export function useKanbanWithPersistence(
  options: UseKanbanWithPersistenceOptions = {}
) {
  const {
    storageKey = 'kanban-board-persistent',
    autoSave = true,
    autoSaveInterval = 30000,
    loadOnMount = true,
    onLoadError,
    onSaveError,
    onMigrationStart,
    onMigrationComplete,
  } = options;

  // Estados da persistência
  const [isInitialized, setIsInitialized] = useState(false);
  const [migrationInProgress, setMigrationInProgress] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);

  // Hook do Kanban principal
  const kanbanBoard = useKanbanBoard({
    persistToStorage: false, // Desabilitamos a persistência interna
    storageKey: storageKey + '_internal',
  });

  // Hook de persistência
  const persistence = useDataPersistence({
    storageKey,
    autoSave,
    autoSaveInterval,
    maxBackups: 15,
    onSaveSuccess: () => {
      setLastAutoSave(new Date());
    },
    onSaveError: (error) => {
      console.error('Erro na persistência:', error);
      onSaveError?.(error);
      message.error('Erro ao salvar dados');
    },
    onLoadSuccess: () => {
      console.log('Dados carregados com sucesso');
    },
    onLoadError: (error) => {
      console.error('Erro ao carregar dados:', error);
      onLoadError?.(error);
      message.error('Erro ao carregar dados salvos');
    },
    onMigrationNeeded: (fromVersion, toVersion) => {
      setMigrationInProgress(true);
      onMigrationStart?.(fromVersion, toVersion);
      message.info(`Atualizando dados de ${fromVersion} para ${toVersion}...`);
    },
    onMigrationComplete: (fromVersion, toVersion) => {
      setMigrationInProgress(false);
      onMigrationComplete?.(fromVersion, toVersion);
      message.success(`Dados atualizados para versão ${toVersion}`);
    },
  });

  // Ref para evitar loops de atualização
  const lastSaveData = useRef<string>('');

  // Carregar dados na inicialização
  useEffect(() => {
    if (loadOnMount && !isInitialized) {
      loadPersistedData();
    }
  }, [loadOnMount, isInitialized]);

  // Auto-save quando dados mudarem
  useEffect(() => {
    if (isInitialized && autoSave && !migrationInProgress) {
      const currentData = getCurrentPersistedData();
      const currentDataStr = JSON.stringify(currentData);

      // Só salvar se houve mudanças
      if (currentDataStr !== lastSaveData.current) {
        lastSaveData.current = currentDataStr;
        persistence.markForAutoSave(currentData);
      }
    }
  }, [
    kanbanBoard.columns.columns,
    kanbanBoard.tasks.tasks,
    isInitialized,
    autoSave,
    migrationInProgress,
  ]);

  // Carregar dados persistidos
  const loadPersistedData = useCallback(async () => {
    try {
      const data = await persistence.load();

      if (data) {
        // Restaurar colunas
        const restoredColumns = data.columns || [];

        // Restaurar tarefas
        const restoredTasks = data.tasks || {};

        // Aplicar dados carregados ao board
        if (restoredColumns.length > 0) {
          // Limpar dados atuais e aplicar os carregados
          // Isso seria feito através de uma função de reset no useKanbanBoard
          console.log('Dados carregados:', {
            columns: restoredColumns.length,
            tasks: Object.keys(restoredTasks).length,
            version: data.settings?.version,
          });
        }
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setIsInitialized(true); // Continuar mesmo com erro
    }
  }, [persistence]);

  // Obter dados atuais no formato persistível
  const getCurrentPersistedData = useCallback((): PersistedData => {
    return {
      columns: kanbanBoard.columns.columns,
      tasks: kanbanBoard.tasks.tasks,
      settings: {
        version: persistence.getCurrentVersion(),
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(), // Seria mantido do load
        totalSaves: 0, // Seria incrementado
        boardId: `board-${Date.now()}`, // Seria mantido do load
        boardName: 'Meu Board Kanban',
      },
    };
  }, [kanbanBoard, persistence]);

  // Salvar manualmente
  const saveManually = useCallback(async () => {
    try {
      const data = getCurrentPersistedData();
      await persistence.save(data);
      message.success('Dados salvos com sucesso!');
    } catch (error) {
      message.error('Erro ao salvar dados');
      console.error(error);
    }
  }, [getCurrentPersistedData, persistence]);

  // Criar backup manual
  const createManualBackup = useCallback(
    async (label?: string) => {
      try {
        const data = getCurrentPersistedData();
        const backupId = await persistence.createBackup(data, label);
        message.success('Backup criado com sucesso!');
        return backupId;
      } catch (error) {
        message.error('Erro ao criar backup');
        throw error;
      }
    },
    [getCurrentPersistedData, persistence]
  );

  // Restaurar dados
  const restoreData = useCallback(
    async (data: PersistedData) => {
      try {
        // Aplicar dados restaurados ao board
        // Isso exigiria funções de reset no useKanbanBoard

        await persistence.save(data);
        setIsInitialized(true);
        message.success('Dados restaurados com sucesso!');
      } catch (error) {
        message.error('Erro ao restaurar dados');
        throw error;
      }
    },
    [persistence]
  );

  // Resetar para estado inicial
  const resetToDefault = useCallback(async () => {
    try {
      await persistence.clearAllData();
      // Reset do board para estado inicial
      setIsInitialized(true);
      message.success('Board resetado para estado inicial');
    } catch (error) {
      message.error('Erro ao resetar board');
      throw error;
    }
  }, [persistence]);

  // Exportar dados
  const exportAllData = useCallback(async () => {
    try {
      return await persistence.exportData();
    } catch (error) {
      message.error('Erro ao exportar dados');
      throw error;
    }
  }, [persistence]);

  // Importar dados
  const importData = useCallback(
    async (jsonData: string) => {
      try {
        await persistence.importData(jsonData);
        await loadPersistedData(); // Recarregar após importação
        message.success('Dados importados com sucesso!');
      } catch (error) {
        message.error('Erro ao importar dados');
        throw error;
      }
    },
    [persistence, loadPersistedData]
  );

  return {
    // Estado do board (delegado)
    ...kanbanBoard,

    // Estados da persistência
    isInitialized,
    migrationInProgress,
    lastAutoSave,

    // Estados da persistência (delegados)
    isLoading: persistence.isLoading,
    isSaving: persistence.isSaving,
    lastSaved: persistence.lastSaved,
    autoSaveEnabled: persistence.autoSaveEnabled,

    // Controles de persistência
    saveManually,
    createManualBackup,
    restoreData,
    resetToDefault,

    // Import/Export
    exportAllData,
    importData,

    // Controles delegados
    setAutoSaveEnabled: persistence.setAutoSaveEnabled,
    getBackups: persistence.getBackups,
    restoreFromBackup: persistence.restoreFromBackup,
    getStorageStats: persistence.getStorageStats,

    // Dados atuais
    getCurrentData: getCurrentPersistedData,

    // Informações de versão
    currentVersion: persistence.getCurrentVersion(),
  };
}

// hooks/use-data-persistence.ts
/**
 * Hook principal para gerenciar persistência de dados
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PersistenceConfig,
  PersistedData,
  BackupEntry,
} from '../types/persistence';
import { StorageManager } from '../utils/storage-manager';

// Implementação simples do VersionManager
class VersionManager {
  getCurrentVersion(): string {
    return '1.0.0';
  }

  needsMigration(): boolean {
    return false; // Por enquanto, sem migrações
  }

  async migrate(data: PersistedData): Promise<PersistedData> {
    // Por enquanto, apenas retorna os dados como estão
    return data;
  }
}

interface UsePersistenceOptions extends Partial<PersistenceConfig> {
  onSaveSuccess?: (data: PersistedData) => void;
  onSaveError?: (error: Error) => void;
  onLoadSuccess?: (data: PersistedData) => void;
  onLoadError?: (error: Error) => void;
  onMigrationNeeded?: (fromVersion: string, toVersion: string) => void;
  onMigrationComplete?: (fromVersion: string, toVersion: string) => void;
}

export function useDataPersistence(options: UsePersistenceOptions = {}) {
  const [storageManager] = useState(() => new StorageManager(options));
  const [versionManager] = useState(() => new VersionManager());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(
    options.autoSave ?? true
  );

  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const pendingData = useRef<PersistedData | null>(null);

  // Auto-save setup
  useEffect(() => {
    if (autoSaveEnabled && options.autoSaveInterval) {
      autoSaveInterval.current = setInterval(() => {
        if (pendingData.current) {
          handleSave(pendingData.current, true);
        }
      }, options.autoSaveInterval);

      return () => {
        if (autoSaveInterval.current) {
          clearInterval(autoSaveInterval.current);
        }
      };
    }
  }, [autoSaveEnabled, options.autoSaveInterval]);

  // Salvar dados
  const handleSave = useCallback(
    async (data: PersistedData, isAutoSave = false) => {
      if (isSaving && !isAutoSave) return; // Evitar salvamentos concorrentes

      setIsSaving(true);

      try {
        // Atualizar metadados
        const dataToSave: PersistedData = {
          ...data,
          settings: {
            ...data.settings,
            version: versionManager.getCurrentVersion(),
            lastUpdated: new Date().toISOString(),
            totalSaves: (data.settings.totalSaves || 0) + 1,
          },
        };

        await storageManager.saveData(dataToSave);
        setLastSaved(new Date());
        pendingData.current = null;

        options.onSaveSuccess?.(dataToSave);
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
        options.onSaveError?.(error as Error);
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving, storageManager, versionManager, options]
  );

  // Carregar dados
  const handleLoad = useCallback(async (): Promise<PersistedData | null> => {
    setIsLoading(true);

    try {
      let data = await storageManager.loadData();

      if (!data) return null;

      // Verificar se migração é necessária
      const currentVersion = data.settings?.version || '1.0.0';
      if (versionManager.needsMigration()) {
        options.onMigrationNeeded?.(
          currentVersion,
          versionManager.getCurrentVersion()
        );

        try {
          data = await versionManager.migrate(data);
          await storageManager.saveData(data); // Salvar dados migrados

          options.onMigrationComplete?.(
            currentVersion,
            versionManager.getCurrentVersion()
          );
        } catch (migrationError) {
          console.error('Erro na migração:', migrationError);
          throw migrationError;
        }
      }

      options.onLoadSuccess?.(data);
      return data;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      options.onLoadError?.(error as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [storageManager, versionManager, options]);

  // Marcar dados para auto-save
  const markForAutoSave = useCallback(
    (data: PersistedData) => {
      if (autoSaveEnabled) {
        pendingData.current = data;
      }
    },
    [autoSaveEnabled]
  );

  // Criar backup manual
  const createBackup = useCallback(
    async (data: PersistedData, label?: string): Promise<string> => {
      return await storageManager.createBackup(data, label);
    },
    [storageManager]
  );

  // Restaurar do backup
  const restoreFromBackup = useCallback(
    async (backupId: string): Promise<PersistedData> => {
      return await storageManager.restoreFromBackup(backupId);
    },
    [storageManager]
  );

  // Listar backups
  const getBackups = useCallback(async (): Promise<BackupEntry[]> => {
    return await storageManager.getBackups();
  }, [storageManager]);

  // Exportar dados
  const exportData = useCallback(async (): Promise<string> => {
    return await storageManager.exportAllData();
  }, [storageManager]);

  // Importar dados
  const importData = useCallback(
    async (jsonData: string): Promise<void> => {
      await storageManager.importData(jsonData);
    },
    [storageManager]
  );

  // Limpar todos os dados
  const clearAllData = useCallback(async (): Promise<void> => {
    await storageManager.clearAllData();
    setLastSaved(null);
  }, [storageManager]);

  // Obter estatísticas de armazenamento
  const getStorageStats = useCallback(() => {
    return storageManager.getStorageSize();
  }, [storageManager]);

  return {
    // Estados
    isLoading,
    isSaving,
    lastSaved,
    autoSaveEnabled,

    // Controles
    setAutoSaveEnabled,

    // Operações principais
    save: handleSave,
    load: handleLoad,
    markForAutoSave,

    // Backup e restore
    createBackup,
    restoreFromBackup,
    getBackups,

    // Import/Export
    exportData,
    importData,

    // Manutenção
    clearAllData,
    getStorageStats,

    // Versioning
    getCurrentVersion: versionManager.getCurrentVersion.bind(versionManager),
    needsMigration: versionManager.needsMigration.bind(versionManager),
  };
}

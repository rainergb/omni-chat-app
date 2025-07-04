// utils/storage-manager.ts
/**
 * Gerenciador central de armazenamento
 */

import { generateId } from './id-generators';
import {
  PersistenceConfig,
  PersistedData,
  BackupEntry,
} from '../types/persistence';

// Classes de erro simples
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class DataIntegrityError extends Error {
  public context?: any;

  constructor(message: string, context?: any) {
    super(message);
    this.name = 'DataIntegrityError';
    this.context = context;
  }
}

export class StorageManager {
  private config: PersistenceConfig;
  private compressionEnabled: boolean;

  constructor(config: Partial<PersistenceConfig> = {}) {
    this.config = {
      storageKey: 'kanban-board',
      autoSave: true,
      autoSaveInterval: 30000, // 30 segundos
      maxBackups: 10,
      compressionEnabled: false,
      encryptionEnabled: false,
      versioningEnabled: true,
      ...config,
    };

    this.compressionEnabled =
      this.config.compressionEnabled && this.isCompressionSupported();
  }

  // Verificar suporte a compressão
  private isCompressionSupported(): boolean {
    return typeof CompressionStream !== 'undefined';
  }

  // Salvar dados principais
  async saveData(data: PersistedData): Promise<void> {
    try {
      const serializedData = await this.serializeData(data);
      const storageData = {
        ...serializedData,
        _metadata: {
          savedAt: new Date().toISOString(),
          version: data.settings.version,
          checksum: this.generateChecksum(serializedData),
        },
      };

      localStorage.setItem(this.config.storageKey, JSON.stringify(storageData));

      // Auto-backup se habilitado
      if (this.config.versioningEnabled) {
        await this.createBackup(data, `auto-${Date.now()}`);
      }
    } catch (error) {
      throw new DataIntegrityError('Falha ao salvar dados no localStorage', {
        originalError: error,
        data,
      });
    }
  }

  // Carregar dados principais
  async loadData(): Promise<PersistedData | null> {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (!stored) return null;

      const storageData = JSON.parse(stored);

      // Validar checksum se disponível
      if (storageData._metadata?.checksum) {
        const { _metadata, ...data } = storageData;
        const currentChecksum = this.generateChecksum(data);

        if (currentChecksum !== _metadata.checksum) {
          console.warn(
            'Checksum inválido detectado, tentando recuperar do backup...'
          );
          return await this.recoverFromBackup();
        }
      }

      return await this.deserializeData(storageData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return await this.recoverFromBackup();
    }
  }

  // Criar backup
  async createBackup(data: PersistedData, label?: string): Promise<string> {
    const backupId = generateId({ prefix: 'backup', length: 12 });
    const backup: BackupEntry = {
      id: backupId,
      timestamp: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      size: JSON.stringify(data).length,
      checksum: this.generateChecksum(data),
      label,
    };

    const backups = await this.getBackups();
    backups.push(backup);

    // Manter apenas os últimos N backups
    if (backups.length > this.config.maxBackups) {
      backups.splice(0, backups.length - this.config.maxBackups);
    }

    localStorage.setItem(
      `${this.config.storageKey}_backups`,
      JSON.stringify(backups)
    );
    return backupId;
  }

  // Listar backups
  async getBackups(): Promise<BackupEntry[]> {
    try {
      const stored = localStorage.getItem(`${this.config.storageKey}_backups`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Restaurar do backup
  async restoreFromBackup(backupId: string): Promise<PersistedData> {
    const backups = await this.getBackups();
    const backup = backups.find((b) => b.id === backupId);

    if (!backup) {
      throw new Error(`Backup ${backupId} não encontrado`);
    }

    // Validar integridade do backup
    const currentChecksum = this.generateChecksum(backup.data);
    if (currentChecksum !== backup.checksum) {
      throw new DataIntegrityError('Backup corrompido detectado');
    }

    return backup.data;
  }

  // Recuperar automaticamente do backup mais recente
  private async recoverFromBackup(): Promise<PersistedData | null> {
    const backups = await this.getBackups();
    if (backups.length === 0) return null;

    // Tentar o backup mais recente primeiro
    const sortedBackups = backups.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    for (const backup of sortedBackups) {
      try {
        const currentChecksum = this.generateChecksum(backup.data);
        if (currentChecksum === backup.checksum) {
          console.log(`Recuperado do backup: ${backup.id}`);
          return backup.data;
        }
      } catch {
        console.warn(`Backup ${backup.id} corrompido, tentando próximo...`);
      }
    }

    return null;
  }

  // Serializar dados
  private async serializeData(data: PersistedData): Promise<any> {
    let serialized = JSON.parse(JSON.stringify(data));

    if (this.compressionEnabled) {
      // Implementar compressão se suportada
      try {
        serialized = await this.compressData(serialized);
      } catch (error) {
        console.warn('Falha na compressão, salvando sem compactar:', error);
      }
    }

    return serialized;
  }

  // Deserializar dados
  private async deserializeData(data: any): Promise<PersistedData> {
    if (data._compressed) {
      try {
        return await this.decompressData(data);
      } catch {
        throw new DataIntegrityError('Falha ao descomprimir dados');
      }
    }

    return data;
  }

  // Compressão (placeholder para implementação futura)
  private async compressData(data: any): Promise<any> {
    // Implementação de compressão seria adicionada aqui
    return { ...data, _compressed: false };
  }

  // Descompressão
  private async decompressData(data: any): Promise<any> {
    // Implementação de descompressão seria adicionada aqui
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _compressed, ...actualData } = data;
    return actualData;
  }

  // Gerar checksum simples
  private generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash).toString(36);
  }

  // Limpar todos os dados
  async clearAllData(): Promise<void> {
    localStorage.removeItem(this.config.storageKey);
    localStorage.removeItem(`${this.config.storageKey}_backups`);
    localStorage.removeItem(`${this.config.storageKey}_settings`);
  }

  // Obter tamanho total dos dados
  getStorageSize(): { main: number; backups: number; total: number } {
    const mainData = localStorage.getItem(this.config.storageKey);
    const backupData = localStorage.getItem(
      `${this.config.storageKey}_backups`
    );

    const mainSize = mainData ? new Blob([mainData]).size : 0;
    const backupSize = backupData ? new Blob([backupData]).size : 0;

    return {
      main: mainSize,
      backups: backupSize,
      total: mainSize + backupSize,
    };
  }

  // Exportar todos os dados
  async exportAllData(): Promise<string> {
    const mainData = await this.loadData();
    const backups = await this.getBackups();

    const exportData = {
      mainData,
      backups,
      exportedAt: new Date().toISOString(),
      version: '2.0',
      storageKey: this.config.storageKey,
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Importar dados
  async importData(jsonData: string): Promise<void> {
    try {
      const importData = JSON.parse(jsonData);

      if (importData.mainData) {
        await this.saveData(importData.mainData);
      }

      if (importData.backups && Array.isArray(importData.backups)) {
        localStorage.setItem(
          `${this.config.storageKey}_backups`,
          JSON.stringify(importData.backups)
        );
      }
    } catch {
      throw new ValidationError('Formato de importação inválido');
    }
  }
}

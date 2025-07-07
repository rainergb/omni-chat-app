// types/persistence.ts
/**
 * Tipos para o sistema de persistência
 */

import { KanbanColumn } from '../types/kanban-column';
import { TasksState } from '../types/kanban-state';

export interface PersistedData {
  columns: KanbanColumn[];
  tasks: TasksState;
  settings: {
    version: string;
    lastUpdated: string;
    createdAt: string;
    totalSaves: number;
    boardId: string;
    boardName?: string;
    userId?: string;
  };
  metadata?: {
    exportedFrom?: string;
    importedAt?: string;
    originalVersion?: string;
    migrationHistory?: string[];
  };
}

export interface PersistenceConfig {
  storageKey: string;
  autoSave: boolean;
  autoSaveInterval: number; // em ms
  maxBackups: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  versioningEnabled: boolean;
}

export interface BackupEntry {
  id: string;
  timestamp: string;
  data: PersistedData;
  size: number;
  checksum: string;
  label?: string;
}

export interface MigrationPlan {
  fromVersion: string;
  toVersion: string;
  steps: MigrationStep[];
  canAutoMigrate: boolean;
  dataLossRisk: 'none' | 'low' | 'medium' | 'high';
}

export interface MigrationStep {
  id: string;
  description: string;
  execute: (data: any) => any;
  validate?: (data: any) => boolean;
}

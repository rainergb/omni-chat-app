// utils/config.ts
/**
 * Configurações centralizadas para todos os utilitários
 */

export interface KanbanUtilitiesConfig {
  // Configurações de ID
  idGeneration: {
    columnPrefix: string;
    taskPrefix: string;
    templatePrefix: string;
    includeTimestamp: boolean;
    randomLength: number;
  };

  // Configurações de validação
  validation: {
    column: {
      titleMinLength: number;
      titleMaxLength: number;
      allowSpecialChars: boolean;
      reservedNames: string[];
    };
    task: {
      titleMinLength: number;
      titleMaxLength: number;
      descriptionMaxLength: number;
      maxAttachments: number;
    };
    board: {
      minColumns: number;
      maxColumns: number;
      recommendedMaxColumns: number;
      maxTasksPerColumn: number;
    };
    wip: {
      minLimit: number;
      maxLimit: number;
      defaultLimit: number;
    };
  };

  // Configurações de performance
  performance: {
    debounceDelay: number;
    throttleDelay: number;
    lazyLoadChunkSize: number;
    memoizationMaxSize: number;
  };

  // Configurações de migração
  migration: {
    backupBeforeMigration: boolean;
    validateAfterMigration: boolean;
    maxBackupFiles: number;
  };

  // Configurações de exportação
  export: {
    includeMetadata: boolean;
    compressData: boolean;
    maxFileSize: number; // em MB
  };
}

export const defaultUtilitiesConfig: KanbanUtilitiesConfig = {
  idGeneration: {
    columnPrefix: 'col',
    taskPrefix: 'task',
    templatePrefix: 'tpl',
    includeTimestamp: true,
    randomLength: 8,
  },

  validation: {
    column: {
      titleMinLength: 2,
      titleMaxLength: 50,
      allowSpecialChars: false,
      reservedNames: ['undefined', 'null', 'admin', 'system'],
    },
    task: {
      titleMinLength: 1,
      titleMaxLength: 200,
      descriptionMaxLength: 2000,
      maxAttachments: 10,
    },
    board: {
      minColumns: 1,
      maxColumns: 20,
      recommendedMaxColumns: 8,
      maxTasksPerColumn: 100,
    },
    wip: {
      minLimit: 1,
      maxLimit: 50,
      defaultLimit: 5,
    },
  },

  performance: {
    debounceDelay: 300,
    throttleDelay: 16, // ~60fps
    lazyLoadChunkSize: 50,
    memoizationMaxSize: 100,
  },

  migration: {
    backupBeforeMigration: true,
    validateAfterMigration: true,
    maxBackupFiles: 10,
  },

  export: {
    includeMetadata: true,
    compressData: false,
    maxFileSize: 50, // 50MB
  },
};

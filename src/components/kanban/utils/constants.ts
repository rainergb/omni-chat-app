// utils/constants.ts
/**
 * Constantes utilizadas pelos utilitários
 */

export const VALIDATION_MESSAGES = {
  COLUMN: {
    TITLE_REQUIRED: 'Título da coluna é obrigatório',
    TITLE_TOO_SHORT: 'Título deve ter pelo menos {min} caracteres',
    TITLE_TOO_LONG: 'Título deve ter no máximo {max} caracteres',
    TITLE_DUPLICATE: 'Já existe uma coluna com este título',
    TITLE_RESERVED: 'Este é um nome reservado do sistema',
    TITLE_INVALID_CHARS: 'Título contém caracteres inválidos',
    TITLE_SIMILAR: 'Existe uma coluna com título similar: {similar}',
  },

  TASK: {
    TITLE_REQUIRED: 'Título da tarefa é obrigatório',
    TITLE_TOO_LONG: 'Título deve ter no máximo {max} caracteres',
    DESCRIPTION_TOO_LONG: 'Descrição deve ter no máximo {max} caracteres',
    INVALID_DATES: 'Data de início não pode ser posterior à data de fim',
    COLUMN_REQUIRED: 'Tarefa deve estar associada a uma coluna válida',
    TOO_MANY_ATTACHMENTS: 'Máximo de {max} anexos permitido',
  },

  BOARD: {
    TOO_FEW_COLUMNS: 'Board deve ter pelo menos {min} coluna(s)',
    TOO_MANY_COLUMNS: 'Board pode ter no máximo {max} colunas',
    RECOMMENDED_COLUMNS: 'Recomendado usar no máximo {max} colunas',
    COLUMN_TOO_MANY_TASKS: 'Coluna excede o limite máximo de {max} tarefas',
  },

  WIP: {
    LIMIT_TOO_LOW: 'Limite WIP deve ser maior que zero',
    LIMIT_TOO_HIGH: 'Limite WIP muito alto (máximo: {max})',
    LIMIT_EXCEEDED: 'Limite WIP excedido: {current}/{limit} tarefas',
    LIMIT_REACHED: 'Limite WIP atingido',
  },

  MIGRATION: {
    INVALID_FORMAT: 'Formato de dados inválido para migração',
    BACKUP_FAILED: 'Falha ao criar backup antes da migração',
    VALIDATION_FAILED: 'Validação pós-migração falhou',
    ORPHANED_TASKS: '{count} tarefa(s) órfã(s) encontrada(s)',
  },
};

export const ID_PATTERNS = {
  COLUMN: /^col-\d+-[a-z0-9]+$/i,
  TASK: /^task-\d+-[a-z0-9]+$/i,
  TEMPLATE: /^tpl-\d+-[a-z0-9]+$/i,
  BACKUP: /^backup-\d+-[a-z0-9]+$/i,
};

export const PRIORITY_WEIGHTS = {
  ALTA: 4,
  MÉDIA: 3,
  BAIXA: 2,
  PENDENTE: 1,
} as const;

export const STATUS_COLORS = {
  NOT_STARTED: '#6b7280',
  PENDING: '#3b82f6',
  IN_PROGRESS: '#eab308',
  WAITING_TASK: '#ec4899',
  DELAYED: '#ef4444',
  CANCELED: '#991b1b',
  COMPLETED: '#10b981',
} as const;

// utils/error-handling.ts
/**
 * Classes de erro personalizadas para os utilitários
 */

export class KanbanUtilitiesError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any
  ) {
    super(message);
    this.name = 'KanbanUtilitiesError';
  }
}

export class ValidationError extends KanbanUtilitiesError {
  constructor(message: string, context?: any) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
  }
}

export class MigrationError extends KanbanUtilitiesError {
  constructor(message: string, context?: any) {
    super(message, 'MIGRATION_ERROR', context);
    this.name = 'MigrationError';
  }
}

export class DataIntegrityError extends KanbanUtilitiesError {
  constructor(message: string, context?: any) {
    super(message, 'DATA_INTEGRITY_ERROR', context);
    this.name = 'DataIntegrityError';
  }
}

export class PerformanceError extends KanbanUtilitiesError {
  constructor(message: string, context?: any) {
    super(message, 'PERFORMANCE_ERROR', context);
    this.name = 'PerformanceError';
  }
}

/**
 * Handler global de erros para os utilitários
 */
export class ErrorHandler {
  static handle(error: Error, context?: any): void {
    if (error instanceof KanbanUtilitiesError) {
      console.error(`[${error.code}] ${error.message}`, {
        context: error.context || context,
        stack: error.stack,
      });
    } else {
      console.error('Unexpected error:', error, { context });
    }

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // ErrorService.report(error, context);
    }
  }

  static wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: any
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handle(error as Error, context);
        throw error;
      }
    }) as T;
  }

  static wrapSync<T extends (...args: any[]) => any>(fn: T, context?: any): T {
    return ((...args: Parameters<T>) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handle(error as Error, context);
        throw error;
      }
    }) as T;
  }
}

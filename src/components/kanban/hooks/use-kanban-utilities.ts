// hooks/use-kanban-utilities.ts
/**
 * Hook que integra todos os utilitários e helpers
 */

import { useCallback, useMemo } from 'react';
import { KanbanColumn } from '../types/kanban-column';
import { Task } from '../types/task-status';
import { TasksState } from '../types/kanban-state';

// Importar todos os utilitários
import {
  generateColumnId,
  generateTaskId,
  generateUniqueId,
  validateIdFormat,
} from '../utils/id-generators';

import {
  validateColumnLimits,
  validateTaskStructure,
  validateWipLimits,
} from '../utils/validation-helpers';

import {
  migrateTasksToNewStructure,
  moveTasksBetweenColumns,
  validateMigrationIntegrity,
  createMigrationBackup,
  restoreFromBackup,
} from '../utils/migration-helpers';

import {
  sortColumnsByPosition,
  sortTasksBy,
  filterTasks,
  calculateBoardStats,
  findOrphanedTasks,
  cleanupInconsistentData,
  exportBoardData,
} from '../utils/data-helpers';

import {
  debounce,
  throttle,
  LazyTaskLoader,
} from '../utils/performance-helpers';

import {
  ColumnValidator,
  WipLimitValidator,
  defaultValidationConfig,
} from '../utils/advanced-validation';

interface UseKanbanUtilitiesProps {
  columns: KanbanColumn[];
  tasks: TasksState;
  validationConfig?: Partial<typeof defaultValidationConfig>;
}

export function useKanbanUtilities({
  columns,
  tasks,
  validationConfig = {},
}: UseKanbanUtilitiesProps) {
  // Validators memoizados
  const columnValidator = useMemo(
    () => new ColumnValidator(validationConfig),
    [validationConfig]
  );

  const wipValidator = useMemo(() => new WipLimitValidator(), []);

  // Estatísticas memoizadas
  const boardStats = useMemo(
    () => calculateBoardStats(columns, tasks),
    [columns, tasks]
  );

  // IDs existentes para validação de unicidade
  const existingColumnIds = useMemo(
    () => columns.map((col) => col.id),
    [columns]
  );

  const existingTaskIds = useMemo(
    () =>
      Object.values(tasks)
        .flat()
        .map((task) => task.id),
    [tasks]
  );

  // Funções de geração de IDs únicos
  const createUniqueColumnId = useCallback(
    () => generateUniqueId(generateColumnId, existingColumnIds),
    [existingColumnIds]
  );

  const createUniqueTaskId = useCallback(
    () => generateUniqueId(generateTaskId, existingTaskIds),
    [existingTaskIds]
  );

  // Funções de validação
  const validateColumnTitle = useCallback(
    (title: string, excludeId?: string) => {
      const existingTitles = columns
        .filter((col) => col.id !== excludeId)
        .map((col) => col.title);
      return columnValidator.validateTitle(title, existingTitles);
    },
    [columns, columnValidator]
  );

  const validateBoardLimits = useCallback(
    () => validateColumnLimits(columns),
    [columns]
  );

  const validateTask = useCallback(
    (task: Partial<Task>) => validateTaskStructure(task),
    []
  );

  const validateWipLimit = useCallback(
    (columnId: string, limit: number) => {
      const currentTaskCount = tasks[columnId]?.length || 0;
      return validateWipLimits(columnId, currentTaskCount, limit);
    },
    [tasks]
  );

  // Funções de migração
  const migrateData = useCallback(
    (legacyData: any) => migrateTasksToNewStructure(legacyData, {} as any),
    []
  );

  const moveColumnTasks = useCallback(
    (sourceId: string, destId: string) =>
      moveTasksBetweenColumns(tasks, sourceId, destId),
    [tasks]
  );

  const validateDataIntegrity = useCallback(
    () => validateMigrationIntegrity(columns, tasks),
    [columns, tasks]
  );

  const createBackup = useCallback(
    () => createMigrationBackup({ columns, tasks }),
    [columns, tasks]
  );

  // Funções de manipulação de dados
  const sortedColumns = useMemo(
    () => sortColumnsByPosition(columns),
    [columns]
  );

  const sortTasksInColumn = useCallback(
    (
      columnId: string,
      sortBy:
        | 'position'
        | 'priority'
        | 'dueDate'
        | 'assignee'
        | 'title' = 'position'
    ) => {
      const columnTasks = tasks[columnId] || [];
      return sortTasksBy(columnTasks, sortBy);
    },
    [tasks]
  );

  const searchTasks = useCallback(
    (query: string, filters: any = {}) => {
      const allTasks = Object.values(tasks).flat();
      return filterTasks(allTasks, { ...filters, search: query });
    },
    [tasks]
  );

  // Funções de limpeza e manutenção
  const findOrphans = useCallback(
    () => findOrphanedTasks(columns, tasks),
    [columns, tasks]
  );

  const cleanupData = useCallback(
    () => cleanupInconsistentData(columns, tasks),
    [columns, tasks]
  );

  // Funções de exportação
  const exportData = useCallback(
    (format: 'json' | 'csv' = 'json') =>
      exportBoardData(columns, tasks, format),
    [columns, tasks]
  );

  // Performance helpers
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string, callback: (results: Task[]) => void) => {
        const results = searchTasks(query);
        callback(results);
      }, 300),
    [searchTasks]
  );

  const throttledDragUpdate = useMemo(
    () => throttle((updateFn: () => void) => updateFn(), 16),
    [] // ~60fps
  );

  // Lazy loader para grandes quantidades de tarefas
  const createTaskLoader = useCallback(
    (columnId: string, chunkSize = 50) => {
      const columnTasks = tasks[columnId] || [];
      return new LazyTaskLoader(columnTasks, chunkSize);
    },
    [tasks]
  );

  return {
    // Geração de IDs
    createUniqueColumnId,
    createUniqueTaskId,
    validateIdFormat,

    // Validação
    validateColumnTitle,
    validateBoardLimits,
    validateTask,
    validateWipLimit,
    columnValidator,
    wipValidator,

    // Migração
    migrateData,
    moveColumnTasks,
    validateDataIntegrity,
    createBackup,
    restoreFromBackup,

    // Manipulação de dados
    sortedColumns,
    sortTasksInColumn,
    searchTasks,
    boardStats,

    // Limpeza e manutenção
    findOrphans,
    cleanupData,

    // Exportação
    exportData,

    // Performance
    debouncedSearch,
    throttledDragUpdate,
    createTaskLoader,

    // Estado atual
    hasOrphans: findOrphans().length > 0,
    dataIntegrity: validateDataIntegrity(),
    boardHealth: {
      totalIssues: findOrphans().length,
      validationStatus: validateDataIntegrity(),
      stats: boardStats,
    },
  };
}

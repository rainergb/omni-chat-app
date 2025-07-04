// utils/migration-helpers.ts
import { Task, TaskStatus } from '../types/task-status';
import { KanbanColumn } from '../types/kanban-column';
import { TasksState } from '../types/kanban-state';
import { generateColumnId, generateTaskId } from './id-generators';
import { ValidationResult } from './advanced-validation';

/**
 * Utilitários para migração de dados entre versões
 */

interface LegacyTasksState {
  [key: string]: Task[];
}

/**
 * Migra tarefas de estrutura enum para estrutura ID-based
 */
export function migrateTasksToNewStructure(
  legacyTasks: LegacyTasksState,
  columnMapping: Record<TaskStatus, string>
): TasksState {
  const newTasksState: TasksState = {};

  // Inicializar colunas vazias
  Object.values(columnMapping).forEach((columnId) => {
    newTasksState[columnId] = [];
  });

  // Migrar tarefas
  Object.entries(legacyTasks).forEach(([status, tasks]) => {
    const columnId = columnMapping[status as TaskStatus];
    if (columnId && tasks) {
      newTasksState[columnId] = tasks.map((task: Task) => ({
        ...task,
        id: task.id || generateTaskId(),
        columnId,
        status: status as TaskStatus, // Manter para compatibilidade
      }));
    }
  });

  return newTasksState;
}

/**
 * Move tarefas entre colunas durante operações de deletar/mesclar
 */
export function moveTasksBetweenColumns(
  tasks: TasksState,
  sourceColumnId: string,
  destinationColumnId: string,
  preserveOrder = true
): TasksState {
  const newTasks = { ...tasks };

  if (!newTasks[sourceColumnId] || !newTasks[destinationColumnId]) {
    throw new Error('Coluna de origem ou destino não encontrada');
  }

  const tasksToMove = [...newTasks[sourceColumnId]];

  // Atualizar columnId das tarefas
  const updatedTasks = tasksToMove.map((task) => ({
    ...task,
    columnId: destinationColumnId,
  }));

  if (preserveOrder) {
    // Manter ordem adicionando no final
    newTasks[destinationColumnId] = [
      ...newTasks[destinationColumnId],
      ...updatedTasks,
    ];
  } else {
    // Recalcular posições
    const existingTasks = newTasks[destinationColumnId];
    const allTasks = [...existingTasks, ...updatedTasks];

    newTasks[destinationColumnId] = allTasks.map((task, index) => ({
      ...task,
      position: (index + 1) * 1000,
    }));
  }

  // Limpar coluna de origem
  newTasks[sourceColumnId] = [];

  return newTasks;
}

/**
 * Migra de formato legado para novo formato
 */
export function migrateFromLegacyFormat(legacyData: any): {
  columns: KanbanColumn[];
  tasks: TasksState;
} {
  const columns: KanbanColumn[] = [];
  const columnMapping: Record<string, string> = {};

  // Criar colunas baseadas nos status legados
  if (legacyData.boards && Array.isArray(legacyData.boards)) {
    legacyData.boards.forEach((boardStatus: string, index: number) => {
      const columnId = generateColumnId();
      columnMapping[boardStatus] = columnId;

      columns.push({
        id: columnId,
        title: boardStatus,
        position: (index + 1) * 1000,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  }

  // Migrar tarefas
  let tasks: TasksState = {};
  if (legacyData.tasks) {
    tasks = migrateTasksToNewStructure(legacyData.tasks, columnMapping as any);
  }

  return { columns, tasks };
}

/**
 * Valida integridade dos dados após migração
 */
export function validateMigrationIntegrity(
  columns: KanbanColumn[],
  tasks: TasksState
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  // Verificar se todas as colunas têm IDs válidos
  columns.forEach((column) => {
    if (!column.id) {
      result.isValid = false;
      result.errors.push(`Coluna "${column.title}" sem ID`);
    }

    if (!tasks[column.id]) {
      result.warnings.push(`Coluna "${column.title}" sem tarefas associadas`);
      tasks[column.id] = [];
    }
  });

  // Verificar se todas as tarefas estão em colunas válidas
  Object.entries(tasks).forEach(([columnId, columnTasks]) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) {
      result.isValid = false;
      result.errors.push(
        `Tarefas encontradas em coluna inexistente: ${columnId}`
      );
    }

    columnTasks.forEach((task) => {
      if (task.columnId !== columnId) {
        result.isValid = false;
        result.errors.push(`Tarefa "${task.title}" com columnId inconsistente`);
      }

      if (!task.id) {
        result.isValid = false;
        result.errors.push(`Tarefa "${task.title}" sem ID`);
      }
    });
  });

  return result;
}

/**
 * Cria backup dos dados antes da migração
 */
export function createMigrationBackup(data: any): string {
  const backup = {
    data,
    timestamp: new Date().toISOString(),
    version: '1.0',
    type: 'pre-migration-backup',
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Restaura dados de um backup
 */
export function restoreFromBackup(backupJson: string): any {
  try {
    const backup = JSON.parse(backupJson);

    if (!backup.data || !backup.timestamp) {
      throw new Error('Formato de backup inválido');
    }

    return backup.data;
  } catch (error) {
    throw new Error('Erro ao restaurar backup: ' + (error as Error).message);
  }
}

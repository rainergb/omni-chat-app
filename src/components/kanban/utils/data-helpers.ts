// utils/data-helpers.ts
import { KanbanColumn } from '../types/kanban-column';
import { Task } from '../types/task-status';
import { TasksState } from '../types/kanban-state';

/**
 * Utilitários para manipulação e formatação de dados
 */

/**
 * Ordena colunas por posição
 */
export function sortColumnsByPosition(columns: KanbanColumn[]): KanbanColumn[] {
  return [...columns].sort((a, b) => a.position - b.position);
}

/**
 * Ordena tarefas por critério especificado
 */
export function sortTasksBy(
  tasks: Task[],
  sortBy: 'position' | 'priority' | 'dueDate' | 'assignee' | 'title'
): Task[] {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'position':
        return a.position - b.position;

      case 'priority': {
        const priorityOrder = { ALTA: 3, MÉDIA: 2, BAIXA: 1, PENDENTE: 0 };
        return (
          (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
          (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
        );
      }

      case 'dueDate': {
        const dateA = a.endDate ? new Date(a.endDate).getTime() : Infinity;
        const dateB = b.endDate ? new Date(b.endDate).getTime() : Infinity;
        return dateA - dateB;
      }

      case 'assignee':
        return (a.assignee || '').localeCompare(b.assignee || '');

      case 'title':
        return a.title.localeCompare(b.title);

      default:
        return 0;
    }
  });
}

/**
 * Filtra tarefas por critérios
 */
export function filterTasks(
  tasks: Task[],
  filters: {
    assignee?: string;
    priority?: string;
    hasOverdue?: boolean;
    search?: string;
  }
): Task[] {
  return tasks.filter((task) => {
    if (
      filters.assignee &&
      filters.assignee !== 'all' &&
      task.assignee !== filters.assignee
    ) {
      return false;
    }

    if (
      filters.priority &&
      filters.priority !== 'all' &&
      task.priority !== filters.priority
    ) {
      return false;
    }

    if (filters.hasOverdue && task.endDate) {
      const isOverdue = new Date(task.endDate) < new Date();
      if (!isOverdue) return false;
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchLower);
      const matchesDescription = task.description
        ?.toLowerCase()
        .includes(searchLower);
      const matchesAssignee = task.assignee
        ?.toLowerCase()
        .includes(searchLower);

      if (!matchesTitle && !matchesDescription && !matchesAssignee) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calcula estatísticas do board
 */
export function calculateBoardStats(
  columns: KanbanColumn[],
  tasks: TasksState
) {
  const stats = {
    totalColumns: columns.length,
    totalTasks: 0,
    tasksByColumn: {} as Record<string, number>,
    tasksByPriority: { ALTA: 0, MÉDIA: 0, BAIXA: 0, PENDENTE: 0 },
    overdueTasks: 0,
    completedTasks: 0,
    averageTasksPerColumn: 0,
    customColumns: 0,
    defaultColumns: 0,
  };

  // Contar colunas por tipo
  columns.forEach((column) => {
    if (column.isDefault) {
      stats.defaultColumns++;
    } else {
      stats.customColumns++;
    }
  });

  // Analisar tarefas
  Object.entries(tasks).forEach(([columnId, columnTasks]) => {
    stats.tasksByColumn[columnId] = columnTasks.length;
    stats.totalTasks += columnTasks.length;

    columnTasks.forEach((task) => {
      // Contar por prioridade
      if (task.priority in stats.tasksByPriority) {
        stats.tasksByPriority[
          task.priority as keyof typeof stats.tasksByPriority
        ]++;
      }

      // Contar tarefas atrasadas
      if (task.endDate && new Date(task.endDate) < new Date()) {
        stats.overdueTasks++;
      }

      // Contar tarefas concluídas (assumindo que existe uma coluna 'Concluído')
      const column = columns.find((col) => col.id === columnId);
      if (column?.title.toLowerCase().includes('conclu')) {
        stats.completedTasks++;
      }
    });
  });

  stats.averageTasksPerColumn =
    stats.totalColumns > 0
      ? Math.round((stats.totalTasks / stats.totalColumns) * 10) / 10
      : 0;

  return stats;
}

/**
 * Encontra tarefas órfãs (sem coluna válida)
 */
export function findOrphanedTasks(
  columns: KanbanColumn[],
  tasks: TasksState
): Task[] {
  const validColumnIds = new Set(columns.map((col) => col.id));
  const orphanedTasks: Task[] = [];

  Object.entries(tasks).forEach(([columnId, columnTasks]) => {
    if (!validColumnIds.has(columnId)) {
      orphanedTasks.push(...columnTasks);
    }
  });

  return orphanedTasks;
}

/**
 * Limpa dados inconsistentes
 */
export function cleanupInconsistentData(
  columns: KanbanColumn[],
  tasks: TasksState
): { columns: KanbanColumn[]; tasks: TasksState; removedItems: string[] } {
  const removedItems: string[] = [];
  const validColumnIds = new Set(columns.map((col) => col.id));
  const cleanedTasks: TasksState = {};

  // Limpar tarefas órfãs
  Object.entries(tasks).forEach(([columnId, columnTasks]) => {
    if (validColumnIds.has(columnId)) {
      cleanedTasks[columnId] = columnTasks.filter((task) => {
        if (!task.id || !task.title?.trim()) {
          removedItems.push(`Tarefa inválida: ${task.title || 'sem título'}`);
          return false;
        }
        return true;
      });
    } else {
      removedItems.push(`Coluna órfã removida: ${columnId}`);
    }
  });

  // Garantir que todas as colunas tenham arrays de tarefas
  columns.forEach((column) => {
    if (!cleanedTasks[column.id]) {
      cleanedTasks[column.id] = [];
    }
  });

  return {
    columns,
    tasks: cleanedTasks,
    removedItems,
  };
}

/**
 * Exporta dados para diferentes formatos
 */
export function exportBoardData(
  columns: KanbanColumn[],
  tasks: TasksState,
  format: 'json' | 'csv' = 'json'
): string {
  if (format === 'json') {
    return JSON.stringify(
      {
        columns,
        tasks,
        exportedAt: new Date().toISOString(),
        version: '2.0',
      },
      null,
      2
    );
  }

  if (format === 'csv') {
    const allTasks = Object.values(tasks).flat();
    const headers = [
      'ID',
      'Título',
      'Coluna',
      'Status',
      'Responsável',
      'Prioridade',
      'Data Criação',
      'Data Entrega',
    ];

    const rows = allTasks.map((task) => {
      const column = columns.find((col) => col.id === task.columnId);
      return [
        task.id,
        `"${task.title.replace(/"/g, '""')}"`,
        `"${column?.title || 'N/A'}"`,
        task.status,
        task.assignee || '',
        task.priority,
        task.createdAt,
        task.endDate || '',
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  throw new Error(`Formato não suportado: ${format}`);
}

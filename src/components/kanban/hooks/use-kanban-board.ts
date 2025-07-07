// hooks/use-kanban-board.ts (hook integrador)
import { useCallback } from 'react';
import { useKanbanColumns } from './use-kanban-columns';
import { useKanbanTasks } from './use-kanban-tasks';
import { mockTasks } from '../kanban.mocks';

interface UseKanbanBoardOptions {
  persistToStorage?: boolean;
  storageKey?: string;
}

export function useKanbanBoard(options: UseKanbanBoardOptions = {}) {
  const { persistToStorage = false, storageKey = 'kanban-board' } = options;

  // Gerenciamento de colunas
  const columnsManager = useKanbanColumns({
    onColumnsChange: (columns) => {
      if (persistToStorage) {
        localStorage.setItem(`${storageKey}-columns`, JSON.stringify(columns));
      }
    },
  });

  // Gerenciamento de tarefas
  const tasksManager = useKanbanTasks({
    columns: columnsManager.columns,
    initialTasks: mockTasks,
    onTasksChange: (tasks) => {
      if (persistToStorage) {
        localStorage.setItem(`${storageKey}-tasks`, JSON.stringify(tasks));
      }
    },
  });

  // Operações integradas
  const deleteColumnWithTasks = useCallback(
    (columnId: string, moveTasksToColumnId?: string) => {
      // Primeiro remover/migrar tarefas
      tasksManager.removeColumn(columnId, moveTasksToColumnId);

      // Depois deletar coluna
      columnsManager.deleteColumn(columnId);
    },
    [columnsManager, tasksManager]
  );

  const addColumnWithTasks = useCallback(
    (data: { title: string; color?: string; isDefault?: boolean }) => {
      // Criar coluna
      const newColumn = columnsManager.createColumn(data);

      // Inicializar área de tarefas
      tasksManager.addColumn(newColumn);

      return newColumn;
    },
    [columnsManager, tasksManager]
  );

  return {
    // Managers
    columns: columnsManager,
    tasks: tasksManager,

    // Operações integradas
    deleteColumnWithTasks,
    addColumnWithTasks,

    // Estado combinado
    board: {
      columns: columnsManager.columns,
      tasks: tasksManager.tasks,
      totalColumns: columnsManager.totalColumns,
      totalTasks: tasksManager.totalTasks,
    },
  };
}

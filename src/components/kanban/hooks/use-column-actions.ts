// hooks/use-column-actions.ts
import { useCallback } from 'react';
import { KanbanColumn } from '../types/kanban-column';

interface UseColumnActionsProps {
  columns: KanbanColumn[];
  tasks: { [columnId: string]: any[] };
  addColumn: (
    column: Omit<KanbanColumn, 'id' | 'position' | 'createdAt' | 'updatedAt'>
  ) => KanbanColumn;
  updateColumn: (columnId: string, updates: Partial<KanbanColumn>) => void;
  deleteColumn: (columnId: string, moveTasksToColumnId?: string) => void;
}

export function useColumnActions({
  columns,
  tasks,
  addColumn,
  updateColumn,
  deleteColumn,
}: UseColumnActionsProps) {
  const validateColumnTitle = useCallback(
    (title: string, excludeId?: string) => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) return 'Título é obrigatório';

      const exists = columns.some(
        (col) =>
          col.id !== excludeId &&
          col.title.toLowerCase() === trimmedTitle.toLowerCase()
      );

      if (exists) return 'Já existe uma coluna com este título';
      return null;
    },
    [columns]
  );

  const canDeleteColumn = useCallback(() => {
    return columns.length > 1;
  }, [columns.length]);

  const getColumnsForMigration = useCallback(
    (excludeColumnId: string) => {
      return columns.filter((col) => col.id !== excludeColumnId);
    },
    [columns]
  );

  const handleCreateColumn = useCallback(
    (data: { title: string; color?: string }) => {
      const validation = validateColumnTitle(data.title);
      if (validation) throw new Error(validation);

      return addColumn({
        title: data.title.trim(),
        color: data.color,
        isDefault: false,
      });
    },
    [addColumn, validateColumnTitle]
  );

  const handleUpdateColumn = useCallback(
    (columnId: string, data: { title: string; color?: string }) => {
      const validation = validateColumnTitle(data.title, columnId);
      if (validation) throw new Error(validation);

      updateColumn(columnId, {
        title: data.title.trim(),
        color: data.color,
      });
    },
    [updateColumn, validateColumnTitle]
  );

  const handleDeleteColumn = useCallback(
    (columnId: string, moveTasksToColumnId?: string) => {
      if (!canDeleteColumn()) {
        throw new Error('Não é possível deletar a única coluna restante');
      }

      const tasksInColumn = tasks[columnId]?.length || 0;
      if (tasksInColumn > 0 && !moveTasksToColumnId) {
        throw new Error(
          'Escolha uma coluna para mover as tarefas ou confirme a exclusão'
        );
      }

      deleteColumn(columnId, moveTasksToColumnId);
    },
    [deleteColumn, canDeleteColumn, tasks]
  );

  return {
    validateColumnTitle,
    canDeleteColumn,
    getColumnsForMigration,
    handleCreateColumn,
    handleUpdateColumn,
    handleDeleteColumn,
  };
}

// hooks/use-kanban-columns.ts
import { useState, useCallback, useMemo } from 'react';
import { KanbanColumn } from '../types/kanban-column';
import { defaultColumns } from '../utils/column-defaults';

interface UseKanbanColumnsOptions {
  initialColumns?: KanbanColumn[];
  onColumnsChange?: (columns: KanbanColumn[]) => void;
}

export function useKanbanColumns(options: UseKanbanColumnsOptions = {}) {
  const { initialColumns = defaultColumns, onColumnsChange } = options;

  const [columns, setColumns] = useState<KanbanColumn[]>(() => {
    return [...initialColumns].sort((a, b) => a.position - b.position);
  });

  // Colunas ordenadas (computed)
  const sortedColumns = useMemo(() => {
    return [...columns].sort((a, b) => a.position - b.position);
  }, [columns]);

  // Validações
  const validateTitle = useCallback(
    (title: string, excludeId?: string) => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        return 'Título é obrigatório';
      }

      if (trimmedTitle.length > 50) {
        return 'Título deve ter no máximo 50 caracteres';
      }

      const exists = columns.some(
        (col) =>
          col.id !== excludeId &&
          col.title.toLowerCase() === trimmedTitle.toLowerCase()
      );

      if (exists) {
        return 'Já existe uma coluna com este título';
      }

      return null;
    },
    [columns]
  );

  const canDelete = useCallback(() => {
    return columns.length > 1;
  }, [columns.length]);

  const canReorder = useCallback(() => {
    return columns.length > 1;
  }, [columns.length]);

  // CRUD Operations
  const createColumn = useCallback(
    (data: { title: string; color?: string; isDefault?: boolean }) => {
      const validation = validateTitle(data.title);
      if (validation) {
        throw new Error(validation);
      }

      const maxPosition = Math.max(...columns.map((col) => col.position), 0);
      const newColumn: KanbanColumn = {
        id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: data.title.trim(),
        position: maxPosition + 1000,
        color: data.color,
        isDefault: data.isDefault || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setColumns((prev) => {
        const updated = [...prev, newColumn];
        onColumnsChange?.(updated);
        return updated;
      });

      return newColumn;
    },
    [columns, validateTitle, onColumnsChange]
  );

  const updateColumn = useCallback(
    (columnId: string, updates: Partial<KanbanColumn>) => {
      if (updates.title) {
        const validation = validateTitle(updates.title, columnId);
        if (validation) {
          throw new Error(validation);
        }
      }

      setColumns((prev) => {
        const updated = prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                ...updates,
                title: updates.title?.trim() || col.title,
                updatedAt: new Date().toISOString(),
              }
            : col
        );
        onColumnsChange?.(updated);
        return updated;
      });
    },
    [validateTitle, onColumnsChange]
  );

  const deleteColumn = useCallback(
    (columnId: string) => {
      if (!canDelete()) {
        throw new Error('Não é possível deletar a única coluna restante');
      }

      setColumns((prev) => {
        const updated = prev.filter((col) => col.id !== columnId);
        onColumnsChange?.(updated);
        return updated;
      });
    },
    [canDelete, onColumnsChange]
  );

  const reorderColumns = useCallback(
    (newOrder: KanbanColumn[]) => {
      if (!canReorder()) {
        throw new Error('Não é possível reordenar com apenas uma coluna');
      }

      const reorderedColumns = newOrder.map((col, index) => ({
        ...col,
        position: (index + 1) * 1000,
        updatedAt: new Date().toISOString(),
      }));

      setColumns(reorderedColumns);
      onColumnsChange?.(reorderedColumns);
    },
    [canReorder, onColumnsChange]
  );

  // Utility functions
  const getColumnById = useCallback(
    (columnId: string) => {
      return columns.find((col) => col.id === columnId);
    },
    [columns]
  );

  const getColumnIndex = useCallback(
    (columnId: string) => {
      return sortedColumns.findIndex((col) => col.id === columnId);
    },
    [sortedColumns]
  );

  const getDefaultColumns = useCallback(() => {
    return columns.filter((col) => col.isDefault);
  }, [columns]);

  const getCustomColumns = useCallback(() => {
    return columns.filter((col) => !col.isDefault);
  }, [columns]);

  const resetToDefaults = useCallback(() => {
    setColumns(defaultColumns);
    onColumnsChange?.(defaultColumns);
  }, [onColumnsChange]);

  return {
    // Estado
    columns: sortedColumns,
    rawColumns: columns,

    // CRUD
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,

    // Validações
    validateTitle,
    canDelete,
    canReorder,

    // Utilitários
    getColumnById,
    getColumnIndex,
    getDefaultColumns,
    getCustomColumns,
    resetToDefaults,

    // Métricas
    totalColumns: columns.length,
    hasCustomColumns: columns.some((col) => !col.isDefault),
  };
}

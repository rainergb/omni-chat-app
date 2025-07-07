// hooks/use-kanban-state.ts
import { useState, useCallback, useMemo } from 'react';
import { KanbanColumn } from '../types/kanban-column';
import { TasksState } from '../types/kanban-state';
import {
  initializeEmptyTasksState,
  getColumnIdByStatus,
} from '../utils/migration-helpers';
import { defaultColumns } from '../utils/column-defaults';
import { mockTasks } from '../kanban.mocks';

export const useKanbanState = () => {
  // Estado das Colunas com ordenação automática
  const [columns, setColumns] = useState<KanbanColumn[]>(() => {
    return [...defaultColumns].sort((a, b) => a.position - b.position);
  });

  // Estado das Tarefas reestruturado (ID-based)
  const [tasks, setTasks] = useState<TasksState>(() => {
    // Migrar tarefas mockadas para nova estrutura

    // Converter estrutura antiga para nova
    const newTasksState = initializeEmptyTasksState(defaultColumns);

    // Migrar tarefas existentes
    mockTasks.forEach((task) => {
      const columnId = getColumnIdByStatus(task.status);
      const migratedTask = {
        ...task,
        columnId,
      };
      newTasksState[columnId].push(migratedTask);
    });

    // Ordenar tarefas por posição em cada coluna
    Object.keys(newTasksState).forEach((columnId) => {
      newTasksState[columnId].sort((a, b) => a.position - b.position);
    });

    return newTasksState;
  });

  // Colunas ordenadas (computed)
  const sortedColumns = useMemo(() => {
    return [...columns].sort((a, b) => a.position - b.position);
  }, [columns]);

  // Função para adicionar coluna
  const addColumn = useCallback(
    (
      newColumn: Omit<
        KanbanColumn,
        'id' | 'position' | 'createdAt' | 'updatedAt'
      >
    ) => {
      const maxPosition = Math.max(...columns.map((col) => col.position), 0);
      const column: KanbanColumn = {
        ...newColumn,
        id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: maxPosition + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setColumns((prev) => [...prev, column]);
      setTasks((prev) => ({ ...prev, [column.id]: [] }));

      return column;
    },
    [columns]
  );

  // Função para atualizar coluna
  const updateColumn = useCallback(
    (columnId: string, updates: Partial<KanbanColumn>) => {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, ...updates, updatedAt: new Date().toISOString() }
            : col
        )
      );
    },
    []
  );

  // Função para deletar coluna
  const deleteColumn = useCallback(
    (columnId: string, moveTasksToColumnId?: string) => {
      setColumns((prev) => prev.filter((col) => col.id !== columnId));

      setTasks((prev) => {
        const { [columnId]: deletedColumnTasks, ...restTasks } = prev;

        if (moveTasksToColumnId && deletedColumnTasks) {
          // Mover tarefas para outra coluna
          return {
            ...restTasks,
            [moveTasksToColumnId]: [
              ...restTasks[moveTasksToColumnId],
              ...deletedColumnTasks.map((task) => ({
                ...task,
                columnId: moveTasksToColumnId,
              })),
            ],
          };
        }

        // Deletar tarefas junto com a coluna
        return restTasks;
      });
    },
    []
  );

  // Função para reordenar colunas
  const reorderColumns = useCallback((newOrder: KanbanColumn[]) => {
    const reorderedColumns = newOrder.map((col, index) => ({
      ...col,
      position: (index + 1) * 1000,
      updatedAt: new Date().toISOString(),
    }));

    setColumns(reorderedColumns);
  }, []);

  // Função para mover tarefa entre colunas
  const moveTask = useCallback(
    (
      taskId: string,
      sourceColumnId: string,
      destinationColumnId: string,
      destinationIndex: number
    ) => {
      setTasks((prev) => {
        const newTasks = { ...prev };

        // Encontrar e remover tarefa da coluna origem
        const sourceColumn = [...newTasks[sourceColumnId]];
        const taskIndex = sourceColumn.findIndex((task) => task.id === taskId);

        if (taskIndex === -1) return prev;

        const [movedTask] = sourceColumn.splice(taskIndex, 1);
        const updatedTask = {
          ...movedTask,
          columnId: destinationColumnId,
        };

        // Atualizar coluna origem
        newTasks[sourceColumnId] = sourceColumn;

        // Adicionar tarefa na coluna destino
        const destinationColumn = [...newTasks[destinationColumnId]];
        destinationColumn.splice(destinationIndex, 0, updatedTask);
        newTasks[destinationColumnId] = destinationColumn;

        return newTasks;
      });
    },
    []
  );

  // Função para atualizar posições das tarefas
  const updateTaskPositions = useCallback(
    (columnId: string, taskIds: string[]) => {
      setTasks((prev) => ({
        ...prev,
        [columnId]: prev[columnId]
          .map((task) => {
            const newIndex = taskIds.indexOf(task.id);
            return newIndex !== -1
              ? { ...task, position: (newIndex + 1) * 1000 }
              : task;
          })
          .sort((a, b) => a.position - b.position),
      }));
    },
    []
  );

  return {
    // Estados
    columns: sortedColumns,
    tasks,

    // Ações para colunas
    addColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,

    // Ações para tarefas
    moveTask,
    updateTaskPositions,
  };
};

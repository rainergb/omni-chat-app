// hooks/use-kanban-tasks.ts
import { useState, useCallback, useMemo } from 'react';
import { Task, TaskStatus } from '../types/task-status';
import { TasksState } from '../types/kanban-state';
import { KanbanColumn } from '../types/kanban-column';

// Helper functions
const initializeEmptyTasksState = (columns: KanbanColumn[]): TasksState => {
  const tasksState: TasksState = {};
  columns.forEach((column) => {
    tasksState[column.id] = [];
  });
  return tasksState;
};

const getColumnIdByStatus = (status: TaskStatus): string => {
  // Implementação temporária - pode ser customizada
  return `col-${status.toLowerCase().replace(/_/g, '-')}`;
};

const getStatusByColumnId = (columnId: string): TaskStatus => {
  // Implementação temporária - pode ser customizada baseada no columnId
  if (columnId.includes('progress')) return TaskStatus.IN_PROGRESS;
  if (columnId.includes('done') || columnId.includes('complete'))
    return TaskStatus.COMPLETED;
  if (columnId.includes('pending')) return TaskStatus.PENDING;
  return TaskStatus.NOT_STARTED;
};

interface UseKanbanTasksOptions {
  columns: KanbanColumn[];
  initialTasks?: Task[];
  onTasksChange?: (tasks: TasksState) => void;
}

export function useKanbanTasks(options: UseKanbanTasksOptions) {
  const { columns, initialTasks = [], onTasksChange } = options;

  const [tasks, setTasks] = useState<TasksState>(() => {
    const tasksState = initializeEmptyTasksState(columns);

    // Migrar tarefas iniciais
    initialTasks.forEach((task) => {
      const columnId = task.columnId || getColumnIdByStatus(task.status);
      if (tasksState[columnId]) {
        tasksState[columnId].push({
          ...task,
          columnId,
        });
      }
    });

    // Ordenar tarefas por posição em cada coluna
    Object.keys(tasksState).forEach((columnId) => {
      tasksState[columnId].sort((a: Task, b: Task) => a.position - b.position);
    });

    return tasksState;
  });

  // Computed values
  const allTasks = useMemo(() => {
    return Object.values(tasks).flat();
  }, [tasks]);

  const tasksByColumn = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.id] = tasks[column.id] || [];
      return acc;
    }, {} as TasksState);
  }, [columns, tasks]);

  const totalTasks = useMemo(() => {
    return allTasks.length;
  }, [allTasks]);

  // Task operations
  const addTask = useCallback(
    (columnId: string, task: Omit<Task, 'id' | 'position' | 'columnId'>) => {
      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        columnId,
        position: (tasks[columnId]?.length || 0) * 1000 + 1000,
      };

      setTasks((prev) => {
        const updated = {
          ...prev,
          [columnId]: [...(prev[columnId] || []), newTask],
        };
        onTasksChange?.(updated);
        return updated;
      });

      return newTask;
    },
    [tasks, onTasksChange]
  );

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) => {
        const updated = { ...prev };

        for (const columnId in updated) {
          updated[columnId] = updated[columnId].map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          );
        }

        onTasksChange?.(updated);
        return updated;
      });
    },
    [onTasksChange]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => {
        const updated = { ...prev };

        for (const columnId in updated) {
          updated[columnId] = updated[columnId].filter(
            (task) => task.id !== taskId
          );
        }

        onTasksChange?.(updated);
        return updated;
      });
    },
    [onTasksChange]
  );

  const moveTask = useCallback(
    (
      taskId: string,
      sourceColumnId: string,
      destinationColumnId: string,
      destinationIndex: number
    ) => {
      setTasks((prev) => {
        const updated = { ...prev };

        // Encontrar e remover tarefa da coluna origem
        const sourceColumn = [...(updated[sourceColumnId] || [])];
        const taskIndex = sourceColumn.findIndex((task) => task.id === taskId);

        if (taskIndex === -1) return prev;

        const [movedTask] = sourceColumn.splice(taskIndex, 1);
        const updatedTask = {
          ...movedTask,
          columnId: destinationColumnId,
          status: getStatusByColumnId(destinationColumnId),
        };

        // Atualizar coluna origem
        updated[sourceColumnId] = sourceColumn;

        // Adicionar tarefa na coluna destino
        const destinationColumn = [...(updated[destinationColumnId] || [])];
        destinationColumn.splice(destinationIndex, 0, updatedTask);
        updated[destinationColumnId] = destinationColumn;

        onTasksChange?.(updated);
        return updated;
      });
    },
    [onTasksChange]
  );

  const updateTaskPositions = useCallback(
    (columnId: string, taskIds: string[]) => {
      setTasks((prev) => {
        const updated = {
          ...prev,
          [columnId]: (prev[columnId] || [])
            .map((task) => {
              const newIndex = taskIds.indexOf(task.id);
              return newIndex !== -1
                ? { ...task, position: (newIndex + 1) * 1000 }
                : task;
            })
            .sort((a, b) => a.position - b.position),
        };

        onTasksChange?.(updated);
        return updated;
      });
    },
    [onTasksChange]
  );

  // Column operations
  const addColumn = useCallback(
    (column: KanbanColumn) => {
      setTasks((prev) => {
        const updated = { ...prev, [column.id]: [] };
        onTasksChange?.(updated);
        return updated;
      });
    },
    [onTasksChange]
  );

  const removeColumn = useCallback(
    (columnId: string, moveTasksToColumnId?: string) => {
      setTasks((prev) => {
        const { [columnId]: removedColumnTasks, ...restTasks } = prev;

        if (moveTasksToColumnId && removedColumnTasks) {
          // Mover tarefas para outra coluna
          const updatedTasks = {
            ...restTasks,
            [moveTasksToColumnId]: [
              ...(restTasks[moveTasksToColumnId] || []),
              ...removedColumnTasks.map((task) => ({
                ...task,
                columnId: moveTasksToColumnId,
                status: getStatusByColumnId(moveTasksToColumnId),
              })),
            ],
          };
          onTasksChange?.(updatedTasks);
          return updatedTasks;
        }

        // Deletar tarefas junto com a coluna
        onTasksChange?.(restTasks);
        return restTasks;
      });
    },
    [onTasksChange]
  );

  // Search and filter
  const getTaskById = useCallback(
    (taskId: string) => {
      return allTasks.find((task) => task.id === taskId);
    },
    [allTasks]
  );

  const getTasksByColumn = useCallback(
    (columnId: string) => {
      return tasks[columnId] || [];
    },
    [tasks]
  );

  const searchTasks = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return allTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerQuery) ||
          task.description?.toLowerCase().includes(lowerQuery) ||
          task.assignee?.toLowerCase().includes(lowerQuery)
      );
    },
    [allTasks]
  );

  const filterTasksByPriority = useCallback(
    (priority: string) => {
      return allTasks.filter((task) => task.priority === priority);
    },
    [allTasks]
  );

  return {
    // Estado
    tasks: tasksByColumn,
    allTasks,
    totalTasks,

    // Task CRUD
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    updateTaskPositions,

    // Column operations
    addColumn,
    removeColumn,

    // Utilities
    getTaskById,
    getTasksByColumn,
    searchTasks,
    filterTasksByPriority,
  };
}

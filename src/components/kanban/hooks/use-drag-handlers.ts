import { useCallback } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { DragDropType } from '../types/drag-drop';
import { KanbanColumn } from '../types/kanban-column';
import { Task, TaskStatus } from '../types/task-status';

// Helper function local
const getStatusByColumnId = (columnId: string): TaskStatus => {
  // Implementação temporária - pode ser customizada baseada no columnId
  if (columnId.includes('progress')) return TaskStatus.IN_PROGRESS;
  if (columnId.includes('done') || columnId.includes('complete'))
    return TaskStatus.COMPLETED;
  if (columnId.includes('pending')) return TaskStatus.PENDING;
  return TaskStatus.NOT_STARTED;
};

interface UseDragHandlersProps {
  columns: KanbanColumn[];
  tasks: { [columnId: string]: Task[] };
  reorderColumns: (newOrder: KanbanColumn[]) => void;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number
  ) => void;
  updateTaskPositions: (columnId: string, taskIds: string[]) => void;
  onChange: (updatedTasks: any[]) => void;
}

export function useDragHandlers({
  columns,
  tasks,
  reorderColumns,
  moveTask,
  updateTaskPositions,
  onChange,
}: UseDragHandlersProps) {
  const handleColumnDrag = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;

      if (!destination || source.index === destination.index) return;

      const newColumns = Array.from(columns);
      const [draggedColumn] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, draggedColumn);

      reorderColumns(newColumns);
    },
    [columns, reorderColumns]
  );

  const handleTaskDrag = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;

      if (!destination) return;

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      const sourceColumnId = source.droppableId;
      const destinationColumnId = destination.droppableId;
      const sourceColumn = tasks[sourceColumnId];
      const movedTask = sourceColumn[source.index];

      if (!movedTask) {
        console.error('Task not found');
        return;
      }

      // Mover tarefa
      moveTask(
        movedTask.id,
        sourceColumnId,
        destinationColumnId,
        destination.index
      );

      // Atualizar posições da coluna de destino
      const destinationColumn = [...(tasks[destinationColumnId] || [])];
      const taskWithNewColumn = { ...movedTask, columnId: destinationColumnId };
      destinationColumn.splice(destination.index, 0, taskWithNewColumn);

      const newTaskIds = destinationColumn.map((task) => task.id);
      updateTaskPositions(destinationColumnId, newTaskIds);

      // Se mudou de coluna, também atualizar a coluna de origem
      if (sourceColumnId !== destinationColumnId) {
        const sourceTaskIds = sourceColumn
          .filter((task) => task.id !== movedTask.id)
          .map((task) => task.id);
        updateTaskPositions(sourceColumnId, sourceTaskIds);
      }

      // Callback para mudanças
      const updatesPayload = [
        {
          id: movedTask.id,
          status: getStatusByColumnId(destinationColumnId),
          oldStatus: getStatusByColumnId(sourceColumnId),
          position: (destination.index + 1) * 1000,
        },
      ];

      onChange(updatesPayload);
    },
    [tasks, moveTask, updateTaskPositions, onChange]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { type } = result;

      switch (type) {
        case DragDropType.COLUMN:
          handleColumnDrag(result);
          break;
        case DragDropType.TASK:
          handleTaskDrag(result);
          break;
        default:
          console.warn('Unknown drag type:', type);
      }
    },
    [handleColumnDrag, handleTaskDrag]
  );

  return {
    onDragEnd,
    handleColumnDrag,
    handleTaskDrag,
  };
}

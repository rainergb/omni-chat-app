import { useCallback } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { DragDropType } from '../types/drag-drop';
import { KanbanColumn } from '../types/kanban-column';
import { Task, TaskStatus } from '../types/task-status';

const getStatusByColumnId = (
  columnId: string,
  columns: KanbanColumn[]
): TaskStatus => {
  const column = columns.find((col) => col.id === columnId);
  if (!column) return TaskStatus.NOT_STARTED;

  const title = column.title.toLowerCase();

  if (title.includes('progress') || title.includes('andamento'))
    return TaskStatus.IN_PROGRESS;
  if (
    title.includes('done') ||
    title.includes('complete') ||
    title.includes('conclu')
  )
    return TaskStatus.COMPLETED;
  if (title.includes('pending') || title.includes('pendente'))
    return TaskStatus.PENDING;
  if (title.includes('waiting') || title.includes('aguardando'))
    return TaskStatus.WAITING_TASK;
  if (title.includes('delay') || title.includes('atras'))
    return TaskStatus.DELAYED;
  if (title.includes('cancel') || title.includes('cancel'))
    return TaskStatus.CANCELED;

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

      if (!sourceColumn || !sourceColumn[source.index]) {
        console.error('Task not found in source column');
        return;
      }

      const movedTask = sourceColumn[source.index];

      try {
        moveTask(
          movedTask.id,
          sourceColumnId,
          destinationColumnId,
          destination.index
        );

        const destinationColumn = [...(tasks[destinationColumnId] || [])];
        const taskWithNewColumn = {
          ...movedTask,
          columnId: destinationColumnId,
          status: getStatusByColumnId(destinationColumnId, columns),
        };
        destinationColumn.splice(destination.index, 0, taskWithNewColumn);

        const newTaskIds = destinationColumn.map((task) => task.id);
        updateTaskPositions(destinationColumnId, newTaskIds);

        if (sourceColumnId !== destinationColumnId) {
          const sourceTaskIds = sourceColumn
            .filter((task) => task.id !== movedTask.id)
            .map((task) => task.id);
          updateTaskPositions(sourceColumnId, sourceTaskIds);
        }

        const updatesPayload = [
          {
            id: movedTask.id,
            status: getStatusByColumnId(destinationColumnId, columns),
            oldStatus: getStatusByColumnId(sourceColumnId, columns),
            position: (destination.index + 1) * 1000,
          },
        ];

        onChange(updatesPayload);
      } catch (error) {
        console.error('Error handling task drag:', error);
      }
    },
    [tasks, moveTask, updateTaskPositions, onChange, columns]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { type } = result;

      try {
        switch (type) {
          case DragDropType.COLUMN:
            handleColumnDrag(result);
            break;
          case DragDropType.TASK:
            handleTaskDrag(result);
            break;
          default:
            if (!type) {
              handleTaskDrag(result);
            } else {
              console.warn('Unknown drag type:', type);
            }
        }
      } catch (error) {
        console.error('Error in drag end handler:', error);
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

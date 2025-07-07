// components/DraggableTask.tsx
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../../types/task-status';
import KanbanCard from '../kanban-card/kanban-card';
import { DraggableItem } from '../../KanbanPage.styles';

interface DraggableTaskProps {
  task: Task;
  index: number;
}

export default function DraggableTask({ task, index }: DraggableTaskProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <DraggableItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.9 : 1,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform} rotate(2deg)`
              : provided.draggableProps.style?.transform,
            zIndex: snapshot.isDragging ? 1000 : 'auto',
          }}
        >
          <KanbanCard task={task} />
        </DraggableItem>
      )}
    </Draggable>
  );
}

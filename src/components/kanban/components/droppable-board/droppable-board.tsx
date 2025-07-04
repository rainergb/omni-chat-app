// components/DroppableBoard.tsx
import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { KanbanColumn } from '../../types/kanban-column';
import { Task } from '../../types/task-status';
import DraggableColumn from '../draggable-column/draggable-column';
import { BoardsContainer, BoardsContent } from '../../KanbanPage.styles';

interface DroppableBoardProps {
  columns: KanbanColumn[];
  tasks: { [columnId: string]: Task[] };
  onDragEnd: (result: any) => void;
  onEditColumn: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddTask: () => void;
  canDeleteColumn: () => boolean;
  onDuplicateColumn?: (column: KanbanColumn) => void;
  configuration?: any;
  getColumnWipLimit?: (columnId: string) => number | undefined;
  collapsedColumns?: { [columnId: string]: boolean };
  onToggleColumnCollapse?: (columnId: string) => void;
}

export default function DroppableBoard({
  columns,
  tasks,
  onDragEnd,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  canDeleteColumn,
  onDuplicateColumn,
  configuration,
  getColumnWipLimit,
  collapsedColumns = {},
  onToggleColumnCollapse,
}: DroppableBoardProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided, snapshot) => (
          <BoardsContainer
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              backgroundColor: snapshot.isDraggingOver
                ? '#fafafa'
                : 'transparent',
              transition: 'background-color 0.2s ease',
            }}
          >
            <BoardsContent>
              {columns.map((column, index) => (
                <DraggableColumn
                  key={column.id}
                  column={column}
                  index={index}
                  tasks={tasks[column.id] || []}
                  onEditColumn={onEditColumn}
                  onDeleteColumn={onDeleteColumn}
                  onAddTask={onAddTask}
                  canDelete={canDeleteColumn()}
                  onDuplicateColumn={onDuplicateColumn}
                  configuration={configuration}
                  getColumnWipLimit={getColumnWipLimit}
                  isCollapsed={collapsedColumns[column.id]}
                  onToggleCollapse={onToggleColumnCollapse}
                />
              ))}
              {provided.placeholder}
            </BoardsContent>
          </BoardsContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
}

// components/DraggableColumn.tsx
import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { KanbanColumn } from '../../types/kanban-column';
import { Task } from '../../types/task-status';
import KanbanCard from '../kanban-card/kanban-card';
import ColumnOptionsMenu from '../column-options-menu/column-options-menu';
import {
  BoardColumn,
  DroppableArea,
  ColumnHeader,
  ColumnTitle,
  ColumnContent,
  ColumnCollapsedIndicator,
  CollapseButton,
  TaskCount,
} from '../../KanbanPage.styles';

interface DraggableColumnProps {
  column: KanbanColumn;
  index: number;
  tasks: Task[];
  onEditColumn: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddTask: () => void;
  canDelete: boolean;
  onDuplicateColumn?: (column: KanbanColumn) => void;
  configuration?: any;
  getColumnWipLimit?: (columnId: string) => number | undefined;
  isCollapsed?: boolean;
  onToggleCollapse?: (columnId: string) => void;
}

export default function DraggableColumn({
  column,
  index,
  tasks,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  canDelete,
  onDuplicateColumn,
  configuration,
  getColumnWipLimit,
  isCollapsed = false,
  onToggleCollapse,
}: DraggableColumnProps) {
  // Calcular WIP limit e status
  const wipLimit = getColumnWipLimit ? getColumnWipLimit(column.id) : undefined;
  const isWipLimitEnabled = configuration?.enableWipLimits && wipLimit;
  const isOverLimit = isWipLimitEnabled && tasks.length > wipLimit;
  const isNearLimit = isWipLimitEnabled && tasks.length >= wipLimit * 0.8;
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <BoardColumn
          ref={provided.innerRef}
          {...provided.draggableProps}
          $isCollapsed={isCollapsed}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform} rotate(5deg)`
              : provided.draggableProps.style?.transform,
          }}
        >
          {/* Header da Coluna Responsivo */}
          <ColumnHeader
            {...provided.dragHandleProps}
            $isCollapsed={isCollapsed}
            style={{
              backgroundColor: column.color || '#f5f5f5',
            }}
          >
            {/* Botão de Collapse */}
            {onToggleCollapse && (
              <CollapseButton
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCollapse(column.id);
                }}
                title={isCollapsed ? 'Expandir coluna' : 'Recolher coluna'}
              >
                {isCollapsed ? (
                  <ChevronRight style={{ width: 16, height: 16 }} />
                ) : (
                  <ChevronLeft style={{ width: 16, height: 16 }} />
                )}
              </CollapseButton>
            )}

            {/* Título e Contador */}
            <div
              style={{
                display: 'flex',
                alignItems: isCollapsed ? 'stretch' : 'center',
                gap: isCollapsed ? 0 : 8,
                flexDirection: isCollapsed ? 'column' : 'row',
                flex: 1,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
              }}
            >
              <ColumnTitle $isCollapsed={isCollapsed}>
                {column.title}
              </ColumnTitle>

              <TaskCount
                $isCollapsed={isCollapsed}
                style={{
                  background: isOverLimit
                    ? '#ff4d4f'
                    : isNearLimit
                      ? '#faad14'
                      : '#e5e5e5',
                  color: isOverLimit || isNearLimit ? '#fff' : '#333',
                  fontWeight: isOverLimit || isNearLimit ? 'bold' : 'normal',
                }}
              >
                {tasks.length}
                {isWipLimitEnabled && !isCollapsed && `/${wipLimit}`}
              </TaskCount>

              {isOverLimit && !isCollapsed && (
                <span
                  style={{
                    fontSize: 12,
                    color: '#ff4d4f',
                    fontWeight: 'bold',
                    marginLeft: 4,
                  }}
                  title="WIP Limit excedido!"
                >
                  ⚠️
                </span>
              )}
            </div>

            {/* Menu de Opções (apenas quando expandido) */}
            {!isCollapsed && (
              <ColumnOptionsMenu
                column={column}
                canDelete={canDelete}
                onEdit={() => onEditColumn(column.id)}
                onDelete={() => onDeleteColumn(column.id)}
                onAddTask={onAddTask}
                onDuplicate={
                  onDuplicateColumn
                    ? () => onDuplicateColumn(column)
                    : undefined
                }
              />
            )}
          </ColumnHeader>

          {/* Conteúdo da Coluna */}
          {isCollapsed ? (
            <ColumnCollapsedIndicator $isCollapsed={true}>
              <div style={{ fontSize: 10, marginBottom: 8 }}>
                {tasks.length}
              </div>
              {isOverLimit && (
                <div style={{ color: '#ff4d4f', fontSize: 14 }}>⚠️</div>
              )}
            </ColumnCollapsedIndicator>
          ) : (
            <ColumnContent $isCollapsed={false}>
              <Droppable droppableId={column.id} type="TASK">
                {(provided, snapshot) => (
                  <DroppableArea
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      backgroundColor: snapshot.isDraggingOver
                        ? '#f0f9ff'
                        : 'transparent',
                      transition: 'background-color 0.2s ease',
                      minHeight: 200,
                      padding: '8px 6px',
                    }}
                  >
                    {tasks.map((task, taskIndex) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={taskIndex}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {tasks.length === 0 && (
                      <div
                        style={{
                          textAlign: 'center',
                          color: '#9ca3af',
                          fontSize: 14,
                          padding: '20px 0',
                          fontStyle: 'italic',
                        }}
                      >
                        Arraste tarefas aqui
                      </div>
                    )}
                  </DroppableArea>
                )}
              </Droppable>
            </ColumnContent>
          )}
        </BoardColumn>
      )}
    </Draggable>
  );
}

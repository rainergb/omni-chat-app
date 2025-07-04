import React from 'react';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { KanbanColumn } from '../../types/kanban-column';
import ColumnOptionsMenu from '../column-options-menu/column-options-menu';
import { GripVertical } from 'lucide-react';

interface ColumnHeaderProps {
  column: KanbanColumn;
  taskCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onAddTask: () => void;
  canDelete: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export default function ColumnHeader({
  column,
  taskCount,
  onEdit,
  onDelete,
  onAddTask,
  canDelete,
  dragHandleProps,
}: ColumnHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: column.color || '#f8fafc',
        borderRadius: '8px 8px 0 0',
        borderBottom: '1px solid #e2e8f0',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <div
          {...dragHandleProps}
          style={{
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <GripVertical style={{ width: 16, height: 16, color: '#6b7280' }} />
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: '#374151',
            flex: 1,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {column.title}
        </h3>

        <span
          style={{
            background: '#e5e7eb',
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: 12,
            fontWeight: 500,
            color: '#374151',
            minWidth: '20px',
            textAlign: 'center',
          }}
        >
          {taskCount}
        </span>
      </div>

      <ColumnOptionsMenu
        column={column}
        canDelete={canDelete}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddTask={onAddTask}
      />
    </div>
  );
}

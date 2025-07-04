// components/ColumnOptionsMenu.tsx - Versão Aprimorada
import React, { useState } from 'react';
import { Dropdown, Button, Modal, message } from 'antd';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Copy,
  Archive,
  Target,
  Users,
} from 'lucide-react';
import { KanbanColumn } from '../../types/kanban-column';

interface ColumnOptionsMenuProps {
  column: KanbanColumn;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddTask: () => void;
  onDuplicate?: (column: KanbanColumn) => void;
  onArchive?: (columnId: string) => void;
  onSetWipLimit?: (columnId: string, limit: number) => void;
  onAssignUsers?: (columnId: string) => void;
  taskCount?: number;
  wipLimit?: number;
}

export default function ColumnOptionsMenu({
  column,
  canDelete,
  onEdit,
  onDelete,
  onAddTask,
  onDuplicate,
  onArchive,
  onSetWipLimit,
  onAssignUsers,
  taskCount = 0,
  wipLimit,
}: ColumnOptionsMenuProps) {
  const [isWipModalOpen, setIsWipModalOpen] = useState(false);

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(column);
      message.success(`Coluna "${column.title}" duplicada com sucesso!`);
    }
  };

  const handleArchive = () => {
    Modal.confirm({
      title: 'Arquivar Coluna',
      content: `Tem certeza que deseja arquivar a coluna "${column.title}"? As tarefas serão movidas para "Arquivadas".`,
      okText: 'Arquivar',
      cancelText: 'Cancelar',
      onOk: () => {
        if (onArchive) {
          onArchive(column.id);
          message.success('Coluna arquivada com sucesso!');
        }
      },
    });
  };

  const isWipExceeded = wipLimit && taskCount > wipLimit;

  const items = [
    {
      key: 'add-task',
      label: (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={onAddTask}
        >
          <Plus style={{ width: 16, height: 16 }} />
          Adicionar Tarefa
        </div>
      ),
    },
    { type: 'divider' as const },
    {
      key: 'edit',
      label: (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={onEdit}
        >
          <Edit style={{ width: 16, height: 16 }} />
          Editar Coluna
        </div>
      ),
    },
    ...(onDuplicate
      ? [
          {
            key: 'duplicate',
            label: (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                onClick={handleDuplicate}
              >
                <Copy style={{ width: 16, height: 16 }} />
                Duplicar Coluna
              </div>
            ),
          },
        ]
      : []),
    { type: 'divider' as const },
    ...(onSetWipLimit
      ? [
          {
            key: 'wip-limit',
            label: (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: isWipExceeded ? '#ef4444' : 'inherit',
                }}
                onClick={() => setIsWipModalOpen(true)}
              >
                <Target style={{ width: 16, height: 16 }} />
                Limite WIP {wipLimit ? `(${wipLimit})` : ''}
                {isWipExceeded && ' ⚠️'}
              </div>
            ),
          },
        ]
      : []),
    ...(onAssignUsers
      ? [
          {
            key: 'assign-users',
            label: (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                onClick={() => onAssignUsers?.(column.id)}
              >
                <Users style={{ width: 16, height: 16 }} />
                Responsáveis
              </div>
            ),
          },
        ]
      : []),
    ...(onArchive
      ? [
          {
            key: 'archive',
            label: (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                onClick={handleArchive}
              >
                <Archive style={{ width: 16, height: 16 }} />
                Arquivar Coluna
              </div>
            ),
          },
        ]
      : []),
    ...(canDelete
      ? [
          { type: 'divider' as const },
          {
            key: 'delete',
            label: (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                onClick={onDelete}
              >
                <Trash2 style={{ width: 16, height: 16 }} />
                Deletar Coluna
              </div>
            ),
            danger: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        placement="bottomRight"
        overlayStyle={{ minWidth: 200 }}
      >
        <Button
          type="text"
          size="small"
          icon={<MoreHorizontal style={{ width: 16, height: 16 }} />}
          style={{
            opacity: 0.7,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        />
      </Dropdown>

      {/* Modal WIP Limit */}
      <Modal
        title="Configurar Limite WIP"
        open={isWipModalOpen}
        onCancel={() => setIsWipModalOpen(false)}
        onOk={() => {
          // Implementar lógica do WIP limit
          setIsWipModalOpen(false);
        }}
      >
        <p>
          Configure o limite máximo de tarefas em progresso (Work In Progress)
          para esta coluna.
        </p>
        <p>
          Atual: <strong>{taskCount} tarefas</strong>
        </p>
        {isWipExceeded && (
          <div style={{ color: '#ef4444', marginTop: 8 }}>
            ⚠️ Esta coluna excedeu o limite WIP atual!
          </div>
        )}
      </Modal>
    </>
  );
}

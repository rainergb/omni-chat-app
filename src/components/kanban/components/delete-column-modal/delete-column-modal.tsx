import React, { useState } from 'react';
import { Modal, Select, Alert, Typography, Button } from 'antd';
import { TriangleAlert } from 'lucide-react';
import { KanbanColumn } from '../../types/kanban-column';

const { Text } = Typography;

interface DeleteColumnModalProps {
  isOpen: boolean;
  column?: KanbanColumn;
  taskCount: number;
  availableColumns: KanbanColumn[];
  onClose: () => void;
  onConfirm: (moveTasksToColumnId?: string) => void;
}

export default function DeleteColumnModal({
  isOpen,
  column,
  taskCount,
  availableColumns,
  onClose,
  onConfirm,
}: DeleteColumnModalProps) {
  const [moveToColumnId, setMoveToColumnId] = useState<string>();
  const [deleteOption, setDeleteOption] = useState<'move' | 'delete'>('move');

  const handleConfirm = () => {
    if (deleteOption === 'move' && taskCount > 0) {
      onConfirm(moveToColumnId);
    } else {
      onConfirm();
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TriangleAlert style={{ width: 20, height: 20, color: '#ef4444' }} />
          Deletar Coluna
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          onClick={handleConfirm}
          disabled={deleteOption === 'move' && taskCount > 0 && !moveToColumnId}
        >
          Deletar Coluna
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Text>Tem certeza que deseja deletar a coluna {column?.title}?</Text>
      </div>

      {taskCount > 0 && (
        <>
          <div style={{ marginBottom: 16 }}>
            <Alert
              message={`Esta coluna contém ${taskCount} tarefa(s)`}
              type="warning"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Text strong>O que fazer com as tarefas?</Text>
            <div style={{ width: '100%', marginTop: 8 }}>
              <Select
                style={{ width: '100%' }}
                value={deleteOption}
                onChange={setDeleteOption}
                options={[
                  { label: 'Mover para outra coluna', value: 'move' },
                  { label: 'Deletar tarefas junto', value: 'delete' },
                ]}
              />
            </div>
          </div>

          {deleteOption === 'move' && (
            <div>
              <Text>Mover tarefas para:</Text>
              <div style={{ width: '100%', marginTop: 8 }}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Selecione uma coluna"
                  value={moveToColumnId}
                  onChange={setMoveToColumnId}
                  options={availableColumns.map((col) => ({
                    label: col.title,
                    value: col.id,
                  }))}
                />
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

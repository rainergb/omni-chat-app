// components/DeleteColumnModal.tsx
import React, { useState } from 'react';
import { Modal, Select, Alert, Typography, Button } from 'antd';
import { TriangleAlert } from 'lucide-react';
import { KanbanColumn } from '@/app/(dashboard)/kanban/types/kanban-column';
import {
  ModalTitle,
  WarningIcon,
  ContentContainer,
  AlertContainer,
  OptionContainer,
  SelectContainer,
  MoveToContainer,
} from './DeleteColumnModal.styles';

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
        <ModalTitle>
          <WarningIcon>
            <TriangleAlert />
          </WarningIcon>
          Deletar Coluna
        </ModalTitle>
      }
      open={isOpen}
      onCancel={onClose}
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
      <ContentContainer>
        <Text>
          Tem certeza que deseja deletar a coluna &quot;{column?.title}&quot;?
        </Text>
      </ContentContainer>

      {taskCount > 0 && (
        <>
          <AlertContainer>
            <Alert
              message={`Esta coluna contém ${taskCount} tarefa(s)`}
              type="warning"
            />
          </AlertContainer>

          <OptionContainer>
            <Text strong>O que fazer com as tarefas?</Text>
            <SelectContainer>
              <Select
                style={{ width: '100%' }}
                value={deleteOption}
                onChange={setDeleteOption}
                options={[
                  { label: 'Mover para outra coluna', value: 'move' },
                  { label: 'Deletar tarefas junto', value: 'delete' },
                ]}
              />
            </SelectContainer>
          </OptionContainer>

          {deleteOption === 'move' && (
            <MoveToContainer>
              <Text>Mover tarefas para:</Text>
              <SelectContainer>
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
              </SelectContainer>
            </MoveToContainer>
          )}
        </>
      )}
    </Modal>
  );
}

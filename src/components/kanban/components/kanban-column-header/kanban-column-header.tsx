import React from 'react';
import { PlusIcon } from 'lucide-react';
import { Button, Tooltip } from 'antd';
import { TaskStatus } from '@/app/(dashboard)/kanban/types/task-status';
import { useCreateTaskModal } from '@/app/(dashboard)/kanban/hooks/use-create-task.modal';
import { statusIconMap } from './kanban-column-header.constants';
import {
  HeaderContainer,
  HeaderLeft,
  IconContainer,
  Title,
  TaskCountBadge,
  AddButton,
} from './KanbanColumnHeader.styles';

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

export default function KanbanColumnHeader({
  board,
  taskCount,
}: KanbanColumnHeaderProps) {
  const { open } = useCreateTaskModal();
  const icon = statusIconMap[board];

  return (
    <HeaderContainer>
      <HeaderLeft>
        <IconContainer>{icon}</IconContainer>

        <Tooltip title={board} placement="top">
          <Title>{board}</Title>
        </Tooltip>

        <TaskCountBadge>{taskCount}</TaskCountBadge>
      </HeaderLeft>

      <AddButton>
        <Button
          icon={<PlusIcon />}
          onClick={() => open()}
          type="text"
          size="small"
        />
      </AddButton>
    </HeaderContainer>
  );
}

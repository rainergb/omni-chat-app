import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, Dropdown, Tooltip } from 'antd';
import { Task } from '@/app/(dashboard)/kanban/types/task-status';
import { useEditTaskModal } from '@/app/(dashboard)/kanban/hooks/use-edit-task.modal';
import { getDropdownItems, getDateTextColor } from './kanban-card.utils';
import {
  CardContainer,
  CardHeader,
  TaskTitle,
  MoreIcon,
  CardFooter,
  AvatarContainer,
  Separator,
  DateText,
} from './KanbanCard.styles';

interface KanbanCardProps {
  task: Task;
}

export default function KanbanCard({ task }: KanbanCardProps) {
  const { open } = useEditTaskModal();

  const dateTextColor = getDateTextColor(task.endDate || '');
  const dropdownItems = getDropdownItems(() => open(task.id));

  return (
    <CardContainer>
      <CardHeader>
        <TaskTitle>{task.title}</TaskTitle>

        <Dropdown
          menu={{ items: dropdownItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <MoreIcon>
            <MoreHorizontal />
          </MoreIcon>
        </Dropdown>
      </CardHeader>

      <CardFooter>
        <AvatarContainer>
          <Tooltip title={task.assignee} placement="top">
            <Avatar size="small">
              {task.assignee?.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        </AvatarContainer>

        <Separator />

        <DateText $color={dateTextColor}>
          {format(task.endDate || '', 'PPP', { locale: ptBR })}
        </DateText>
      </CardFooter>
    </CardContainer>
  );
}

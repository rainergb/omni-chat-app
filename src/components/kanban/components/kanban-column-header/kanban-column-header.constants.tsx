import React from 'react';
import { CircleDashedIcon, CircleDotDashedIcon, CircleDotIcon, CircleIcon } from 'lucide-react';
import { TaskStatus } from '@/app/(dashboard)/kanban/types/task-status';

export const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    [TaskStatus.WAITING_TASK]: (
        <CircleDashedIcon style={{ width: 18, height: 18, color: '#ec4899' }} />
    ),
    [TaskStatus.DELAYED]: (
        <CircleIcon style={{ width: 18, height: 18, color: '#ef4444' }} />
    ),
    [TaskStatus.IN_PROGRESS]: (
        <CircleDotDashedIcon style={{ width: 18, height: 18, color: '#eab308' }} />
    ),
    [TaskStatus.NOT_STARTED]: (
        <CircleDotIcon style={{ width: 18, height: 18, color: '#3b82f6' }} />
    ),
    [TaskStatus.COMPLETED]: (
        <CircleDashedIcon style={{ width: 18, height: 18, color: '#10b981' }} />
    ),
    [TaskStatus.CANCELED]: (
        <CircleIcon style={{ width: 18, height: 18, color: '#991b1b' }} />
    ),
    [TaskStatus.PENDING]: (
        <CircleIcon style={{ width: 18, height: 18, color: '#1e40af' }} />
    )
};
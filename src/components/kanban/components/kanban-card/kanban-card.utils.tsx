import React from 'react';
import { PencilIcon, TrashIcon } from "lucide-react";
import { MenuProps } from "antd/lib";
import { differenceInDays } from 'date-fns';

export const getDropdownItems = (onEdit: () => void): MenuProps['items'] => [
    {
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={onEdit}>
                <PencilIcon style={{ width: 16, height: 16, strokeWidth: 2 }} />
                Editar Tarefa
            </div>
        ),
        key: '0',
    },
    {
        type: 'divider',
    },
    {
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrashIcon style={{ width: 16, height: 16, strokeWidth: 2 }} />
                Deletar Tarefa
            </div>
        ),
        key: '1',
    },
];

export const getDateTextColor = (endDate: string): string => {
    const today = new Date();
    const taskEndDate = new Date(endDate || '');
    const diffInDays = differenceInDays(taskEndDate, today);

    if (diffInDays <= 3) {
        return '#ef4444'; // text-red-500
    } else if (diffInDays <= 7) {
        return '#f97316'; // text-orange-500
    } else if (diffInDays <= 30) {
        return '#eab308'; // text-yellow-500
    }
    
    return '#6b7280'; // text-muted-foreground
};
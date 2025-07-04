// components/ColumnStatusIndicator.tsx - Novo componente
import React from 'react';
import { Badge, Tooltip } from 'antd';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ColumnStatusIndicatorProps {
  taskCount: number;
  wipLimit?: number;
  isDefault: boolean;
  hasOverdueTasks?: boolean;
}

export default function ColumnStatusIndicator({
  taskCount,
  wipLimit,
  isDefault,
  hasOverdueTasks = false,
}: ColumnStatusIndicatorProps) {
  const isWipExceeded = wipLimit && taskCount > wipLimit;

  let status: 'success' | 'warning' | 'error' | 'default' = 'default';
  let icon = null;
  let tooltipText = '';

  if (isWipExceeded) {
    status = 'error';
    icon = <AlertTriangle style={{ width: 12, height: 12 }} />;
    tooltipText = `Limite WIP excedido (${taskCount}/${wipLimit})`;
  } else if (hasOverdueTasks) {
    status = 'warning';
    icon = <Clock style={{ width: 12, height: 12 }} />;
    tooltipText = 'Contém tarefas atrasadas';
  } else if (taskCount === 0) {
    status = 'default';
    tooltipText = 'Coluna vazia';
  } else {
    status = 'success';
    icon = <CheckCircle style={{ width: 12, height: 12 }} />;
    tooltipText = `${taskCount} tarefa(s)`;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Tooltip title={tooltipText}>
        <Badge
          count={taskCount}
          status={status}
          style={{
            backgroundColor:
              status === 'error'
                ? '#ef4444'
                : status === 'warning'
                  ? '#f59e0b'
                  : status === 'success'
                    ? '#10b981'
                    : '#6b7280',
          }}
        />
      </Tooltip>

      {icon && (
        <Tooltip title={tooltipText}>
          <span
            style={{
              color:
                status === 'error'
                  ? '#ef4444'
                  : status === 'warning'
                    ? '#f59e0b'
                    : '#6b7280',
            }}
          >
            {icon}
          </span>
        </Tooltip>
      )}

      {isDefault && (
        <Tooltip title="Coluna padrão do sistema">
          <Badge size="small" color="#6366f1" />
        </Tooltip>
      )}
    </div>
  );
}

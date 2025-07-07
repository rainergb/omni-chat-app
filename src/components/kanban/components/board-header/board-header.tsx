// components/BoardHeader.tsx - Versão Aprimorada
import React, { useState } from 'react';
import { Button, Space, Dropdown, Switch, Tooltip, Typography } from 'antd';
import {
  Plus,
  Settings,
  Download,
  Upload,
  MoreHorizontal,
  Grid,
  List,
} from 'lucide-react';

const { Title, Text } = Typography;

interface BoardHeaderProps {
  onAddColumn: () => void;
  onAddTask: () => void;
  onExportBoard?: () => void;
  onImportBoard?: () => void;
  onResetBoard?: () => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  showCompletedTasks?: boolean;
  onToggleCompletedTasks?: (show: boolean) => void;
}

export default function BoardHeader({
  onAddColumn,
  onAddTask,
  onExportBoard,
  onImportBoard,
  onResetBoard,
  viewMode = 'grid',
  onViewModeChange,
  showCompletedTasks = true,
  onToggleCompletedTasks,
}: BoardHeaderProps) {
  const [isCompactMode, setIsCompactMode] = useState(false);

  const configMenuItems = [
    {
      key: 'export',
      label: (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={onExportBoard}
        >
          <Download style={{ width: 16, height: 16 }} />
          Exportar Board
        </div>
      ),
      disabled: !onExportBoard,
    },
    {
      key: 'import',
      label: (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={onImportBoard}
        >
          <Upload style={{ width: 16, height: 16 }} />
          Importar Board
        </div>
      ),
      disabled: !onImportBoard,
    },
    { type: 'divider' as const },
    {
      key: 'reset',
      label: (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={onResetBoard}
        >
          <Settings style={{ width: 16, height: 16 }} />
          Resetar para Padrão
        </div>
      ),
      disabled: !onResetBoard,
      danger: true,
    },
  ];

  return (
    <div
      style={{
        marginBottom: 24,
        padding: isCompactMode ? '16px 0' : '24px 0',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Linha principal */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isCompactMode ? 'center' : 'flex-start',
          marginBottom: isCompactMode ? 0 : 16,
        }}
      >
        <div>
          <Title level={isCompactMode ? 4 : 2} style={{ margin: 0 }}>
            Quadro Kanban
          </Title>
          {!isCompactMode && (
            <Text type="secondary" style={{ fontSize: 16 }}>
              Arraste e solte as tarefas entre as colunas para atualizar seu
              status.
            </Text>
          )}
        </div>

        <Space size="middle">
          {/* Controles de visualização */}
          {onViewModeChange && (
            <Space>
              <Tooltip title="Visualização em grade">
                <Button
                  type={viewMode === 'grid' ? 'primary' : 'default'}
                  icon={<Grid style={{ width: 16, height: 16 }} />}
                  onClick={() => onViewModeChange('grid')}
                />
              </Tooltip>
              <Tooltip title="Visualização em lista">
                <Button
                  type={viewMode === 'list' ? 'primary' : 'default'}
                  icon={<List style={{ width: 16, height: 16 }} />}
                  onClick={() => onViewModeChange('list')}
                />
              </Tooltip>
            </Space>
          )}

          {/* Botões principais */}
          <Button
            onClick={onAddColumn}
            icon={<Plus style={{ width: 16, height: 16 }} />}
            size="large"
          >
            {isCompactMode ? '' : 'Adicionar Coluna'}
          </Button>

          <Button
            onClick={onAddTask}
            type="primary"
            icon={<Plus style={{ width: 16, height: 16 }} />}
            size="large"
          >
            {isCompactMode ? '' : 'Adicionar Tarefa'}
          </Button>

          {/* Menu de configurações */}
          <Dropdown menu={{ items: configMenuItems }} trigger={['click']}>
            <Button
              icon={<MoreHorizontal style={{ width: 16, height: 16 }} />}
              size="large"
            />
          </Dropdown>
        </Space>
      </div>

      {/* Linha de controles */}
      {!isCompactMode && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
          }}
        >
          <Space size="large">
            {onToggleCompletedTasks && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text>Mostrar tarefas concluídas:</Text>
                <Switch
                  checked={showCompletedTasks}
                  onChange={onToggleCompletedTasks}
                  size="small"
                />
              </div>
            )}
          </Space>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text type="secondary">Modo compacto:</Text>
            <Switch
              checked={isCompactMode}
              onChange={setIsCompactMode}
              size="small"
            />
          </div>
        </div>
      )}
    </div>
  );
}

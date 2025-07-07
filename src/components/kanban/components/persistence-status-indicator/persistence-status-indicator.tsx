// components/PersistenceStatusIndicator.tsx
/**
 * Indicador visual do status da persistência
 */

import React from 'react';
import { Badge, Tooltip, Space, Typography } from 'antd';
import { Save, Clock, AlertTriangle, CheckCircle, Upload } from 'lucide-react';

const { Text } = Typography;

interface PersistenceStatusProps {
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  migrationInProgress: boolean;
  hasErrors: boolean;
}

export default function PersistenceStatusIndicator({
  isLoading,
  isSaving,
  lastSaved,
  autoSaveEnabled,
  migrationInProgress,
  hasErrors = false,
}: PersistenceStatusProps) {
  const getStatus = () => {
    if (migrationInProgress) {
      return {
        color: 'blue',
        icon: <Upload style={{ width: 12, height: 12 }} />,
        text: 'Migrando...',
        tooltip: 'Atualizando estrutura de dados',
      };
    }

    if (isSaving) {
      return {
        color: 'blue',
        icon: <Save style={{ width: 12, height: 12 }} />,
        text: 'Salvando...',
        tooltip: 'Salvando dados automaticamente',
      };
    }

    if (isLoading) {
      return {
        color: 'blue',
        icon: <Clock style={{ width: 12, height: 12 }} />,
        text: 'Carregando...',
        tooltip: 'Carregando dados salvos',
      };
    }

    if (hasErrors) {
      return {
        color: 'red',
        icon: <AlertTriangle style={{ width: 12, height: 12 }} />,
        text: 'Erro',
        tooltip: 'Erro na persistência de dados',
      };
    }

    if (lastSaved) {
      const now = new Date();
      const diffMinutes = Math.floor(
        (now.getTime() - lastSaved.getTime()) / (1000 * 60)
      );

      return {
        color: 'green',
        icon: <CheckCircle style={{ width: 12, height: 12 }} />,
        text: diffMinutes === 0 ? 'Salvo agora' : `Salvo há ${diffMinutes}m`,
        tooltip: `Último salvamento: ${lastSaved.toLocaleString()}`,
      };
    }

    return {
      color: 'default',
      icon: <Clock style={{ width: 12, height: 12 }} />,
      text: 'Nunca salvo',
      tooltip: 'Nenhum dado foi salvo ainda',
    };
  };

  const status = getStatus();

  return (
    <Tooltip title={status.tooltip}>
      <Space size={4} style={{ cursor: 'help' }}>
        <Badge color={status.color} />
        {status.icon}
        <Text style={{ fontSize: 12, color: '#666' }}>{status.text}</Text>
        {autoSaveEnabled && (
          <Text style={{ fontSize: 10, color: '#999' }}>(Auto)</Text>
        )}
      </Space>
    </Tooltip>
  );
}

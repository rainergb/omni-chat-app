import React from 'react';
import { Badge, Tooltip, Spin } from 'antd';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
} from 'lucide-react';

interface PersistenceStatusIndicatorProps {
  isLoading?: boolean;
  isSaving?: boolean;
  lastSaved?: Date | null;
  autoSaveEnabled?: boolean;
  migrationInProgress?: boolean;
  hasErrors?: boolean;
}

const PersistenceStatusIndicator: React.FC<PersistenceStatusIndicatorProps> = ({
  isLoading = false,
  isSaving = false,
  lastSaved = null,
  autoSaveEnabled = true,
  migrationInProgress = false,
  hasErrors = false,
}) => {
  const getStatusInfo = () => {
    if (migrationInProgress) {
      return {
        icon: (
          <RefreshCw
            className="animate-spin"
            style={{ width: 14, height: 14 }}
          />
        ),
        color: 'processing' as const,
        text: 'Atualizando dados...',
        tooltip: 'Migração de dados em progresso',
      };
    }

    if (hasErrors) {
      return {
        icon: <AlertCircle style={{ width: 14, height: 14 }} />,
        color: 'error' as const,
        text: 'Erro',
        tooltip: 'Erro na persistência de dados',
      };
    }

    if (isSaving) {
      return {
        icon: <Spin size="small" />,
        color: 'processing' as const,
        text: 'Salvando...',
        tooltip: 'Salvando dados automaticamente',
      };
    }

    if (isLoading) {
      return {
        icon: <Spin size="small" />,
        color: 'processing' as const,
        text: 'Carregando...',
        tooltip: 'Carregando dados salvos',
      };
    }

    if (lastSaved) {
      const timeDiff = Date.now() - lastSaved.getTime();
      const minutes = Math.floor(timeDiff / 60000);

      if (minutes < 1) {
        return {
          icon: <CheckCircle style={{ width: 14, height: 14 }} />,
          color: 'success' as const,
          text: 'Salvo',
          tooltip: 'Dados salvos há menos de 1 minuto',
        };
      } else if (minutes < 5) {
        return {
          icon: <CheckCircle style={{ width: 14, height: 14 }} />,
          color: 'success' as const,
          text: `${minutes}min`,
          tooltip: `Dados salvos há ${minutes} minuto${minutes > 1 ? 's' : ''}`,
        };
      } else {
        return {
          icon: <Clock style={{ width: 14, height: 14 }} />,
          color: 'warning' as const,
          text: `${minutes}min`,
          tooltip: `Dados salvos há ${minutes} minutos - considere salvar manualmente`,
        };
      }
    }

    return {
      icon: autoSaveEnabled ? (
        <Wifi style={{ width: 14, height: 14 }} />
      ) : (
        <WifiOff style={{ width: 14, height: 14 }} />
      ),
      color: autoSaveEnabled ? ('default' as const) : ('warning' as const),
      text: autoSaveEnabled ? 'Auto-save' : 'Manual',
      tooltip: autoSaveEnabled
        ? 'Salvamento automático ativado'
        : 'Salvamento automático desativado',
    };
  };

  const status = getStatusInfo();

  return (
    <Tooltip title={status.tooltip}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: '#666',
        }}
      >
        <Database style={{ width: 12, height: 12 }} />
        <Badge
          status={status.color}
          text={
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
              }}
            >
              {status.icon}
              {status.text}
            </span>
          }
        />
      </div>
    </Tooltip>
  );
};

export default PersistenceStatusIndicator;

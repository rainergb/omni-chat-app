// utils/persistence-examples.ts
/**
 * Exemplos de uso da persistência
 */

import { useKanbanWithPersistence } from '../hooks/use-kanban-with-persistence';

export const persistenceExamples = {
  // Exemplo 1: Setup básico
  basicSetup: () => {
    const kanban = useKanbanWithPersistence({
      storageKey: 'my-kanban-board',
      autoSave: true,
      autoSaveInterval: 30000,
    });

    return kanban;
  },

  // Exemplo 2: Backup programático
  createScheduledBackup: async (kanban: any) => {
    try {
      const backupId = await kanban.createManualBackup(
        `Backup automático - ${new Date().toLocaleDateString()}`
      );
      console.log('Backup criado:', backupId);
    } catch (error) {
      console.error('Erro no backup:', error);
    }
  },

  // Exemplo 3: Exportar para compartilhamento
  exportForSharing: async (kanban: any) => {
    try {
      const data = kanban.getCurrentData();
      const shareableData = {
        columns: data.columns,
        tasks: data.tasks,
        exportedAt: new Date().toISOString(),
        boardName: data.settings?.boardName || 'Board Compartilhado',
      };

      const blob = new Blob([JSON.stringify(shareableData, null, 2)], {
        type: 'application/json',
      });

      // Criar link de download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kanban-board-shared.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  },

  // Exemplo 4: Monitoramento de uso de storage
  monitorStorage: (kanban: any) => {
    const stats = kanban.getStorageStats();
    const warningThreshold = 4 * 1024 * 1024; // 4MB

    if (stats.total > warningThreshold) {
      console.warn('Uso elevado de storage:', {
        total: (stats.total / 1024 / 1024).toFixed(2) + 'MB',
        main: (stats.main / 1024 / 1024).toFixed(2) + 'MB',
        backups: (stats.backups / 1024 / 1024).toFixed(2) + 'MB',
      });

      // Sugerir limpeza de backups antigos
      return true;
    }

    return false;
  },

  // Exemplo 5: Configuração avançada com callbacks
  advancedSetup: () => {
    const kanban = useKanbanWithPersistence({
      storageKey: 'advanced-kanban-board',
      autoSave: true,
      autoSaveInterval: 15000, // 15 segundos
      loadOnMount: true,

      // Callbacks para monitoramento
      onLoadError: (error: Error) => {
        console.error('Erro ao carregar dados:', error);
        // Implementar fallback ou notificação para o usuário
      },

      onSaveError: (error: Error) => {
        console.error('Erro ao salvar dados:', error);
        // Implementar retry ou notificação
      },

      onMigrationStart: (fromVersion: string, toVersion: string) => {
        console.log(`Iniciando migração: ${fromVersion} → ${toVersion}`);
      },

      onMigrationComplete: (fromVersion: string, toVersion: string) => {
        console.log(`Migração concluída: ${fromVersion} → ${toVersion}`);
      },
    });

    return kanban;
  },

  // Exemplo 6: Integração com sistema de backup externo
  integrateWithExternalBackup: async (kanban: any) => {
    try {
      // Criar backup local
      const localBackupId = await kanban.createManualBackup('Pre-sync backup');

      // Obter dados para sincronização
      const currentData = kanban.getCurrentData();

      // Simular envio para servidor externo
      const response = await fetch('/api/kanban/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: currentData,
          timestamp: new Date().toISOString(),
          localBackupId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Backup externo criado:', result.backupId);
        return result.backupId;
      } else {
        throw new Error('Falha no backup externo');
      }
    } catch (error) {
      console.error('Erro na integração com backup externo:', error);
      throw error;
    }
  },

  // Exemplo 7: Recuperação de dados com validação
  smartDataRecovery: async (kanban: any, backupId?: string): Promise<any> => {
    try {
      // Listar backups disponíveis
      const backups = kanban.listBackups();

      if (backups.length === 0) {
        throw new Error('Nenhum backup disponível');
      }

      // Usar backup específico ou o mais recente
      const targetBackup = backupId
        ? backups.find((b: any) => b.id === backupId)
        : backups[0]; // Mais recente

      if (!targetBackup) {
        throw new Error('Backup não encontrado');
      }

      // Validar integridade do backup
      const isValid = kanban.validateBackup(targetBackup.id);

      if (!isValid) {
        console.warn('Backup pode estar corrompido, tentando próximo...');

        // Tentar próximo backup disponível
        const nextBackup = backups.find((b: any) => b.id !== targetBackup.id);
        if (nextBackup) {
          return await persistenceExamples.smartDataRecovery(
            kanban,
            nextBackup.id
          );
        } else {
          throw new Error('Todos os backups estão corrompidos');
        }
      }

      // Restaurar dados
      await kanban.restoreFromBackup(targetBackup.id);

      console.log('Dados recuperados com sucesso do backup:', targetBackup.id);

      return targetBackup;
    } catch (error) {
      console.error('Erro na recuperação de dados:', error);
      throw error;
    }
  },

  // Exemplo 8: Limpeza automática de dados antigos
  performMaintenanceCleanup: async (kanban: any) => {
    try {
      const stats = kanban.getStorageStats();
      const backups = kanban.listBackups();

      // Limpar backups antigos (manter apenas os 5 mais recentes)
      const oldBackups = backups.slice(5);

      for (const backup of oldBackups) {
        await kanban.deleteBackup(backup.id);
        console.log('Backup antigo removido:', backup.id);
      }

      // Compactar dados se necessário
      if (stats.fragmentationRatio > 0.3) {
        await kanban.compactStorage();
        console.log('Storage compactado');
      }

      // Verificar integridade
      const integrityCheck = kanban.checkDataIntegrity();

      if (!integrityCheck.isValid) {
        console.warn(
          'Problemas de integridade detectados:',
          integrityCheck.issues
        );

        // Tentar auto-correção
        const fixed = await kanban.autoFixIntegrityIssues();
        console.log('Problemas corrigidos:', fixed);
      }

      console.log('Manutenção concluída');
    } catch (error) {
      console.error('Erro na manutenção:', error);
    }
  },
};

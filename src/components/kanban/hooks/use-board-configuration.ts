// hooks/use-board-configuration.ts - Hook para configurações avançadas
import { useState, useCallback } from 'react';

export interface ColumnWipLimit {
  columnId: string;
  limit: number;
}

export interface ColumnTemplate {
  id: string;
  name: string;
  title: string;
  wipLimit?: number;
  position?: number;
}

export interface BoardConfiguration {
  autoSave: boolean;
  showTaskCount: boolean;
  enableWipLimits: boolean;
  defaultWipLimit: number;
  columnWipLimits: ColumnWipLimit[];
  taskSortBy: 'position' | 'priority' | 'dueDate' | 'assignee';
  compactMode: boolean;
  showCompletedTasks: boolean;
  enableNotifications: boolean;
  columnTemplates: ColumnTemplate[];
}

const defaultConfig: BoardConfiguration = {
  autoSave: true,
  showTaskCount: true,
  enableWipLimits: false,
  defaultWipLimit: 5,
  columnWipLimits: [],
  taskSortBy: 'position',
  compactMode: false,
  showCompletedTasks: true,
  enableNotifications: true,
  columnTemplates: [
    {
      id: 'todo',
      name: 'Para Fazer',
      title: 'Para Fazer',
      wipLimit: 10,
      position: 0,
    },
    {
      id: 'progress',
      name: 'Em Progresso',
      title: 'Em Progresso',
      wipLimit: 5,
      position: 1,
    },
    {
      id: 'review',
      name: 'Em Revisão',
      title: 'Em Revisão',
      wipLimit: 3,
      position: 2,
    },
    {
      id: 'done',
      name: 'Concluído',
      title: 'Concluído',
      wipLimit: undefined,
      position: 3,
    },
  ],
};

export function useBoardConfiguration() {
  const [config, setConfig] = useState<BoardConfiguration>(() => {
    const saved = localStorage.getItem('kanban-board-config');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const updateConfig = useCallback((newConfig: Partial<BoardConfiguration>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('kanban-board-config', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    localStorage.setItem('kanban-board-config', JSON.stringify(defaultConfig));
  }, []);

  const exportConfig = useCallback(() => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kanban-board-config.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [config]);

  const importConfig = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          updateConfig(imported);
        } catch (error) {
          console.error('Erro ao importar configuração:', error);
        }
      };
      reader.readAsText(file);
    },
    [updateConfig]
  );

  // Métodos para gerenciar WIP limits por coluna
  const setColumnWipLimit = useCallback((columnId: string, limit: number) => {
    setConfig((prev) => {
      const wipLimits = prev.columnWipLimits.filter(
        (w) => w.columnId !== columnId
      );
      if (limit > 0) {
        wipLimits.push({ columnId, limit });
      }
      const updated = { ...prev, columnWipLimits: wipLimits };
      localStorage.setItem('kanban-board-config', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getColumnWipLimit = useCallback(
    (columnId: string): number | undefined => {
      const columnLimit = config.columnWipLimits.find(
        (w) => w.columnId === columnId
      );
      return (
        columnLimit?.limit ||
        (config.enableWipLimits ? config.defaultWipLimit : undefined)
      );
    },
    [config.columnWipLimits, config.enableWipLimits, config.defaultWipLimit]
  );

  // Métodos para gerenciar templates de colunas
  const addColumnTemplate = useCallback(
    (template: Omit<ColumnTemplate, 'id'>) => {
      setConfig((prev) => {
        const newTemplate: ColumnTemplate = {
          ...template,
          id: `template-${Date.now()}`,
        };
        const updated = {
          ...prev,
          columnTemplates: [...prev.columnTemplates, newTemplate],
        };
        localStorage.setItem('kanban-board-config', JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const updateColumnTemplate = useCallback(
    (id: string, updates: Partial<ColumnTemplate>) => {
      setConfig((prev) => {
        const templates = prev.columnTemplates.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        );
        const updated = { ...prev, columnTemplates: templates };
        localStorage.setItem('kanban-board-config', JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const removeColumnTemplate = useCallback((id: string) => {
    setConfig((prev) => {
      const templates = prev.columnTemplates.filter((t) => t.id !== id);
      const updated = { ...prev, columnTemplates: templates };
      localStorage.setItem('kanban-board-config', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    config,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
    // WIP Limits
    setColumnWipLimit,
    getColumnWipLimit,
    // Templates
    addColumnTemplate,
    updateColumnTemplate,
    removeColumnTemplate,
  };
}

// utils/version-manager.ts
/**
 * Gerenciador de versões e migrações
 */

import { TasksState } from '../types/kanban-state';
import { MigrationPlan, PersistedData } from '../types/persistence';

export class VersionManager {
  private readonly CURRENT_VERSION = '2.0.0';
  private readonly migrations: Map<string, MigrationPlan> = new Map();

  constructor() {
    this.setupMigrations();
  }

  private setupMigrations(): void {
    // Migração de 1.0.0 para 2.0.0
    this.migrations.set('1.0.0->2.0.0', {
      fromVersion: '1.0.0',
      toVersion: '2.0.0',
      canAutoMigrate: true,
      dataLossRisk: 'low',
      steps: [
        {
          id: 'add-column-ids',
          description: 'Adicionar IDs únicos às colunas',
          execute: (data: any) => {
            if (data.columns) {
              data.columns = data.columns.map((col: any, index: number) => ({
                ...col,
                id: col.id || `col-migrated-${Date.now()}-${index}`,
                createdAt: col.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }));
            }
            return data;
          },
          validate: (data: any) => data.columns?.every((col: any) => !!col.id),
        },
        {
          id: 'migrate-tasks-structure',
          description:
            'Migrar estrutura de tarefas para formato baseado em IDs',
          execute: (data: any) => {
            if (data.tasks && data.tasks.constructor !== Object) {
              // Se tasks ainda está no formato antigo (array por status)
              const newTasks: TasksState = {};

              // Inicializar com colunas
              data.columns?.forEach((col: any) => {
                newTasks[col.id] = [];
              });

              // Migrar tarefas existentes
              Object.entries(data.tasks).forEach(([status, tasks]) => {
                const column = data.columns?.find(
                  (col: any) => col.title === status
                );
                if (column && Array.isArray(tasks)) {
                  newTasks[column.id] = tasks.map((task: any) => ({
                    ...task,
                    columnId: column.id,
                    id:
                      task.id ||
                      `task-migrated-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
                  }));
                }
              });

              data.tasks = newTasks;
            }
            return data;
          },
        },
        {
          id: 'update-settings',
          description: 'Atualizar estrutura de configurações',
          execute: (data: any) => {
            data.settings = {
              ...data.settings,
              version: '2.0.0',
              lastUpdated: new Date().toISOString(),
              totalSaves: (data.settings?.totalSaves || 0) + 1,
              boardId: data.settings?.boardId || `board-${Date.now()}`,
            };
            return data;
          },
        },
      ],
    });

    // Outras migrações futuras seriam adicionadas aqui
  }

  // Verificar se migração é necessária
  needsMigration(currentVersion: string): boolean {
    return currentVersion !== this.CURRENT_VERSION;
  }

  // Obter plano de migração
  getMigrationPlan(fromVersion: string): MigrationPlan | null {
    const key = `${fromVersion}->${this.CURRENT_VERSION}`;
    return this.migrations.get(key) || null;
  }

  // Executar migração
  async migrate(data: any, fromVersion: string): Promise<PersistedData> {
    const plan = this.getMigrationPlan(fromVersion);

    if (!plan) {
      throw new Error(
        `Migração de ${fromVersion} para ${this.CURRENT_VERSION} não suportada`
      );
    }

    let migratedData = JSON.parse(JSON.stringify(data)); // Deep clone

    // Executar cada passo da migração
    for (const step of plan.steps) {
      try {
        console.log(`Executando migração: ${step.description}`);
        migratedData = step.execute(migratedData);

        // Validar se o passo foi bem-sucedido
        if (step.validate && !step.validate(migratedData)) {
          throw new Error(`Validação falhou para o passo: ${step.id}`);
        }
      } catch (error) {
        throw new Error(
          `Falha na migração no passo ${step.id}: ${(error as Error).message}`
        );
      }
    }

    // Adicionar histórico de migração
    if (!migratedData.metadata) {
      migratedData.metadata = {};
    }

    if (!migratedData.metadata.migrationHistory) {
      migratedData.metadata.migrationHistory = [];
    }

    migratedData.metadata.migrationHistory.push(
      `${fromVersion}->${this.CURRENT_VERSION} at ${new Date().toISOString()}`
    );

    return migratedData as PersistedData;
  }

  // Obter versão atual
  getCurrentVersion(): string {
    return this.CURRENT_VERSION;
  }

  // Validar estrutura de dados para versão específica
  validateDataStructure(data: any, version: string): boolean {
    switch (version) {
      case '2.0.0':
        return this.validateV2Structure(data);
      case '1.0.0':
        return this.validateV1Structure(data);
      default:
        return false;
    }
  }

  private validateV2Structure(data: any): boolean {
    return !!(
      data.columns &&
      Array.isArray(data.columns) &&
      data.tasks &&
      typeof data.tasks === 'object' &&
      data.settings &&
      data.settings.version
    );
  }

  private validateV1Structure(data: any): boolean {
    return !!(
      data.columns &&
      Array.isArray(data.columns) &&
      data.tasks &&
      data.settings
    );
  }
}

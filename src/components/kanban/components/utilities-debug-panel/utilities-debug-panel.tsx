// components/UtilitiesDebugPanel.tsx
/**
 * Painel de debug para visualizar estado dos utilitários
 */

import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Button,
  Space,
  Typography,
  Alert,
  Tag,
  Progress,
} from 'antd';
import { Bug, Download, Trash2, RefreshCw } from 'lucide-react';
import { KanbanColumn } from '../../types/kanban-column';
import { TasksState } from '../../types/kanban-state';
import { useKanbanUtilities } from '../../hooks/use-kanban-utilities';

const { TabPane } = Tabs;
const { Text } = Typography;

interface UtilitiesDebugPanelProps {
  columns: KanbanColumn[];
  tasks: TasksState;
  onExport: () => void;
  onCleanup: () => void;
  onValidate: () => void;
}

export default function UtilitiesDebugPanel({
  columns,
  tasks,
  onExport,
  onCleanup,
  onValidate,
}: UtilitiesDebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false);

  const utilities = useKanbanUtilities({ columns, tasks });

  if (!isVisible) {
    return (
      <Button
        icon={<Bug style={{ width: 16, height: 16 }} />}
        onClick={() => setIsVisible(true)}
        style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
      >
        Debug
      </Button>
    );
  }

  return (
    <Card
      title="Utilitários e Debug"
      extra={<Button onClick={() => setIsVisible(false)}>Fechar</Button>}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 500,
        maxHeight: 600,
        overflow: 'auto',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <Tabs size="small">
        <TabPane tab="Estado" key="status">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>Integridade dos Dados:</Text>
              <Tag color={utilities.dataIntegrity.isValid ? 'green' : 'red'}>
                {utilities.dataIntegrity.isValid ? 'OK' : 'Problemas'}
              </Tag>
            </div>

            {utilities.dataIntegrity.errors.length > 0 && (
              <Alert
                message="Erros Encontrados"
                description={utilities.dataIntegrity.errors.join(', ')}
                type="error"
              />
            )}

            {utilities.dataIntegrity.warnings.length > 0 && (
              <Alert
                message="Avisos"
                description={utilities.dataIntegrity.warnings.join(', ')}
                type="warning"
              />
            )}

            <div>
              <Text strong>Tarefas Órfãs:</Text>
              <Tag color={utilities.hasOrphans ? 'orange' : 'green'}>
                {utilities.findOrphans().length}
              </Tag>
            </div>
          </Space>
        </TabPane>

        <TabPane tab="Estatísticas" key="stats">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>
                Colunas: <strong>{utilities.boardStats.totalColumns}</strong>
              </Text>
            </div>
            <div>
              <Text>
                Tarefas: <strong>{utilities.boardStats.totalTasks}</strong>
              </Text>
            </div>
            <div>
              <Text>
                Média por Coluna:{' '}
                <strong>{utilities.boardStats.averageTasksPerColumn}</strong>
              </Text>
            </div>
            <div>
              <Text>
                Tarefas Atrasadas:{' '}
                <strong>{utilities.boardStats.overdueTasks}</strong>
              </Text>
            </div>
            <div>
              <Text>
                Tarefas Concluídas:{' '}
                <strong>{utilities.boardStats.completedTasks}</strong>
              </Text>
            </div>

            <div>
              <Text strong>Distribuição por Prioridade:</Text>
              {Object.entries(utilities.boardStats.tasksByPriority).map(
                ([priority, count]) => (
                  <div key={priority}>
                    <Text>
                      {priority}: {count}
                    </Text>
                    <Progress
                      percent={(count / utilities.boardStats.totalTasks) * 100}
                      size="small"
                      showInfo={false}
                    />
                  </div>
                )
              )}
            </div>
          </Space>
        </TabPane>

        <TabPane tab="Ações" key="actions">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              icon={<Download style={{ width: 16, height: 16 }} />}
              onClick={onExport}
              block
            >
              Exportar Dados
            </Button>

            <Button
              icon={<Trash2 style={{ width: 16, height: 16 }} />}
              onClick={onCleanup}
              block
            >
              Limpar Dados Inconsistentes
            </Button>

            <Button
              icon={<RefreshCw style={{ width: 16, height: 16 }} />}
              onClick={onValidate}
              block
            >
              Validar Integridade
            </Button>

            <Button
              onClick={() => {
                const backup = utilities.createBackup();
                console.log('Backup criado:', backup);
              }}
              block
            >
              Criar Backup
            </Button>
          </Space>
        </TabPane>
      </Tabs>
    </Card>
  );
}

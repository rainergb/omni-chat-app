// components/BoardConfigurationModal.tsx - Componente de configuração avançada
import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Form,
  Switch,
  InputNumber,
  Select,
  Button,
  Space,
  Divider,
  Typography,
  Popconfirm,
  Input,
} from 'antd';
import {
  Settings,
  Target,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import type {
  BoardConfiguration,
  ColumnTemplate,
} from '../../hooks/use-board-configuration';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface BoardConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  configuration: BoardConfiguration;
  onSave: (config: BoardConfiguration) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
  // Props opcionais para funcionalidades avançadas
  columns?: Array<{ id: string; title: string; taskCount?: number }>;
  onSetColumnWipLimit?: (columnId: string, limit: number) => void;
  onAddTemplate?: (template: Omit<ColumnTemplate, 'id'>) => void;
  onUpdateTemplate?: (id: string, updates: Partial<ColumnTemplate>) => void;
  onRemoveTemplate?: (id: string) => void;
}

export default function BoardConfigurationModal({
  isOpen,
  onClose,
  configuration,
  onSave,
  onExport,
  onImport,
  onReset,
  onAddTemplate,
  onUpdateTemplate,
  onRemoveTemplate,
}: BoardConfigurationModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSave(values);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      event.target.value = '';
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings style={{ width: 20, height: 20 }} />
          Configurações do Board
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="reset" onClick={onReset} danger>
          Resetar
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSave}
        >
          Salvar Configurações
        </Button>,
      ]}
    >
      <Tabs defaultActiveKey="general">
        <TabPane
          tab={
            <span>
              <Settings style={{ width: 16, height: 16, marginRight: 8 }} />
              Geral
            </span>
          }
          key="general"
        >
          <Form form={form} layout="vertical" initialValues={configuration}>
            <Form.Item
              name="autoSave"
              label="Salvamento Automático"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="showTaskCount"
              label="Mostrar Contador de Tarefas"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="compactMode"
              label="Modo Compacto"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="showCompletedTasks"
              label="Mostrar Tarefas Concluídas"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="enableNotifications"
              label="Habilitar Notificações"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item name="taskSortBy" label="Ordenar Tarefas Por">
              <Select>
                <Select.Option value="position">Posição</Select.Option>
                <Select.Option value="priority">Prioridade</Select.Option>
                <Select.Option value="dueDate">Data de Entrega</Select.Option>
                <Select.Option value="assignee">Responsável</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane
          tab={
            <span>
              <Target style={{ width: 16, height: 16, marginRight: 8 }} />
              WIP Limits
            </span>
          }
          key="wip"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="enableWipLimits"
              label="Habilitar Limites WIP"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="defaultWipLimit"
              label="Limite WIP Padrão"
              rules={[{ type: 'number', min: 1, max: 100 }]}
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <div
              style={{
                marginTop: 16,
                padding: 16,
                backgroundColor: '#f8fafc',
                borderRadius: 8,
              }}
            >
              <Text type="secondary">
                <strong>WIP (Work in Progress):</strong> Limite a quantidade de
                tarefas em cada coluna para melhorar o fluxo de trabalho e
                identificar gargalos.
              </Text>
            </div>
          </Form>
        </TabPane>

        <TabPane
          tab={
            <span>
              <Settings style={{ width: 16, height: 16, marginRight: 8 }} />
              Templates
            </span>
          }
          key="templates"
        >
          <div style={{ padding: 16 }}>
            <Title level={4}>Templates de Colunas</Title>
            <Text
              type="secondary"
              style={{ display: 'block', marginBottom: 16 }}
            >
              Gerencie templates pré-configurados para criar colunas rapidamente
            </Text>

            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<Plus style={{ width: 16, height: 16 }} />}
                onClick={() => {
                  if (onAddTemplate) {
                    onAddTemplate({
                      name: 'Nova Coluna',
                      title: 'Nova Coluna',
                      wipLimit: configuration.defaultWipLimit,
                      position: configuration.columnTemplates.length,
                    });
                  }
                }}
              >
                Adicionar Template
              </Button>
            </div>

            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {configuration.columnTemplates.map((template) => (
                <div
                  key={template.id}
                  style={{
                    padding: 12,
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    marginBottom: 8,
                    backgroundColor: '#fafafa',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {editingTemplate === template.id ? (
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Input
                            value={template.title}
                            onChange={(e) => {
                              if (onUpdateTemplate) {
                                onUpdateTemplate(template.id, {
                                  title: e.target.value,
                                  name: e.target.value,
                                });
                              }
                            }}
                            placeholder="Nome do template"
                          />
                          <InputNumber
                            value={template.wipLimit}
                            onChange={(value) => {
                              if (onUpdateTemplate && value) {
                                onUpdateTemplate(template.id, {
                                  wipLimit: value,
                                });
                              }
                            }}
                            placeholder="Limite WIP"
                            min={1}
                            max={100}
                            style={{ width: '100%' }}
                          />
                        </Space>
                      ) : (
                        <div>
                          <Text strong>{template.name}</Text>
                          {template.wipLimit && (
                            <Text type="secondary" style={{ marginLeft: 8 }}>
                              (WIP: {template.wipLimit})
                            </Text>
                          )}
                        </div>
                      )}
                    </div>
                    <Space>
                      <Button
                        size="small"
                        icon={<Edit style={{ width: 14, height: 14 }} />}
                        onClick={() => {
                          setEditingTemplate(
                            editingTemplate === template.id ? null : template.id
                          );
                        }}
                      >
                        {editingTemplate === template.id ? 'Salvar' : 'Editar'}
                      </Button>
                      <Popconfirm
                        title="Confirmar exclusão"
                        description="Tem certeza que deseja excluir este template?"
                        onConfirm={() => {
                          if (onRemoveTemplate) {
                            onRemoveTemplate(template.id);
                          }
                        }}
                        okText="Sim"
                        cancelText="Não"
                      >
                        <Button
                          size="small"
                          danger
                          icon={<Trash2 style={{ width: 14, height: 14 }} />}
                        >
                          Excluir
                        </Button>
                      </Popconfirm>
                    </Space>
                  </div>
                </div>
              ))}
            </div>

            {configuration.columnTemplates.length === 0 && (
              <div style={{ textAlign: 'center', padding: 24, color: '#666' }}>
                <Text type="secondary">Nenhum template configurado</Text>
              </div>
            )}
          </div>
        </TabPane>

        <TabPane
          tab={
            <span>
              <Download style={{ width: 16, height: 16, marginRight: 8 }} />
              Backup
            </span>
          }
          key="backup"
        >
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Title level={4}>Backup e Restauração</Title>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text>Exporte todas as configurações e dados do board</Text>
                <br />
                <Button
                  type="primary"
                  icon={<Download style={{ width: 16, height: 16 }} />}
                  onClick={onExport}
                  size="large"
                  style={{ marginTop: 8 }}
                >
                  Exportar Board
                </Button>
              </div>

              <Divider />

              <div>
                <Text>Importe configurações de um arquivo exportado</Text>
                <br />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="import-file"
                />
                <Button
                  icon={<Upload style={{ width: 16, height: 16 }} />}
                  onClick={() =>
                    document.getElementById('import-file')?.click()
                  }
                  size="large"
                  style={{ marginTop: 8 }}
                >
                  Importar Board
                </Button>
              </div>
            </Space>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
}

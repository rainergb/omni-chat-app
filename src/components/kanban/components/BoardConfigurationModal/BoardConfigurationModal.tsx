// components/BoardConfigurationModal/BoardConfigurationModal.tsx
import React from 'react';
import {
  Modal,
  Form,
  Switch,
  Select,
  InputNumber,
  Space,
  Button,
  Typography,
  Divider,
} from 'antd';
import { Download, Upload, RotateCcw, Settings } from 'lucide-react';

const { Title, Text } = Typography;
const { Option } = Select;

interface BoardConfiguration {
  autoSave: boolean;
  showTaskCount: boolean;
  enableWipLimits: boolean;
  defaultWipLimit: number;
  taskSortBy: 'position' | 'priority' | 'dueDate' | 'assignee';
  compactMode: boolean;
  showCompletedTasks: boolean;
  enableNotifications: boolean;
}

interface BoardConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  configuration: BoardConfiguration;
  onSave: (config: Partial<BoardConfiguration>) => void;
  onExport: () => void;
  onImport: (config: BoardConfiguration) => void;
  onReset: () => void;
}

export default function BoardConfigurationModal({
  isOpen,
  onClose,
  configuration,
  onSave,
  onExport,
  onImport,
  onReset,
}: BoardConfigurationModalProps) {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values);
      onClose();
    });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          onImport(imported);
        } catch (error) {
          console.error('Erro ao importar configuração:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <Settings size={20} />
          <span>Configurações do Board</span>
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Salvar Configurações
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={configuration}>
        <Title level={5}>Configurações Gerais</Title>

        <Form.Item name="autoSave" valuePropName="checked">
          <Switch checkedChildren="Ativado" unCheckedChildren="Desativado" />
          <Text style={{ marginLeft: 8 }}>Auto-salvamento</Text>
        </Form.Item>

        <Form.Item name="showTaskCount" valuePropName="checked">
          <Switch checkedChildren="Ativado" unCheckedChildren="Desativado" />
          <Text style={{ marginLeft: 8 }}>Mostrar contador de tarefas</Text>
        </Form.Item>

        <Form.Item name="compactMode" valuePropName="checked">
          <Switch checkedChildren="Ativado" unCheckedChildren="Desativado" />
          <Text style={{ marginLeft: 8 }}>Modo compacto</Text>
        </Form.Item>

        <Form.Item name="showCompletedTasks" valuePropName="checked">
          <Switch checkedChildren="Ativado" unCheckedChildren="Desativado" />
          <Text style={{ marginLeft: 8 }}>Mostrar tarefas concluídas</Text>
        </Form.Item>

        <Form.Item name="enableNotifications" valuePropName="checked">
          <Switch checkedChildren="Ativado" unCheckedChildren="Desativado" />
          <Text style={{ marginLeft: 8 }}>Notificações</Text>
        </Form.Item>

        <Divider />

        <Title level={5}>Limites WIP</Title>

        <Form.Item name="enableWipLimits" valuePropName="checked">
          <Switch checkedChildren="Ativado" unCheckedChildren="Desativado" />
          <Text style={{ marginLeft: 8 }}>Habilitar limites WIP</Text>
        </Form.Item>

        <Form.Item
          name="defaultWipLimit"
          label="Limite WIP padrão"
          rules={[{ required: true, message: 'Campo obrigatório' }]}
        >
          <InputNumber min={1} max={50} style={{ width: '100%' }} />
        </Form.Item>

        <Divider />

        <Title level={5}>Ordenação</Title>

        <Form.Item
          name="taskSortBy"
          label="Ordenar tarefas por"
          rules={[{ required: true, message: 'Campo obrigatório' }]}
        >
          <Select style={{ width: '100%' }}>
            <Option value="position">Posição</Option>
            <Option value="priority">Prioridade</Option>
            <Option value="dueDate">Data de Entrega</Option>
            <Option value="assignee">Responsável</Option>
          </Select>
        </Form.Item>

        <Divider />

        <Title level={5}>Backup & Restore</Title>

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button icon={<Download size={16} />} onClick={onExport}>
            Exportar Configuração
          </Button>

          <label>
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileImport}
            />
            <Button icon={<Upload size={16} />}>Importar Configuração</Button>
          </label>

          <Button icon={<RotateCcw size={16} />} onClick={onReset} danger>
            Resetar
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}

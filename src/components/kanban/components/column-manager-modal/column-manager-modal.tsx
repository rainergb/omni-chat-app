import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  ColorPicker,
  Space,
  Typography,
  Divider,
  Card,
  Row,
  Col,
} from 'antd';
import { Palette, Save, X, FileText } from 'lucide-react';
import { KanbanColumn } from '../../types/kanban-column';
import type { ColumnTemplate } from '../../hooks/use-board-configuration';

const { Text } = Typography;

interface ColumnManagerModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit' | null;
  column?: KanbanColumn;
  onClose: () => void;
  onSave: (data: { title: string; color?: string }) => void;
  onValidate: (title: string, excludeId?: string) => string | null;
  templates?: ColumnTemplate[];
  onApplyTemplate?: (template: ColumnTemplate) => void;
}

const predefinedColors = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cinza', value: '#6b7280' },
];

export default function ColumnManagerModal({
  isOpen,
  mode,
  column,
  onClose,
  onSave,
  onValidate,
  templates = [],
  onApplyTemplate,
}: ColumnManagerModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('#f8fafc');

  useEffect(() => {
    if (isOpen && mode === 'edit' && column) {
      const values = {
        title: column.title,
        color: column.color || '#f8fafc',
      };
      form.setFieldsValue(values);
      setSelectedColor(column.color || '#f8fafc');
    } else if (isOpen && mode === 'create') {
      form.resetFields();
      setSelectedColor('#f8fafc');
    }
  }, [isOpen, mode, column, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const validation = onValidate(values.title, column?.id);
      if (validation) {
        message.error(validation);
        return;
      }

      onSave({
        title: values.title,
        color: selectedColor !== '#f8fafc' ? selectedColor : undefined,
      });

      message.success(
        mode === 'create'
          ? 'Coluna criada com sucesso!'
          : 'Coluna atualizada com sucesso!'
      );
      onClose();
    } catch (error) {
      console.error('Erro ao salvar coluna:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    form.setFieldValue('color', color);
  };

  const handleCustomColorChange = (color: any) => {
    const hexColor = typeof color === 'string' ? color : color.toHexString();
    setSelectedColor(hexColor);
    form.setFieldValue('color', hexColor);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Palette style={{ width: 20, height: 20, color: '#6366f1' }} />
          {mode === 'create' ? 'Criar Nova Coluna' : 'Editar Coluna'}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={520}
      destroyOnHidden
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          icon={<X style={{ width: 16, height: 16 }} />}
        >
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          icon={<Save style={{ width: 16, height: 16 }} />}
        >
          {mode === 'create' ? 'Criar Coluna' : 'Salvar Alterações'}
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 24 }}>
        <Text type="secondary">
          {mode === 'create'
            ? 'Configure sua nova coluna com título e cor personalizados.'
            : 'Atualize as configurações desta coluna.'}
        </Text>
      </div>

      {mode === 'create' && templates.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <Text strong>
              <FileText style={{ width: 16, height: 16, marginRight: 8 }} />
              Templates Disponíveis
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Clique em um template para usar as configurações pré-definidas
            </Text>
          </div>

          <Row gutter={[8, 8]}>
            {templates.map((template) => (
              <Col span={12} key={template.id}>
                <Card
                  size="small"
                  hoverable
                  style={{
                    cursor: 'pointer',
                    border: '1px solid #e2e8f0',
                  }}
                  onClick={() => {
                    if (onApplyTemplate) {
                      form.setFieldsValue({
                        title: template.title,
                      });
                      setSelectedColor('#f8fafc');
                      onApplyTemplate(template);
                      message.success(`Template "${template.name}" aplicado!`);
                    }
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: 12 }}>
                      {template.name}
                    </Text>
                    {template.wipLimit && (
                      <div
                        style={{ fontSize: 11, color: '#666', marginTop: 4 }}
                      >
                        WIP: {template.wipLimit}
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Divider />
        </div>
      )}

      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="title"
          label={<Text strong>Título da Coluna</Text>}
          rules={[
            { required: true, message: 'Título é obrigatório' },
            { max: 50, message: 'Título deve ter no máximo 50 caracteres' },
            { min: 2, message: 'Título deve ter pelo menos 2 caracteres' },
          ]}
        >
          <Input
            placeholder="Ex: Fazendo, Revisão, Concluído..."
            size="large"
            showCount
            maxLength={50}
          />
        </Form.Item>

        <Divider />

        <div style={{ marginBottom: 16 }}>
          <Text strong>Cor da Coluna</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Escolha uma cor para destacar esta coluna no board
          </Text>
        </div>

        <div
          style={{
            marginBottom: 16,
            padding: 16,
            borderRadius: 8,
            backgroundColor: selectedColor,
            border: '1px solid #e2e8f0',
            textAlign: 'center',
          }}
        >
          <Text
            style={{
              color: selectedColor === '#f8fafc' ? '#374151' : '#ffffff',
              fontWeight: 600,
              textShadow:
                selectedColor !== '#f8fafc'
                  ? '0 1px 2px rgba(0,0,0,0.3)'
                  : 'none',
            }}
          >
            {form.getFieldValue('title') || 'Preview da Coluna'}
          </Text>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ marginBottom: 8, display: 'block' }}>
            Cores Sugeridas
          </Text>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={() => handleColorSelect('#f8fafc')}
              style={{
                width: '100%',
                height: 40,
                borderRadius: 6,
                border:
                  selectedColor === '#f8fafc'
                    ? '3px solid #6366f1'
                    : '2px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                color: '#6b7280',
                fontWeight: 500,
              }}
            >
              Padrão
            </button>

            {predefinedColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorSelect(color.value)}
                style={{
                  width: '100%',
                  height: 40,
                  borderRadius: 6,
                  border:
                    selectedColor === color.value
                      ? '3px solid #6366f1'
                      : '2px solid #e2e8f0',
                  backgroundColor: color.value,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space align="center">
            <Text strong>Cor Personalizada:</Text>
            <ColorPicker
              value={selectedColor}
              onChange={handleCustomColorChange}
              showText
              size="large"
            />
          </Space>
        </div>

        <Form.Item name="color" hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

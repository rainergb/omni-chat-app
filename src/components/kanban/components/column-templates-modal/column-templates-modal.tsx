// components/ColumnTemplatesModal.tsx - Novo componente
import React, { useState } from 'react';
import { Modal, Tabs, Input, Space } from 'antd';
import { Search, Layers } from 'lucide-react';
import ColumnTemplate from '../column-template/column-template';

const { TabPane } = Tabs;

const predefinedTemplates = [
  {
    id: 'scrum',
    name: 'Scrum Básico',
    description: 'Template clássico para metodologia Scrum',
    columns: [
      { title: 'Backlog', color: '#6b7280' },
      { title: 'Sprint Backlog', color: '#3b82f6' },
      { title: 'Em Desenvolvimento', color: '#eab308', wipLimit: 3 },
      { title: 'Em Revisão', color: '#f97316', wipLimit: 2 },
      { title: 'Testando', color: '#8b5cf6', wipLimit: 2 },
      { title: 'Concluído', color: '#10b981' },
    ],
    tags: ['Scrum', 'Desenvolvimento', 'Ágil'],
  },
  {
    id: 'kanban-simple',
    name: 'Kanban Simples',
    description: 'Fluxo simples para qualquer tipo de trabalho',
    columns: [
      { title: 'Para Fazer', color: '#6b7280' },
      { title: 'Fazendo', color: '#eab308', wipLimit: 5 },
      { title: 'Feito', color: '#10b981' },
    ],
    tags: ['Simples', 'Geral', 'Básico'],
  },
  {
    id: 'marketing',
    name: 'Marketing Digital',
    description: 'Fluxo otimizado para campanhas de marketing',
    columns: [
      { title: 'Ideias', color: '#8b5cf6' },
      { title: 'Planejamento', color: '#3b82f6' },
      { title: 'Criação', color: '#eab308', wipLimit: 3 },
      { title: 'Aprovação', color: '#f97316', wipLimit: 2 },
      { title: 'Publicação', color: '#ec4899' },
      { title: 'Análise', color: '#10b981' },
    ],
    tags: ['Marketing', 'Criativo', 'Campanhas'],
  },
  {
    id: 'support',
    name: 'Suporte ao Cliente',
    description: 'Gestão de tickets e solicitações de suporte',
    columns: [
      { title: 'Novos Tickets', color: '#ef4444' },
      { title: 'Em Análise', color: '#f97316', wipLimit: 5 },
      { title: 'Aguardando Cliente', color: '#eab308' },
      { title: 'Em Resolução', color: '#3b82f6', wipLimit: 3 },
      { title: 'Resolvido', color: '#10b981' },
    ],
    tags: ['Suporte', 'Tickets', 'Atendimento'],
  },
];

interface ColumnTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (templateId: string) => void;
}

export default function ColumnTemplatesModal({
  isOpen,
  onClose,
  onUseTemplate,
}: ColumnTemplatesModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customTemplates] = useState<any[]>([]); // Para templates salvos pelo usuário

  const filteredTemplates = predefinedTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleUseTemplate = (templateId: string) => {
    onUseTemplate(templateId);
    onClose();
  };

  const handleDuplicateTemplate = (templateId: string) => {
    // Lógica para duplicar template como customizado
    console.log('Duplicating template:', templateId);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers style={{ width: 20, height: 20 }} />
          Templates de Colunas
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Buscar templates por nome, descrição ou tags..."
          prefix={
            <Search style={{ width: 16, height: 16, color: '#6b7280' }} />
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="large"
        />
      </div>

      <Tabs defaultActiveKey="predefined">
        <TabPane tab="Templates Predefinidos" key="predefined">
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {filteredTemplates.map((template) => (
                <ColumnTemplate
                  key={template.id}
                  template={template}
                  onUse={handleUseTemplate}
                  onDuplicate={handleDuplicateTemplate}
                />
              ))}
            </Space>
          </div>
        </TabPane>

        <TabPane
          tab={`Meus Templates (${customTemplates.length})`}
          key="custom"
        >
          <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            <Layers style={{ width: 48, height: 48, margin: '0 auto 16px' }} />
            <p>Você ainda não tem templates personalizados.</p>
            <p>Duplique um template predefinido para começar.</p>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
}

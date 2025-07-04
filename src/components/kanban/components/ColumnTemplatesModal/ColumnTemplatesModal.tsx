// components/ColumnTemplatesModal/ColumnTemplatesModal.tsx
import React from 'react';
import { Modal, Card, Row, Col, Button, Typography, Space, Tag } from 'antd';
import { Copy, CheckCircle, Clock, AlertCircle, Archive } from 'lucide-react';

const { Title, Text } = Typography;

interface ColumnTemplate {
  id: string;
  name: string;
  description: string;
  columns: Array<{
    title: string;
    color: string;
    wipLimit?: number;
  }>;
  category: string;
  icon: React.ReactNode;
}

interface ColumnTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (templateId: string) => void;
}

const templates: ColumnTemplate[] = [
  {
    id: 'basic-kanban',
    name: 'Kanban Básico',
    description: 'Template simples com 3 colunas básicas',
    category: 'Básico',
    icon: <Copy size={16} />,
    columns: [
      { title: 'Para Fazer', color: '#f56565' },
      { title: 'Em Progresso', color: '#ed8936' },
      { title: 'Concluído', color: '#48bb78' },
    ],
  },
  {
    id: 'software-development',
    name: 'Desenvolvimento de Software',
    description: 'Template otimizado para desenvolvimento ágil',
    category: 'Desenvolvimento',
    icon: <CheckCircle size={16} />,
    columns: [
      { title: 'Backlog', color: '#718096' },
      { title: 'Em Desenvolvimento', color: '#3182ce' },
      { title: 'Code Review', color: '#ed8936' },
      { title: 'Testes', color: '#9f7aea' },
      { title: 'Deploy', color: '#48bb78' },
    ],
  },
  {
    id: 'marketing-campaign',
    name: 'Campanha de Marketing',
    description: 'Gestão de campanhas e conteúdo',
    category: 'Marketing',
    icon: <AlertCircle size={16} />,
    columns: [
      { title: 'Ideias', color: '#4299e1' },
      { title: 'Planejamento', color: '#ed8936' },
      { title: 'Produção', color: '#9f7aea' },
      { title: 'Revisão', color: '#f56565' },
      { title: 'Publicado', color: '#48bb78' },
    ],
  },
  {
    id: 'project-management',
    name: 'Gestão de Projetos',
    description: 'Template completo para gestão de projetos',
    category: 'Projetos',
    icon: <Clock size={16} />,
    columns: [
      { title: 'Solicitações', color: '#718096' },
      { title: 'Planejamento', color: '#4299e1' },
      { title: 'Em Execução', color: '#ed8936' },
      { title: 'Aguardando', color: '#9f7aea' },
      { title: 'Entregue', color: '#48bb78' },
      { title: 'Arquivado', color: '#2d3748' },
    ],
  },
];

export default function ColumnTemplatesModal({
  isOpen,
  onClose,
  onUseTemplate,
}: ColumnTemplatesModalProps) {
  const handleUseTemplate = (templateId: string) => {
    onUseTemplate(templateId);
    onClose();
  };

  const groupedTemplates = templates.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    },
    {} as Record<string, ColumnTemplate[]>
  );

  return (
    <Modal
      title={
        <Space>
          <Archive size={20} />
          <span>Templates de Colunas</span>
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          Fechar
        </Button>,
      ]}
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {Object.entries(groupedTemplates).map(
          ([category, categoryTemplates]) => (
            <div key={category} style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginBottom: 16 }}>
                {category}
              </Title>

              <Row gutter={[16, 16]}>
                {categoryTemplates.map((template) => (
                  <Col key={template.id} xs={24} sm={12} lg={8}>
                    <Card
                      hoverable
                      style={{ height: '100%' }}
                      actions={[
                        <Button
                          key="use"
                          type="primary"
                          size="small"
                          onClick={() => handleUseTemplate(template.id)}
                        >
                          Usar Template
                        </Button>,
                      ]}
                    >
                      <Card.Meta
                        avatar={template.icon}
                        title={template.name}
                        description={
                          <div>
                            <Text style={{ fontSize: 12, color: '#666' }}>
                              {template.description}
                            </Text>

                            <div style={{ marginTop: 12 }}>
                              <Text strong style={{ fontSize: 12 }}>
                                Colunas ({template.columns.length}):
                              </Text>
                              <div style={{ marginTop: 8 }}>
                                {template.columns.map((column, index) => (
                                  <Tag
                                    key={index}
                                    color={column.color}
                                    style={{
                                      marginBottom: 4,
                                      fontSize: 10,
                                      padding: '2px 6px',
                                    }}
                                  >
                                    {column.title}
                                  </Tag>
                                ))}
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )
        )}
      </div>
    </Modal>
  );
}

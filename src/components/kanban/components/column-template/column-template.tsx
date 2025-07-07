// components/ColumnTemplate.tsx - Novo componente
import React from 'react';
import { Card, Button, Space, Tag, Typography } from 'antd';
import { Plus, Copy } from 'lucide-react';

const { Text, Title } = Typography;

interface ColumnTemplateProps {
  template: {
    id: string;
    name: string;
    description: string;
    columns: Array<{
      title: string;
      color: string;
      wipLimit?: number;
    }>;
    tags: string[];
  };
  onUse: (templateId: string) => void;
  onDuplicate: (templateId: string) => void;
}

export default function ColumnTemplate({
  template,
  onUse,
  onDuplicate,
}: ColumnTemplateProps) {
  return (
    <Card
      size="small"
      style={{ marginBottom: 16 }}
      actions={[
        <Button
          key="use"
          type="primary"
          icon={<Plus style={{ width: 14, height: 14 }} />}
          onClick={() => onUse(template.id)}
        >
          Usar Template
        </Button>,
        <Button
          key="duplicate"
          icon={<Copy style={{ width: 14, height: 14 }} />}
          onClick={() => onDuplicate(template.id)}
        >
          Duplicar
        </Button>,
      ]}
    >
      <div>
        <Title level={5} style={{ margin: 0, marginBottom: 8 }}>
          {template.name}
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {template.description}
        </Text>

        <div style={{ margin: '12px 0' }}>
          <Space size={4} wrap>
            {template.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </div>

        <div style={{ marginTop: 12 }}>
          <Text strong style={{ fontSize: 12 }}>
            Colunas ({template.columns.length}):
          </Text>
          <div
            style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}
          >
            {template.columns.slice(0, 4).map((col, index) => (
              <div
                key={index}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  backgroundColor: col.color,
                  border: '1px solid #e2e8f0',
                }}
                title={col.title}
              />
            ))}
            {template.columns.length > 4 && (
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: '#6b7280',
                }}
              >
                +{template.columns.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

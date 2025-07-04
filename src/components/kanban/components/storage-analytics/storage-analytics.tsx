// components/StorageAnalytics.tsx
/**
 * Análise de uso de armazenamento
 */

import React from 'react';
import { Card, Progress, Space, Typography, Row, Col, Tooltip } from 'antd';
import { Database, HardDrive, Archive } from 'lucide-react';

const { Text } = Typography;

interface StorageAnalyticsProps {
  stats: {
    main: number;
    backups: number;
    total: number;
  };
}

export default function StorageAnalytics({ stats }: StorageAnalyticsProps) {
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const maxStorage = 5 * 1024 * 1024; // 5MB como limite sugerido para localStorage
  const usagePercentage = (stats.total / maxStorage) * 100;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Row gutter={16}>
        <Col span={8}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Database
                style={{
                  width: 24,
                  height: 24,
                  color: '#1890ff',
                  marginBottom: 8,
                }}
              />
              <div>
                <Text strong>{formatSize(stats.main)}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Dados Principais
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Archive
                style={{
                  width: 24,
                  height: 24,
                  color: '#52c41a',
                  marginBottom: 8,
                }}
              />
              <div>
                <Text strong>{formatSize(stats.backups)}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Backups
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <HardDrive
                style={{
                  width: 24,
                  height: 24,
                  color: '#fa8c16',
                  marginBottom: 8,
                }}
              />
              <div>
                <Text strong>{formatSize(stats.total)}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Total
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text>Uso do LocalStorage</Text>
          <Text>{usagePercentage.toFixed(1)}%</Text>
        </div>

        <Tooltip
          title={`${formatSize(stats.total)} de ${formatSize(maxStorage)} utilizados`}
        >
          <Progress
            percent={Math.min(usagePercentage, 100)}
            status={
              usagePercentage > 80
                ? 'exception'
                : usagePercentage > 60
                  ? 'active'
                  : 'success'
            }
            size="small"
          />
        </Tooltip>

        {usagePercentage > 80 && (
          <Text type="warning" style={{ fontSize: 12 }}>
            ⚠️ Uso elevado de armazenamento. Considere limpar backups antigos.
          </Text>
        )}
      </div>

      <div style={{ background: '#f0f2f5', padding: 12, borderRadius: 6 }}>
        <Text style={{ fontSize: 12 }}>
          <strong>Dica:</strong> O localStorage tem limite de ~5-10MB por
          domínio. Para boards grandes, considere exportar dados regularmente.
        </Text>
      </div>
    </Space>
  );
}

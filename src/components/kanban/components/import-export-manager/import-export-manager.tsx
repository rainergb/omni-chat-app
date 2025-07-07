// components/ImportExportManager.tsx
/**
 * Gerenciador de import/export
 */

import React, { useState } from 'react';
import {
  Button,
  Space,
  Upload,
  Alert,
  Typography,
  Card,
  Select,
  Divider,
  message,
} from 'antd';
import { Download, Upload as UploadIcon, Share2 } from 'lucide-react';
import { PersistedData } from '../../types/persistence';

const { Text } = Typography;
const { Dragger } = Upload;

interface ImportExportManagerProps {
  persistence: any;
  currentData: PersistedData;
  onDataImport: (data: PersistedData) => void;
}

export default function ImportExportManager({
  persistence,
  currentData,
  onDataImport,
}: ImportExportManagerProps) {
  const [exportFormat, setExportFormat] = useState<
    'complete' | 'data-only' | 'backup'
  >('complete');
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    try {
      let exportData: string;
      let filename: string;

      switch (exportFormat) {
        case 'complete':
          exportData = await persistence.exportData();
          filename = `kanban-complete-${new Date().toISOString().split('T')[0]}.json`;
          break;

        case 'data-only':
          exportData = JSON.stringify(
            {
              columns: currentData.columns,
              tasks: currentData.tasks,
              exportedAt: new Date().toISOString(),
            },
            null,
            2
          );
          filename = `kanban-data-${new Date().toISOString().split('T')[0]}.json`;
          break;

        case 'backup':
          exportData = JSON.stringify(currentData, null, 2);
          filename = `kanban-backup-${new Date().toISOString().split('T')[0]}.json`;
          break;

        default:
          return;
      }

      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  const handleImport = async (file: File) => {
    setImporting(true);

    try {
      const text = await file.text();
      const importedData = JSON.parse(text);

      // Verificar formato dos dados
      if (importedData.mainData && importedData.backups) {
        // Formato completo de exportação
        await persistence.importData(text);
      } else if (importedData.columns && importedData.tasks) {
        // Formato de dados ou backup
        const restoredData: PersistedData = {
          columns: importedData.columns,
          tasks: importedData.tasks,
          settings: {
            version: '2.0.0',
            lastUpdated: new Date().toISOString(),
            createdAt:
              importedData.settings?.createdAt || new Date().toISOString(),
            totalSaves: 0,
            boardId: importedData.settings?.boardId || `board-${Date.now()}`,
            boardName: importedData.settings?.boardName,
          },
          metadata: {
            importedAt: new Date().toISOString(),
            originalVersion: importedData.settings?.version,
          },
        };

        onDataImport(restoredData);
      } else {
        throw new Error('Formato de arquivo não reconhecido');
      }

      message.success('Dados importados com sucesso!');
    } catch (error) {
      console.error('Erro ao importar:', error);
      message.error('Erro ao importar dados: ' + (error as Error).message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Exportação */}
      <Card title="Exportar Dados" size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Formato de Exportação:</Text>
            <Select
              value={exportFormat}
              onChange={setExportFormat}
              style={{ width: '100%', marginTop: 8 }}
              options={[
                {
                  label: 'Completo (dados + backups + configurações)',
                  value: 'complete',
                },
                {
                  label: 'Apenas dados (colunas + tarefas)',
                  value: 'data-only',
                },
                {
                  label: 'Backup (dados + metadados)',
                  value: 'backup',
                },
              ]}
            />
          </div>

          <Alert
            message="Informações sobre os Formatos"
            description={
              exportFormat === 'complete'
                ? 'Inclui todos os dados, backups e configurações. Ideal para migração completa.'
                : exportFormat === 'data-only'
                  ? 'Inclui apenas colunas e tarefas. Ideal para compartilhamento.'
                  : 'Inclui dados e metadados. Ideal para backup pessoal.'
            }
            type="info"
          />

          <Button
            type="primary"
            icon={<Download style={{ width: 16, height: 16 }} />}
            onClick={handleExport}
            block
          >
            Exportar{' '}
            {exportFormat === 'complete'
              ? 'Completo'
              : exportFormat === 'data-only'
                ? 'Dados'
                : 'Backup'}
          </Button>
        </Space>
      </Card>

      <Divider />

      {/* Importação */}
      <Card title="Importar Dados" size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="Atenção"
            description="A importação irá substituir todos os dados atuais. Recomendamos criar um backup antes de prosseguir."
            type="warning"
            showIcon
          />

          <Dragger
            accept=".json"
            showUploadList={false}
            beforeUpload={(file) => {
              handleImport(file);
              return false; // Evitar upload automático
            }}
            disabled={importing}
          >
            <div style={{ padding: 20 }}>
              <UploadIcon
                style={{
                  fontSize: 48,
                  color: '#1890ff',
                  margin: '0 auto 16px',
                  display: 'block',
                }}
              />
              <Text strong>Clique ou arraste um arquivo JSON aqui</Text>
              <br />
              <Text type="secondary">
                Suporta formatos: exportação completa, dados apenas, ou backup
              </Text>
            </div>
          </Dragger>

          {importing && (
            <Alert
              message="Importando dados..."
              description="Por favor, aguarde enquanto os dados são processados."
              type="info"
            />
          )}
        </Space>
      </Card>

      {/* Compartilhamento */}
      <Card title="Compartilhamento" size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            Para compartilhar seu board com outros usuários, exporte no formato
            Apenas dados e envie o arquivo JSON.
          </Text>

          <Button
            icon={<Share2 style={{ width: 16, height: 16 }} />}
            onClick={() => {
              setExportFormat('data-only');
              setTimeout(handleExport, 100);
            }}
          >
            Exportar para Compartilhamento
          </Button>

          <Alert
            message="Dica de Segurança"
            description="Dados exportados podem conter informações sensíveis. Revise antes de compartilhar."
            type="info"
          />
        </Space>
      </Card>
    </Space>
  );
}

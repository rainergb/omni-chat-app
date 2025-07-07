// components/PersistenceManager.tsx
/**
 * Componente principal para gerenciar persistência
 */

import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Card,
  Button,
  Space,
  Typography,
  Switch,
  InputNumber,
  Alert,
  Tag,
} from 'antd';
import { Save, Download, Database, Shield, Settings } from 'lucide-react';
import { useDataPersistence } from '../../hooks/use-data-persistence';
import { PersistedData } from '../../types/persistence';
import BackupManager from '../backup-manager/backup-manager';
import ImportExportManager from '../import-export-manager/import-export-manager';
import StorageAnalytics from '../storage-analytics/storage-analytics';

const { TabPane } = Tabs;
const { Text } = Typography;

interface PersistenceManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: PersistedData;
  onDataRestore: (data: PersistedData) => void;
}

export default function PersistenceManager({
  isOpen,
  onClose,
  currentData,
  onDataRestore,
}: PersistenceManagerProps) {
  const [activeTab, setActiveTab] = useState('settings');

  const persistence = useDataPersistence({
    autoSaveInterval: 30000,
    maxBackups: 10,
    onSaveSuccess: () => console.log('Dados salvos com sucesso'),
    onSaveError: (error) => console.error('Erro ao salvar:', error),
    onMigrationNeeded: (from, to) =>
      console.log(`Migração necessária: ${from} → ${to}`),
    onMigrationComplete: (from, to) =>
      console.log(`Migração concluída: ${from} → ${to}`),
  });

  const [config, setConfig] = useState({
    autoSave: persistence.autoSaveEnabled || false,
    autoSaveInterval: 30,
    maxBackups: 10,
    compressionEnabled: false,
  });

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));

    if (key === 'autoSave') {
      persistence.setAutoSaveEnabled(value);
    }
  };

  const handleManualSave = async () => {
    try {
      await persistence.save(currentData);
    } catch (error) {
      console.error('Erro no salvamento manual:', error);
    }
  };

  const storageStats = persistence.getStorageStats();

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Database style={{ width: 20, height: 20 }} />
          Gerenciador de Persistência
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={null}
      destroyOnHidden
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Configurações */}
        <TabPane
          tab={
            <span>
              <Settings style={{ width: 16, height: 16, marginRight: 8 }} />
              Configurações
            </span>
          }
          key="settings"
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            {/* Status atual */}
            <Card size="small">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <Text strong>Status da Persistência</Text>
                  <br />
                  <Text type="secondary">
                    Última salvação:{" "}
                    {persistence.lastSaved?.toLocaleString() || "Nunca"}
                  </Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {persistence.isSaving && <Tag color="blue">Salvando...</Tag>}
                  {persistence.autoSaveEnabled && (
                    <Tag color="green">Auto-save Ativo</Tag>
                  )}
                  <Button
                    type="primary"
                    icon={<Save style={{ width: 16, height: 16 }} />}
                    onClick={handleManualSave}
                    loading={persistence.isSaving}
                  >
                    Salvar Agora
                  </Button>
                </div>
              </div>
            </Card>

            {/* Configurações de Auto-save */}
            <Card title="Salvamento Automático" size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Text>Habilitar auto-save</Text>
                  <Switch
                    checked={config.autoSave}
                    onChange={(checked) =>
                      handleConfigChange("autoSave", checked)
                    }
                  />
                </div>

                {config.autoSave && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Text>Intervalo (segundos)</Text>
                    <InputNumber
                      min={10}
                      max={300}
                      value={config.autoSaveInterval}
                      onChange={(value) =>
                        handleConfigChange("autoSaveInterval", value)
                      }
                      style={{ width: 100 }}
                    />
                  </div>
                )}

                <Alert
                  message="Auto-save Inteligente"
                  description="O sistema salva automaticamente apenas quando há mudanças, evitando salvamentos desnecessários."
                  type="info"
                />
              </Space>
            </Card>

            {/* Configurações de Backup */}
            <Card title="Backup e Versionamento" size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Text>Máximo de backups</Text>
                  <InputNumber
                    min={1}
                    max={50}
                    value={config.maxBackups}
                    onChange={(value) =>
                      handleConfigChange("maxBackups", value)
                    }
                    style={{ width: 100 }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Text>Compressão (experimental)</Text>
                  <Switch
                    checked={config.compressionEnabled}
                    onChange={(checked) =>
                      handleConfigChange("compressionEnabled", checked)
                    }
                    disabled
                  />
                </div>

                <Alert
                  message="Versionamento Automático"
                  description="Cada salvamento cria automaticamente um backup versionado para permitir recuperação."
                  type="success"
                />
              </Space>
            </Card>

            {/* Informações de armazenamento */}
            <Card title="Uso de Armazenamento" size="small">
              <StorageAnalytics stats={storageStats} />
            </Card>
          </Space>
        </TabPane>

        {/* Backups */}
        <TabPane
          tab={
            <span>
              <Shield style={{ width: 16, height: 16, marginRight: 8 }} />
              Backups
            </span>
          }
          key="backups"
        >
          <BackupManager
            persistence={persistence}
            currentData={currentData}
            onDataRestore={onDataRestore}
          />
        </TabPane>

        {/* Import/Export */}
        <TabPane
          tab={
            <span>
              <Download style={{ width: 16, height: 16, marginRight: 8 }} />
              Import/Export
            </span>
          }
          key="import-export"
        >
          <ImportExportManager
            persistence={persistence}
            currentData={currentData}
            onDataImport={onDataRestore}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
}

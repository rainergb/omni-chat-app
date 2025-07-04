// components/BackupManager.tsx
/**
 * Gerenciador de backups
 */

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Typography,
  Tag,
  Tooltip,
  message,
} from 'antd';
import { Download, Upload, Plus } from 'lucide-react';
import { PersistedData } from '../../types/persistence';

const { Text } = Typography;

interface BackupEntry {
  id: string;
  timestamp: string;
  label?: string;
  size: number;
  checksum: string;
  data: PersistedData;
}

interface BackupManagerProps {
  persistence: any;
  currentData: PersistedData;
  onDataRestore: (data: PersistedData) => void;
}

export default function BackupManager({
  persistence,
  currentData,
  onDataRestore,
}: BackupManagerProps) {
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [createBackupModal, setCreateBackupModal] = useState(false);
  const [backupLabel, setBackupLabel] = useState('');
  const [restoreModal, setRestoreModal] = useState<BackupEntry | null>(null);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    setLoading(true);
    try {
      const backupList = await persistence.getBackups();
      setBackups(
        backupList.sort(
          (a: BackupEntry, b: BackupEntry) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
      );
    } catch {
      message.error('Erro ao carregar backups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      await persistence.createBackup(currentData, backupLabel || undefined);
      message.success('Backup criado com sucesso!');
      setCreateBackupModal(false);
      setBackupLabel('');
      loadBackups();
    } catch {
      message.error('Erro ao criar backup');
    }
  };

  const handleRestoreBackup = async (backup: BackupEntry) => {
    try {
      const restoredData = await persistence.restoreFromBackup(backup.id);
      onDataRestore(restoredData);
      message.success('Backup restaurado com sucesso!');
      setRestoreModal(null);
    } catch {
      message.error('Erro ao restaurar backup');
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const columns = [
    {
      title: 'Data/Hora',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => (
        <div>
          <Text>{new Date(timestamp).toLocaleDateString()}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {new Date(timestamp).toLocaleTimeString()}
          </Text>
        </div>
      ),
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
      render: (label: string, record: BackupEntry) => (
        <div>
          {label ? (
            <Tag color="blue">{label}</Tag>
          ) : (
            <Text type="secondary">Auto-backup</Text>
          )}
          <br />
          <Text style={{ fontSize: 11, color: '#999' }}>ID: {record.id}</Text>
        </div>
      ),
    },
    {
      title: 'Tamanho',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatSize(size),
    },
    {
      title: 'Integridade',
      key: 'integrity',
      render: (record: BackupEntry) => (
        <Tag color="green">
          <span style={{ fontSize: 10 }}>
            ✓ {record.checksum.substring(0, 8)}
          </span>
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: BackupEntry) => (
        <Space>
          <Tooltip title="Restaurar backup">
            <Button
              size="small"
              icon={<Upload style={{ width: 14, height: 14 }} />}
              onClick={() => setRestoreModal(record)}
            />
          </Tooltip>
          <Tooltip title="Download backup">
            <Button
              size="small"
              icon={<Download style={{ width: 14, height: 14 }} />}
              onClick={() => {
                const dataStr = JSON.stringify(record.data, null, 2);
                const dataBlob = new Blob([dataStr], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `backup-${record.id}-${new Date(record.timestamp).toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Text strong>Backups Disponíveis ({backups.length})</Text>
          <br />
          <Text type="secondary">
            Os backups são criados automaticamente e preservam o estado completo
            do board.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<Plus style={{ width: 16, height: 16 }} />}
          onClick={() => setCreateBackupModal(true)}
        >
          Criar Backup
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={backups}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        size="small"
      />

      {/* Modal para criar backup */}
      <Modal
        title="Criar Backup Manual"
        open={createBackupModal}
        onOk={handleCreateBackup}
        onCancel={() => {
          setCreateBackupModal(false);
          setBackupLabel('');
        }}
        okText="Criar Backup"
        cancelText="Cancelar"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            Crie um backup manual do estado atual do board. Você pode adicionar
            uma descrição para facilitar a identificação.
          </Text>
          <Input
            placeholder="Descrição do backup (opcional)"
            value={backupLabel}
            onChange={(e) => setBackupLabel(e.target.value)}
            maxLength={50}
          />
        </Space>
      </Modal>

      {/* Modal para confirmar restauração */}
      <Modal
        title="Restaurar Backup"
        open={!!restoreModal}
        onOk={() => restoreModal && handleRestoreBackup(restoreModal)}
        onCancel={() => setRestoreModal(null)}
        okText="Restaurar"
        cancelText="Cancelar"
        okType="danger"
      >
        {restoreModal && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>
              Tem certeza que deseja restaurar este backup?
              <strong> Esta ação irá substituir todos os dados atuais.</strong>
            </Text>

            <div
              style={{ background: '#f5f5f5', padding: 12, borderRadius: 6 }}
            >
              <Text strong>Detalhes do Backup:</Text>
              <br />
              <Text>
                Data: {new Date(restoreModal.timestamp).toLocaleString()}
              </Text>
              <br />
              <Text>Label: {restoreModal.label || 'Auto-backup'}</Text>
              <br />
              <Text>Tamanho: {formatSize(restoreModal.size)}</Text>
            </div>

            <Text type="warning">
              ⚠️ Recomendamos criar um backup atual antes de prosseguir.
            </Text>
          </Space>
        )}
      </Modal>
    </div>
  );
}

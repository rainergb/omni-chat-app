'use client';

import { useCallback, useState, useMemo } from 'react';
import { Button, Space, FloatButton, DatePicker, Select, message } from 'antd';
import { Database, Save, Settings } from 'lucide-react';
import locale from 'antd/lib/date-picker/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useSelector } from 'react-redux';

import { useKanbanWithPersistence } from './hooks/use-kanban-with-persistence';
import PersistenceStatusIndicator from './components/persistence-status-indicator/persistence-status-indicator';
import ConfirmationModal from './components/ui/confirmation-modal';
import { useConfirmation } from './hooks/use-confirmation';
import { useBoardConfiguration } from './hooks/use-board-configuration';
import { useColumnCollapse } from './hooks/use-column-collapse';
import { useResponsive, useAutoCollapseOnMobile } from './hooks/use-responsive';

import TaskManagerModal from '../components/TaskManager/modals/TaskManagerModal';
import DroppableBoard from './components/droppable-board/droppable-board';
import ColumnManagerModal from './components/column-manager-modal';
import DeleteColumnModal from './components/delete-column-modal';
import BoardHeader from './components/board-header/board-header';
import BoardConfigurationModal from './components/board-configuration-modal/board-configuration-modal';
import ColumnTemplatesModal from './components/ColumnTemplatesModal/ColumnTemplatesModal';

import { useCreateTaskModal } from './hooks/use-create-task.modal';
import { useEditTaskModal } from './hooks/use-edit-task.modal';
import { useColumnModal } from './hooks/use-column-modal';
import { useDragHandlers } from './hooks/use-drag-handlers';
import { useKanbanUtilities } from './hooks/use-kanban-utilities';

import { mapTaskToModalTaskData } from './kanban.mocks';
import { RootState } from '@/store';

import {
  MainContainer,
  HeaderContainer,
  ContentContainer,
  FiltersContainer,
  FilterSelect,
  EmptyState,
  EmptyStateText,
  FooterContainer,
} from './KanbanPage.styles';
import PersistenceManager from './components/persistance-manager/persistance-manager';

dayjs.locale('pt-br');

// Componente de Debug temporário
const DebugPanel = ({ columns, tasks, utilities, kanban }: any) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <Button
        icon={<Database style={{ width: 16, height: 16 }} />}
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          zIndex: 1000,
          backgroundColor: '#ff4d4f',
          borderColor: '#ff4d4f',
          color: 'white',
        }}
        size="small"
      >
        Debug State
      </Button>
    );
  }

  const debugInfo = {
    kanbanInitialized: kanban?.isInitialized,
    columnsManager: {
      exists: !!columns,
      columnsCount: columns?.columns?.length || 0,
      columns:
        columns?.columns?.map((col: any) => ({
          id: col.id,
          title: col.title,
        })) || [],
    },
    utilities: {
      exists: !!utilities,
      sortedColumns: utilities?.sortedColumns?.length || 0,
      sortedColumnsData:
        utilities?.sortedColumns?.map((col: any) => ({
          id: col.id,
          title: col.title,
        })) || [],
    },
    tasksManager: {
      exists: !!tasks,
      addTaskExists: !!tasks?.addTask,
      tasksData: tasks?.tasks || {},
    },
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 350,
        maxHeight: 400,
        overflow: 'auto',
        zIndex: 1000,
        backgroundColor: 'white',
        border: '1px solid #d9d9d9',
        borderRadius: 6,
        padding: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <div
        style={{
          marginBottom: 12,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <strong>Debug Panel</strong>
        <Button size="small" onClick={() => setIsVisible(false)}>
          ×
        </Button>
      </div>

      <div style={{ fontSize: 12, lineHeight: 1.4 }}>
        <div>
          <strong>Kanban Inicializado:</strong>{' '}
          {kanban?.isInitialized ? '✅' : '❌'}
        </div>
        <div>
          <strong>Columns Manager:</strong>{' '}
          {debugInfo.columnsManager.exists ? '✅' : '❌'}
        </div>
        <div>
          <strong>Tasks Manager:</strong>{' '}
          {debugInfo.tasksManager.exists ? '✅' : '❌'}
        </div>
        <div>
          <strong>AddTask Method:</strong>{' '}
          {debugInfo.tasksManager.addTaskExists ? '✅' : '❌'}
        </div>
        <div>
          <strong>Utilities:</strong> {debugInfo.utilities.exists ? '✅' : '❌'}
        </div>
        <br />
        <div>
          <strong>Total Colunas:</strong>{' '}
          {debugInfo.columnsManager.columnsCount}
        </div>
        <div>
          <strong>Total Sorted:</strong> {debugInfo.utilities.sortedColumns}
        </div>
        <br />
        <div>
          <strong>Colunas:</strong>
        </div>
        {debugInfo.columnsManager.columns.map((col: any, i: number) => (
          <div key={i} style={{ paddingLeft: 8 }}>
            • {col.title}
          </div>
        ))}
        <br />
        <div>
          <strong>Sorted Columns:</strong>
        </div>
        {debugInfo.utilities.sortedColumnsData.map((col: any, i: number) => (
          <div key={i} style={{ paddingLeft: 8 }}>
            • {col.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function KanbanPage() {
  const [persistenceModalOpen, setPersistenceModalOpen] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const confirmationHook = useConfirmation();

  const kanban = useKanbanWithPersistence({
    storageKey: 'kanban-production-v2',
    autoSave: true,
    autoSaveInterval: 15000,
    loadOnMount: true,
    onLoadError: (error) => {
      setHasErrors(true);
      console.error('Erro ao carregar dados:', error);
    },
    onSaveError: (error) => {
      setHasErrors(true);
      console.error('Erro ao salvar dados:', error);
    },
    onMigrationStart: (from, to) => {
      console.log(`Iniciando migração: ${from} → ${to}`);
    },
    onMigrationComplete: (from, to) => {
      console.log(`Migração concluída: ${from} → ${to}`);
      setHasErrors(false);
    },
  });

  const utilities = useKanbanUtilities({
    columns: kanban.columns?.columns || [],
    tasks: kanban.tasks?.tasks || [],
    validationConfig: {
      columnTitleMaxLength: 30,
      maxColumnsPerBoard: 15,
      allowSpecialChars: true,
    },
  });

  const {
    config,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
    getColumnWipLimit,
  } = useBoardConfiguration();

  const responsive = useResponsive();
  const {
    collapsedColumns,
    toggleColumnCollapse,
    collapseAll,
    expandAll,
    getCollapsedCount,
  } = useColumnCollapse();

  const columnIds = useMemo(
    () => (kanban.columns?.columns || []).map((col) => col.id),
    [kanban.columns?.columns]
  );

  useAutoCollapseOnMobile(columnIds, collapseAll, expandAll);

  const {
    isOpen: isTaskOpen,
    close: closeTask,
    open: openTask,
  } = useCreateTaskModal();

  const { isOpen: isEditOpen, close: closeEdit } = useEditTaskModal();

  const {
    isOpen: isColumnOpen,
    mode,
    columnId,
    openCreate,
    openEdit: openColumnEdit,
    close: closeColumn,
  } = useColumnModal();

  const [deleteColumnData, setDeleteColumnData] = useState<{
    columnId: string;
    title: string;
  } | null>(null);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { isMenuCollapsed } = useSelector((state: RootState) => state.general);

  const { columns, tasks, board } = kanban;

  const { onDragEnd } = useDragHandlers({
    columns: columns?.columns || [],
    tasks: tasks?.tasks || [],
    reorderColumns: columns?.reorderColumns || (() => {}),
    moveTask: tasks?.moveTask || (() => {}),
    updateTaskPositions: tasks?.updateTaskPositions || (() => {}),
    onChange: (updatedTasks) => {
      console.log('Tasks updated:', updatedTasks);
    },
  });

  const handleColumnSave = useCallback(
    async (data: { title: string; color?: string }) => {
      try {
        const validation = utilities.validateColumnTitle(data.title);
        if (!validation.isValid) {
          message.error(validation.errors.join(', '));
          return;
        }

        const boardValidation = utilities.validateBoardLimits();
        if (!boardValidation.isValid) {
          message.error(boardValidation.errors.join(', '));
          return;
        }

        if (mode === 'create') {
          const columnWithId = {
            ...data,
            id: utilities.createUniqueColumnId(),
          };
          kanban.addColumnWithTasks?.(columnWithId);
          message.success('Coluna criada com sucesso!');
        } else if (mode === 'edit' && columnId) {
          columns?.updateColumn(columnId, data);
          message.success('Coluna atualizada com sucesso!');
        }

        if (validation.warnings && validation.warnings.length > 0) {
          message.warning(validation.warnings.join(', '));
        }

        closeColumn();
      } catch (error) {
        message.error(
          error instanceof Error ? error.message : 'Erro ao salvar coluna'
        );
      }
    },
    [mode, columnId, kanban, columns, closeColumn, utilities]
  );

  const handleDeleteColumnClick = useCallback(
    (colId: string) => {
      const column = columns?.getColumnById(colId);
      if (column) {
        confirmationHook.confirmDelete(
          'Confirmar exclusão',
          <div>
            <p>
              Tem certeza que deseja excluir a coluna
              <strong>{column.title}</strong>?
            </p>
            <p style={{ color: '#ff4d4f', fontSize: '12px' }}>
              Esta ação não pode ser desfeita.
            </p>
          </div>,
          () => setDeleteColumnData({ columnId: colId, title: column.title })
        );
      }
    },
    [columns, confirmationHook]
  );

  const handleDeleteColumnConfirm = useCallback(
    async (moveTasksToColumnId?: string) => {
      if (!deleteColumnData) return;

      try {
        kanban.deleteColumnWithTasks?.(
          deleteColumnData.columnId,
          moveTasksToColumnId
        );
        setDeleteColumnData(null);
        message.success('Coluna deletada com sucesso!');
      } catch (error) {
        message.error(
          error instanceof Error ? error.message : 'Erro ao deletar coluna'
        );
      }
    },
    [deleteColumnData, kanban]
  );

  const handleDuplicateColumn = useCallback(
    (column: any) => {
      try {
        kanban.addColumnWithTasks?.({
          title: `${column.title} (Cópia)`,
          color: column.color,
          isDefault: false,
        });
        message.success('Coluna duplicada com sucesso!');
      } catch (error) {
        message.error(
          error instanceof Error ? error.message : 'Erro ao duplicar coluna'
        );
      }
    },
    [kanban]
  );

  const handleTaskSave = useCallback(
    (taskData: any) => {
      try {
        console.log('Salvando tarefa:', { taskData, isEditOpen, isTaskOpen });
        console.log('Colunas disponíveis:', {
          utilitiesSorted: utilities.sortedColumns,
          columnsData: columns?.columns,
          totalColumns: board?.totalColumns,
        });

        if (isEditOpen) {
          // Para edição, manter a validação normal
          const validation = utilities.validateTask(taskData);
          if (!validation.isValid) {
            message.error(validation.errors.join(', '));
            return;
          }

          tasks?.updateTask(isEditOpen, taskData);
          message.success('Tarefa atualizada com sucesso!');

          if (validation.warnings && validation.warnings.length > 0) {
            message.warning(validation.warnings.join(', '));
          }
        } else {
          // Para criação, validar primeiro sem columnId obrigatório
          const preValidation = utilities.validateTask(taskData);
          if (!preValidation.isValid) {
            message.error(preValidation.errors.join(', '));
            return;
          }

          // Tentar encontrar primeira coluna com múltiplas estratégias
          let firstColumn =
            utilities.sortedColumns?.[0] || columns?.columns?.[0] || null;

          // Se ainda não tem coluna, tentar criar uma padrão
          if (!firstColumn && kanban.addColumnWithTasks) {
            console.log('Criando coluna padrão para tarefa...');
            try {
              firstColumn = kanban.addColumnWithTasks({
                title: 'Para Fazer',
                isDefault: true,
              });
            } catch (error) {
              console.error('Erro ao criar coluna padrão:', error);
            }
          }

          if (!firstColumn) {
            message.error(
              'Não foi possível encontrar ou criar uma coluna para a tarefa. Tente criar uma coluna primeiro.'
            );
            return;
          }

          console.log('Usando coluna:', firstColumn);

          const taskWithColumnAndId = {
            ...taskData,
            id: utilities.createUniqueTaskId(),
            columnId: firstColumn.id,
            status: firstColumn.title || 'NÃO INICIADA',
            position: Date.now(),
            createdAt: new Date().toISOString(),
          };

          console.log('Tarefa preparada:', taskWithColumnAndId);

          // Validação final após definir a coluna
          const finalValidation = utilities.validateTask(taskWithColumnAndId);
          if (!finalValidation.isValid) {
            message.error(finalValidation.errors.join(', '));
            return;
          }

          if (!tasks?.addTask) {
            message.error('Sistema de tarefas não está disponível');
            return;
          }

          tasks.addTask(firstColumn.id, taskWithColumnAndId);
          message.success('Tarefa criada com sucesso!');

          // Mostrar warnings se houver
          const allWarnings = [
            ...(preValidation.warnings || []),
            ...(finalValidation.warnings || []),
          ];

          if (allWarnings.length > 0) {
            message.warning(allWarnings.join(', '));
          }
        }

        // Fechar modais após sucesso
        if (isTaskOpen) closeTask();
        if (isEditOpen) closeEdit();
      } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
        message.error(
          error instanceof Error ? error.message : 'Erro ao salvar tarefa'
        );
      }
    },
    [
      isEditOpen,
      isTaskOpen,
      tasks,
      columns,
      utilities,
      kanban,
      board,
      closeTask,
      closeEdit,
    ]
  );

  const handleUseTemplate = useCallback((templateId: string) => {
    console.log('Using template:', templateId);
    message.success('Template aplicado com sucesso!');
  }, []);

  const handleExportBoard = useCallback(() => {
    try {
      const jsonData = utilities.exportData('json');
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kanban-board-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      message.success('Dados exportados com sucesso!');
    } catch {
      message.error('Erro ao exportar dados');
    }
  }, [utilities]);

  const handleImportBoard = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            kanban.restoreData?.(imported);
            message.success('Board importado com sucesso!');
          } catch {
            message.error('Erro ao importar board');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [kanban]);

  const getStatusOptions = useCallback(() => {
    const options = [{ value: 'all', label: 'Todos os Responsáveis' }];
    columns?.columns.forEach((column: any) => {
      tasks?.getTasksByColumn(column.id).forEach((task: any) => {
        if (task.assignee && !options.some((opt) => opt.value === task.id)) {
          options.push({
            label: task.assignee,
            value: task.id,
          });
        }
      });
    });
    return options;
  }, [columns, tasks]);

  const currentColumn = columnId ? columns?.getColumnById(columnId) : undefined;
  const deleteColumn = deleteColumnData
    ? columns?.getColumnById(deleteColumnData.columnId)
    : undefined;
  const taskCount = deleteColumnData
    ? tasks?.getTasksByColumn(deleteColumnData.columnId).length || 0
    : 0;
  const availableColumns = deleteColumnData
    ? columns?.columns.filter(
        (col: any) => col.id !== deleteColumnData.columnId
      ) || []
    : [];

  const editingTask = isEditOpen ? tasks?.getTaskById(isEditOpen) : null;

  if (!kanban.isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div>Carregando board...</div>
        {kanban.migrationInProgress && (
          <div style={{ fontSize: 14, color: '#666' }}>
            Atualizando estrutura de dados...
          </div>
        )}
      </div>
    );
  }

  if (board?.totalColumns === 0) {
    return (
      <EmptyState>
        <EmptyStateText>Nenhuma coluna disponível</EmptyStateText>
      </EmptyState>
    );
  }

  return (
    <MainContainer $isMenuCollapsed={isMenuCollapsed}>
      <HeaderContainer>
        <div>
          <h1 style={{ margin: 0, fontSize: 18 }}>Quadro Kanban</h1>
        </div>

        <Space>
          <PersistenceStatusIndicator
            isLoading={kanban.isLoading || false}
            isSaving={kanban.isSaving || false}
            lastSaved={kanban.lastSaved}
            autoSaveEnabled={kanban.autoSaveEnabled || false}
            migrationInProgress={kanban.migrationInProgress || false}
            hasErrors={hasErrors}
          />

          <Button
            icon={<Save style={{ width: 16, height: 16 }} />}
            onClick={kanban.saveManually}
            loading={kanban.isSaving}
            size="small"
          >
            Salvar
          </Button>

          <Button
            icon={<Database style={{ width: 16, height: 16 }} />}
            onClick={() => setPersistenceModalOpen(true)}
            size="small"
          >
            Persistência
          </Button>
        </Space>
      </HeaderContainer>

      <TaskManagerModal
        isOpen={isTaskOpen || !!isEditOpen}
        onClose={isTaskOpen ? closeTask : closeEdit}
        isEdit={!!isEditOpen}
        onSave={handleTaskSave}
        tasker={mapTaskToModalTaskData(editingTask || null)}
      />

      <ColumnManagerModal
        isOpen={isColumnOpen}
        mode={mode}
        column={currentColumn}
        onClose={closeColumn}
        onSave={handleColumnSave}
        onValidate={columns?.validateTitle || (() => null)}
        templates={config.columnTemplates}
        onApplyTemplate={(template) => {
          message.info(`Template "${template.name}" selecionado!`);
        }}
      />

      <DeleteColumnModal
        isOpen={!!deleteColumnData}
        column={deleteColumn}
        taskCount={taskCount}
        availableColumns={availableColumns}
        onClose={() => setDeleteColumnData(null)}
        onConfirm={handleDeleteColumnConfirm}
      />

      <BoardConfigurationModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        configuration={config}
        onSave={(newConfig) => {
          updateConfig(newConfig);
          message.success('Configurações salvas com sucesso!');
        }}
        onExport={() => {
          exportConfig();
          message.success('Configurações exportadas com sucesso!');
        }}
        onImport={(file: File) => {
          importConfig(file);
          message.success('Configurações importadas com sucesso!');
        }}
        onReset={() => {
          resetConfig();
          message.success('Configurações resetadas!');
        }}
      />

      <ColumnTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onUseTemplate={handleUseTemplate}
      />

      <PersistenceManager
        isOpen={persistenceModalOpen}
        onClose={() => setPersistenceModalOpen(false)}
        currentData={
          kanban.getCurrentData?.() || {
            columns: [],
            tasks: {},
            settings: {
              version: '1.0.0',
              lastUpdated: '',
              createdAt: '',
              totalSaves: 0,
              boardId: '',
            },
          }
        }
        onDataRestore={kanban.restoreData || (() => {})}
      />

      <ConfirmationModal
        isOpen={confirmationHook.confirmation.isOpen}
        onClose={confirmationHook.handleCancel}
        onConfirm={confirmationHook.handleConfirm}
        title={confirmationHook.confirmation.title}
        message={confirmationHook.confirmation.message}
        confirmText={confirmationHook.confirmation.confirmText}
        cancelText={confirmationHook.confirmation.cancelText}
        type={confirmationHook.confirmation.type}
        loading={confirmationHook.confirmation.loading}
      />

      <ContentContainer>
        <BoardHeader
          onAddColumn={openCreate}
          onAddTask={openTask}
          onExportBoard={handleExportBoard}
          onImportBoard={handleImportBoard}
          onResetBoard={() => {
            confirmationHook.confirmAction(
              'Resetar Board',
              <div>
                <p>Tem certeza que deseja resetar o board?</p>
                <p style={{ color: '#faad14', fontSize: '12px' }}>
                  Todas as configurações serão restauradas para os valores
                  padrão.
                </p>
              </div>,
              () => setIsConfigModalOpen(true),
              'Resetar'
            );
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showCompletedTasks={config.showCompletedTasks}
          onToggleCompletedTasks={(show) =>
            updateConfig({ showCompletedTasks: show })
          }
        />

        <FiltersContainer>
          <FilterSelect>
            <Select
              options={getStatusOptions()}
              defaultValue={'all'}
              style={{ width: '100%' }}
              placeholder="Filtrar por responsável"
            />
          </FilterSelect>
          <FilterSelect>
            <DatePicker
              format={'DD MMMM YYYY'}
              style={{ width: '100%' }}
              placeholder="Data de Entrega"
              locale={locale}
            />
          </FilterSelect>
          <FilterSelect>
            <Select
              options={[
                { label: 'Todos os Status', value: 'all' },
                ...(columns?.columns.map((column: any) => ({
                  label: column.title,
                  value: column.id,
                })) || []),
              ]}
              defaultValue={'all'}
              style={{ width: '100%' }}
              placeholder="Filtrar por coluna"
            />
          </FilterSelect>
        </FiltersContainer>

        <DroppableBoard
          columns={columns?.columns || []}
          tasks={tasks?.tasks || {}}
          onDragEnd={onDragEnd}
          onEditColumn={openColumnEdit}
          onDeleteColumn={handleDeleteColumnClick}
          onAddTask={openTask}
          canDeleteColumn={columns?.canDelete || (() => false)}
          onDuplicateColumn={handleDuplicateColumn}
          configuration={config}
          getColumnWipLimit={getColumnWipLimit}
          collapsedColumns={collapsedColumns}
          onToggleColumnCollapse={toggleColumnCollapse}
        />

        {/* Rodapé com Estatísticas */}
        <FooterContainer>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: responsive.isMobile ? 'column' : 'row',
              gap: responsive.isMobile ? 12 : 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 24,
                flexDirection: responsive.isMobile ? 'column' : 'row',
                alignItems: responsive.isMobile ? 'center' : 'flex-start',
                textAlign: responsive.isMobile ? 'center' : 'left',
              }}
            >
              <span>Colunas: {board?.totalColumns || 0}</span>
              <span>Tarefas: {board?.totalTasks || 0}</span>
              <span>
                Personalizadas: {columns?.getCustomColumns()?.length || 0}
              </span>
              {getCollapsedCount > 0 && (
                <span style={{ color: '#1890ff' }}>
                  Recolhidas: {getCollapsedCount}
                </span>
              )}
              {responsive.isMobile && (
                <span style={{ color: '#faad14' }}>📱 Modo Mobile</span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                gap: 8,
                flexDirection: responsive.isMobile ? 'column' : 'row',
                alignItems: 'center',
              }}
            >
              {/* Controles de Collapse */}
              {!responsive.isMobile && (
                <>
                  <button
                    onClick={() => expandAll()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6366f1',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: 12,
                    }}
                    title="Expandir todas as colunas"
                  >
                    Expandir Todas
                  </button>
                  <span style={{ color: '#ccc' }}>|</span>
                </>
              )}

              <button
                onClick={() => setIsTemplatesModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Templates
              </button>
              <button
                onClick={() => setIsConfigModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Configurações
              </button>
            </div>
          </div>
        </FooterContainer>
      </ContentContainer>

      {responsive.isDesktop ? null : (
        <div
          style={{
            position: 'fixed',
            top: 10,
            right: 10,
            background: responsive.isMobile
              ? 'rgba(255, 193, 7, 0.9)'
              : 'rgba(0, 123, 255, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 11,
            zIndex: 1000,
          }}
        >
          {responsive.isMobile ? '📱 Mobile' : '📱 Tablet'} (
          {responsive.screenWidth}px)
        </div>
      )}

      {/* Debug Panel - Temporário para diagnóstico */}
      <DebugPanel
        columns={columns}
        tasks={tasks}
        board={board}
        utilities={utilities}
        kanban={kanban}
      />

      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<Database />}
      >
        <FloatButton
          tooltip="Salvar manualmente"
          icon={<Save />}
          onClick={kanban.saveManually}
        />
        <FloatButton
          tooltip="Configurações de persistência"
          icon={<Settings />}
          onClick={() => setPersistenceModalOpen(true)}
        />
      </FloatButton.Group>
    </MainContainer>
  );
}

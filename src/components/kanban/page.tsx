// KanbanPage.tsx - Versão Final com Persistência Integrada
'use client';

import { useCallback, useState } from 'react';
import { Button, Space, FloatButton, DatePicker, Select, message } from 'antd';
import { Database, Save, Settings } from 'lucide-react';
import locale from 'antd/lib/date-picker/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useSelector } from 'react-redux';

// Hook principal com persistência integrada
import { useKanbanWithPersistence } from './hooks/use-kanban-with-persistence';

// Componentes de persistência
import PersistenceStatusIndicator from './components/persistence-status-indicator/persistence-status-indicator';

// Componentes de UX
import ConfirmationModal from './components/ui/confirmation-modal';

// Hooks de UX
import { useConfirmation } from './hooks/use-confirmation';
import { useBoardConfiguration } from './hooks/use-board-configuration';
import { useColumnCollapse } from './hooks/use-column-collapse';
import { useResponsive, useAutoCollapseOnMobile } from './hooks/use-responsive';

// Componentes principais
import TaskManagerModal from '../components/TaskManager/modals/TaskManagerModal';
import DroppableBoard from './components/droppable-board/droppable-board';

// Componentes aprimorados
import ColumnManagerModal from './components/column-manager-modal';
import DeleteColumnModal from './components/delete-column-modal';
import BoardHeader from './components/board-header/board-header';
import BoardConfigurationModal from './components/board-configuration-modal/board-configuration-modal';
import ColumnTemplatesModal from './components/ColumnTemplatesModal/ColumnTemplatesModal';

// Hooks especializados
import { useCreateTaskModal } from './hooks/use-create-task.modal';
import { useEditTaskModal } from './hooks/use-edit-task.modal';
import { useColumnModal } from './hooks/use-column-modal';
import { useDragHandlers } from './hooks/use-drag-handlers';
import { useKanbanUtilities } from './hooks/use-kanban-utilities';

// Tipos e Utilitários
import { mapTaskToModalTaskData } from './kanban.mocks';
import { RootState } from '@/store';

// Estilos
import {
  MainContainer,
  ContentContainer,
  FiltersContainer,
  FilterSelect,
  EmptyState,
  EmptyStateText,
} from './KanbanPage.styles';
import PersistenceManager from './components/persistance-manager/persistance-manager';

dayjs.locale('pt-br');

export default function KanbanPage() {
  const [persistenceModalOpen, setPersistenceModalOpen] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  // Hooks de UX
  const confirmationHook = useConfirmation();

  // Hook principal com persistência integrada
  const kanban = useKanbanWithPersistence({
    storageKey: 'kanban-production-v2',
    autoSave: true,
    autoSaveInterval: 15000, // 15 segundos
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

  // Hooks para utilitários (usando dados do kanban com persistência)
  const utilities = useKanbanUtilities({
    columns: kanban.columns?.columns || [],
    tasks: kanban.tasks?.tasks || [],
    validationConfig: {
      columnTitleMaxLength: 30,
      maxColumnsPerBoard: 15,
      allowSpecialChars: true,
    },
  });

  // Board configuration hook
  const {
    config,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
    getColumnWipLimit,
  } = useBoardConfiguration();

  // Responsividade e collapse de colunas
  const responsive = useResponsive();
  const {
    collapsedColumns,
    toggleColumnCollapse,
    collapseAll,
    expandAll,
    getCollapsedCount,
  } = useColumnCollapse();

  // Auto-collapse em mobile
  useAutoCollapseOnMobile(
    (kanban.columns?.columns || []).map((col) => col.id),
    collapseAll,
    expandAll
  );

  // Estados dos modais
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

  // Destructuring dos managers (deve vir antes dos retornos condicionais)
  const { columns, tasks, board } = kanban;

  // Drag handlers (todos os hooks devem vir antes dos retornos condicionais)
  const { onDragEnd } = useDragHandlers({
    columns: columns?.columns || [],
    tasks: tasks?.tasks || [],
    reorderColumns: columns?.reorderColumns,
    moveTask: tasks?.moveTask,
    updateTaskPositions: tasks?.updateTaskPositions,
    onChange: (updatedTasks) => {
      console.log('Tasks updated:', updatedTasks);
    },
  });

  // Handlers de coluna aprimorados com validação (TODOS OS HOOKS ANTES DOS RETURNS!)
  const handleColumnSave = useCallback(
    async (data: { title: string; color?: string }) => {
      try {
        // Validar título
        const validation = utilities.validateColumnTitle(data.title);
        if (!validation.isValid) {
          message.error(validation.errors.join(', '));
          return;
        }

        // Validar limites do board
        const boardValidation = utilities.validateBoardLimits();
        if (!boardValidation.isValid) {
          message.error(boardValidation.errors.join(', '));
          return;
        }

        if (mode === 'create') {
          // Criar coluna com ID único
          const columnWithId = {
            ...data,
            id: utilities.createUniqueColumnId(),
          };
          kanban.addColumnWithTasks(columnWithId);
          message.success('Coluna criada com sucesso!');
        } else if (mode === 'edit' && columnId) {
          columns?.updateColumn(columnId, data);
          message.success('Coluna atualizada com sucesso!');
        }

        // Mostrar warnings se houver
        if (validation.warnings.length > 0) {
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
              Tem certeza que deseja excluir a coluna &quot;
              <strong>{column.title}</strong>&quot;?
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
        kanban.deleteColumnWithTasks(
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

  // Handler para duplicar coluna
  const handleDuplicateColumn = useCallback(
    (column: any) => {
      try {
        kanban.addColumnWithTasks({
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

  // Handlers de tarefa aprimorados
  const handleTaskSave = useCallback(
    (taskData: any) => {
      try {
        // Validar estrutura da tarefa
        const validation = utilities.validateTask(taskData);
        if (!validation.isValid) {
          message.error(validation.errors.join(', '));
          return;
        }

        if (isEditOpen) {
          tasks?.updateTask(isEditOpen, taskData);
          message.success('Tarefa atualizada com sucesso!');
        } else {
          // Criar tarefa com ID único
          const taskWithId = {
            ...taskData,
            id: utilities.createUniqueTaskId(),
          };

          const firstColumn = utilities.sortedColumns[0] || columns?.columns[0];
          if (firstColumn) {
            tasks?.addTask(firstColumn.id, taskWithId);
            message.success('Tarefa criada com sucesso!');
          }
        }

        // Mostrar warnings se houver
        if (validation.warnings && validation.warnings.length > 0) {
          message.warning(validation.warnings.join(', '));
        }
      } catch (error) {
        message.error(
          error instanceof Error ? error.message : 'Erro ao salvar tarefa'
        );
      }
    },
    [isEditOpen, tasks, columns, utilities]
  );

  // Handler para usar template
  const handleUseTemplate = useCallback((templateId: string) => {
    // Implementar lógica para aplicar template
    console.log('Using template:', templateId);
    message.success('Template aplicado com sucesso!');
  }, []);

  // Handlers de configuração aprimorados
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
            // Implementar lógica de importação usando kanban.restoreData
            kanban.restoreData(imported);
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

  // Filtros
  const getStatusOptions = () => {
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
  };

  // Dados para modais
  const currentColumn = columnId ? columns?.getColumnById(columnId) : undefined;
  const deleteColumn = deleteColumnData
    ? columns?.getColumnById(deleteColumnData.columnId)
    : undefined;
  const taskCount = deleteColumnData
    ? tasks?.getTasksByColumn(deleteColumnData.columnId).length
    : 0;
  const availableColumns = deleteColumnData
    ? columns?.columns.filter(
        (col: any) => col.id !== deleteColumnData.columnId
      )
    : [];

  const editingTask = isEditOpen ? tasks?.getTaskById(isEditOpen) : null;

  // Verificar se os dados estão carregados (APÓS todos os hooks)
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

  // Estados de erro/vazio (APÓS todos os hooks e lógica)
  if (board?.totalColumns === 0) {
    return (
      <EmptyState>
        <EmptyStateText>Nenhuma coluna disponível</EmptyStateText>
      </EmptyState>
    );
  }

  return (
    <MainContainer $isMenuCollapsed={isMenuCollapsed}>
      {/* Header com status de persistência */}
      <div
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid #e8e8e8',
          background: '#fafafa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 18 }}>Quadro Kanban</h1>
        </div>

        <Space>
          <PersistenceStatusIndicator
            isLoading={kanban.isLoading}
            isSaving={kanban.isSaving}
            lastSaved={kanban.lastSaved}
            autoSaveEnabled={kanban.autoSaveEnabled}
            migrationInProgress={kanban.migrationInProgress}
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
      </div>

      {/* Modal de Tarefa */}
      <TaskManagerModal
        isOpen={isTaskOpen || !!isEditOpen}
        onClose={isTaskOpen ? closeTask : closeEdit}
        isEdit={!!isEditOpen}
        onSave={handleTaskSave}
        tasker={mapTaskToModalTaskData(editingTask || null)}
      />

      {/* Modal de Coluna */}
      <ColumnManagerModal
        isOpen={isColumnOpen}
        mode={mode}
        column={currentColumn}
        onClose={closeColumn}
        onSave={handleColumnSave}
        onValidate={columns?.validateTitle}
        templates={config.columnTemplates}
        onApplyTemplate={(template) => {
          message.info(`Template "${template.name}" selecionado!`);
        }}
      />

      {/* Modal de Exclusão */}
      <DeleteColumnModal
        isOpen={!!deleteColumnData}
        column={deleteColumn}
        taskCount={taskCount}
        availableColumns={availableColumns}
        onClose={() => setDeleteColumnData(null)}
        onConfirm={handleDeleteColumnConfirm}
      />

      {/* Modal de Configurações */}
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

      {/* Modal de Templates */}
      <ColumnTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onUseTemplate={handleUseTemplate}
      />

      {/* Modal de gerenciamento de persistência */}
      <PersistenceManager
        isOpen={persistenceModalOpen}
        onClose={() => setPersistenceModalOpen(false)}
        currentData={kanban.getCurrentData()}
        onDataRestore={kanban.restoreData}
      />

      {/* Modal de confirmação para ações destrutivas */}
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
        {/* Header Aprimorado */}
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

        {/* Filtros */}
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

        {/* Board Principal */}
        <DroppableBoard
          columns={columns?.columns || []}
          tasks={tasks?.tasks || []}
          onDragEnd={onDragEnd}
          onEditColumn={openColumnEdit}
          onDeleteColumn={handleDeleteColumnClick}
          onAddTask={openTask}
          canDeleteColumn={columns?.canDelete}
          onDuplicateColumn={handleDuplicateColumn}
          configuration={config}
          getColumnWipLimit={getColumnWipLimit}
          collapsedColumns={collapsedColumns}
          onToggleColumnCollapse={toggleColumnCollapse}
        />

        {/* Rodapé com Estatísticas */}
        <div
          style={{
            marginTop: 16,
            padding: 16,
            backgroundColor: '#f8f9fa',
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 14,
            color: '#6c757d',
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
              Personalizadas: {columns?.getCustomColumns().length || 0}
            </span>
            {getCollapsedCount() > 0 && (
              <span style={{ color: '#1890ff' }}>
                Recolhidas: {getCollapsedCount()}
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
      </ContentContainer>

      {/* Indicador responsivo */}
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
          display: responsive.isDesktop ? 'none' : 'block',
        }}
      >
        {responsive.isMobile ? '📱 Mobile' : '📱 Tablet'} (
        {responsive.screenWidth}px)
      </div>

      {/* Botão flutuante para acesso rápido */}
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

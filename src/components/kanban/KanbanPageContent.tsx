'use client';

import { useCallback, useState, useMemo, useEffect } from 'react';
import { FloatButton, DatePicker, Select, message } from 'antd';
import { Database, Save, Settings } from 'lucide-react';
import locale from 'antd/lib/date-picker/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useSelector } from 'react-redux';
import { useKanbanWithPersistence } from './hooks/use-kanban-with-persistence';
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
  ContentContainer,
  FiltersContainer,
  FilterSelect,
  EmptyState,
  EmptyStateText,
  FooterContainer,
} from './KanbanPage.styles';
import PersistenceManager from './components/persistance-manager/persistance-manager';
import { useFullscreen } from './context/FullscreenContext';

dayjs.locale('pt-br');

export default function KanbanPageContent() {
  const [persistenceModalOpen, setPersistenceModalOpen] = useState(false);
  const { isFullscreen, setIsFullscreen } = useFullscreen();

  const confirmationHook = useConfirmation();

  const kanban = useKanbanWithPersistence({
    storageKey: 'kanban-production-v2',
    autoSave: true,
    autoSaveInterval: 15000,
    loadOnMount: true,
    onLoadError: (error) => {
      console.error('Erro ao carregar dados:', error);
    },
    onSaveError: (error) => {
      console.error('Erro ao salvar dados:', error);
    },
    onMigrationStart: (from, to) => {
      console.log(`Iniciando migração: ${from} → ${to}`);
    },
    onMigrationComplete: (from, to) => {
      console.log(`Migração concluída: ${from} → ${to}`);
    },
  });

  const utilities = useKanbanUtilities({
    columns: kanban.columns?.columns || [],
    tasks: kanban.tasks?.tasks || {},
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
    tasks: tasks?.tasks || {},
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
        if (isEditOpen) {
          const validation = utilities.validateTask(taskData, 'edit');
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
          const preValidation = utilities.validateTask(taskData, 'create');
          if (!preValidation.isValid) {
            message.error(preValidation.errors.join(', '));
            return;
          }

          let firstColumn =
            utilities.sortedColumns?.[0] || columns?.columns?.[0] || null;

          if (!firstColumn && kanban.addColumnWithTasks) {
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

          const taskWithColumnAndId = {
            ...taskData,
            id: utilities.createUniqueTaskId(),
            columnId: firstColumn.id,
            status: firstColumn.title || 'NÃO INICIADA',
            position: Date.now(),
            createdAt: new Date().toISOString(),
          };

          const finalValidation = utilities.validateTask(
            taskWithColumnAndId,
            'edit'
          );
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

          const allWarnings = [
            ...(preValidation.warnings || []),
            ...(finalValidation.warnings || []),
          ];

          if (allWarnings.length > 0) {
            message.warning(allWarnings.join(', '));
          }
        }

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

  const handleToggleFullscreen = useCallback(() => {
    const newFullscreen = !isFullscreen;
    setIsFullscreen(newFullscreen);

    if (newFullscreen) {
      // Adiciona classes CSS para fullscreen
      document.body.classList.add('kanban-fullscreen');
      document.documentElement.classList.add('kanban-fullscreen');

      // Remove qualquer scroll da página
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Esconde TODOS os elementos exceto o container do kanban
      const allElements = document.querySelectorAll('*');
      const kanbanContainer = document.querySelector('[data-kanban-container]');

      allElements.forEach((element) => {
        const htmlElement = element as HTMLElement;

        // Só esconde se não for o container do kanban nem seus filhos
        if (
          htmlElement &&
          htmlElement !== kanbanContainer &&
          !kanbanContainer?.contains(htmlElement) &&
          htmlElement !== document.body &&
          htmlElement !== document.documentElement &&
          htmlElement !== document.head &&
          !document.head.contains(htmlElement)
        ) {
          // Se é um elemento que contém o kanban, não esconde
          if (!htmlElement.contains(kanbanContainer)) {
            htmlElement.style.setProperty('display', 'none', 'important');
            htmlElement.setAttribute('data-hidden-by-kanban', 'true');
          }
        }
      });

      // Força o container do kanban a ocupar toda a tela
      const kanbanElement = kanbanContainer as HTMLElement;
      if (kanbanElement) {
        kanbanElement.style.setProperty('position', 'fixed', 'important');
        kanbanElement.style.setProperty('top', '0', 'important');
        kanbanElement.style.setProperty('left', '0', 'important');
        kanbanElement.style.setProperty('right', '0', 'important');
        kanbanElement.style.setProperty('bottom', '0', 'important');
        kanbanElement.style.setProperty('width', '100vw', 'important');
        kanbanElement.style.setProperty('height', '100vh', 'important');
        kanbanElement.style.setProperty('z-index', '999999', 'important');
        kanbanElement.style.setProperty('background', 'white', 'important');
        kanbanElement.style.setProperty('margin', '0', 'important');
        kanbanElement.style.setProperty('padding', '0', 'important');
        kanbanElement.style.setProperty('border-radius', '0', 'important');
        kanbanElement.style.setProperty('box-shadow', 'none', 'important');
      }

      // Remove margens e paddings do body e html
      document.body.style.setProperty('margin', '0', 'important');
      document.body.style.setProperty('padding', '0', 'important');
      document.documentElement.style.setProperty('margin', '0', 'important');
      document.documentElement.style.setProperty('padding', '0', 'important');
    } else {
      // Remove classes CSS de fullscreen
      document.body.classList.remove('kanban-fullscreen');
      document.documentElement.classList.remove('kanban-fullscreen');

      // Restaura scroll da página
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      // Restaura elementos escondidos
      const hiddenElements = document.querySelectorAll(
        '[data-hidden-by-kanban="true"]'
      );
      hiddenElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.removeProperty('display');
        htmlElement.removeAttribute('data-hidden-by-kanban');
      });

      // Remove estilos forçados do container do kanban
      const kanbanContainer = document.querySelector(
        '[data-kanban-container]'
      ) as HTMLElement;
      if (kanbanContainer) {
        kanbanContainer.style.removeProperty('position');
        kanbanContainer.style.removeProperty('top');
        kanbanContainer.style.removeProperty('left');
        kanbanContainer.style.removeProperty('right');
        kanbanContainer.style.removeProperty('bottom');
        kanbanContainer.style.removeProperty('width');
        kanbanContainer.style.removeProperty('height');
        kanbanContainer.style.removeProperty('z-index');
        kanbanContainer.style.removeProperty('background');
        kanbanContainer.style.removeProperty('margin');
        kanbanContainer.style.removeProperty('padding');
        kanbanContainer.style.removeProperty('border-radius');
        kanbanContainer.style.removeProperty('box-shadow');
      }

      // Restaura margens e paddings do body e html
      document.body.style.removeProperty('margin');
      document.body.style.removeProperty('padding');
      document.documentElement.style.removeProperty('margin');
      document.documentElement.style.removeProperty('padding');
    }
  }, [isFullscreen, setIsFullscreen]);

  // Cleanup do fullscreen quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (isFullscreen) {
        // Remove classes CSS de fullscreen
        document.body.classList.remove('kanban-fullscreen');
        document.documentElement.classList.remove('kanban-fullscreen');

        // Restaura scroll da página
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // Restaura elementos escondidos
        const hiddenElements = document.querySelectorAll(
          '[data-hidden-by-kanban="true"]'
        );
        hiddenElements.forEach((element) => {
          const htmlElement = element as HTMLElement;
          htmlElement.style.removeProperty('display');
          htmlElement.removeAttribute('data-hidden-by-kanban');
        });

        // Restaura margens e paddings do body e html
        document.body.style.removeProperty('margin');
        document.body.style.removeProperty('padding');
        document.documentElement.style.removeProperty('margin');
        document.documentElement.style.removeProperty('padding');
      }
    };
  }, [isFullscreen]);

  // Adiciona listener para ESC sair do fullscreen
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        handleToggleFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullscreen, handleToggleFullscreen]);

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
    <MainContainer
      $isMenuCollapsed={isMenuCollapsed}
      data-kanban-container
      className={isFullscreen ? 'kanban-fullscreen-container' : ''}
    >
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
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
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

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
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
        </div>

        <div style={{ flexShrink: 0 }}>
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
        </div>
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

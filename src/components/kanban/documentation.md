# Documentação Completa - Módulo Kanban

## Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Componentes Principais](#componentes-principais)
4. [Hooks e Estado](#hooks-e-estado)
5. [Utilitários](#utilitários)
6. [Sistema de Persistência](#sistema-de-persistência)
7. [Guia de Integração Backend](#guia-de-integração-backend)
8. [Exemplos Práticos](#exemplos-práticos)

## Visão Geral da Arquitetura

O módulo Kanban é uma solução completa de gestão de tarefas em formato board, implementada com React, TypeScript e Ant Design. A arquitetura segue princípios de:

- **Modularidade**: Componentes e hooks separados por responsabilidade
- **Tipagem forte**: TypeScript em todos os componentes
- **Performance**: Lazy loading, memoização e debounce
- **Persistência**: Sistema robusto com backup automático
- **Extensibilidade**: Fácil integração com backends

### Tecnologias Utilizadas

- **React 18** com hooks
- **TypeScript** para tipagem
- **Ant Design** para UI
- **@hello-pangea/dnd** para drag & drop
- **Styled Components** para estilização
- **Dayjs** para manipulação de datas

## Estrutura de Arquivos

```
src/components/kanban/
├── page.tsx                          # Componente principal
├── KanbanPage.styles.ts              # Estilos globais
├── kanban.mocks.ts                   # Dados de teste
├── components/                       # Componentes específicos
│   ├── board-header/
│   ├── column-manager-modal/
│   ├── delete-column-modal/
│   ├── draggable-column/
│   ├── droppable-board/
│   ├── kanban-card/
│   ├── persistance-manager/
│   └── ...
├── hooks/                           # Hooks personalizados
│   ├── use-kanban-with-persistence.ts
│   ├── use-kanban-board.ts
│   ├── use-kanban-columns.ts
│   ├── use-kanban-tasks.ts
│   └── ...
├── types/                          # Definições de tipos
│   ├── kanban-column.ts
│   ├── task-status.ts
│   ├── persistence.ts
│   └── ...
├── utils/                          # Utilitários
│   ├── data-helpers.ts
│   ├── validation-helpers.ts
│   ├── migration-helpers.ts
│   └── ...
└── storage/                        # Sistema de persistência
    └── version-manager.ts
```

## Componentes Principais

### 1. KanbanPage (page.tsx)

**Funcionalidade**: Componente raiz que orquestra todo o sistema Kanban.

**Responsabilidades**:

- Integração de todos os hooks
- Gerenciamento de modais
- Controle de estado global
- Configurações de persistência

**Props Principais**:

```typescript
// Utiliza Redux para estado global e hooks internos
const { isMenuCollapsed } = useSelector((state: RootState) => state.general);
```

**Exemplo de Uso**:

```jsx
export default function KanbanPage() {
  const kanban = useKanbanWithPersistence({
    storageKey: 'kanban-production-v2',
    autoSave: true,
    autoSaveInterval: 15000,
  });

  return (
    <MainContainer $isMenuCollapsed={isMenuCollapsed}>
      {/* Resto do componente */}
    </MainContainer>
  );
}
```

### 2. DroppableBoard

**Funcionalidade**: Gerencia o layout principal do board com drag & drop.

**Props**:

```typescript
interface DroppableBoardProps {
  columns: KanbanColumn[];
  tasks: { [columnId: string]: Task[] };
  onDragEnd: (result: any) => void;
  onEditColumn: (columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddTask: () => void;
  canDeleteColumn: () => boolean;
  configuration?: BoardConfiguration;
  collapsedColumns?: { [columnId: string]: boolean };
}
```

### 3. DraggableColumn

**Funcionalidade**: Renderiza uma coluna individual com suporte a drag & drop.

**Características**:

- Suporte a colapso/expansão
- WIP limits visuais
- Menu de opções contextual
- Responsividade

### 4. KanbanCard

**Funcionalidade**: Renderiza uma tarefa individual no board.

**Características**:

- Informações condensadas (título, responsável, data)
- Menu de opções
- Indicadores visuais (prioridade, status)

## Hooks e Estado

### 1. useKanbanWithPersistence

**Função**: Hook principal que integra Kanban com persistência automática.

```typescript
const kanban = useKanbanWithPersistence({
  storageKey: 'my-kanban-board',
  autoSave: true,
  autoSaveInterval: 30000,
  loadOnMount: true,
  onLoadError: (error) => console.error(error),
  onSaveError: (error) => console.error(error),
});

// Retorna:
// - Todos os métodos de useKanbanBoard
// - Estados de persistência (isLoading, isSaving)
// - Controles (saveManually, createBackup, etc.)
```

### 2. useKanbanBoard

**Função**: Gerencia o estado central do board (colunas + tarefas).

```typescript
const kanban = useKanbanBoard({
  persistToStorage: true,
  storageKey: 'kanban-board',
});

// Retorna:
const {
  columns: {
    columns, // Array de colunas
    createColumn, // Criar nova coluna
    updateColumn, // Atualizar coluna
    deleteColumn, // Deletar coluna
    reorderColumns, // Reordenar colunas
  },
  tasks: {
    tasks, // Estado das tarefas por coluna
    addTask, // Adicionar tarefa
    updateTask, // Atualizar tarefa
    deleteTask, // Deletar tarefa
    moveTask, // Mover entre colunas
  },
  board: {
    totalColumns, // Métricas
    totalTasks,
  },
} = kanban;
```

### 3. useKanbanColumns

**Função**: Gerencia CRUD das colunas.

```typescript
const {
  columns, // Array ordenado de colunas
  createColumn, // (data) => KanbanColumn
  updateColumn, // (id, updates) => void
  deleteColumn, // (id) => void
  reorderColumns, // (newOrder) => void
  validateTitle, // (title, excludeId?) => string | null
  canDelete, // () => boolean
  totalColumns, // number
} = useKanbanColumns();
```

### 4. useKanbanTasks

**Função**: Gerencia CRUD das tarefas.

```typescript
const {
  tasks, // TasksState { [columnId]: Task[] }
  addTask, // (columnId, task) => Task
  updateTask, // (taskId, updates) => void
  deleteTask, // (taskId) => void
  moveTask, // (taskId, sourceCol, destCol, index) => void
  getTaskById, // (taskId) => Task | undefined
  searchTasks, // (query) => Task[]
  totalTasks, // number
} = useKanbanTasks({
  columns: kanbanColumns,
  initialTasks: mockTasks,
});
```

### 5. useDragHandlers

**Função**: Gerencia eventos de drag & drop.

```typescript
const { onDragEnd } = useDragHandlers({
  columns,
  tasks,
  reorderColumns,
  moveTask,
  updateTaskPositions,
  onChange: (updatedTasks) => {
    // Callback para mudanças de estado
  },
});
```

## Utilitários

### 1. Validação (validation-helpers.ts)

```typescript
// Validar título único de coluna
const result = validateUniqueColumnTitle(title, columns, excludeId);
if (!result.isValid) {
  console.error(result.errors);
}

// Validar estrutura de tarefa
const taskResult = validateTaskStructure(task, 'create');

// Validar limites WIP
const wipResult = validateWipLimits(columnId, taskCount, limit);
```

### 2. Geração de IDs (id-generators.ts)

```typescript
// IDs únicos com prefixos
const columnId = generateColumnId(); // col-timestamp-random
const taskId = generateTaskId(); // task-timestamp-random
const backupId = generateBackupId(); // backup-timestamp-random

// Validação de formato
const isValid = validateIdFormat(id, 'col');
```

### 3. Migração de Dados (migration-helpers.ts)

```typescript
// Migrar de formato legado
const { columns, tasks } = migrateFromLegacyFormat(oldData);

// Mover tarefas entre colunas
const newTasks = moveTasksBetweenColumns(tasks, sourceColumnId, targetColumnId);

// Validar integridade
const integrity = validateMigrationIntegrity(columns, tasks);
```

## Sistema de Persistência

### Estrutura de Dados Persistidos

```typescript
interface PersistedData {
  columns: KanbanColumn[];
  tasks: TasksState;
  settings: {
    version: string;
    lastUpdated: string;
    createdAt: string;
    totalSaves: number;
    boardId: string;
    boardName?: string;
  };
  metadata?: {
    exportedFrom?: string;
    importedAt?: string;
    migrationHistory?: string[];
  };
}
```

### StorageManager

- **LocalStorage**: Armazenamento principal
- **Backup automático**: Versionamento com limite configurável
- **Checksums**: Verificação de integridade
- **Compressão**: Suporte opcional (futuro)

### VersionManager

- **Migrações automáticas**: Entre versões do schema
- **Validação**: Pós-migração
- **Rollback**: Via backups

## Guia de Integração Backend

### 1. Estrutura de APIs Recomendadas

#### Endpoints Básicos

```typescript
// GET /api/kanban/boards/:boardId
interface GetBoardResponse {
  id: string;
  name: string;
  columns: KanbanColumn[];
  tasks: Task[];
  settings: BoardSettings;
  lastModified: string;
}

// POST /api/kanban/boards
interface CreateBoardRequest {
  name: string;
  template?: string;
  columns?: Partial<KanbanColumn>[];
}

// PATCH /api/kanban/boards/:boardId
interface UpdateBoardRequest {
  name?: string;
  settings?: Partial<BoardSettings>;
}
```

#### Endpoints de Colunas

```typescript
// POST /api/kanban/boards/:boardId/columns
interface CreateColumnRequest {
  title: string;
  position: number;
  color?: string;
  wipLimit?: number;
}

// PATCH /api/kanban/columns/:columnId
interface UpdateColumnRequest {
  title?: string;
  position?: number;
  color?: string;
  wipLimit?: number;
}

// DELETE /api/kanban/columns/:columnId
interface DeleteColumnRequest {
  moveTasksToColumnId?: string;
}
```

#### Endpoints de Tarefas

```typescript
// POST /api/kanban/boards/:boardId/tasks
interface CreateTaskRequest {
  title: string;
  columnId: string;
  description?: string;
  assigneeId?: string;
  priority: TaskPriority;
  dueDate?: string;
  tags?: string[];
}

// PATCH /api/kanban/tasks/:taskId
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assigneeId?: string;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
}

// POST /api/kanban/tasks/:taskId/move
interface MoveTaskRequest {
  columnId: string;
  position: number;
}
```

### 2. Adaptadores para Backend

#### Hook Personalizado para API

```typescript
function useKanbanAPI(boardId: string) {
  const [board, setBoard] = useState<BoardData | null>(null);

  // Carregar board
  const loadBoard = useCallback(async () => {
    const response = await fetch(`/api/kanban/boards/${boardId}`);
    const data = await response.json();
    setBoard(data);
  }, [boardId]);

  // Criar coluna
  const createColumn = useCallback(
    async (columnData: CreateColumnRequest) => {
      const response = await fetch(`/api/kanban/boards/${boardId}/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(columnData),
      });

      if (response.ok) {
        const newColumn = await response.json();
        setBoard((prev) =>
          prev
            ? {
                ...prev,
                columns: [...prev.columns, newColumn].sort(
                  (a, b) => a.position - b.position
                ),
              }
            : null
        );
        return newColumn;
      }
      throw new Error('Falha ao criar coluna');
    },
    [boardId]
  );

  // Mover tarefa
  const moveTask = useCallback(
    async (taskId: string, columnId: string, position: number) => {
      const response = await fetch(`/api/kanban/tasks/${taskId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnId, position }),
      });

      if (response.ok) {
        // Atualizar estado local
        loadBoard();
      }
    },
    [loadBoard]
  );

  return {
    board,
    loadBoard,
    createColumn,
    moveTask,
    // ... outros métodos
  };
}
```

#### Adaptador para React Query

```typescript
import { useMutation, useQuery, useQueryClient } from 'react-query';

export function useKanbanQueries(boardId: string) {
  const queryClient = useQueryClient();

  // Query para carregar board
  const boardQuery = useQuery(
    ['kanban', 'board', boardId],
    () => fetch(`/api/kanban/boards/${boardId}`).then((res) => res.json()),
    {
      staleTime: 30000, // 30 segundos
      cacheTime: 300000, // 5 minutos
    }
  );

  // Mutation para criar coluna
  const createColumnMutation = useMutation(
    (data: CreateColumnRequest) =>
      fetch(`/api/kanban/boards/${boardId}/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['kanban', 'board', boardId]);
      },
    }
  );

  // Mutation para mover tarefa
  const moveTaskMutation = useMutation(
    ({
      taskId,
      columnId,
      position,
    }: {
      taskId: string;
      columnId: string;
      position: number;
    }) =>
      fetch(`/api/kanban/tasks/${taskId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnId, position }),
      }),
    {
      onMutate: async ({ taskId, columnId, position }) => {
        // Optimistic update
        await queryClient.cancelQueries(['kanban', 'board', boardId]);

        const previousBoard = queryClient.getQueryData([
          'kanban',
          'board',
          boardId,
        ]);

        queryClient.setQueryData(['kanban', 'board', boardId], (old: any) => {
          if (!old) return old;

          // Atualizar posição da tarefa localmente
          const updatedTasks = old.tasks.map((task: Task) =>
            task.id === taskId ? { ...task, columnId, position } : task
          );

          return { ...old, tasks: updatedTasks };
        });

        return { previousBoard };
      },
      onError: (err, variables, context) => {
        // Rollback em caso de erro
        if (context?.previousBoard) {
          queryClient.setQueryData(
            ['kanban', 'board', boardId],
            context.previousBoard
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(['kanban', 'board', boardId]);
      },
    }
  );

  return {
    board: boardQuery.data,
    isLoading: boardQuery.isLoading,
    createColumn: createColumnMutation.mutate,
    moveTask: moveTaskMutation.mutate,
    isCreatingColumn: createColumnMutation.isLoading,
    isMovingTask: moveTaskMutation.isLoading,
  };
}
```

### 3. Hook Integrado para Backend

```typescript
function useKanbanWithBackend(boardId: string) {
  const api = useKanbanQueries(boardId);

  // Converter dados da API para formato local
  const kanbanData = useMemo(() => {
    if (!api.board) return null;

    // Converter tarefas para formato TasksState
    const tasks: TasksState = {};
    api.board.columns.forEach((col) => {
      tasks[col.id] = api.board.tasks.filter(
        (task) => task.columnId === col.id
      );
    });

    return {
      columns: api.board.columns,
      tasks,
    };
  }, [api.board]);

  // Drag handlers adaptados
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { draggableId, source, destination } = result;

      if (result.type === 'TASK') {
        // Mover tarefa via API
        api.moveTask({
          taskId: draggableId,
          columnId: destination.droppableId,
          position: destination.index * 1000,
        });
      }
      // ... outros tipos de drag
    },
    [api.moveTask]
  );

  return {
    // Estado
    columns: kanbanData?.columns || [],
    tasks: kanbanData?.tasks || {},
    isLoading: api.isLoading,

    // Ações
    onDragEnd: handleDragEnd,
    createColumn: api.createColumn,

    // Status das operações
    isCreatingColumn: api.isCreatingColumn,
    isMovingTask: api.isMovingTask,
  };
}
```

## Exemplos Práticos

### 1. Implementação Básica

```tsx
import { KanbanPage } from '@/components/kanban';

export default function ProjectBoard() {
  return <KanbanPage />;
}
```

### 2. Com Configurações Personalizadas

```tsx
function CustomKanbanBoard() {
  const kanban = useKanbanWithPersistence({
    storageKey: 'project-123-board',
    autoSave: true,
    autoSaveInterval: 10000, // 10 segundos
    onSaveError: (error) => {
      toast.error('Erro ao salvar board');
    },
  });

  return (
    <DroppableBoard
      columns={kanban.columns.columns}
      tasks={kanban.tasks.tasks}
      onDragEnd={kanban.onDragEnd}
      // ... outras props
    />
  );
}
```

### 3. Integração com Backend

```tsx
function BackendKanbanBoard({ projectId }: { projectId: string }) {
  const kanban = useKanbanWithBackend(projectId);

  if (kanban.isLoading) {
    return <div>Carregando board...</div>;
  }

  return (
    <DroppableBoard
      columns={kanban.columns}
      tasks={kanban.tasks}
      onDragEnd={kanban.onDragEnd}
      onEditColumn={(columnId) => {
        // Abrir modal de edição
      }}
      onDeleteColumn={(columnId) => {
        // Confirmar e deletar via API
      }}
    />
  );
}
```

### 4. Hook Personalizado para Projeto Específico

```typescript
function useProjectKanban(projectId: string) {
  const { data: project } = useQuery(['project', projectId]);
  const kanban = useKanbanWithBackend(projectId);

  // Validações específicas do projeto
  const canEditBoard = project?.permissions?.includes('board.edit');
  const canCreateTasks = project?.permissions?.includes('tasks.create');

  // Filtros específicos
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    if (!assigneeFilter) return kanban.tasks;

    const filtered: TasksState = {};
    Object.entries(kanban.tasks).forEach(([columnId, tasks]) => {
      filtered[columnId] = tasks.filter(
        (task) => task.assigneeId === assigneeFilter
      );
    });
    return filtered;
  }, [kanban.tasks, assigneeFilter]);

  return {
    ...kanban,
    tasks: filteredTasks,

    // Controles de permissão
    canEditBoard,
    canCreateTasks,

    // Filtros
    assigneeFilter,
    setAssigneeFilter,

    // Ações específicas do projeto
    assignTask: (taskId: string, userId: string) => {
      return kanban.updateTask(taskId, { assigneeId: userId });
    },
  };
}
```

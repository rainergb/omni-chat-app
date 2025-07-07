// utils/example-usage.ts
/**
 * Exemplos de uso dos utilitários
 */

import { debounce, memoize } from 'lodash';
import { TasksState } from '../types/kanban-state';
import { TaskStatus } from '../types/task-status';
import { ColumnValidator } from './advanced-validation';
import { filterTasks, calculateBoardStats } from './data-helpers';
import { generateColumnId } from './error-handling';
import { migrateTasksToNewStructure } from './migration-helpers';
import { TestDataFactory, TestAssertions } from './test-helpers';

// Exemplo 1: Validação de coluna
export function exampleColumnValidation() {
  const validator = new ColumnValidator({
    columnTitleMaxLength: 30,
    allowSpecialChars: true,
  });

  const existingTitles = ['To Do', 'In Progress', 'Done'];
  const result = validator.validateTitle('New Column', existingTitles);

  if (!result.isValid) {
    console.error('Validation errors:', result.errors);
    return false;
  }

  if (result.warnings.length > 0) {
    console.warn('Validation warnings:', result.warnings);
  }

  return true;
}

// Exemplo 2: Migração de dados
export function exampleDataMigration() {
  const legacyTasks = {
    [TaskStatus.NOT_STARTED]: [
      TestDataFactory.createTask({
        title: 'Task 1',
        status: TaskStatus.NOT_STARTED,
      }),
    ],
    [TaskStatus.IN_PROGRESS]: [
      TestDataFactory.createTask({
        title: 'Task 2',
        status: TaskStatus.IN_PROGRESS,
      }),
    ],
    [TaskStatus.COMPLETED]: [],
  };

  const columnMapping = {
    [TaskStatus.NOT_STARTED]: 'col-todo',
    [TaskStatus.IN_PROGRESS]: 'col-progress',
    [TaskStatus.COMPLETED]: 'col-done',
  };

  const migratedTasks = migrateTasksToNewStructure(
    legacyTasks,
    columnMapping as any
  );

  console.log('Migration completed:', {
    originalTaskCount: Object.values(legacyTasks).flat().length,
    migratedTaskCount: Object.values(migratedTasks).flat().length,
  });

  return migratedTasks;
}

// Exemplo 3: Performance otimizada para busca
export function exampleOptimizedSearch() {
  const allTasks = Array.from({ length: 1000 }, (_, i) =>
    TestDataFactory.createTask({
      title: `Task ${i}`,
      assignee: `User ${i % 10}`,
    })
  );

  // Busca com debounce
  const debouncedSearch = debounce((query: string) => {
    const results = filterTasks(allTasks, { search: query });
    console.log(`Found ${results.length} tasks for "${query}"`);
  }, 300);

  // Simular digitação do usuário
  debouncedSearch('Task');
  debouncedSearch('Task 1');
  debouncedSearch('Task 10'); // Apenas esta será executada após 300ms

  return debouncedSearch;
}

// Exemplo 4: Cálculo de estatísticas memoizado
export function exampleMemoizedStats() {
  const columns = TestDataFactory.createMultipleColumns(5);
  const tasks: TasksState = {};

  columns.forEach((column) => {
    tasks[column.id] = TestDataFactory.createMultipleTasks(20, column.id);
  });

  // Memoizar cálculo de estatísticas
  const memoizedStats = memoize(
    calculateBoardStats,
    (cols, tasks) => `${cols.length}-${Object.keys(tasks).length}`
  );

  console.time('First calculation');
  const stats1 = memoizedStats(columns, tasks);
  console.timeEnd('First calculation');

  console.time('Second calculation (cached)');
  const stats2 = memoizedStats(columns, tasks);
  console.timeEnd('Second calculation (cached)');

  console.log(
    'Stats equal:',
    JSON.stringify(stats1) === JSON.stringify(stats2)
  );

  return stats1;
}

// Testes unitários simples
export function runBasicTests() {
  console.log('Running basic tests...');

  try {
    // Teste de geração de ID
    const columnId = generateColumnId();
    TestAssertions.assertIdFormat(columnId, 'col');
    console.log('✓ ID generation test passed');

    // Teste de validação
    const validator = new ColumnValidator();
    const validResult = validator.validateTitle('Valid Title', []);
    TestAssertions.assertValidationPassed(validResult);

    const invalidResult = validator.validateTitle('', []);
    TestAssertions.assertValidationFailed(invalidResult, 'pelo menos');
    console.log('✓ Validation tests passed');

    // Teste de migração
    const migratedData = exampleDataMigration();
    const taskCount = Object.values(migratedData).flat().length;
    if (taskCount < 2) {
      throw new Error('Migration test failed: not enough tasks migrated');
    }
    console.log('✓ Migration test passed');

    console.log('All tests passed! 🎉');
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }

  return true;
}

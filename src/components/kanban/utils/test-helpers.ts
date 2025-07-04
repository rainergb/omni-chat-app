// utils/test-helpers.ts
/**
 * Utilitários para testes unitários
 */

import { KanbanColumn } from '../types/kanban-column';
import { Task, TaskStatus } from '../types/task-status';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Factory para criar dados de teste
 */
export class TestDataFactory {
  static createColumn(overrides: Partial<KanbanColumn> = {}): KanbanColumn {
    return {
      id: `col-test-${Date.now()}`,
      title: 'Test Column',
      position: 1000,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static createTask(overrides: Partial<Task> = {}): Task {
    return {
      id: `task-test-${Date.now()}`,
      title: 'Test Task',
      columnId: 'col-test',
      status: TaskStatus.NOT_STARTED,
      labels: [],
      color: 'blue',
      priority: 'MÉDIA',
      tags: [],
      createdAt: new Date().toISOString(),
      selected: false,
      position: 1000,
      ...overrides,
    };
  }

  static createMultipleColumns(count: number): KanbanColumn[] {
    return Array.from({ length: count }, (_, index) =>
      this.createColumn({
        id: `col-test-${index}`,
        title: `Column ${index + 1}`,
        position: (index + 1) * 1000,
      })
    );
  }

  static createMultipleTasks(count: number, columnId: string): Task[] {
    return Array.from({ length: count }, (_, index) =>
      this.createTask({
        id: `task-test-${index}`,
        title: `Task ${index + 1}`,
        columnId,
        position: (index + 1) * 1000,
      })
    );
  }
}

/**
 * Utilitários para asserções de teste
 */
export class TestAssertions {
  static assertValidationPassed(result: ValidationResult): void {
    if (!result.isValid) {
      throw new Error(`Validation failed: ${result.errors.join(', ')}`);
    }
  }

  static assertValidationFailed(
    result: ValidationResult,
    expectedError?: string
  ): void {
    if (result.isValid) {
      throw new Error('Expected validation to fail, but it passed');
    }

    if (
      expectedError &&
      !result.errors.some((error) => error.includes(expectedError))
    ) {
      throw new Error(
        `Expected error containing "${expectedError}", got: ${result.errors.join(', ')}`
      );
    }
  }

  static assertArraysEqual<T>(
    actual: T[],
    expected: T[],
    message?: string
  ): void {
    if (actual.length !== expected.length) {
      throw new Error(
        message ||
          `Array lengths differ: ${actual.length} vs ${expected.length}`
      );
    }

    for (let i = 0; i < actual.length; i++) {
      if (JSON.stringify(actual[i]) !== JSON.stringify(expected[i])) {
        throw new Error(message || `Arrays differ at index ${i}`);
      }
    }
  }

  static assertIdFormat(id: string, expectedPrefix?: string): void {
    if (!id || typeof id !== 'string') {
      throw new Error('ID must be a non-empty string');
    }

    const idPattern = /^[a-z]+-(\d+-)?[a-z0-9]+$/i;
    if (!idPattern.test(id)) {
      throw new Error(`Invalid ID format: ${id}`);
    }

    if (expectedPrefix && !id.startsWith(expectedPrefix + '-')) {
      throw new Error(`ID should start with "${expectedPrefix}-", got: ${id}`);
    }
  }
}

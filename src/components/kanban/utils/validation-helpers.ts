// utils/validation-helpers.ts
import { KanbanColumn } from '../types/kanban-column';
import { Task } from '../types/task-status';

/**
 * Utilitários de validação para colunas e tarefas
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Valida título único de coluna
 */
export function validateUniqueColumnTitle(
  title: string,
  columns: KanbanColumn[],
  excludeId?: string
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    result.isValid = false;
    result.errors.push('Título é obrigatório');
    return result;
  }

  if (trimmedTitle.length < 2) {
    result.isValid = false;
    result.errors.push('Título deve ter pelo menos 2 caracteres');
  }

  if (trimmedTitle.length > 50) {
    result.isValid = false;
    result.errors.push('Título deve ter no máximo 50 caracteres');
  }

  // Verificar caracteres especiais
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(trimmedTitle)) {
    result.isValid = false;
    result.errors.push('Título contém caracteres inválidos');
  }

  // Verificar título único
  const existingColumn = columns.find(
    (col) =>
      col.id !== excludeId &&
      col.title.toLowerCase().trim() === trimmedTitle.toLowerCase()
  );

  if (existingColumn) {
    result.isValid = false;
    result.errors.push('Já existe uma coluna com este título');
  }

  // Warnings para títulos muito similares
  const similarColumns = columns.filter(
    (col) =>
      (col.id !== excludeId &&
        col.title.toLowerCase().includes(trimmedTitle.toLowerCase())) ||
      trimmedTitle.toLowerCase().includes(col.title.toLowerCase())
  );

  if (similarColumns.length > 0) {
    result.warnings.push(
      `Títulos similares encontrados: ${similarColumns.map((c) => c.title).join(', ')}`
    );
  }

  return result;
}

/**
 * Valida limites de colunas no board
 */
export function validateColumnLimits(
  columns: KanbanColumn[]
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  const MIN_COLUMNS = 1;
  const MAX_COLUMNS = 20;
  const RECOMMENDED_MAX = 10;

  if (columns.length < MIN_COLUMNS) {
    result.isValid = false;
    result.errors.push(`Board deve ter pelo menos ${MIN_COLUMNS} coluna`);
  }

  if (columns.length > MAX_COLUMNS) {
    result.isValid = false;
    result.errors.push(`Board pode ter no máximo ${MAX_COLUMNS} colunas`);
  }

  if (columns.length > RECOMMENDED_MAX) {
    result.warnings.push(
      `Recomendado usar no máximo ${RECOMMENDED_MAX} colunas para melhor visualização`
    );
  }

  return result;
}

/**
 * Valida proteção de colunas padrão
 */
export function validateDefaultColumnProtection(
  column: KanbanColumn,
  operation: 'delete' | 'modify'
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (column.isDefault) {
    if (operation === 'delete') {
      result.warnings.push('Cuidado ao deletar coluna padrão do sistema');
    } else if (operation === 'modify') {
      result.warnings.push('Modificando coluna padrão do sistema');
    }
  }

  return result;
}

/**
 * Valida estrutura de tarefa
 */
export function validateTaskStructure(task: Partial<Task>): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!task.title?.trim()) {
    result.isValid = false;
    result.errors.push('Título da tarefa é obrigatório');
  }

  if (task.title && task.title.length > 200) {
    result.isValid = false;
    result.errors.push('Título da tarefa deve ter no máximo 200 caracteres');
  }

  if (!task.columnId) {
    result.isValid = false;
    result.errors.push('Tarefa deve estar associada a uma coluna');
  }

  if (task.position && task.position < 0) {
    result.isValid = false;
    result.errors.push('Posição da tarefa deve ser um número positivo');
  }

  // Validar datas
  if (task.startDate && task.endDate) {
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);

    if (start > end) {
      result.isValid = false;
      result.errors.push('Data de início não pode ser posterior à data de fim');
    }
  }

  return result;
}

/**
 * Valida WIP limits
 */
export function validateWipLimits(
  columnId: string,
  currentTaskCount: number,
  wipLimit?: number
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!wipLimit) return result;

  if (wipLimit < 1) {
    result.isValid = false;
    result.errors.push('Limite WIP deve ser maior que zero');
  }

  if (wipLimit > 50) {
    result.warnings.push('Limite WIP muito alto pode reduzir eficiência');
  }

  if (currentTaskCount > wipLimit) {
    result.warnings.push(
      `Limite WIP excedido: ${currentTaskCount}/${wipLimit} tarefas`
    );
  }

  if (currentTaskCount === wipLimit) {
    result.warnings.push('Limite WIP atingido');
  }

  return result;
}

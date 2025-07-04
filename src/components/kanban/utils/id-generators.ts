// utils/id-generators.ts
/**
 * Utilitários para geração de IDs únicos com prefixos consistentes
 */

interface IdOptions {
  prefix?: string;
  length?: number;
  includeTimestamp?: boolean;
}

/**
 * Gera um ID único com prefixo e formato consistente
 */
export function generateId(options: IdOptions = {}): string {
  const { prefix = '', length = 8, includeTimestamp = true } = options;

  const timestamp = includeTimestamp ? Date.now().toString() : '';
  const randomStr = Math.random()
    .toString(36)
    .substring(2, 2 + length);

  const parts = [prefix, timestamp, randomStr].filter(Boolean);
  return parts.join('-');
}

/**
 * Gera ID para coluna com prefixo 'col'
 */
export function generateColumnId(): string {
  return generateId({ prefix: 'col', length: 6 });
}

/**
 * Gera ID para tarefa com prefixo 'task'
 */
export function generateTaskId(): string {
  return generateId({ prefix: 'task', length: 8 });
}

/**
 * Gera ID para template com prefixo 'tpl'
 */
export function generateTemplateId(): string {
  return generateId({ prefix: 'tpl', length: 6 });
}

/**
 * Gera ID para backup com prefixo 'backup'
 */
export function generateBackupId(): string {
  return generateId({ prefix: 'backup', length: 12 });
}

/**
 * Valida formato de ID
 */
export function validateIdFormat(id: string, expectedPrefix?: string): boolean {
  if (!id || typeof id !== 'string') return false;

  // Formato básico: prefix-timestamp-random ou prefix-random
  const idPattern = /^[a-z]+(-\d+)?-[a-z0-9]+$/i;
  if (!idPattern.test(id)) return false;

  if (expectedPrefix) {
    return id.startsWith(expectedPrefix + '-');
  }

  return true;
}

/**
 * Extrai prefixo de um ID
 */
export function extractIdPrefix(id: string): string | null {
  if (!id || typeof id !== 'string') return null;
  const parts = id.split('-');
  return parts.length >= 2 ? parts[0] : null;
}

/**
 * Verifica se ID já existe em uma lista
 */
export function isIdUnique(id: string, existingIds: string[]): boolean {
  return !existingIds.includes(id);
}

/**
 * Gera ID único garantindo que não existe na lista
 */
export function generateUniqueId(
  generator: () => string,
  existingIds: string[],
  maxAttempts = 10
): string {
  for (let i = 0; i < maxAttempts; i++) {
    const id = generator();
    if (isIdUnique(id, existingIds)) {
      return id;
    }
  }

  // Fallback com timestamp mais específico
  return (
    generator() +
    '-' +
    Date.now() +
    '-' +
    Math.random().toString(36).substring(2, 6)
  );
}

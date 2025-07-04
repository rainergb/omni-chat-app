// utils/performance-helpers.ts
/**
 * Utilitários para otimização de performance
 */

import { Task } from '../types/task-status';

/**
 * Debounce para operações de busca/filtro
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle para operações de drag & drop
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Memoização para cálculos pesados
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);

    return result;
  }) as T;
}

/**
 * Chunking para processamento em lotes
 */
export function processInChunks<T, R>(
  items: T[],
  processor: (chunk: T[]) => R[],
  chunkSize = 100
): R[] {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    results.push(...processor(chunk));
  }

  return results;
}

/**
 * Lazy loading para grandes quantidades de dados
 */
export class LazyTaskLoader {
  private tasks: Task[] = [];
  private loadedChunks = new Set<number>();
  private chunkSize: number;

  constructor(tasks: Task[], chunkSize = 50) {
    this.tasks = tasks;
    this.chunkSize = chunkSize;
  }

  getChunk(chunkIndex: number): Task[] {
    const start = chunkIndex * this.chunkSize;
    const end = start + this.chunkSize;

    this.loadedChunks.add(chunkIndex);
    return this.tasks.slice(start, end);
  }

  getTotalChunks(): number {
    return Math.ceil(this.tasks.length / this.chunkSize);
  }

  isChunkLoaded(chunkIndex: number): boolean {
    return this.loadedChunks.has(chunkIndex);
  }
}

// utils/advanced-validation.ts
/**
 * Validações avançadas com configurações personalizáveis
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationConfig {
  columnTitleMinLength: number;
  columnTitleMaxLength: number;
  taskTitleMinLength: number;
  taskTitleMaxLength: number;
  maxColumnsPerBoard: number;
  minColumnsPerBoard: number;
  maxTasksPerColumn: number;
  allowSpecialChars: boolean;
  requiredFields: string[];
}

export const defaultValidationConfig: ValidationConfig = {
  columnTitleMinLength: 2,
  columnTitleMaxLength: 50,
  taskTitleMinLength: 1,
  taskTitleMaxLength: 200,
  maxColumnsPerBoard: 20,
  minColumnsPerBoard: 1,
  maxTasksPerColumn: 100,
  allowSpecialChars: false,
  requiredFields: ['title'],
};

/**
 * Validador configurável para colunas
 */
export class ColumnValidator {
  private config: ValidationConfig;

  constructor(config: Partial<ValidationConfig> = {}) {
    this.config = { ...defaultValidationConfig, ...config };
  }

  validateTitle(
    title: string,
    existingTitles: string[] = []
  ): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // Verificação de comprimento
    if (title.length < this.config.columnTitleMinLength) {
      result.isValid = false;
      result.errors.push(
        `Título deve ter pelo menos ${this.config.columnTitleMinLength} caracteres`
      );
    }

    if (title.length > this.config.columnTitleMaxLength) {
      result.isValid = false;
      result.errors.push(
        `Título deve ter no máximo ${this.config.columnTitleMaxLength} caracteres`
      );
    }

    // Verificação de caracteres especiais
    if (!this.config.allowSpecialChars) {
      const specialChars = /[<>:"/\\|?*]/;
      if (specialChars.test(title)) {
        result.isValid = false;
        result.errors.push('Título contém caracteres especiais não permitidos');
      }
    }

    // Verificação de unicidade
    const normalizedTitle = title.toLowerCase().trim();
    const isDuplicate = existingTitles.some(
      (existing) => existing.toLowerCase().trim() === normalizedTitle
    );

    if (isDuplicate) {
      result.isValid = false;
      result.errors.push('Título já existe');
    }

    // Warnings para títulos muito similares
    const similarTitles = existingTitles.filter((existing) => {
      const similarity = this.calculateSimilarity(
        normalizedTitle,
        existing.toLowerCase().trim()
      );
      return similarity > 0.8 && similarity < 1;
    });

    if (similarTitles.length > 0) {
      result.warnings.push(`Títulos similares: ${similarTitles.join(', ')}`);
    }

    return result;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}

/**
 * Validador de WIP limits com regras avançadas
 */
export class WipLimitValidator {
  validateLimit(
    limit: number,
    context: {
      columnType?: string;
      teamSize?: number;
      boardComplexity?: 'low' | 'medium' | 'high';
    } = {}
  ): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (limit < 1) {
      result.isValid = false;
      result.errors.push('Limite WIP deve ser maior que zero');
    }

    if (limit > 50) {
      result.isValid = false;
      result.errors.push('Limite WIP muito alto (máximo: 50)');
    }

    // Recomendações baseadas no contexto
    if (context.teamSize) {
      const recommendedLimit = Math.ceil(context.teamSize * 1.5);
      if (limit > recommendedLimit) {
        result.warnings.push(
          `Recomendado: ${recommendedLimit} para equipe de ${context.teamSize} pessoas`
        );
      }
    }

    if (context.boardComplexity === 'high' && limit > 3) {
      result.warnings.push(
        'Para boards complexos, recomenda-se limite menor (≤3)'
      );
    }

    return result;
  }
}
